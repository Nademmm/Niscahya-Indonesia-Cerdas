import express from "express";
import compression from "compression";
import { createRequestHandler } from "@react-router/express";
import path from "path";
import { fileURLToPath } from "url";
import pool, { initializeDatabase } from "./db.js";
import multer from "multer";
import fs from "fs";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const app = express();
const PORT = process.env.PORT || 3000;

const sourceImageExtensions = new Set([".png", ".jpg", ".jpeg"]);

function toWebpUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return imageUrl;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  const extension = path.extname(imageUrl).toLowerCase();
  if (!sourceImageExtensions.has(extension)) return imageUrl;

  const webpUrl = imageUrl.slice(0, -extension.length) + ".webp";
  const publicCandidate = path.join(root, "public", webpUrl.replace(/^\//, ""));
  const uploadCandidate = path.join(root, "server", webpUrl.replace(/^\//, ""));
  const buildCandidate = path.join(root, "build/client", webpUrl.replace(/^\//, ""));

  if (fs.existsSync(publicCandidate) || fs.existsSync(uploadCandidate) || fs.existsSync(buildCandidate)) {
    return webpUrl;
  }

  return imageUrl;
}

function optimizeProductRecord(product) {
  if (!product || typeof product !== "object") return product;

  const optimized = { ...product };
  optimized.image = toWebpUrl(optimized.image);

  ["image2", "image3", "image4", "image5"].forEach((key) => {
    if (optimized[key]) {
      optimized[key] = toWebpUrl(optimized[key]);
    }
  });

  if (Array.isArray(optimized.images)) {
    optimized.images = optimized.images.map((image) => toWebpUrl(image));
  } else if (typeof optimized.images === "string") {
    try {
      const parsedImages = JSON.parse(optimized.images);
      if (Array.isArray(parsedImages)) {
        optimized.images = JSON.stringify(parsedImages.map((image) => toWebpUrl(image)));
      }
    } catch {
      optimized.images = optimized.images;
    }
  }

  return optimized;
}

app.use(compression());
app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(root, "server/uploads"), {
  maxAge: "1y",
  immutable: true,
}));

if (process.env.NODE_ENV === "production") {
  app.use("/assets", express.static(path.join(root, "build/client/assets"), {
    maxAge: "1y",
    immutable: true,
    fallthrough: false,
  }));
  app.use(express.static(path.join(root, "build/client"), { maxAge: "1d" }));
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(root, "server/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// API Routes
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(rows.map(optimizeProductRecord));
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ error: "Gagal mengambil data produk" });
  }
});

app.get("/api/products/:slugOrId", async (req, res) => {
  const { slugOrId } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE slug = ? OR id = ?",
      [slugOrId, slugOrId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }
    res.json(optimizeProductRecord(rows[0]));
  } catch (error) {
    console.error("Fetch product detail error:", error);
    res.status(500).json({ error: "Gagal mengambil detail produk" });
  }
});

app.post("/api/admin-auth", (req, res) => {
  const { email, password } = req.body;
  // Simple auth for now - should be replaced with better auth in production
  if (email === "admin@niscahya.id" && password === "n1scahya") {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Email atau password salah" });
  }
});

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Tidak ada file yang diunggah" });
  }
  const originalPath = req.file.path;
  const optimizedFilename = `${path.parse(req.file.filename).name}.webp`;
  const optimizedPath = path.join(path.dirname(originalPath), optimizedFilename);

  sharp(originalPath)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true, fit: "inside" })
    .webp({ quality: 82 })
    .toFile(optimizedPath)
    .then(() => {
      // Delete original file after successful conversion
      fs.unlink(originalPath, (err) => {
        if (err) console.error("Failed to delete original file:", err);
      });
      res.json({ imageUrl: `/uploads/${optimizedFilename}` });
    })
    .catch((error) => {
      console.error("Image optimization failed:", error);
      res.json({ imageUrl: `/uploads/${req.file.filename}` });
    });
});

app.post("/api/products", async (req, res) => {
  const { name, category, image, images, description } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  
  try {
    const [result] = await pool.query(
      "INSERT INTO products (name, category, image, images, description, slug, price) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, category, image, JSON.stringify(images || []), description, slug, 0]
    );
    res.status(201).json({ id: result.insertId, message: "Produk berhasil ditambahkan" });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ error: "Gagal menambahkan produk" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, image, images, description } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  try {
    await pool.query(
      "UPDATE products SET name = ?, category = ?, image = ?, images = ?, description = ?, slug = ? WHERE id = ?",
      [name, category, image, JSON.stringify(images || []), description, slug, id]
    );
    res.json({ message: "Produk berhasil diperbarui" });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Gagal memperbarui produk" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Gagal menghapus produk" });
  }
});

async function startServer() {
  console.log("Starting server...");
  
  try {
    await initializeDatabase();
    console.log("Database initialized");
  } catch (err) {
    console.error("Database initialization failed:", err);
  }

  let viteDevServer = null;
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite in middleware mode...");
    const vite = await import("vite");
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(viteDevServer.middlewares);
  }

  app.use(async (req, res, next) => {
    try {
      const build = viteDevServer 
        ? await viteDevServer.ssrLoadModule("virtual:react-router/server-build")
        : await import("../build/server/index.js");
      
      const handler = createRequestHandler({ build });
      await handler(req, res, next);
    } catch (error) {
      console.error("React Router Request Handler Error:", error);
      if (!res.headersSent) {
        res.status(500).send("Internal Server Error: " + error.message);
      }
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
