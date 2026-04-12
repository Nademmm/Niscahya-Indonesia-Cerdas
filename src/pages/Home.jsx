import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Home = () => {
  const featuredProducts = products.slice(0, 4);

  const stats = [
    { label: 'CO2 Offset', value: '42.5k', unit: 'Tons', icon: 'bx bx-leaf', color: 'text-primary' },
    { label: 'Energy Saved', value: '850M', unit: 'Wh', icon: 'bx bx-bolt', color: 'text-secondary' },
    { label: 'Global Reach', value: '120+', unit: 'Cities', icon: 'bx bx-globe', color: 'text-accent' },
  ];

  const partners = ['Vercel', 'Stripe', 'Tesla', 'NASA', 'SpaceX'];

  return (
    <div className="space-y-32">
      {/* Experimental Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent animate-pulse"></div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-black/5 rounded-full"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_#10b981]"></div>
          </motion.div>
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-black/5 rounded-full"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-secondary rounded-full shadow-[0_0_20px_#f59e0b]"></div>
          </motion.div>
        </div>

        <div className="max-w-4xl space-y-8 relative">
          
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] uppercase"
          >
            Solar <br />
            <span className="text-gradient">Evolution.</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Mendefinisikan ulang cara kita berinteraksi dengan energi. Cerdas, efisien, dan sepenuhnya berkelanjutan.
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Link
              to="/products"
              className="group relative px-10 py-5 bg-primary text-background font-black text-xl rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 flex items-center gap-3">
                Start Journey <i className="bx bx-right-arrow-alt text-2xl"></i>
              </span>
            </Link>
            <Link
              to="/about"
              className="px-10 py-5 glass border border-black/10 rounded-2xl font-black text-xl hover:bg-black/5 transition-all text-center"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
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

      {/* Bento Grid Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -50 }}
          className="md:col-span-2 glass p-12 rounded-[56px] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <i className="bx bx-sun text-[250px] text-primary"></i>
          </div>
          <div className="relative z-10 space-y-8">
            <span className="w-16 h-16 bg-primary/20 text-primary rounded-3xl flex items-center justify-center border border-primary/20">
              <i className="bx bx-bolt text-3xl"></i>
            </span>
            <div className="space-y-4">
              <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">High Efficiency <br />Photovoltaic</h3>
              <p className="text-xl text-text-secondary font-medium max-w-lg leading-relaxed">
                Panel surya generasi terbaru dengan efisiensi konversi hingga 24.5%. Maksimalkan setiap sinar matahari untuk energi rumah Anda.
              </p>
            </div>
            <Link 
              to="/solutions"
              className="flex items-center gap-3 font-black uppercase tracking-widest text-primary group-hover:gap-5 transition-all"
            >
              Read Whitepaper <i className="bx bx-right-arrow-alt text-2xl"></i>
            </Link>
          </div>
        </motion.div>
        <motion.div 
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 50 }}
          className="glass p-12 rounded-[56px] bg-gradient-to-br from-secondary/20 to-transparent border-secondary/20 flex flex-col justify-between"
        >
          <div className="space-y-8">
            <span className="w-16 h-16 bg-secondary/20 text-secondary rounded-3xl flex items-center justify-center border border-secondary/20">
              <i className="bx bx-chip text-3xl"></i>
            </span>
            <div className="space-y-4">
              <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">Smart AI <br />Control</h3>
              <p className="text-xl text-text-secondary font-medium leading-relaxed">
                Sistem manajemen energi berbasis AI yang mengoptimalkan penggunaan daya secara otomatis berdasarkan pola hidup Anda.
              </p>
            </div>
          </div>
          <div className="pt-10 flex gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <div className="w-2 h-2 bg-secondary/30 rounded-full"></div>
            <div className="w-2 h-2 bg-secondary/30 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Partners Scroll */}
      <section className="overflow-hidden py-10 border-y border-black/5">
        <div className="flex items-center gap-20 animate-marquee whitespace-nowrap">
          {[...partners, ...partners].map((partner, i) => (
            <span key={i} className="text-4xl md:text-6xl font-black text-black/5 uppercase tracking-tighter hover:text-primary transition-colors cursor-default">
              {partner}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="text-xs font-black tracking-[0.3em] text-secondary uppercase">The Collection</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Prime <span className="text-primary">Selection.</span>
            </h2>
          </div>
          <Link to="/products" className="group flex items-center gap-3 text-lg font-black uppercase tracking-tighter hover:text-primary transition-colors">
            Explore All Products <i className="bx bx-right-arrow-alt text-2xl group-hover:translate-x-2 transition-transform"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Big CTA Section */}
      <motion.section 
        whileInView={{ scale: 0.95, opacity: 1 }}
        initial={{ scale: 1, opacity: 0 }}
        className="relative py-32 rounded-[64px] overflow-hidden bg-primary group mx-4 lg:mx-0 shadow-2xl shadow-primary/20"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="relative z-10 text-center space-y-12 px-6">
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8]">
            Ready for <br />the Green?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/products"
              className="px-12 py-6 bg-white text-primary font-black text-2xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              Join Movement
            </Link>
            <Link
              to="/contact"
              className="px-12 py-6 border-4 border-white text-white font-black text-2xl rounded-2xl hover:bg-white hover:text-primary transition-all text-center"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
