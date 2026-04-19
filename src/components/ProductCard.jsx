import { memo } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = memo(({ product }) => {
  // Extract category display text (show subcategory if available, else main category)
  const getCategoryDisplay = (fullCategory) => {
    if (fullCategory.includes(' - ')) {
      return fullCategory.split(' - ')[1];
    }
    return fullCategory;
  };
  return (
    <div className="group relative rounded-3xl md:rounded-[40px] overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-black/5 hover:border-primary/30 bg-white will-change-transform">
      <div className="relative aspect-square md:aspect-4/5 overflow-hidden">
        {/* Image with hardware acceleration */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
          loading="lazy"
        />
        
        {/* Improved Overlay Gradient - Optimized for performance */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300"></div>
        
        {/* Category Badge - Optimized for performance (removed blur) */}
        <div className="absolute top-3 left-3 md:top-6 md:left-6 z-20">
          <span className="px-2 py-1 md:px-4 md:py-2 bg-black/60 border border-white/10 text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white rounded-lg md:rounded-xl shadow-xl">
            {getCategoryDisplay(product.category)}
          </span>
        </div>

        {/* Floating Action Icon - Simplified animation (Hidden on mobile) */}
        <div className="hidden md:block absolute top-6 right-6 -translate-y-2.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40">
            <i className="bx bx-arrow-to-right text-2xl"></i>
          </div>
        </div>

        {/* Product Info - Better spacing and contrast */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 space-y-2 md:space-y-3 z-20">
          <div className="space-y-0.5 md:space-y-1">
            <h3 className="text-sm md:text-xl font-black tracking-tighter text-white uppercase leading-tight md:leading-[1.1] line-clamp-2 drop-shadow-lg">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5 md:gap-2 pt-1 md:pt-2">
              <div className="h-0.5 w-4 md:w-8 bg-primary rounded-full"></div>
              <span className="text-[7px] md:text-[10px] font-black text-primary uppercase tracking-widest">Detail</span>
            </div>
          </div>
        </div>
      </div>

      {/* Link Overlay */}
      <Link to={`/products/${product.slug || product.id}`} className="absolute inset-0 z-30" aria-label={`Lihat detail ${product.name}`}></Link>
    </div>
  );
});

export default ProductCard;
