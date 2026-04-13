import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    specs: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Lampu Jalan', 'Lampu Taman', 'Solar Panel', 'Baterai', 'Aksesori'];

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show immediate local preview
    const localPreview = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: localPreview }));

    setUploading(true);
    setError('');

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        // Update with actual server URL
        setFormData(prev => ({ ...prev, image: data.imageUrl }));
        console.log('Upload success:', data.imageUrl);
      } else {
        setError(data.error || 'Gagal mengunggah gambar ke server');
        console.error('Upload failed:', data);
      }
    } catch (err) {
      setError('Error koneksi: Pastikan server (npm run server) sedang berjalan');
      console.error('Connection error:', err);
    } finally {
      setUploading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Gagal login. Pastikan server berjalan.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseInt(formData.price),
      specs: formData.specs.split('\n').filter(s => s.trim() !== '')
    };

    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchProducts();
        setEditingProduct(null);
        setFormData({ name: '', price: '', category: '', image: '', description: '', specs: '' });
      }
    } catch (err) {
      setError('Gagal menyimpan produk');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      description: product.description,
      specs: product.specs.join('\n')
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus produk ini?')) {
      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        fetchProducts();
      } catch (err) {
        setError('Gagal menghapus produk');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-[32px] w-full max-w-md border-black/5"
        >
          <h2 className="text-3xl font-black mb-6">Admin Login</h2>
          {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full p-4 rounded-2xl bg-black/5 border border-black/5 focus:border-secondary outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-4 rounded-2xl bg-black/5 border border-black/5 focus:border-secondary outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full py-4 bg-secondary text-white rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-text-secondary">Default: admin / admin123</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-40 space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase">Admin Panel</h1>
          <p className="text-text-secondary font-medium">Kelola katalog produk Anda</p>
        </div>
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="px-6 py-2 bg-black/5 rounded-xl font-bold hover:bg-black/10 transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <motion.div 
            layout
            className="glass p-8 rounded-[32px] border-black/5 sticky top-32"
          >
            <h2 className="text-2xl font-black mb-6">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Nama Produk</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Harga (IDR)</label>
                <input 
                  type="number" 
                  required
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Kategori</label>
                <select 
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Gambar Produk</label>
                <div className="space-y-3">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                  {uploading && <p className="text-xs font-bold text-secondary animate-pulse ml-1">Mengunggah...</p>}
                  {formData.image && (
                    <div className="relative group aspect-video rounded-xl overflow-hidden bg-black/5 border border-black/5">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-[10px] text-white font-black uppercase tracking-widest">Gambar Terpilih</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Deskripsi</label>
                <textarea 
                  rows="3"
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Spesifikasi (Satu per baris)</label>
                <textarea 
                  rows="4"
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none text-sm"
                  value={formData.specs}
                  onChange={(e) => setFormData({...formData, specs: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-secondary text-white rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {editingProduct ? 'Update' : 'Simpan'}
                </button>
                {editingProduct && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setFormData({ name: '', price: '', category: '', image: '', description: '', specs: '' });
                    }}
                    className="px-6 py-4 bg-black/5 rounded-2xl font-bold"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black">Daftar Produk ({products.length})</h2>
          {loading ? (
            <div className="py-20 text-center text-text-secondary font-medium animate-pulse">Memuat produk...</div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  className="glass p-6 rounded-[24px] border-black/5 flex items-center gap-6"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-20 h-20 object-cover rounded-2xl bg-black/5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="font-bold truncate">{product.name}</h3>
                    <p className="text-sm font-medium text-text-secondary">Rp {product.price.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-3 bg-secondary/10 text-secondary rounded-xl hover:bg-secondary hover:text-white transition-all"
                    >
                      <i className="bx bx-edit-alt text-xl"></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <i className="bx bx-trash text-xl"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
