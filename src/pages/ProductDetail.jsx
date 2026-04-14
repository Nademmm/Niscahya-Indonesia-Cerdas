import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const normalizeImageList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
  } catch (_err) {
    // Fallback for comma-separated legacy values.
  }

  return trimmed.split(',');
};

const getCategoryDisplay = (fullCategory) => {
  if (fullCategory.includes(' - ')) {
    return fullCategory.split(' - ')[1];
  }
  return fullCategory;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  // Chat ke WhatsApp
  const handleBuyNow = () => {
  const phoneNumber = "6287853536124";
  const message = `Halo Admin Niscaya Indonesia Cerdas
  Saya ingin melakukan pembelian produk berikut:
  ${product?.name || 'Produk'}
  Jumlah: ${quantity} unit
  Silakan diproses ya. Terima kasih`;
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, allRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch('/api/products')
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          const normalizedExtras = [
            ...normalizeImageList(prodData.images),
            prodData.image2,
            prodData.image3,
            prodData.image4,
            prodData.image5
          ].filter(Boolean);

          const firstAvailableImage = prodData.image || normalizedExtras[0] || null;

          setProduct(prodData);
          setSelectedImage(firstAvailableImage);
        } else {
          setProduct(null);
        }

        if (allRes.ok) {
          const allData = await allRes.json();
          setRelatedProducts(allData.filter(p => p.id !== parseInt(id)));
        }
      } catch (err) {
        console.error('Failed to fetch product data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 glass rounded-[64px] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary font-black uppercase tracking-widest text-xs">Mengakses Inti Sistem...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-40 glass rounded-[64px] space-y-8">
        <i className="bx bx-error text-8xl text-primary animate-pulse"></i>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Produk Tidak Ditemukan</h1>
        <Link to="/products" className="px-10 py-5 bg-primary text-background font-black rounded-2xl">Kembali ke Katalog</Link>
      </div>
    );
  }

  const normalizedGalleryImages = [
    ...normalizeImageList(product.images),
    product.image2,
    product.image3,
    product.image4,
    product.image5
  ].filter(Boolean);

  const allImages = [product.image, ...normalizedGalleryImages].filter((img, index, self) => 
    img && typeof img === 'string' && img.trim() !== '' && self.indexOf(img) === index
  );

  const galleryImages = normalizedGalleryImages.filter((img, index, self) => 
    img && typeof img === 'string' && img.trim() !== '' && self.indexOf(img) === index
  );

  const firstImage = allImages[0] || null;
  const thumbnailSlots = [
    firstImage,
    ...Array.from({ length: 4 }, (_, idx) => galleryImages[idx] || null)
  ];

  const displayedImage = selectedImage || allImages[0] || '';

  return (
    <div className="space-y-24">
      {/* Detail Header */}
      <section className="flex flex-col lg:flex-row gap-16">
        {/* Gallery Utama */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex-1 space-y-6"
        >
          <div className="relative aspect-[4/5] glass rounded-[48px] overflow-hidden group shadow-2xl shadow-black/5">
            <AnimatePresence mode="wait">
              <motion.img 
                key={displayedImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                src={displayedImage} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </AnimatePresence>
            <div className="absolute top-8 left-8">
              <span className="px-6 py-2 glass-bright rounded-full text-xs font-black uppercase tracking-[0.2em] border border-black/10">
                {getCategoryDisplay(product.category)}
              </span>
            </div>
          </div>
          
          {/* Thumbnail Selector */}
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {thumbnailSlots.map((img, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => img && setSelectedImage(img)}
                className={`flex-shrink-0 w-24 h-24 glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border-2 ${
                  displayedImage === img && img
                    ? 'border-primary opacity-100 ring-4 ring-primary/10' 
                    : 'border-transparent opacity-40 hover:opacity-70'
                }`}
              >
                {img ? (
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-text-secondary/30">
                    Slot {i + 1}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex-1 flex flex-col justify-center space-y-12"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-xs font-black tracking-[0.3em] text-text-secondary uppercase">
              <Link to="/products" className="hover:text-primary transition-colors">Katalog</Link>
              <i className="bx bx-chevron-right text-lg"></i>
              <span className="text-primary">{product.name}</span>
            </div>
            <motion.h1 
              layoutId={`product-name-${product.id}`}
              className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]"
            >
              {(product.name || '').split(' ').slice(0, -1).join(' ')} <br />
              <span className="text-gradient">{(product.name || '').split(' ').slice(-1)}</span>
            </motion.h1>
            <span className="inline-flex px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl">
              Tersedia
            </span>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center glass border border-black/10 rounded-2xl overflow-hidden h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 hover:bg-black/5 transition-colors h-full"
                >
                  <i className="bx bx-minus font-bold"></i>
                </button>
                <span className="w-12 text-center font-black text-xl">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 hover:bg-black/5 transition-colors h-full"
                >
                  <i className="bx bx-plus font-bold"></i>
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleBuyNow}
                className="flex-1 py-6 bg-primary text-background font-black text-2xl rounded-[32px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 group"
              >
                <i className="bx bxl-whatsapp text-4xl"></i>
                <span>Beli Sekarang via WhatsApp</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-6 rounded-[32px] flex items-center gap-4 border-black/5 shadow-lg shadow-black/5">
                <i className="bx bx-shield-alt-2 text-3xl text-primary"></i>
                <span className="text-xs font-black uppercase tracking-widest text-text-secondary">Garansi 2 Tahun</span>
              </div>
              <div className="glass p-6 rounded-[32px] flex items-center gap-4 border-black/5 shadow-lg shadow-black/5">
                <i className="bx bx-trending-up text-3xl text-secondary"></i>
                <span className="text-xs font-black uppercase tracking-widest text-text-secondary">Sertifikasi Eco</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Deskripsi */}
      <section className="space-y-12">
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Deskripsi <br /><span className="text-secondary">Sistem</span></h2>
            <div className="glass p-10 rounded-[48px] border-black/5 shadow-xl shadow-black/5 bg-gradient-to-br from-white to-black/5">
              <p className="text-xl text-text-secondary font-medium leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="glass p-8 rounded-[32px] border-black/5 flex items-center gap-6 group hover:border-primary/30 transition-all">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <i className="bx bx-check-shield"></i>
              </div>
              <div>
                <h4 className="font-black uppercase tracking-tighter">Kualitas Terjamin</h4>
                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest">Sertifikasi Standar Nasional</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Selection */}
      <section className="space-y-12">
        <div className="flex items-end justify-between">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Unit <br /><span className="text-secondary">Terkait</span></h2>
          <Link to="/products" className="text-lg font-black uppercase tracking-tighter hover:text-primary transition-colors flex items-center gap-2">
            Katalog <i className="bx bx-right-arrow-alt text-2xl"></i>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {relatedProducts.slice(0, 4).map(p => (
            <motion.div 
              key={p.id} 
              whileHover={{ y: -10 }}
              className="group glass rounded-[32px] overflow-hidden hover:border-primary/30 transition-all border-black/5 shadow-xl shadow-black/5"
            >
              <div className="aspect-square relative overflow-hidden">
                <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <Link to={`/products/${p.id}`} className="absolute inset-0 z-10"></Link>
              </div>
              <div className="p-6 space-y-2">
                <h4 className="text-sm font-black uppercase tracking-tight line-clamp-1">{p.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
