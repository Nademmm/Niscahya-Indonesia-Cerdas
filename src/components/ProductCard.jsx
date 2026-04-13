import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Extract category display text (show subcategory if available, else main category)
  const getCategoryDisplay = (fullCategory) => {
    if (fullCategory.includes(' - ')) {
      return fullCategory.split(' - ')[1];
    }
    return fullCategory;
  };
  return (
    <div className="group relative glass rounded-[32px] overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10 border-black/5 hover:border-primary/20">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60"></div>
        
        {/* Category Badge */}
        <div className="absolute top-6 left-6">
          <span className="px-4 py-1.5 bg-white/20 backdrop-blur-xl border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-white rounded-full">
            {getCategoryDisplay(product.category)}
          </span>
        </div>

        {/* Floating Action */}
        <div className="absolute top-6 right-6 translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <div className="w-12 h-12 glass-bright rounded-2xl flex items-center justify-center text-text-main hover:bg-primary hover:text-background transition-all">
            <i className="bx bx-show text-2xl"></i>
          </div>
        </div>

        {/* Product Info Overlay */}
        <div className="absolute bottom-8 left-8 right-8 space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tighter text-white uppercase leading-none line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
            {product.specs?.slice(0, 2).map((spec, i) => (
              <span key={i} className="text-[9px] font-bold text-white/70 uppercase tracking-widest bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                {spec.split(':')[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Link Overlay */}
      <Link to={`/products/${product.id}`} className="absolute inset-0 z-10"></Link>
    </div>
  );
};

export default ProductCard;
