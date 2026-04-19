import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pool, { initializeDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Global error handlers to catch silent crashes
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

const uploadDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || value.trim() === '') return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
};

const normalizeProduct = (product) => {
  if (!product) return product;

  return {
    ...product,
    images: parseJsonArray(product.images),
    specs: parseJsonArray(product.specs)
  };
};

const createSlug = async (connection, name, excludeId = null) => {
  const baseSlug = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const params = [slug];
    let query = 'SELECT id FROM products WHERE slug = ?';

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const [rows] = await connection.execute(query, params);
    if (rows.length === 0) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
};

// Initialize database on startup
const initDB = async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized.');
  } catch (dbError) {
    console.error('CRITICAL: Database initialization failed:', dbError);
  }
};

initDB();

app.use(cors());

app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Route for file upload
app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error:', err);
      return res.status(500).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      console.error('Unknown Error:', err);
      return res.status(500).json({ error: `Unknown error: ${err.message}` });
    }

    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File uploaded successfully:', req.file.filename);
    // Return relative path (for production/proxy) and absolute (for debugging)
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl, fullUrl: `http://127.0.0.1:${port}${imageUrl}` });
  });
});

// Route for multiple file uploads
app.post('/api/upload-multiple', (req, res) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ error: `Unknown error: ${err.message}` });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ imageUrls });
  });
});

// Routes for products
app.get('/api/products', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [products] = await connection.execute('SELECT * FROM products');
    res.json(products.map(normalizeProduct));
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.get('/api/products/:idOrSlug', async (req, res) => {
  let connection;
  try {
    const { idOrSlug } = req.params;
    connection = await pool.getConnection();
    let product;
    
    // Check if the parameter is an ID (number) or a Slug (text)
    if (/^\d+$/.test(idOrSlug)) {
      const [results] = await connection.execute('SELECT * FROM products WHERE id = ?', [idOrSlug]);
      product = results[0];
    } else {
      const [results] = await connection.execute('SELECT * FROM products WHERE slug = ?', [idOrSlug]);
      product = results[0];
    }

    if (product) {
      res.json(normalizeProduct(product));
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.post('/api/products', async (req, res) => {
  let connection;
  try {
    const { name, price, category, image, images, description, specs } = req.body;

    if (!name || !category || !image) {
      return res.status(400).json({ error: 'Nama, kategori, dan gambar utama wajib diisi' });
    }
    
    connection = await pool.getConnection();
    const slug = await createSlug(connection, name);
    const [result] = await connection.execute(
      `INSERT INTO products (name, price, category, image, images, description, specs, slug)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        price, 
        category, 
        image, 
        JSON.stringify(parseJsonArray(images)), 
        description, 
        JSON.stringify(parseJsonArray(specs)),
        slug
      ]
    );

    const [rows] = await connection.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(normalizeProduct(rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.put('/api/products/:id', async (req, res) => {
  let connection;
  try {
    const { name, price, category, image, images, description, specs } = req.body;
    connection = await pool.getConnection();

    if (!name || !category || !image) {
      return res.status(400).json({ error: 'Nama, kategori, dan gambar utama wajib diisi' });
    }

    const slug = await createSlug(connection, name, req.params.id);
    
    const [result] = await connection.execute(
      `UPDATE products 
       SET name = ?, price = ?, category = ?, image = ?, images = ?, description = ?, specs = ?, slug = ?
       WHERE id = ?`,
      [
        name, 
        price, 
        category, 
        image, 
        JSON.stringify(parseJsonArray(images)), 
        description, 
        JSON.stringify(parseJsonArray(specs)), 
        slug,
        req.params.id
      ]
    );
    
    if (result.affectedRows > 0) {
      const [rows] = await connection.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
      res.json(normalizeProduct(rows[0]));
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.delete('/api/products/:id', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Admin login (simple placeholder)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Simple hardcoded admin credentials
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.listen(port, '127.0.0.1', (err) => {
  if (err) {
    console.error('CRITICAL: Server failed to start:', err);
    return;
  }
  console.log(`[BACKEND] Server is active at http://127.0.0.1:${port}`);
});
