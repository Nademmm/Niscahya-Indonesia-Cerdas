import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blog';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === parseInt(id));

  useEffect(() => {
    if (!post) {
      navigate('/blog');
    } else {
      document.title = `${post.title} | Blog Niscahya Indonesia Cerdas`;
      
      // Update meta description for SEO
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', post.excerpt);
      }
      
      // Add canonical link
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', window.location.href);
    }
    
    return () => {
      document.title = 'Niscahya Indonesia Cerdas';
      // Reset meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Distributor resmi Lampu PJU Tenaga Surya berkualitas di Indonesia.');
      }
    };
  }, [post, navigate]);

  if (!post) return null;

  return (
    <div className="space-y-16">
      {/* Back Button */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Link 
          to="/blog"
          className="inline-flex items-center gap-3 px-6 py-3 bg-black/5 hover:bg-black/10 text-text-secondary font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
        >
          <i className="bx bx-left-arrow-alt text-xl"></i>
          Kembali ke Blog
        </Link>
      </motion.div>

      {/* Hero Header */}
      <section className="relative space-y-10">
        <div className="max-w-4xl space-y-8">
          <div className="flex items-center gap-4">
            <span className="px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl">
              {post.category}
            </span>
            <span className="text-text-secondary font-black text-[10px] uppercase tracking-widest">
              {post.date}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[1] text-text-main drop-shadow-sm">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white text-xl font-black">
              {post.author[0]}
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary leading-none">Ditulis Oleh</p>
              <p className="font-black uppercase tracking-tight text-text-main">{post.author}</p>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="aspect-video md:aspect-[21/9] rounded-[64px] overflow-hidden shadow-2xl shadow-black/10 border-8 border-white/50"
        >
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          <div className="glass p-10 md:p-16 rounded-[64px] border-black/5 space-y-8">
            <div className="prose prose-xl prose-primary max-w-none text-text-secondary font-medium leading-relaxed">
              {post.content.split('\n').map((para, i) => (
                para.trim() && (
                  <p key={i} className="mb-6 whitespace-pre-line">
                    {para.trim()}
                  </p>
                )
              ))}
            </div>
            
            <div className="pt-12 border-t border-black/5 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4">
                <button className="w-12 h-12 bg-black/5 hover:bg-black/10 rounded-2xl flex items-center justify-center text-xl transition-all">
                  <i className="bx bxl-facebook"></i>
                </button>
                <button className="w-12 h-12 bg-black/5 hover:bg-black/10 rounded-2xl flex items-center justify-center text-xl transition-all">
                  <i className="bx bxl-twitter"></i>
                </button>
                <button className="w-12 h-12 bg-black/5 hover:bg-black/10 rounded-2xl flex items-center justify-center text-xl transition-all">
                  <i className="bx bxl-linkedin"></i>
                </button>
              </div>
              <button className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20">
                Bagikan Artikel
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="glass p-10 rounded-[48px] border-black/5 space-y-8 sticky top-32">
            <h3 className="text-xl font-black uppercase tracking-tighter">Artikel Terkait</h3>
            <div className="space-y-8">
              {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map(related => (
                <Link 
                  key={related.id} 
                  to={`/blog/${related.id}`}
                  className="group flex gap-4"
                >
                  <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-black/5">
                    <img 
                      src={related.image} 
                      alt={related.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary leading-none">
                      {related.category}
                    </p>
                    <h4 className="text-sm font-black uppercase tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="pt-8 border-t border-black/5">
              <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Newsletter</p>
                <h4 className="text-lg font-black tracking-tight uppercase leading-tight">Dapatkan Update Terbaru</h4>
                <p className="text-xs text-text-secondary font-medium">Berlangganan untuk info teknologi energi terbarukan.</p>
                <div className="flex flex-col gap-3">
                  <input 
                    type="email" 
                    placeholder="Email Anda"
                    className="px-6 py-3 bg-white border border-black/5 rounded-xl text-xs outline-none focus:border-primary/50 transition-all"
                  />
                  <button className="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
                    Langganan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default BlogDetail;
