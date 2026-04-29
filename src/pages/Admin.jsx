import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Admin = () => {
  const { searchQuery } = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminAuth, setAdminAuth] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'blogs'
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: '',
    images: ['', '', '', ''], // 4 slots for gallery
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({
    primary: false,
    gallery0: false,
    gallery1: false,
    gallery2: false,
    gallery3: false
  });
  const [uploadingBlog, setUploadingBlog] = useState(false);
  const [error, setError] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');

  const categoryStructure = {
    'PJU Tenaga Surya': ['All In One', 'Two In One', 'Konvensional'],
    'PJU PLN': [],
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

  useEffect(() => {
    if (isLoggedIn && activeTab === 'blogs') {
      fetchBlogs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, activeTab]);

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

  const handleBlogFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setBlogForm(prev => ({ ...prev, image: localPreview }));
    setUploadingBlog(true);

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setBlogForm(prev => ({ ...prev, image: data.imageUrl }));
      } else {
        setError(data.error || 'Gagal mengunggah gambar blog');
      }
    } catch (err) {
      setError('Error koneksi saat mengunggah gambar blog');
    } finally {
      setUploadingBlog(false);
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

  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', date: '', category: '', image: '', excerpt: '', content: '', author: '' });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      setError('Gagal memuat blog');
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (uploadingBlog) {
      setError('Upload gambar blog masih berjalan');
      return;
    }
    if (!blogForm.title || !blogForm.content) {
      setError('Judul dan konten wajib diisi');
      return;
    }

    const payload = { ...blogForm };
    const method = editingBlog ? 'PUT' : 'POST';
    const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': adminAuth },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchBlogs();
        setEditingBlog(null);
        setBlogForm({ title: '', date: '', category: '', image: '', excerpt: '', content: '', author: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || data.message || 'Gagal menyimpan blog');
      }
    } catch (err) {
      setError('Gagal menyimpan blog');
    }
  };

  const handleEditBlog = (post) => {
    setEditingBlog(post);
    setBlogForm({ title: post.title || '', date: post.date || '', category: post.category || '', image: post.image || '', excerpt: post.excerpt || '', content: post.content || '', author: post.author || '' });
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Hapus artikel ini?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE', headers: { 'x-admin-auth': adminAuth } });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || data.message || 'Gagal menghapus blog');
        return;
      }
      fetchBlogs();
    } catch (err) {
      setError('Gagal menghapus blog');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        setAdminAuth(password);
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
      images: formData.images.filter(
        (img) => typeof img === 'string' && img.trim() !== '' && !img.startsWith('blob:')
      ) 
    };

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
        setFormData({ name: '', category: '', image: '', images: ['', '', '', ''], description: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || data.message || 'Gagal menyimpan produk');
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
      description: product.description
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus produk ini?')) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || data.message || 'Gagal menghapus produk');
          return;
        }
        fetchProducts();
      } catch (err) {
        setError('Gagal menghapus produk');
      }
    }
  };

  const descriptionRef = useRef(null);

  const applyBold = () => {
    const textarea = descriptionRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.description.substring(start, end);
    
    if (!selectedText) {
      alert('Pilih teks terlebih dahulu untuk di-bold');
      return;
    }

    const newText = formData.description.substring(0, start) + `**${selectedText}**` + formData.description.substring(end);
    setFormData({ ...formData, description: newText });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, end + 2);
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      applyBold();
    }
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) => {
      return [product.name, product.category, product.description]
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
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Email Admin</label>
              <input 
                type="email" 
                className="w-full p-4 rounded-2xl bg-black/5 border border-black/5 focus:border-secondary outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Kata Sandi</label>
              <input 
                type="password"
                placeholder="••••••••" 
                className="w-full p-4 rounded-2xl bg-black/5 border border-black/5 focus:border-secondary outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button className="w-full py-4 bg-secondary text-white rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Login
            </button>
          </form>
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

      {/* Tabs */}
      <div className="flex gap-4 border-b border-black/10">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 font-bold uppercase tracking-widest text-sm border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-text-secondary hover:text-text-main'
          }`}
        >
          <i className="bx bx-box mr-2"></i>Produk
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`px-6 py-3 font-bold uppercase tracking-widest text-sm border-b-2 transition-colors ${
            activeTab === 'blogs'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-text-secondary hover:text-text-main'
          }`}
        >
          <i className="bx bx-news mr-2"></i>Blog
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
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
                <div className="flex items-center justify-between ml-1 mb-1">
                  <label className="text-xs font-black uppercase tracking-widest text-text-secondary">Deskripsi</label>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-text-secondary/50">Ctrl+B bold</span>
                    <button
                      type="button"
                      onClick={applyBold}
                      className="w-7 h-7 rounded-lg bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                      title="Bold (Ctrl+B)"
                    >
                      <i className="bx bx-bold text-xs"></i>
                    </button>
                  </div>
                </div>
                <textarea 
                  ref={descriptionRef}
                  rows="3"
                  onKeyDown={handleKeyDown}
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Gunakan Ctrl+B untuk memilih teks dan membuat judul/sub-judul bold. Contoh: **Nama Produk**"
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
                      setFormData({ name: '', category: '', image: '', images: ['', '', '', ''], description: '' });
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
      )}

      {/* Blogs Tab */}
      {activeTab === 'blogs' && (
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Blog Form Section */}
        <div className="lg:col-span-1">
          <motion.div 
            layout
            className="glass p-8 rounded-[32px] border-black/5 sticky top-32"
          >
            <h2 className="text-2xl font-black mb-6">{editingBlog ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h2>
            {error && (
              <p className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm font-bold text-red-600">
                {error}
              </p>
            )}
            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Judul Artikel</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Tanggal</label>
                <input 
                  type="text"
                  placeholder="Contoh: April 21, 2026"
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none"
                  value={blogForm.date}
                  onChange={(e) => setBlogForm({...blogForm, date: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Kategori</label>
                <input 
                  type="text"
                  placeholder="Contoh: Teknologi, Tips, Panduan"
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none"
                  value={blogForm.category}
                  onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Gambar</label>
                <div className="space-y-3">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 cursor-pointer"
                    onChange={handleBlogFileUpload}
                  />
                  {uploadingBlog && <p className="text-xs font-bold text-secondary animate-pulse ml-1">Mengunggah gambar...</p>}
                  {blogForm.image && !blogForm.image.startsWith('blob:') && (
                    <div className="relative group aspect-video rounded-xl overflow-hidden bg-black/5 border border-black/5">
                      <img src={blogForm.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Excerpt (Ringkasan Singkat)</label>
                <textarea 
                  rows="2"
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none"
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                  placeholder="Deskripsi singkat untuk preview artikel"
                ></textarea>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Konten Lengkap</label>
                <textarea 
                  rows="6"
                  required
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none text-sm"
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                  placeholder="Tulis konten artikel di sini"
                ></textarea>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1 mb-1 block">Penulis</label>
                <input 
                  type="text"
                  placeholder="Nama penulis"
                  className="w-full p-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-secondary outline-none"
                  value={blogForm.author}
                  onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-secondary text-white rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {editingBlog ? 'Update' : 'Terbitkan'}
                </button>
                {editingBlog && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingBlog(null);
                      setBlogForm({ title: '', date: '', category: '', image: '', excerpt: '', content: '', author: '' });
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

        {/* Blog List Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Artikel Terbit</h2>
            <span className="text-xs font-black uppercase tracking-widest text-text-secondary">
              {blogs.length} Artikel
            </span>
          </div>
          {loading ? (
            <div className="py-20 text-center text-text-secondary font-medium animate-pulse">Memuat artikel...</div>
          ) : (
            <div className="grid gap-4">
              {blogs.map((post) => (
                <motion.div 
                  key={post.id}
                  layout
                  className="glass p-6 rounded-[24px] border-black/5 flex items-center gap-6"
                >
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-20 h-20 object-cover rounded-2xl bg-black/5"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                        {post.category || 'Umum'}
                      </span>
                      <span className="text-[8px] text-text-secondary">{post.date}</span>
                    </div>
                    <h3 className="font-bold truncate">{post.title}</h3>
                    <p className="text-xs text-text-secondary line-clamp-1 mt-1">Oleh {post.author || 'Admin'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditBlog(post)}
                      className="p-3 bg-secondary/10 text-secondary rounded-xl hover:bg-secondary hover:text-white transition-all"
                    >
                      <i className="bx bx-edit-alt text-xl"></i>
                    </button>
                    <button 
                      onClick={() => handleDeleteBlog(post.id)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <i className="bx bx-trash text-xl"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
              {blogs.length === 0 && (
                <div className="glass p-8 rounded-[24px] border-black/5 text-center">
                  <p className="font-bold text-text-secondary">
                    Belum ada artikel. Mulai tulis artikel baru.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default Admin;
