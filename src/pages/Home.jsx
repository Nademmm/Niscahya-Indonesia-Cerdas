import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/hero-1.png",
      title: "Penerangan Jalan Umum Tenaga Surya"
    },
    {
      id: 2,
      image: "/hero-2.png",
      title: "Slide 2"
    },
    {
      id: 3,
      image: "/hero-3.png",
      title: "Slide 3"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[600px] md:h-[80vh] rounded-[48px] overflow-hidden group shadow-2xl shadow-black/5 mt-4">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentSlide}
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      
      {/* Overlay gradient if you want to put text later */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-primary w-8" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
      
      {/* Prev/Next buttons */}
      <button 
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 z-10"
      >
        <i className="bx bx-chevron-left text-3xl"></i>
      </button>
      <button 
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 z-10"
      >
        <i className="bx bx-chevron-right text-3xl"></i>
      </button>
    </section>
  );
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const stats = [
    { label: 'Offset CO2', value: '42.5rb', unit: 'Ton', icon: 'bx bx-leaf', color: 'text-primary' },
    { label: 'Energi Hemat', value: '850jt', unit: 'Wh', icon: 'bx bx-bolt', color: 'text-secondary' },
    { label: 'Jangkauan', value: '120+', unit: 'Kota', icon: 'bx bx-globe', color: 'text-accent' },
  ];

  const partners = ['NISCAHYA', 'INDONESIA', 'CERDAS'];

  return (
    <div className="space-y-32">
      <HeroSlider />

      {/* About Industry Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Tentang Niscahya</span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Menerangi Masa Depan <br /> <span className="text-gradient">Indonesia.</span>
            </h2>
          </div>
          <p className="text-lg text-text-secondary font-medium leading-relaxed">
            CV Niscahya Indonesia Cerdas hadir sebagai solusi terdepan dalam industri penerangan jalan umum dan energi surya. Kami berdedikasi untuk memberikan pencahayaan yang optimal, hemat energi, dan ramah lingkungan bagi seluruh pelosok negeri.
          </p>
          <p className="text-lg text-text-secondary font-medium leading-relaxed">
            Dengan teknologi cerdas terkini dan standar kualitas tertinggi, produk kami dirancang untuk tangguh di berbagai kondisi cuaca, memastikan keamanan dan kenyamanan di jalan raya maupun area publik lainnya tanpa membebani biaya listrik berkelanjutan.
          </p>
          <div className="pt-4 flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl">
                <i className="bx bx-check-shield"></i>
              </div>
              <span className="font-bold uppercase tracking-widest text-xs">Kualitas Teruji</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary text-2xl">
                <i className="bx bx-leaf"></i>
              </div>
              <span className="font-bold uppercase tracking-widest text-xs">Ramah Lingkungan</span>
            </div>
          </div>
          <div className="pt-4">
            <Link to="/about" className="inline-flex items-center gap-3 px-8 py-4 bg-black/5 hover:bg-primary hover:text-background transition-all rounded-xl font-bold uppercase tracking-widest text-xs group">
              Selengkapnya <i className="bx bx-right-arrow-alt text-xl group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-[500px] rounded-[48px] overflow-hidden shadow-2xl shadow-black/5"
        >
          <img 
            src="/public/panel.jpg" 
            alt="Industri Energi Surya" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 p-6 glass-bright rounded-3xl border border-white/20">
            <div className="flex justify-around items-center">
              <div className="text-center">
                <h4 className="text-3xl font-black text-primary">10+</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mt-1">Tahun Pengalaman</p>
              </div>
              <div className="w-px h-12 bg-black/10"></div>
              <div className="text-center">
                <h4 className="text-3xl font-black text-secondary">500+</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mt-1">Proyek Selesai</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Energy Impact Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-10 rounded-[48px] text-center space-y-4 border-black/5 hover:border-primary/20 transition-all group shadow-xl shadow-black/5"
          >
            <div className={`w-16 h-16 mx-auto bg-black/5 rounded-[24px] flex items-center justify-center text-3xl ${stat.color} group-hover:scale-110 transition-transform`}>
              <i className={stat.icon}></i>
            </div>
            <div className="space-y-1">
              <h4 className="text-5xl font-black tracking-tighter uppercase">{stat.value}</h4>
              <p className="text-sm font-black text-text-secondary uppercase tracking-[0.2em]">{stat.label} ({stat.unit})</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Partners Scroll */}
      <section className="overflow-hidden py-10 border-y border-black/5 mx-[-1.5rem] lg:mx-[-2.5rem]">
        <div className="flex items-center gap-20 animate-marquee whitespace-nowrap">
          {[...partners, ...partners, ...partners, ...partners].map((partner, i) => (
            <span key={i} className="text-4xl md:text-6xl font-black text-black/5 uppercase tracking-tighter hover:text-primary transition-colors cursor-default">
              {partner}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Teknologi Terbaru</span>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Unggulan.</h2>
          </div>
          <Link to="/products" className="px-8 py-4 glass border border-black/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black/5 transition-all">
            Lihat Semua Produk <i className="bx bx-right-arrow-alt text-lg align-middle ml-2"></i>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-[400px] glass animate-pulse rounded-[48px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Map Section */}
      <motion.section 
        whileInView={{ scale: 0.95, opacity: 1 }}
        initial={{ scale: 1, opacity: 0 }}
        className="relative rounded-[64px] overflow-hidden glass border-black/5 mx-4 lg:mx-0 shadow-2xl shadow-black/5 group"
      >
        <div className="p-12 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Lokasi Kami</span>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Kunjungi Kami.</h2>
            </div>
            <p className="text-text-secondary font-medium max-w-sm text-right">
              Temukan unit terbaik kami secara langsung di showroom SinarSurya EnergiKu.
            </p>
          </div>
          
          <div className="w-full h-[500px] rounded-[48px] overflow-hidden border-4 border-black/5 shadow-inner relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.047714009534!2d112.75474949999999!3d-7.373135199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e5e072a76abf%3A0xe5803d1aaf72795b!2sLampu%20PJU%20SinarSurya%20EnergiKu!5e1!3m2!1sid!2sid!4v1776048109065!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
