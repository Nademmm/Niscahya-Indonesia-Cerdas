import React, { useState, useMemo, useEffect, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

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

const categories = ['Semua', ...Object.keys(categoryStructure)];

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
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      {products.map((product) => (
        <div
          key={product.id}
          className="animate-in fade-in duration-300"
        >
          <ProductCard product={product} />
        </div>
      ))}

      {products.length === 0 && (
        <div 
          className="col-span-full py-40 glass rounded-[64px] flex flex-col items-center justify-center text-center space-y-8 shadow-2xl shadow-black/5 border-black/5 animate-in fade-in duration-500"
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
        </div>
      )}
    </div>
  );
});

const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/wa+t+s?/g, 'w') // handles wat, watt, watts, waatt, etc.
    .replace(/kilo\s*wa+t+s?/g, 'kw') // handles kilowatt, kilovat, etc.
    .replace(/(\d+)\s*(w|kw|ah|v|a|wp)\b/g, '$1$2') // 100 watt -> 100w, 100 w -> 100w
    .replace(/[^a-z0-9\s]/g, ' ') // replace special chars with space
    .replace(/\s+/g, ' ')
    .trim();
};

const fuzzyMatch = (text, query) => {
  const nText = normalizeText(text);
  const nQuery = normalizeText(query);
  
  if (nText.includes(nQuery)) return true;
  
  // Split query into words for "all words must match" logic
  const queryWords = nQuery.split(' ').filter(w => w.length > 0);
  if (queryWords.length === 0) return true;

  return queryWords.every(word => {
    // Exact word match after normalization
    if (nText.includes(word)) return true;
    
    // Simple anti-typo: check if word is almost a match (Levenshtein distance 1 for short words, 2 for long)
    // For simplicity, we'll use a basic character-subset check for anti-typo
    if (word.length > 3) {
      const regex = new RegExp(word.split('').join('.?'), 'i');
      if (regex.test(nText)) return true;
    }
    
    return false;
  });
};

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

    const filtered = products.filter(product => {
      // Category filter first (usually more selective)
      if (cat !== 'Semua') {
        const productCat = product.category;
        // Fallback: match 'PJU PLN' with old name 'PJU PLN (50-200 watt)'
        const isOldPJUPLN = cat === 'PJU PLN' && productCat === 'PJU PLN (50-200 watt)';
        
        if (productCat !== cat && !productCat.startsWith(cat + ' -') && !isOldPJUPLN) {
          return false;
        }
      }
      
      // Sub-category filter
      if (subCat !== 'Semua' && !product.category.includes(subCat)) {
        return false;
      }

      // Search filter last (more expensive)
      if (query) {
        // Prioritize: Name > Category > Specs
        // We'll give each a match status
        const nameMatch = fuzzyMatch(product.name, query);
        const categoryMatch = fuzzyMatch(product.category, query);
        const specMatch = (product.specs || []).some(spec => fuzzyMatch(spec, query));

        // Store match score for sorting later
        product._searchScore = 0;
        if (nameMatch) product._searchScore += 100;
        if (categoryMatch) product._searchScore += 50;
        if (specMatch) product._searchScore += 20;

        return nameMatch || categoryMatch || specMatch;
      }
      
      product._searchScore = 0;
      return true;
    });

    // Sort by search score (highest first) if there's a query
    if (query) {
      return [...filtered].sort((a, b) => (b._searchScore || 0) - (a._searchScore || 0));
    }

    return filtered;
  }, [products, selectedCategory, selectedSubCategory, searchQuery]);

  return (
    <div className="space-y-20">
      {/* Experimental Header */}
      <section className="relative pt-10">
        <div className="max-w-3xl space-y-6">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-2xl"
          >
            <span className="text-[10px] font-black tracking-[0.4em] text-secondary uppercase">Pasar / Katalog</span>
          </div>
          <h1 
            className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[1.1]"
          >
            Solusi Terdepan.
          </h1>
          <p 
            className="text-xl text-text-secondary font-medium max-w-xl"
          >
            Pilih perangkat yang tepat untuk sistem energi Anda. Teknologi mutakhir dengan efisiensi terverifikasi.
          </p>
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
          
          <div 
            ref={scrollRef}
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
          </div>

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
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
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

      {/* Search Result Indicator */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 glass rounded-[32px] border-primary/10 shadow-2xl shadow-primary/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <i className="bx bx-search-alt text-2xl text-primary animate-pulse"></i>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Hasil Pencarian</p>
                <h2 className="text-xl font-black tracking-tight">
                  Menampilkan <span className="text-primary">{filteredProducts.length}</span> produk untuk <span className="text-primary">"{searchQuery}"</span>
                </h2>
              </div>
            </div>
            <button 
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-black/5 hover:bg-black/10 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 group"
            >
              <i className="bx bx-x text-lg group-hover:rotate-90 transition-transform"></i>
              Hapus Pencarian
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
