import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const { cart, removeFromCart, searchQuery, setSearchQuery, showNotification } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleDeploy = () => {
    if (cart.length === 0) return;
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setCartOpen(false);
      showNotification("System Deployment Successful!");
    }, 2000);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/products') {
      navigate('/products');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Impact', path: '/impact' },
  ];

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${
      scrolled ? 'lg:py-4' : 'lg:py-8'
    }`}>
      <div className={`max-w-7xl mx-auto glass rounded-[32px] px-6 py-3 flex items-center justify-between transition-all duration-500 ${
        scrolled ? 'shadow-2xl shadow-primary/10 border-black/5' : 'bg-transparent border-transparent'
      }`}>
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-primary/20">
            <i className="bx bxs-bolt text-background text-2xl"></i>
          </div>
          <span className="text-2xl font-black tracking-tighter text-text-main uppercase">niscahya</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 bg-black/5 rounded-2xl p-1 border border-black/5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-all duration-300 ${
                location.pathname === link.path
                  ? 'bg-primary text-background shadow-lg shadow-primary/20'
                  : 'text-text-secondary hover:text-primary hover:bg-black/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-black/5 border border-black/10 rounded-2xl text-sm font-bold group focus-within:border-primary/50 transition-all">
            <i className="bx bx-search text-xl text-text-secondary group-focus-within:text-primary"></i>
            <input 
              type="text" 
              placeholder="Search units..."
              value={searchQuery}
              onChange={handleSearch}
              className="bg-transparent border-none outline-none text-text-main placeholder-text-secondary/50 w-32 md:w-48"
            />
          </div>
          <button 
            onClick={() => setCartOpen(!cartOpen)}
            className="relative p-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-background border border-primary/20 rounded-2xl transition-all shadow-lg"
          >
            <i className="bx bx-shopping-bag text-2xl"></i>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-background text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background">
                {totalItems}
              </span>
            )}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 bg-black/5 text-text-main rounded-2xl border border-black/10"
          >
            <i className={`bx ${mobileMenuOpen ? 'bx-x' : 'bx-menu-alt-right'} text-2xl`}
          ></i>
          </button>
        </div>
      </div>

      {/* Cart Sidebar Simulation */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-black/10 z-50 p-10 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black tracking-tighter uppercase">System Cart</h3>
                <button onClick={() => setCartOpen(false)} className="text-3xl hover:text-primary transition-colors">
                  <i className="bx bx-x"></i>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center opacity-50">
                    <i className="bx bx-ghost text-6xl mb-4 text-primary"></i>
                    <p className="font-bold uppercase tracking-widest text-sm">No units active</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 glass p-4 rounded-2xl group border-black/5">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-black/5 bg-background">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-sm uppercase tracking-tight line-clamp-1">{item.name}</h4>
                        <p className="text-primary font-bold text-xs">Rp {item.price.toLocaleString('id-ID')}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] font-black uppercase text-text-secondary">QTY: {item.quantity}</span>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-text-secondary hover:text-red-500 transition-colors"
                          >
                            <i className="bx bx-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-10 pt-10 border-t border-black/10 space-y-6">
                <div className="flex items-end justify-between">
                  <span className="text-sm font-black uppercase tracking-widest text-text-secondary">Total Investment</span>
                  <span className="text-3xl font-black tracking-tighter">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <button 
                  onClick={handleDeploy}
                  disabled={isDeploying || cart.length === 0}
                  className="w-full py-5 bg-primary text-background font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  {isDeploying ? (
                    <>
                      <motion.i 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="bx bx-loader-alt text-2xl"
                      ></motion.i>
                      <span>Deploying...</span>
                    </>
                  ) : (
                    <>
                      <i className="bx bx-rocket text-2xl"></i>
                      <span>Deploy System</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-2xl z-[-1] lg:hidden flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-black tracking-tighter hover:text-primary transition-colors uppercase"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Layout = ({ children }) => {
  const { notification } = useApp();
  const location = useLocation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, input')) setIsHovering(true);
      else setIsHovering(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-text-main selection:bg-primary/30 selection:text-primary relative overflow-x-hidden lg:cursor-none">
      {/* Custom Cursor */}
      <motion.div 
        className="fixed w-8 h-8 border border-primary rounded-full pointer-events-none z-[9999] hidden lg:block"
        animate={{ 
          x: mousePos.x - 16, 
          y: mousePos.y - 16,
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
      />
      <motion.div 
        className="fixed w-1 h-1 bg-primary rounded-full pointer-events-none z-[9999] hidden lg:block"
        animate={{ x: mousePos.x - 2, y: mousePos.y - 2 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
      />
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[100] glass-bright px-8 py-4 rounded-2xl border border-primary/30 shadow-2xl shadow-primary/10 flex items-center gap-4"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="bx bx-check text-background text-xl"></i>
            </div>
            <p className="font-black uppercase tracking-widest text-xs">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-mesh -z-10 opacity-70"></div>
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <Navbar />
      
      <motion.main 
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-32 pb-20 px-6 lg:px-10 max-w-7xl mx-auto w-full relative z-10"
      >
        {children}
      </motion.main>

      <footer className="mt-20 border-t border-black/5 py-20 relative z-10 overflow-hidden bg-card/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <i className="bx bxs-bolt text-background text-2xl"></i>
                </div>
                <span className="text-2xl font-black tracking-tighter text-text-main uppercase">niscahya</span>
              </Link>
              <p className="text-text-secondary leading-relaxed font-medium">
                Pionir teknologi energi terbarukan di Indonesia. Menerangi masa depan dengan solusi cerdas dan berkelanjutan.
              </p>
              <div className="flex gap-4">
                {['instagram', 'twitter', 'linkedin-square', 'facebook-square'].map(icon => (
                  <a key={icon} href="#" className="w-12 h-12 bg-black/5 border border-black/10 rounded-2xl flex items-center justify-center text-2xl text-text-secondary hover:text-primary hover:border-primary/30 transition-all">
                    <i className={`bx bxl-${icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-black uppercase tracking-widest mb-8 text-primary">Products</h4>
              <ul className="space-y-4 font-bold text-text-secondary">
                {[
                  { name: 'Solar Panels', cat: 'Solar Panel' },
                  { name: 'Street Lighting', cat: 'Lampu Jalan' },
                  { name: 'Garden Lights', cat: 'Lampu Taman' },
                  { name: 'Storage Systems', cat: 'Baterai' },
                  { name: 'Accessories', cat: 'Aksesori' }
                ].map(item => (
                  <li key={item.name}>
                    <Link to={`/products?category=${encodeURIComponent(item.cat)}`} className="hover:text-primary transition-colors">
                      / {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-black uppercase tracking-widest mb-8 text-secondary">Company</h4>
              <ul className="space-y-4 font-bold text-text-secondary">
                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Sustainability', path: '/sustainability' },
                  { name: 'Projects', path: '/projects' },
                  { name: 'Careers', path: '/careers' },
                  { name: 'Contact', path: '/contact' }
                ].map(item => (
                  <li key={item.name}><Link to={item.path} className="hover:text-primary transition-colors">/ {item.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="glass p-8 rounded-[40px] space-y-6">
              <h4 className="text-lg font-black uppercase tracking-widest text-text-main">Stay Informed</h4>
              <p className="text-sm text-text-secondary font-medium">Get the latest insights on clean energy.</p>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Email address" 
                  className="w-full bg-background/50 border border-black/10 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all text-sm font-bold"
                />
                <button className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-background rounded-xl flex items-center justify-center hover:scale-105 transition-transform">
                  <i className="bx bx-right-arrow-alt text-2xl"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-bold text-text-secondary">
            <p>&copy; 2026 NISCAHYA INDONESIA CERDAS. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8 uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
