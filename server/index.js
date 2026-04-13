import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import db, { seedDatabase } from './db.js';
import { products as initialProducts } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Ensure upload directory exists
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

// Seed database on startup
seedDatabase(initialProducts);

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
    res.json({ imageUrl, fullUrl: `http://localhost:${port}${imageUrl}` });
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
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    // Parse specs and images from JSON string back to array
    const parsedProducts = products.map(p => ({
      ...p,
      specs: JSON.parse(p.specs || '[]'),
      images: JSON.parse(p.images || '[]')
    }));
    res.json(parsedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (product) {
      product.specs = JSON.parse(product.specs || '[]');
      product.images = JSON.parse(product.images || '[]');
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', (req, res) => {
  const { name, price, category, image, images, description, specs } = req.body;
  try {
    const insertStmt = db.prepare(`
      INSERT INTO products (name, price, category, image, images, description, specs)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = insertStmt.run(
      name, 
      price, 
      category, 
      image, 
      JSON.stringify(images || []), 
      description, 
      JSON.stringify(specs)
    );
    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  const { name, price, category, image, images, description, specs } = req.body;
  try {
    const updateStmt = db.prepare(`
      UPDATE products 
      SET name = ?, price = ?, category = ?, image = ?, images = ?, description = ?, specs = ?
      WHERE id = ?
    `);
    const result = updateStmt.run(
      name, 
      price, 
      category, 
      image, 
      JSON.stringify(images || []), 
      description, 
      JSON.stringify(specs), 
      req.params.id
    );
    if (result.changes > 0) {
      res.json({ id: req.params.id, ...req.body });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const deleteStmt = db.prepare('DELETE FROM products WHERE id = ?');
    const result = deleteStmt.run(req.params.id);
    if (result.changes > 0) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
