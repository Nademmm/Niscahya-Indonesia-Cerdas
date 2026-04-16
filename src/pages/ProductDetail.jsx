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
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  // Render deskripsi dengan support bold markdown (**teks**)
  const renderDescription = (text) => {
    if (!text) return null;
    
    // Pecah teks berdasarkan pattern **...**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Hapus tanda bintang dan jadikan bold
        return <strong key={index} className="font-black text-text-main">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Chat ke WhatsApp
  const handleBuyNow = () => {
  const phoneNumber = "6287853536124";
  const message = `Halo Admin Niscahya Indonesia Cerdas
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
          fetch(`/api/products/${slug}`),
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
          document.title = `${prodData.name} | Niscahya Indonesia Cerdas`;
          
          // SEO Meta Update
          let metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', prodData.description.substring(0, 160));
          }
          
          let canonical = document.querySelector('link[rel="canonical"]');
          if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
          }
          canonical.setAttribute('href', window.location.href);
        } else {
          setProduct(null);
        }

        if (allRes.ok) {
          const allData = await allRes.json();
          setRelatedProducts(allData.filter(p => p.slug !== slug));
        }
      } catch (err) {
        console.error('Failed to fetch product data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

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

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": allImages,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Niscahya"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "IDR",
      "price": product.price || "0",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="space-y-24">
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
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
                alt={`${product.name} - Lampu PJU Tenaga Surya Niscahya`} 
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {thumbnailSlots.map((img, i) => (
              <button 
                key={i}
                onClick={() => img && setSelectedImage(img)}
                className={`aspect-square rounded-2xl overflow-hidden transition-all ${
                  selectedImage === img ? 'ring-4 ring-primary' : 'opacity-60 hover:opacity-100'
                } ${!img ? 'bg-black/5' : ''}`}
              >
                {img && (
                  <img 
                    src={img} 
                    alt={`${product.name} Gallery ${i + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                )}
              </button>
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
              className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[1.1]"
            >
              {product.name}
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
          <div className="glass p-10 rounded-[48px] border-black/5 shadow-xl shadow-black/5 bg-gradient-to-br from-white to-black/5">
            <p className="text-base md:text-lg text-text-secondary font-medium leading-relaxed whitespace-pre-line">
              {renderDescription(product.description)}
            </p>
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
          <h2 className="text-4xl font-black uppercase tracking-tighter">Unit Terkait</h2>
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

      {/* Hubungi & Lokasi Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12 border-t border-black/5">
        {/* Kontak Kami */}
        <div className="glass p-10 rounded-[48px] space-y-8 flex flex-col justify-between border-black/5 shadow-xl shadow-black/5">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Hubungi Kami</span>
              <h3 className="text-4xl font-black uppercase tracking-tighter">Siap Melayani <br />Kebutuhan Anda.</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl">
                  <i className="bx bxs-phone-call"></i>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black text-text-secondary/60 uppercase tracking-[0.2em]">Telepon / WA</span>
                  <div className="flex flex-col gap-0.5">
                    <a href="https://wa.me/6287853536124" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg font-black tracking-tight hover:text-primary transition-colors">+62 878 5353 6124</a>
                    <a href="https://wa.me/6282143707398" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg font-black tracking-tight hover:text-primary transition-colors">+62 821 4370 7398</a>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary text-2xl">
                  <i className="bx bxs-envelope"></i>
                </div>
                <div className="flex flex-col min-w-0 overflow-hidden">
                  <span className="text-[10px] font-black text-text-secondary/60 uppercase tracking-[0.2em]">Email</span>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=cvniscahyaindonesiacerdas@gmail.com" target="_blank" rel="noopener noreferrer" className="text-sm md:text-base font-black tracking-tight break-all hover:text-secondary transition-colors">cvniscahyaindonesiacerdas@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl">
                  <i className="bx bxs-map"></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-text-secondary/60 uppercase tracking-[0.2em]">Marketing Office</span>
                  <span className="text-lg font-black leading-tight tracking-tight">Wisma Juanda Permai Jl. Bouraq Blok B1 No. 15, Sedati Gede, <br />Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={handleBuyNow}
            className="w-full py-5 bg-black/5 hover:bg-black/10 transition-colors rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3"
          >
            Konsultasi Sekarang <i className="bx bx-right-arrow-alt text-xl"></i>
          </button>
        </div>

        {/* Lokasi Kami (Map) */}
        <div className="glass p-4 rounded-[48px] border-black/5 shadow-xl shadow-black/5 relative overflow-hidden h-[500px] lg:h-auto">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.047714009534!2d112.75474949999999!3d-7.373135199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e5e072a76abf%3A0xe5803d1aaf72795b!2sLampu%20PJU%20SinarSurya%20EnergiKu!5e1!3m2!1sid!2sid!4v1776048109065!5m2!1sid!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-[36px] shadow-inner"
          ></iframe>
          <div className="absolute top-8 right-8 pointer-events-none">
            <span className="px-4 py-2 glass-bright rounded-full text-[10px] font-black uppercase tracking-widest border border-black/10 shadow-lg">Showroom Kami</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;