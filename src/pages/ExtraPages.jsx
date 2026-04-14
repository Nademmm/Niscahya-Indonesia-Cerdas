import React from 'react';
import { motion } from 'framer-motion';

const PageHero = ({ title, subtitle, icon, color = 'primary' }) => (
  <section className="relative py-20">
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.05, scale: 1 }}
      className="absolute top-0 right-0 p-20 -z-10"
    >
      <i className={`bx ${icon} text-[300px]`}></i>
    </motion.div>
    
    <div className="max-w-4xl space-y-8">
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-${color}/10 border border-${color}/20 rounded-2xl`}
      >
        <span className={`text-[10px] font-black tracking-[0.4em] text-${color} uppercase`}>System / {title}</span>
      </motion.div>
      
      <motion.h1 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.8]"
      >
        {title.split(' ').slice(0, -1).join(' ')} <br />
        <span className="text-gradient">{title.split(' ').slice(-1)}</span>
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl text-text-secondary font-medium leading-relaxed max-w-2xl"
      >
        {subtitle}
      </motion.p>
    </div>
  </section>
);

export const Solutions = () => (
  <div className="space-y-32">
    <PageHero 
      title="Solusi Eco" 
      subtitle="Integrasi energi surya tercanggih untuk kebutuhan domestik dan industri."
      icon="bx-chip"
      color="primary"
    />
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { title: 'Ekosistem Rumah', desc: 'Sistem mandiri untuk rumah tangga dengan penyimpanan baterai cerdas.', icon: 'bx-home-alt-2' },
        { title: 'Daya Industri', desc: 'Skala besar untuk pabrik dan gudang dengan efisiensi tinggi.', icon: 'bx-factory' },
        { title: 'Jaringan Kota Cerdas', desc: 'Infrastruktur publik terintegrasi untuk penerangan jalan otomatis.', icon: 'bx-buildings' }
      ].map((item, i) => (
        <motion.div key={i} whileHover={{ y: -10 }} className="glass p-10 rounded-[48px] space-y-6 border-black/5 shadow-xl shadow-black/5">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-3xl">
            <i className={`bx ${item.icon}`}></i>
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">{item.title}</h3>
          <p className="text-text-secondary font-medium">{item.desc}</p>
        </motion.div>
      ))}
    </section>
  </div>
);

export const Impact = () => (
  <div className="space-y-32">
    <PageHero 
      title="Dampak Global" 
      subtitle="Melacak kontribusi nyata Niscahya dalam menjaga ekosistem bumi."
      icon="bx-globe"
      color="primary"
    />
    <section className="glass p-12 rounded-[64px] relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Menyelamatkan <br /><span className="text-primary">Atmosfer.</span></h2>
          <p className="text-xl text-text-secondary font-medium leading-relaxed">
            Setiap unit yang dideploy adalah satu langkah menuju udara yang lebih bersih. Kami tidak hanya menjual produk, kami menginstal masa depan.
          </p>
          <div className="space-y-4">
            {['Setara 1.2jt Pohon Ditanam', '500+ MegaWatts Dihasilkan', 'Kemasan Tanpa Limbah'].map(text => (
              <div key={text} className="flex items-center gap-4">
                <i className="bx bx-check-circle text-primary text-2xl"></i>
                <span className="font-black uppercase tracking-widest text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-8 rounded-3xl text-center border-secondary/20">
            <h4 className="text-4xl font-black text-secondary">-45%</h4>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Jejak Karbon</p>
          </div>
          <div className="glass p-8 rounded-3xl text-center border-primary/20">
            <h4 className="text-4xl font-black text-primary">100%</h4>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Terbarukan</p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export const About = () => (
  <div className="space-y-32">
    <PageHero 
      title="Cerita Kami" 
      subtitle="Membangun kedaulatan energi melalui inovasi teknologi tanpa batas."
      icon="bx-user-voice"
      color="accent"
    />
    <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <h3 className="text-4xl font-black uppercase tracking-tighter">Tim Visioner.</h3>
        <p className="text-xl text-text-secondary font-medium leading-relaxed">
          Niscahya Indonesia Cerdas lahir dari keinginan untuk membuat energi matahari dapat diakses oleh semua orang di Indonesia. Dari Sabang sampai Merauke, kami menerangi malam dengan teknologi yang ramah lingkungan.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="glass p-6 rounded-[32px] border-accent/20">
          <h4 className="text-xl font-black uppercase">Inovasi</h4>
          <p className="text-sm text-text-secondary">Selalu di depan dalam riset R&D.</p>
        </div>
        <div className="glass p-6 rounded-[32px] border-primary/20">
          <h4 className="text-xl font-black uppercase">Integritas</h4>
          <p className="text-sm text-text-secondary">Transparansi dalam setiap efisiensi.</p>
        </div>
      </div>
    </section>
  </div>
);

export const Sustainability = () => (
  <div className="space-y-32">
    <PageHero 
      title="Jalur Berkelanjutan" 
      subtitle="Roadmap menuju emisi nol bersih pada tahun 2030."
      icon="bx-leaf"
      color="primary"
    />
    <div className="relative space-y-12">
      {[
        { year: '2024', goal: '100% Komponen Dapat Didaur Ulang', status: 'Aktif' },
        { year: '2026', goal: 'Standar Optimasi Energi AI', status: 'Mendatang' },
        { year: '2030', goal: 'Visi Emisi Karbon Operasional Nol', status: 'Visi' }
      ].map((item, i) => (
        <motion.div key={i} whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -50 }} className="flex gap-12 items-center group">
          <h3 className="text-6xl font-black text-black/5 group-hover:text-primary transition-colors">{item.year}</h3>
          <div className="glass p-8 rounded-[32px] flex-1 flex justify-between items-center border-black/5 shadow-xl shadow-black/5">
            <span className="text-xl font-bold uppercase tracking-tight">{item.goal}</span>
            <span className="px-4 py-1 bg-black/5 rounded-full text-[10px] font-black uppercase tracking-widest">{item.status}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export const Projects = () => (
  <div className="space-y-32">
    <PageHero 
      title="Proyek Besar" 
      subtitle="Implementasi nyata yang mengubah wajah energi di berbagai sektor."
      icon="bx-briefcase-alt-2"
      color="secondary"
    />
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { title: 'Penerangan Cerdas Jakarta', area: 'Area Urban', img: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=1000&auto=format&fit=crop' },
        { title: 'Grid Eco-Resort Bali', area: 'Perhotelan', img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=1000&auto=format&fit=crop' }
      ].map((proj, i) => (
        <motion.div key={i} className="group relative aspect-video glass rounded-[48px] overflow-hidden">
          <img src={proj.img} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-background to-transparent">
            <span className="text-xs font-black text-secondary uppercase tracking-[0.3em] mb-2">{proj.area}</span>
            <h3 className="text-4xl font-black uppercase tracking-tighter">{proj.title}</h3>
          </div>
        </motion.div>
      ))}
    </section>
  </div>
);

export const Careers = () => (
  <div className="space-y-32">
    <PageHero 
      title="Join Mission" 
      subtitle="Bekerja dengan teknologi terbaik untuk misi yang paling berarti."
      icon="bx-rocket"
      color="primary"
    />
    <section className="space-y-6">
      {[
        { role: 'Energy System Engineer', loc: 'Jakarta / Remote', type: 'Full-time' },
        { role: 'AI Algorithm Developer', loc: 'Bandung', type: 'Full-time' },
        { role: 'Sustainable Supply Chain', loc: 'Surabaya', type: 'Contract' }
      ].map((job, i) => (
        <motion.div key={i} whileHover={{ x: 20 }} className="glass p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6 border-black/5 shadow-xl shadow-black/5 cursor-pointer">
          <div>
            <h4 className="text-2xl font-black uppercase tracking-tighter">{job.role}</h4>
            <p className="text-text-secondary font-medium uppercase text-xs tracking-widest">{job.loc}</p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-primary uppercase tracking-widest">{job.type}</span>
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all">
              <i className="bx bx-right-arrow-alt text-2xl"></i>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  </div>
);

export const Contact = () => (
  <div className="space-y-32">
    <PageHero 
      title="Hubungi Kami" 
      subtitle="Mulai konsultasi energi Anda hari ini bersama tim ahli Niscahya Indonesia Cerdas."
      icon="bx-message-square-detail"
      color="accent"
    />
    <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
      <div className="space-y-12">
        <div className="space-y-6">
          <h3 className="text-4xl font-black uppercase tracking-tighter">Kontak Langsung.</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-accent text-2xl"><i className="bx bx-phone"></i></div>
              <span className="text-xl font-bold">+62 878 5353 6124</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-accent text-2xl"><i className="bx bx-envelope"></i></div>
              <span className="text-xl font-bold">hello@niscahya.com</span>
            </div>
          </div>
        </div>
        <div className="glass p-8 rounded-[40px] border-black/5 shadow-xl shadow-black/5">
          <h4 className="text-sm font-black uppercase tracking-widest text-text-secondary mb-4">Kantor Pusat</h4>
          <p className="text-lg font-bold">Cyber Tower 12, Lantai 24 <br />Kuningan, Jakarta Selatan, Indonesia</p>
        </div>
      </div>
      <div className="glass p-12 rounded-[56px] space-y-8 border-black/5 shadow-xl shadow-black/5">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-2">Nama</label>
            <input type="text" className="w-full bg-black/5 border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" placeholder="Nama Anda" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-2">Email</label>
            <input type="email" className="w-full bg-black/5 border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold" placeholder="alamat@sistem.com" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-2">Pesan</label>
          <textarea className="w-full bg-black/5 border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all font-bold h-40 resize-none" placeholder="Detail kebutuhan Anda..."></textarea>
        </div>
        <button className="w-full py-6 bg-accent text-background font-black text-xl rounded-3xl hover:scale-105 transition-all shadow-2xl shadow-accent/20 uppercase tracking-tighter">Kirim Pesan</button>
      </div>
    </section>
  </div>
);
