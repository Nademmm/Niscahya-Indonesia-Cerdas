import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { updateSEO } from '../utils/seo';

export const meta = () => {
  return [
    { title: "Cerita Kami | Niscahya Indonesia Cerdas" },
    { name: "description", content: "Mengenal CV Niscahya Indonesia Cerdas, penggerak utama transformasi energi terbarukan di Indonesia melalui penyediaan infrastruktur PJU tenaga surya yang inovatif." },
    { name: "keywords", content: "profil niscahya indonesia cerdas, visi misi niscahya, distributor pju tenaga surya, energi terbarukan indonesia" },
  ];
};

const PageHero = ({ title, subtitle, icon }) => (
  <section className="relative pt-6 md:pt-10 pb-4 md:pb-6">
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.05, scale: 1 }}
      className="absolute top-0 right-0 p-10 md:p-20 -z-10"
    >
      <i className={`bx ${icon} text-[150px] md:text-[300px]`}></i>
    </motion.div>
    
    <div className="max-w-3xl space-y-4 md:space-y-6">
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-6xl font-black tracking-tighter uppercase leading-[1.1]"
      >
        {title.split(' ').slice(0, -1).join(' ')} <br />
        <span className="text-gradient">{title.split(' ').slice(-1)}</span>
      </motion.h1>
      
      {subtitle && (
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-xl"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  </section>
);

export default function AboutPage() {
  useEffect(() => {
    updateSEO({
      title: 'Cerita Kami',
      description: 'Mengenal CV Niscahya Indonesia Cerdas, penggerak utama transformasi energi terbarukan di Indonesia melalui penyediaan infrastruktur PJU tenaga surya yang inovatif.',
      keywords: 'profil niscahya indonesia cerdas, visi misi niscahya, distributor pju tenaga surya, energi terbarukan indonesia'
    });
  }, []);

  return (
    <div className="space-y-10 md:space-y-16">
      <PageHero 
        title="Cerita Kami" 
      />

      {/* Vision & Mission Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="space-y-6 md:space-y-8">
          <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed">
            CV Niscahya Indonesia Cerdas hadir sebagai jawaban atas tantangan energi masa depan. Kami bukan sekadar distributor, melainkan partner strategis dalam menghadirkan teknologi penerangan yang efisien untuk setiap sudut Indonesia.
          </p>
          <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
            <div className="flex gap-4 md:gap-6">
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl md:text-2xl">
                <i className="bx bx-check-double"></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-base md:text-lg font-black uppercase tracking-tight">Kualitas Premium</h4>
                <p className="text-xs md:text-sm text-text-secondary font-medium">Hanya menyediakan komponen dengan standar industri tertinggi.</p>
              </div>
            </div>
            <div className="flex gap-4 md:gap-6">
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl md:text-2xl">
                <i className="bx bx-leaf"></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-base md:text-lg font-black uppercase tracking-tight">Ramah Lingkungan</h4>
                <p className="text-xs md:text-sm text-text-secondary font-medium">Mendukung penuh target Net Zero Emission Indonesia.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 rounded-[64px] blur-3xl -z-10 animate-pulse"></div>
          <div className="glass p-8 md:p-12 rounded-3xl md:rounded-[64px] border-black/5 shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden">
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter border-b border-black/5 pb-2 md:pb-4">Visi Kami</h3>
              <p className="text-base md:text-lg font-bold text-text-main italic leading-relaxed">
                "Menjadi penggerak utama transformasi energi terbarukan di Indonesia melalui penyediaan infrastruktur PJU Tenaga Surya yang inovatif, andal, dan dapat diakses oleh seluruh lapisan masyarakat."
              </p>
            </div>
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter border-b border-black/5 pb-2 md:pb-4">Misi Kami</h3>
              <ul className="space-y-3 md:space-y-4">
                {[
                  'Memberikan solusi energi yang disesuaikan dengan kebutuhan geografis Indonesia.',
                  'Menjamin ketersediaan stok dan layanan purna jual yang profesional.',
                  'Mendukung program pemerintah dalam percepatan kemandirian energi desa.'
                ].map((misi, i) => (
                  <li key={i} className="flex gap-3 md:gap-4 text-xs md:text-sm font-medium text-text-secondary">
                    <span className="text-primary font-black">0{i+1}.</span>
                    {misi}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="space-y-8 md:space-y-16">
        <div className="text-center space-y-2 md:space-y-4">
          <span className="text-[8px] md:text-[10px] font-black tracking-[0.4em] text-primary uppercase">Nilai Kami</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Prinsip Kerja.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: 'Integritas', desc: 'Kejujuran dalam spesifikasi produk dan transparansi harga adalah kunci kepercayaan mitra kami.', icon: 'bx-shield-quarter' },
            { title: 'Inovasi', desc: 'Terus mengadopsi teknologi panel surya dan baterai lithium terbaru untuk efisiensi maksimal.', icon: 'bx-bolt-circle' },
            { title: 'Responsif', desc: 'Tim teknis dan admin kami siap memberikan solusi cepat untuk setiap kendala di lapangan.', icon: 'bx-support' }
          ].map((value, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="glass p-8 md:p-10 rounded-3xl md:rounded-[48px] border-black/5 shadow-xl text-center space-y-4 md:space-y-6"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-primary/10 text-primary rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl shadow-inner">
                <i className={`bx ${value.icon}`}></i>
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">{value.title}</h3>
              <p className="text-xs md:text-sm text-text-secondary font-medium leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Stats */}
      <section className="bg-accent p-8 md:p-20 rounded-3xl md:rounded-[64px] relative overflow-hidden">
        <div className="absolute top-0 left-0 p-10 opacity-10 -rotate-12">
          <i className="bx bx-certification text-[150px] md:text-[250px] text-white"></i>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">Mitra Energi <br />Terpercaya.</h2>
            <p className="text-white/80 font-medium text-base md:text-lg leading-relaxed">
              Dengan pengalaman bertahun-tahun dalam menangani berbagai skala proyek, CV Niscahya Indonesia Cerdas telah membuktikan dedikasinya dalam menjaga kualitas setiap unit yang terpasang.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="glass-bright p-6 md:p-8 rounded-2xl md:rounded-4xl text-center space-y-2 border-white/20 shadow-2xl">
              <h4 className="text-2xl md:text-4xl font-black text-accent tracking-tighter">100%</h4>
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary">Original Produk</p>
            </div>
            <div className="glass-bright p-6 md:p-8 rounded-2xl md:rounded-4xl text-center space-y-2 border-white/20 shadow-2xl">
              <h4 className="text-2xl md:text-4xl font-black text-accent tracking-tighter">Garansi</h4>
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary">Layanan</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
