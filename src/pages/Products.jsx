import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

const Products = () => {
  const { searchQuery, setSearchQuery } = useApp();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Semua');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  const handleReset = () => {
    setSelectedCategory('Semua');
    setSelectedSubCategory('Semua');
    setSearchQuery('');
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setSelectedCategory(cat);
      setSelectedSubCategory('Semua');
    } else {
      setSelectedCategory('Semua');
      setSelectedSubCategory('Semua');
    }
  }, [location.search]);

  const categories = ['Semua', ...Object.keys(categoryStructure)];
  const currentSubCategories = selectedCategory !== 'Semua' ? categoryStructure[selectedCategory] : [];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'Semua' || 
                             product.category === selectedCategory ||
                             product.category.startsWith(selectedCategory + ' -');
      
      const matchesSubCategory = selectedSubCategory === 'Semua' || 
                                product.category.includes(selectedSubCategory);

      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSubCategory && matchesSearch;
    });
  }, [products, selectedCategory, selectedSubCategory, searchQuery]);

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
            <span className="text-[10px] font-black tracking-[0.4em] text-secondary uppercase">Pasar / Katalog</span>
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]"
          >
            Solusi <br />
            <span className="text-gradient">Terdepan.</span>
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
      <section className="sticky top-28 z-40 space-y-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass p-3 rounded-[32px] border-black/5 flex flex-wrap items-center justify-center gap-2 shadow-2xl shadow-black/5"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubCategory('Semua');
              }}
              className={`px-8 py-4 rounded-2xl text-[11px] font-black tracking-[0.15em] uppercase transition-all duration-500 relative group ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-105'
                  : 'text-text-secondary hover:text-primary hover:bg-black/5'
              }`}
            >
              {cat}
              {selectedCategory === cat && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary rounded-2xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Sub-Category Navigation */}
        <AnimatePresence>
          {currentSubCategories.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="overflow-hidden flex justify-center"
            >
              <div className="inline-flex flex-wrap items-center justify-center gap-2 p-2 bg-black/5 backdrop-blur-xl rounded-[24px] border border-black/5 shadow-inner">
                <button
                  onClick={() => setSelectedSubCategory('Semua')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedSubCategory === 'Semua'
                      ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-105'
                      : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  Semua Tipe
                </button>
                <div className="w-px h-4 bg-black/10 mx-1" />
                {currentSubCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      selectedSubCategory === sub
                        ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-105'
                        : 'text-text-secondary hover:text-primary'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Dynamic Grid */}
      {loading ? (
        <div className="py-40 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-text-secondary font-black uppercase tracking-widest text-xs">Menyiapkan Database...</p>
        </div>
      ) : (
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
                <h3 className="text-4xl font-black uppercase tracking-tighter">Sistem Kosong</h3>
                <p className="text-text-secondary font-medium tracking-tight">Tidak ada produk ditemukan untuk "{searchQuery}"</p>
              </div>
              <button 
                onClick={handleReset}
                className="px-10 py-4 bg-primary text-background font-black rounded-2xl hover:scale-105 transition-all"
              >
                Atur Ulang Filter
              </button>
            </motion.div>
          )}
        </motion.section>
      )}
    </div>
  );
};

export default Products;
