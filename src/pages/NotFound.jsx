import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-12">
      <div className="relative">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[150px] md:text-[250px] font-black tracking-tighter leading-none text-black/5 uppercase"
        >
          404
        </motion.h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Sistem Offline.</h2>
        </div>
      </div>
      
      <p className="text-xl text-text-secondary max-w-md mx-auto font-medium">
        Halaman yang Anda cari tidak ditemukan atau telah terputus dari jaringan.
      </p>

      <Link
        to="/"
        className="px-5 py-5 bg-primary text-background font-black text-2xl rounded-2xl hover:scale-105 transition-all shadow-2xl "
      >
        <span className="flex items-center gap-3">
          <i className="bx bx-left-arrow-alt text-3xl group-hover:-translate-x-2 transition-transform"></i>
          Kembali ke Beranda
        </span>
      </Link>
    </div>
  );
};

export default NotFound;
