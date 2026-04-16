import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blog';

const Blog = () => {
  useEffect(() => {
    document.title = 'Wawasan & Edukasi Energi Terbarukan | Blog Niscahya';
    
    // SEO Meta Update
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Dapatkan informasi terbaru mengenai teknologi panel surya, panduan harga lampu jalan 2025, dan tips perawatan energi terbarukan di Blog Niscahya.');
    }
    
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + '/blog');
    
    return () => {
      document.title = 'Niscahya Indonesia Cerdas';
    };
  }, []);

  const [activeCategory, setActiveCategory] = useState('Semua');
  const categories = ['Semua', ...new Set(blogPosts.map(post => post.category))];

  const sortedPosts = [...blogPosts].sort((a, b) => b.id - a.id);

  const filteredPosts = activeCategory === 'Semua' 
    ? sortedPosts 
    : sortedPosts.filter(post => post.category === activeCategory);

  return (
    <div className="space-y-20">
      {/* Blog Header */}
      <section className="relative pt-10">
        <div className="max-w-3xl space-y-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-2xl"
          >
            <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Inovasi / Edukasi</span>
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[1.1]"
          >
            Wawasan Energi Terbarukan.
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary font-medium max-w-xl"
          >
            Jelajahi artikel terbaru kami tentang teknologi PJU tenaga surya, tips efisiensi, dan fakta unik dunia energi.
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="flex flex-wrap gap-3">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-black/5 text-text-secondary hover:bg-black/10'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </section>

      {/* Blog Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {filteredPosts.map((post, idx) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
            className="group glass rounded-[48px] overflow-hidden border-black/5 hover:border-primary/20 transition-all flex flex-col h-full"
          >
            <Link to={`/blog/${post.id}`} className="relative aspect-video overflow-hidden block">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest rounded-xl text-primary shadow-lg">
                  {post.category}
                </span>
              </div>
            </Link>
            
            <div className="p-10 flex flex-col grow space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-black text-text-secondary uppercase tracking-widest">
                <span>{post.date}</span>
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                <span>Oleh {post.author}</span>
              </div>
              
              <Link to={`/blog/${post.id}`}>
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-[1.1] group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
              </Link>
              
              <p className="text-text-secondary font-medium line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="pt-6 mt-auto">
                <Link 
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                  Baca Selengkapnya
                  <i className="bx bx-right-arrow-alt text-lg"></i>
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-primary p-12 md:p-20 rounded-[64px] relative overflow-hidden text-center space-y-8">
        <div className="absolute top-0 right-0 p-10 opacity-20 rotate-12">
          <i className="bx bx-news text-[200px] text-white"></i>
        </div>
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
            Ingin Tahu Lebih Banyak Tentang Energi Surya?
          </h2>
          <p className="text-white/80 font-medium text-lg">
            Hubungi tim ahli kami untuk konsultasi gratis mengenai kebutuhan sistem energi Anda.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://wa.me/628123456789" 
              className="px-10 py-4 bg-white text-primary font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs"
            >
              Konsultasi via WhatsApp
            </a>
            <Link 
              to="/products"
              className="px-10 py-4 bg-primary-dark/20 border border-white/20 text-white font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs"
            >
              Lihat Katalog Produk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
