import React, { useState, useMemo, useEffect, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

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

const categories = ['Semua', ...Object.keys(categoryStructure)];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const ProductGrid = memo(({ products, loading, searchQuery, handleReset }) => {
  if (loading) {
    return (
      <div className="py-40 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-text-secondary font-black uppercase tracking-widest text-xs">Menyiapkan Database...</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}

      {products.length === 0 && (
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
    </motion.div>
  );
});

const Products = () => {
  const { searchQuery, setSearchQuery } = useApp();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Semua');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

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

  const currentSubCategories = selectedCategory !== 'Semua' ? categoryStructure[selectedCategory] : [];

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];
    
    const query = searchQuery.trim().toLowerCase();
    const cat = selectedCategory;
    const subCat = selectedSubCategory;

    return products.filter(product => {
      // Category filter first (usually more selective)
      if (cat !== 'Semua') {
        const productCat = product.category;
        if (productCat !== cat && !productCat.startsWith(cat + ' -')) {
          return false;
        }
      }
      
      // Sub-category filter
      if (subCat !== 'Semua' && !product.category.includes(subCat)) {
        return false;
      }

      // Search filter last (more expensive)
      if (query) {
        return product.name.toLowerCase().includes(query) || 
               product.category.toLowerCase().includes(query);
      }
      
      return true;
    });
  }, [products, selectedCategory, selectedSubCategory, searchQuery]);

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
      <section className="sticky top-28 z-40 space-y-6 mx-[-1.5rem] lg:mx-[-2.5rem] px-6 lg:px-10">
        <div className="relative group/nav">
          {/* Scroll Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-black/5 flex items-center justify-center text-primary z-10 opacity-0 group-hover/nav:opacity-100 transition-opacity hover:bg-white"
          >
            <i className="bx bx-chevron-left text-2xl"></i>
          </button>
          
          <motion.div 
            ref={scrollRef}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass p-2 rounded-[24px] border-black/5 flex flex-nowrap items-center justify-start gap-2 shadow-2xl shadow-black/5 overflow-x-auto scrollbar-hide no-scrollbar scroll-smooth"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory('Semua');
                }}
                className={`px-6 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 relative whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-black/5 text-text-secondary hover:bg-black/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <button 
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-black/5 flex items-center justify-center text-primary z-10 opacity-0 group-hover/nav:opacity-100 transition-opacity hover:bg-white"
          >
            <i className="bx bx-chevron-right text-2xl"></i>
          </button>
        </div>

        {/* Sub-Category Navigation */}
        <AnimatePresence>
          {currentSubCategories.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="overflow-hidden flex justify-start"
            >
              <div className="flex flex-nowrap items-center justify-start gap-2 p-2 bg-black/5 backdrop-blur-xl rounded-[20px] border border-black/5 shadow-inner overflow-x-auto scrollbar-hide no-scrollbar w-full">
                <button
                  onClick={() => setSelectedSubCategory('Semua')}
                  className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                    selectedSubCategory === 'Semua'
                      ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                      : 'text-text-secondary hover:text-primary bg-white/50'
                  }`}
                >
                  Semua Tipe
                </button>
                <div className="w-px h-3 bg-black/10 shrink-0" />
                {currentSubCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                      selectedSubCategory === sub
                        ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                        : 'text-text-secondary hover:text-primary bg-white/50'
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

      <ProductGrid 
        products={filteredProducts} 
        loading={loading} 
        searchQuery={searchQuery} 
        handleReset={handleReset} 
      />
    </div>
  );
};

export default Products;
