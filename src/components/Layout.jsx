import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { BubbleChat } from 'flowise-embed-react';

const navLinks = [
  { name: 'Beranda', path: '/' },
  { name: 'Produk', path: '/products' },
  { name: 'Blog', path: '/blog' },
  { name: 'Solusi', path: '/solutions' },
  { name: 'Dampak', path: '/impact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useApp();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const handleSearch = (e) => {
    setLocalSearch(e.target.value);
    if (location.pathname !== '/products' && location.pathname !== '/admin') {
      navigate('/products');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${
      scrolled ? 'lg:py-4' : 'lg:py-8'
    }`}>
      <div className={`max-w-7xl mx-auto glass rounded-4xl px-6 py-3 flex items-center justify-between transition-all duration-500 ${
        scrolled ? 'shadow-2xl shadow-primary/10 border-black/5' : 'bg-transparent border-transparent'
      }`}>
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Niscahya Indonesia Cerdas Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-black tracking-tighter text-text-main uppercase">Niscahya</span>
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
              placeholder="Cari unit..."
              value={localSearch}
              onChange={handleSearch}
              className="bg-transparent border-none outline-none text-text-main placeholder-text-secondary/50 w-32 md:w-48"
            />
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 bg-black/5 text-text-main rounded-2xl border border-black/10"
          >
            <i className={`bx ${mobileMenuOpen ? 'bx-x' : 'bx-menu-alt-right'} text-2xl`}
          ></i>
          </button>
        </div>
      </div>

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-text-main selection:bg-primary/30 selection:text-primary relative overflow-x-hidden">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-100 glass-bright px-8 py-4 rounded-2xl border border-primary/30 shadow-2xl shadow-primary/10 flex items-center gap-4"
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
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] -z-10"></div>

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

      <footer className="py-20 px-6 lg:px-10 max-w-7xl mx-auto border-t border-black/5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Niscahya Indonesia Cerdas Logo" className="w-10 h-10 object-contain" />
              <span className="text-2xl font-black tracking-tighter text-text-main uppercase">Niscahya Indonesia Cerdas</span>
            </Link>
            <p className="text-text-secondary font-medium max-w-sm">
              Membangun masa depan yang berkelanjutan melalui inovasi teknologi energi surya yang cerdas dan terjangkau.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-text-main">Wawasan</h4>
            <ul className="space-y-4">
              <li><Link to="/blog" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">Blog & Artikel</Link></li>
              <li><Link to="/solutions" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">Studi Kasus</Link></li>
              <li><Link to="/impact" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">Laporan Dampak</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-text-main">Sistem</h4>
            <ul className="space-y-4">
              <li><Link to="/admin" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">Panel Admin</Link></li>
              <li><Link to="/contact" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">Bantuan</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-black/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Copyright © 2026 CV Niscahya Indonesia Cerdas. All Rights Reserved.</p>
          <div className="flex gap-6 text-xl text-text-secondary">
            <a href="https://www.instagram.com/niscahya.id?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <i className="bx bxl-instagram"></i>
            </a>
            <a href="https://www.facebook.com/pjutenagasuryasurabaya" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <i className="bx bxl-facebook-circle"></i>
            </a>
          </div>
        </div>
      </footer>

      <BubbleChat 
        chatflowid="6adfdb52-f0cd-4aad-98ab-9a241a19ee3d" 
        apiHost="http://192.168.1.7:3000"
        theme={{
            button: {
                backgroundColor: "#10b981",
                right: 25,
                bottom: 25,
                size: 60,
                iconColor: "white",
                customIconSrc: "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/png/flowise.png",
            },
            chatWindow: {
                welcomeMessage: "Halo! Saya asisten AI Niscahya Indonesia Cerdas. Ada yang bisa saya bantu terkait produk PJU Tenaga Surya atau solusi energi kami? ☀️",
                backgroundColor: "#ffffff",
                height: 600,
                width: 400,
                fontSize: 16,
                poweredByTextColor: "#303235",
                botMessage: {
                    backgroundColor: "#f0fdf4",
                    textColor: "#064e3b",
                    showAvatar: true,
                    avatarSrc: "/logo.png",
                },
                userMessage: {
                    backgroundColor: "#10b981",
                    textColor: "#ffffff",
                    showAvatar: true,
                    avatarSrc: "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
                },
                textInput: {
                    placeholder: "Tanya sesuatu...",
                    backgroundColor: "#ffffff",
                    textColor: "#303235",
                    sendButtonColor: "#10b981",
                }
            }
        }}
      />
    </div>
  );
};

export default Layout;
