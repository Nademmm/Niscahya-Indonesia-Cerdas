import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Admin = () => {
  const { searchQuery } = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: '',
    images: ['', '', '', ''], // 4 slots for gallery
    description: '',
    specs: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({
    primary: false,
    gallery0: false,
    gallery1: false,
    gallery2: false,
    gallery3: false
  });
  const [error, setError] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');

  const categoryStructure = {
    'PJU Tenaga Surya': ['All In One', 'Two In One', 'Konvensional'],
    'PJU PLN (50-200 watt)': [],
    'Pompa Air Tenaga Surya': [],
    'Traffic Light': [],
    'Warning Light': [],
    'Lampu Taman': [],
    'Solar Home System': [],
    'Aksesori': ['Solar Panel', 'Controller', 'Inverter', 'Baterai']
  };

  const mainCategories = Object.keys(categoryStructure);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  const handleFileUpload = async (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show immediate local preview
    const localPreview = URL.createObjectURL(file);
    if (type === 'primary') {
      setFormData(prev => ({ ...prev, image: localPreview }));
      setUploading(prev => ({ ...prev, primary: true }));
    } else {
      setFormData(prev => {
        const updatedImages = [...prev.images];
        updatedImages[index] = localPreview;
        return { ...prev, images: updatedImages };
      });
      setUploading(prev => ({ ...prev, [`gallery${index}`]: true }));
    }

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
        if (type === 'primary') {
          setFormData(prev => ({ ...prev, image: data.imageUrl }));
        } else {
          setFormData(prev => {
            const updatedImages = [...prev.images];
            updatedImages[index] = data.imageUrl;
            return { ...prev, images: updatedImages };
          });
        }
      } else {
        setError(data.error || 'Gagal mengunggah gambar ke server');
      }
    } catch (err) {
      setError('Error koneksi: Pastikan server sedang berjalan');
    } finally {
      if (type === 'primary') {
        setUploading(prev => ({ ...prev, primary: false }));
      } else {
        setUploading(prev => ({ ...prev, [`gallery${index}`]: false }));
      }
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

    const isAnyUploading = Object.values(uploading).some(Boolean);
    if (isAnyUploading) {
      setError('Upload gambar masih berjalan. Tunggu sampai selesai, lalu simpan lagi.');
      return;
    }
    
    // Check if any image is still uploading or is a blob (not yet saved to server)
    const isAnyBlob = formData.image.startsWith('blob:') || 
                      formData.images.some(img => img && img.startsWith('blob:'));
    
    if (isAnyBlob) {
      setError('Harap tunggu sampai semua proses upload selesai sebelum menyimpan.');
      return;
    }

    const payload = {
      ...formData,
      price: 0,
      specs: formData.specs.split('\n').filter(s => s.trim()),
      images: formData.images.filter(
        (img) => typeof img === 'string' && img.trim() !== '' && !img.startsWith('blob:')
      ) 
    };

    console.log('Final payload before save:', payload);

    if (!payload.image) {
      setError('Gambar utama wajib diunggah.');
      return;
    }

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
        setSelectedMainCategory('');
        setFormData({ name: '', category: '', image: '', images: ['', '', '', ''], description: '', specs: '' });
      }
    } catch (err) {
      setError('Gagal menyimpan produk');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);

    const gallery = [...(product.images || [])];
    while (gallery.length < 4) gallery.push('');

    const mainCat = product.category.includes(' - ') ? product.category.split(' - ')[0] : product.category;
    setSelectedMainCategory(mainCat);

    setFormData({
      name: product.name,
      category: product.category,
      image: product.image,
      images: gallery.slice(0, 4),
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

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) => {
      const specText = Array.isArray(product.specs) ? product.specs.join(' ') : '';
      return [product.name, product.category, product.description, specText]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(normalizedSearch));
    });
  }, [products, searchQuery]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-[32px] w-full max-w-md border-black/5"
        >
          <h2 className="text-3xl font-black mb-6">Login Admin</h2>
          {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Nama Pengguna" 
              className="w-full p-4 rounded-2xl bg-black/5 border border-black/5 focus:border-secondary outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Kata Sandi" 
              className="w-full p-4 rounded-2xl bg-black/5 border border-black/5 focus:border-secondary outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full py-4 bg-secondary text-white rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Masuk
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-text-secondary">Bawaan: admin / admin123</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-40 space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase">Panel Admin</h1>
          <p className="text-text-secondary font-medium">Kelola katalog produk Anda</p>
        </div>
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="px-6 py-2 bg-black/5 rounded-xl font-bold hover:bg-black/10 transition-colors"
        >
          Keluar
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
            {error && (
              <p className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm font-bold text-red-600">
                {error}
              </p>
            )}
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
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Kategori Utama</label>
                <select 
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none appearance-none"
                  value={selectedMainCategory}
                  onChange={(e) => {
                    setSelectedMainCategory(e.target.value);
                    setFormData({...formData, category: e.target.value});
                  }}
                  required
                >
                  <option value="">Pilih Kategori Utama</option>
                  {mainCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {selectedMainCategory && categoryStructure[selectedMainCategory]?.length > 0 && (
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Sub-Kategori</label>
                  <select 
                    className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none appearance-none"
                    value={formData.category.includes(' - ') ? formData.category.split(' - ')[1] : ''}
                    onChange={(e) => {
                      const fullCategory = `${selectedMainCategory} - ${e.target.value}`;
                      setFormData({...formData, category: fullCategory});
                    }}
                    required
                  >
                    <option value="">Pilih Sub-Kategori</option>
                    {categoryStructure[selectedMainCategory].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Gambar Utama</label>
                <div className="space-y-3">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, 'primary')}
                  />
                  {uploading.primary && <p className="text-xs font-bold text-secondary animate-pulse ml-1">Mengunggah Utama...</p>}
                  {formData.image && (
                    <div className="relative group aspect-video rounded-xl overflow-hidden bg-black/5 border border-black/5">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Gambar Galeri (4 Slot Terpisah)</label>
                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5 border border-black/5">
                        {formData.images[idx] ? (
                          <img src={formData.images[idx]} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase text-text-secondary/30">
                            Slot {idx + 1}
                          </div>
                        )}
                        {uploading[`gallery${idx}`] && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <i className="bx bx-loader-alt animate-spin text-white text-xl"></i>
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="w-full text-[10px] file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-black/5 file:text-text-secondary hover:file:bg-black/10 cursor-pointer"
                        onChange={(e) => handleFileUpload(e, 'gallery', idx)}
                      />
                    </div>
                  ))}
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
                      setSelectedMainCategory('');
                      setFormData({ name: '', category: '', image: '', images: ['', '', '', ''], description: '', specs: '' });
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
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Daftar Produk</h2>
            <span className="text-xs font-black uppercase tracking-widest text-text-secondary">
              {filteredProducts.length}
              {searchQuery.trim() ? ` / ${products.length}` : ''} Unit Terdaftar
            </span>
          </div>
          {searchQuery.trim() && (
            <p className="px-2 text-xs font-bold tracking-wide text-text-secondary">
              Hasil pencarian admin untuk "{searchQuery}".
            </p>
          )}
          {loading ? (
            <div className="py-20 text-center text-text-secondary font-medium animate-pulse">Memuat produk...</div>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
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
              {filteredProducts.length === 0 && (
                <div className="glass p-8 rounded-[24px] border-black/5 text-center">
                  <p className="font-bold text-text-secondary">
                    Produk tidak ditemukan. Coba kata kunci lain untuk edit produk.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
