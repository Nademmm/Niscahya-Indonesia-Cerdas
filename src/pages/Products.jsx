import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { useApp } from '../context/AppContext';

const Products = () => {
  const { searchQuery, setSearchQuery } = useApp();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleReset = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('All');
    }
  }, [location.search]);

  const categories = ['All', 'Lampu Jalan', 'Lampu Taman', 'Solar Panel', 'Baterai', 'Aksesori'];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-20">
      {/* Experimental Header */}
      <section className="relative pt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          className="absolute top-0 right-0 p-20 -z-10 animate-pulse"
        >
          <i className="bx bx-package text-[300px]"></i>
        </motion.div>
        <div className="max-w-3xl space-y-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-2xl"
          >
            <span className="text-[10px] font-black tracking-[0.4em] text-secondary uppercase">Marketplace / Catalog</span>
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]"
          >
            Advanced <br />
            <span className="text-gradient">Solutions.</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary font-medium max-w-xl"
          >
            Pilih perangkat yang tepat untuk sistem energi Anda. Teknologi mutakhir dengan efisiensi terverifikasi.
          </motion.p>
        </div>
      </section>

      {/* Filter Navigation */}
      <section className="sticky top-28 z-40">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass p-2 rounded-[28px] border-black/5 inline-flex flex-wrap gap-1 shadow-2xl shadow-black/5"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => cat === 'All' ? handleReset() : setSelectedCategory(cat)}
              className={`px-8 py-3.5 rounded-[22px] text-xs font-black tracking-[0.2em] uppercase transition-all duration-500 ${
                selectedCategory === cat
                  ? 'bg-primary text-background shadow-xl shadow-primary/20'
                  : 'text-text-secondary hover:text-primary hover:bg-black/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Dynamic Grid */}
      <motion.section 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence mode='popLayout'>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              variants={item}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-40 glass rounded-[64px] flex flex-col items-center justify-center text-center space-y-8 shadow-2xl shadow-black/5 border-black/5"
          >
            <div className="w-24 h-24 bg-black/5 rounded-[32px] flex items-center justify-center border border-black/5 animate-bounce-slow">
              <i className="bx bx-ghost text-5xl text-text-secondary"></i>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-black uppercase tracking-tighter">System Error: Empty</h3>
              <p className="text-text-secondary font-medium tracking-tight">Tidak ada produk ditemukan untuk "{searchQuery}"</p>
            </div>
            <button 
              onClick={handleReset}
              className="px-10 py-4 bg-primary text-background font-black rounded-2xl hover:scale-105 transition-all"
            >
              Reset Filter
            </button>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default Products;
