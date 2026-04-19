import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { blogPosts } from '../data/blog';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left

  const slides = [
    {
      id: 1,
      image: "/hero-1.png",
      title: "Penerangan Jalan Umum Tenaga Surya"
    },
    {
      id: 2,
      image: "/hero-2.png",
      title: "Our best seller"
    },
    {
      id: 3,
      image: "/hero-3.png",
      title: "PJU Solar Panel"
    }
  ];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // Diperlama menjadi 8 detik
    return () => clearInterval(timer);
  }, [slides.length]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full aspect-[16/9] md:aspect-auto md:h-[80vh] rounded-xl md:rounded-[48px] overflow-hidden group shadow-2xl shadow-black/5 mt-4">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentSlide}
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 }
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-primary w-6 md:w-8" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
      
      {/* Prev/Next buttons */}
      <button 
        onClick={() => paginate(-1)}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white/30 z-10"
      >
        <i className="bx bx-chevron-left text-2xl md:text-3xl"></i>
      </button>
      <button 
        onClick={() => paginate(1)}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white/30 z-10"
      >
        <i className="bx bx-chevron-right text-2xl md:text-3xl"></i>
      </button>
    </section>
  );
};

const Home = () => {
  useEffect(() => {
    document.title = 'Niscahya Indonesia Cerdas | Lampu PJU Tenaga Surya Terbaik';
    
    // SEO Meta Update
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Distributor resmi Lampu PJU Tenaga Surya berkualitas di Indonesia. Tersedia model All In One, Two In One, dan Konvensional dengan harga kompetitif.');
    }
    
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + '/');
    
    return () => {
      document.title = 'Niscahya Indonesia Cerdas';
    };
  }, []);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const targetIds = [32, 77, 83, 80];
        const filtered = data.filter(p => targetIds.includes(p.id))
                           .sort((a, b) => targetIds.indexOf(a.id) - targetIds.indexOf(b.id));
        setFeaturedProducts(filtered.length > 0 ? filtered : data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const stats = [
    { label: 'Proyek Selesai', value: '150+', unit: 'Unit', icon: 'bx bx-check-double', color: 'text-primary' },
    { label: 'Panel Terpasang', value: '5000+', unit: 'Panel', icon: 'bx bx-sun', color: 'text-secondary' },
    { label: 'Jangkauan Wilayah', value: '24+', unit: 'Provinsi', icon: 'bx bx-map-alt', color: 'text-accent' },
  ];

  const partners = ['NISCAHYA', 'INDONESIA', 'CERDAS'];

  return (
    <div className="space-y-10 md:space-y-24">
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
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              Menerangi Masa Depan Indonesia.
            </h2>
          </div>
          <p className="text-lg text-text-secondary font-medium leading-relaxed">
            CV Niscahya Indonesia Cerdas adalah mitra strategis Anda dalam distribusi lampu PJU Tenaga Surya dan PLN berkualitas tinggi. Kami menghadirkan solusi penerangan jalan umum yang mengedepankan efisiensi maksimal, penghematan energi, serta konsep ramah lingkungan yang berkelanjutan.
          </p>
          <p className="text-lg text-text-secondary font-medium leading-relaxed">
            Didukung oleh tim profesional dan produk berstandar industri, kami siap melayani kebutuhan pencahayaan proyek di seluruh skala wilayah Indonesia dari pusat perkotaan hingga pelosok daerah terpencil. Komitmen utama kami adalah memberikan akses cahaya yang aman, andal, dan inovatif bagi masyarakat Indonesia.
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
          className="relative h-64 md:h-125 rounded-3xl md:rounded-[48px] overflow-hidden shadow-2xl shadow-black/5"
        >
          <img 
            src="/PJU TENAGA SURYA.jpeg" 
            alt="Industri Energi Surya" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 p-4 md:p-6 glass-bright rounded-2xl md:rounded-3xl border border-white/20">
            <div className="flex justify-around items-center">
              <div className="text-center">
                <h4 className="text-2xl md:text-3xl font-black text-primary">10+</h4>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-text-secondary mt-1">Tahun Pengalaman</p>
              </div>
              <div className="w-px h-10 md:h-12 bg-black/10"></div>
              <div className="text-center">
                <h4 className="text-2xl md:text-3xl font-black text-secondary">500+</h4>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-text-secondary mt-1">Proyek Selesai</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Energy Impact Stats */}
      <section className="grid grid-cols-3 gap-3 md:gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 md:p-10 rounded-2xl md:rounded-[48px] text-center space-y-4 md:space-y-6 border-black/5 hover:border-primary/20 transition-all group shadow-xl shadow-black/5"
          >
            <div className={`w-10 h-10 md:w-20 md:h-20 mx-auto bg-black/5 rounded-xl md:rounded-3xl flex items-center justify-center text-xl md:text-4xl ${stat.color} group-hover:scale-110 transition-transform`}>
              <i className={stat.icon}></i>
            </div>
            <div className="space-y-1 md:space-y-2">
              <h4 className="text-2xl md:text-6xl font-black tracking-tighter uppercase">{stat.value}</h4>
              <p className="text-[8px] md:text-sm font-black text-text-secondary uppercase tracking-widest md:tracking-[0.2em] leading-tight">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Partners Scroll */}
      <section className="overflow-hidden py-10 border-y border-black/5 -mx-6 lg:-mx-10">
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Produk Kami</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Unggulan.</h2>
          </div>
          <Link to="/products" className="px-8 py-4 glass border border-black/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black/5 transition-all">
            Lihat Semua Produk <i className="bx bx-right-arrow-alt text-lg align-middle ml-2"></i>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-48 md:h-100 glass animate-pulse rounded-3xl md:rounded-[48px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
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

      {/* Latest Blog Section */}
      <section className="space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-[0.4em] text-secondary uppercase">Wawasan & Edukasi</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Blog Terbaru.</h2>
          </div>
          <Link to="/blog" className="px-8 py-4 glass border border-black/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black/5 transition-all">
            Jelajahi Semua Artikel <i className="bx bx-right-arrow-alt text-lg align-middle ml-2"></i>
          </Link>
        </div>

        <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto pb-6 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide no-scrollbar snap-x snap-mandatory">
          {[...blogPosts].sort((a, b) => b.id - a.id).slice(0, 3).map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[280px] w-[80vw] md:w-auto snap-center group glass rounded-[40px] overflow-hidden border-black/5 hover:border-secondary/20 transition-all flex flex-col shrink-0"
            >
              <Link to={`/blog/${post.id}`} className="relative aspect-video overflow-hidden block">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-[8px] font-black uppercase tracking-widest rounded-lg text-secondary shadow-lg">
                    {post.category}
                  </span>
                </div>
              </Link>
              <div className="p-8 space-y-4 grow flex flex-col">
                <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">{post.date}</p>
                <Link to={`/blog/${post.id}`}>
                  <h3 className="text-xl font-black tracking-tight uppercase leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-xs text-text-secondary font-medium line-clamp-2 leading-relaxed grow">
                  {post.excerpt}
                </p>
                <div className="pt-4">
                  <Link 
                    to={`/blog/${post.id}`}
                    className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Baca Selengkapnya <i className="bx bx-right-arrow-alt text-lg"></i>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Hubungi & Lokasi Section */}
      <section id="contact" className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12 border-t border-black/5">
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
          <Link 
            to="/#contact"
            className="w-full py-5 bg-black/5 hover:bg-black/10 transition-colors rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3"
          >
            Konsultasi Sekarang <i className="bx bx-right-arrow-alt text-xl"></i>
          </Link>
        </div>

        {/* Lokasi Kami (Map) */}
        <div className="glass p-4 rounded-[48px] border-black/5 shadow-xl shadow-black/5 relative overflow-hidden h-125 lg:h-auto">
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

export default Home;
