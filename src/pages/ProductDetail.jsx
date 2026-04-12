import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products } from '../data/products';
import { useApp } from '../context/AppContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-40 glass rounded-[64px] space-y-8">
        <i className="bx bx-error text-8xl text-primary animate-pulse"></i>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Product Not Found</h1>
        <Link to="/products" className="px-10 py-5 bg-primary text-background font-black rounded-2xl">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {/* Detail Header */}
      <section className="flex flex-col lg:flex-row gap-16">
        {/* Gallery */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex-1 space-y-6"
        >
          <div className="relative aspect-[4/5] glass rounded-[48px] overflow-hidden group">
            <motion.img 
              layoutId={`product-image-${product.id}`}
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute top-8 left-8">
              <span className="px-6 py-2 glass-bright rounded-full text-xs font-black uppercase tracking-[0.2em] border border-black/10">
                {product.category}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05 }}
                className="aspect-square glass rounded-3xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all opacity-50 hover:opacity-100 border-black/5 shadow-lg shadow-black/5"
              >
                <img src={product.image} className="w-full h-full object-cover" />
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
              <Link to="/products" className="hover:text-primary transition-colors">Catalog</Link>
              <i className="bx bx-chevron-right text-lg"></i>
              <span className="text-primary">{product.name}</span>
            </div>
            <motion.h1 
              layoutId={`product-name-${product.id}`}
              className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]"
            >
              {product.name.split(' ').slice(0, -1).join(' ')} <br />
              <span className="text-gradient">{product.name.split(' ').slice(-1)}</span>
            </motion.h1>
            <div className="flex items-center gap-6">
              <p className="text-5xl font-black tracking-tighter text-text-main">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
              <span className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl">
                In Stock
              </span>
            </div>
            <p className="text-xl text-text-secondary font-medium leading-relaxed max-w-xl">
              {product.description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 py-6 bg-primary text-background font-black text-2xl rounded-[32px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 group"
              >
                <i className="bx bx-shopping-bag text-3xl"></i>
                <span>Add to System</span>
              </button>
              <button className="w-24 glass border border-black/10 rounded-[32px] flex items-center justify-center hover:bg-black/5 transition-all">
                <i className="bx bx-heart text-4xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-6 rounded-[32px] flex items-center gap-4 border-black/5 shadow-lg shadow-black/5">
                <i className="bx bx-shield-alt-2 text-3xl text-primary"></i>
                <span className="text-xs font-black uppercase tracking-widest text-text-secondary">2 Year Warranty</span>
              </div>
              <div className="glass p-6 rounded-[32px] flex items-center gap-4 border-black/5 shadow-lg shadow-black/5">
                <i className="bx bx-trending-up text-3xl text-secondary"></i>
                <span className="text-xs font-black uppercase tracking-widest text-text-secondary">Certified Eco</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bento Specs Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          className="glass p-12 rounded-[56px] space-y-6 border-black/5 shadow-xl shadow-black/5"
        >
          <h3 className="text-2xl font-black uppercase tracking-tighter">Technical <br /><span className="text-primary">Specifications</span></h3>
          <p className="text-text-secondary font-medium">Informasi mendetail mengenai kemampuan perangkat.</p>
        </motion.div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {product.specs?.map((spec, i) => (
            <motion.div 
              key={i} 
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[32px] border-black/5 hover:border-primary/20 transition-all flex justify-between items-center group shadow-lg shadow-black/5"
            >
              <span className="text-xs font-black uppercase tracking-widest text-text-secondary group-hover:text-primary transition-colors">{spec.split(':')[0]}</span>
              <span className="text-lg font-black tracking-tight text-text-main">{spec.split(':')[1]}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Similar Selection */}
      <section className="space-y-12">
        <div className="flex items-end justify-between">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Related <br /><span className="text-secondary">Units</span></h2>
          <Link to="/products" className="text-lg font-black uppercase tracking-tighter hover:text-primary transition-colors flex items-center gap-2">
            Catalog <i className="bx bx-right-arrow-alt text-2xl"></i>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.slice(0, 4).map(p => (
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
                <p className="text-lg font-black text-primary tracking-tighter">Rp {p.price.toLocaleString('id-ID')}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
