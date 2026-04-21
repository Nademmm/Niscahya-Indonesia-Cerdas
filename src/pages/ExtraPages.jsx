import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { updateSEO } from '../utils/seo';

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

export const Solutions = () => {
  useEffect(() => {
    updateSEO({
      title: 'Solusi Energi Eco',
      description: 'Integrasi energi surya tercanggih untuk kebutuhan domestik dan industri. Ekosistem rumah cerdas, daya industri skala besar, dan jaringan kota cerdas.',
      keywords: 'solusi energi surya, solar panel industri, pju cerdas, infrastruktur energi terbarukan'
    });
  }, []);

  return (
    <div className="space-y-12 md:space-y-16">
      <PageHero 
        title="Solusi Eco" 
        subtitle="Integrasi energi surya tercanggih untuk kebutuhan domestik dan industri."
        icon="bx-chip"
      />
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { title: 'Ekosistem Rumah', desc: 'Sistem mandiri untuk rumah tangga dengan penyimpanan baterai cerdas.', icon: 'bx-home-alt-2' },
          { title: 'Daya Industri', desc: 'Skala besar untuk pabrik dan gudang dengan efisiensi tinggi.', icon: 'bx-factory' },
          { title: 'Jaringan Kota Cerdas', desc: 'Infrastruktur publik terintegrasi untuk penerangan jalan otomatis.', icon: 'bx-buildings' }
        ].map((item, i) => (
          <motion.div key={i} whileHover={{ y: -10 }} className="glass p-8 md:p-10 rounded-3xl md:rounded-[48px] space-y-4 md:space-y-6 border-black/5 shadow-xl shadow-black/5">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 text-primary rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl">
              <i className={`bx ${item.icon}`}></i>
            </div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">{item.title}</h3>
            <p className="text-sm md:text-base text-text-secondary font-medium">{item.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export const Contact = () => {
  useEffect(() => {
    updateSEO({
      title: 'Hubungi Kami',
      description: 'Hubungi CV Niscahya Indonesia Cerdas untuk konsultasi PJU tenaga surya, penawaran proyek, dan kerjasama resmi. Marketing office Sidoarjo, Jawa Timur.',
      keywords: 'kontak niscahya, pju surabaya, pju sidoarjo, konsultasi pju tenaga surya, alamat niscahya indonesia cerdas'
    });
  }, []);

  return (
    <div className="space-y-12 md:space-y-16">
      <PageHero 
        title="Hubungi Kami" 
        subtitle="Kami siap membantu mewujudkan solusi energi terbaik untuk Anda. Hubungi kami melalui berbagai saluran komunikasi."
        icon="bx-message-square-detail"
      />

      {/* Contact Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* WhatsApp Card */}
        <motion.div
          whileHover={{ y: -10 }}
          className="glass p-8 md:p-10 rounded-3xl md:rounded-[48px] space-y-4 md:space-y-6 border-black/5 shadow-xl shadow-black/5 flex flex-col"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500/10 text-green-500 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg">
            <i className="bx bxl-whatsapp"></i>
          </div>
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">WhatsApp</h3>
            <p className="text-xs md:text-sm text-text-secondary font-medium">Respon cepat untuk konsultasi produk & teknis.</p>
          </div>
          <div className="space-y-2 md:space-y-3 mt-auto">
            <a href="https://wa.me/6287853536124" target="_blank" rel="noopener noreferrer" className="block text-base md:text-lg font-black tracking-tight text-text-main hover:text-green-500 transition-colors">+62 878 5353 6124</a>
            <a href="https://wa.me/6282143707398" target="_blank" rel="noopener noreferrer" className="block text-base md:text-lg font-black tracking-tight text-text-main hover:text-green-500 transition-colors">+62 821 4370 7398</a>
          </div>
        </motion.div>

        {/* Email Card */}
        <motion.a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=cvniscahyaindonesiacerdas@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -10 }}
          className="glass p-8 md:p-10 rounded-3xl md:rounded-[48px] space-y-4 md:space-y-6 border-black/5 shadow-xl shadow-black/5 block"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/10 text-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg">
            <i className="bx bx-envelope"></i>
          </div>
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Email</h3>
            <p className="text-xs md:text-sm text-text-secondary font-medium">Untuk penawaran proyek dan kerjasama resmi.</p>
          </div>
          <p className="text-sm md:text-lg font-black tracking-tight text-text-main break-all">cvniscahyaindonesiacerdas@gmail.com</p>
        </motion.a>

        {/* Instagram Card */}
        <motion.a
          href="https://instagram.com/niscahya.id"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -10 }}
          className="glass p-8 md:p-10 rounded-3xl md:rounded-[48px] space-y-4 md:space-y-6 border-black/5 shadow-xl shadow-black/5 block"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-500/10 text-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg">
            <i className="bx bxl-instagram"></i>
          </div>
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Instagram</h3>
            <p className="text-xs md:text-sm text-text-secondary font-medium">Update proyek terbaru dan edukasi.</p>
          </div>
          <p className="text-base md:text-lg font-black tracking-tight text-text-main break-all">@niscahya.id</p>
        </motion.a>
      </section>

      {/* Marketing Office Info Section */}
      <section className="flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="space-y-8 md:space-y-12 text-center flex flex-col items-center">
            <div className="space-y-6 md:space-y-8 w-full">
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">Marketing <br /><span className="text-gradient">Office.</span></h2>
              <div className="glass p-6 md:p-10 rounded-3xl md:rounded-[48px] border-black/5 shadow-xl shadow-black/5 flex flex-col md:flex-row gap-8 md:gap-4 justify-around items-stretch">
                <div className="flex items-start gap-4 md:gap-6 text-left max-w-sm flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl md:text-2xl">
                    <i className="bx bxs-map"></i>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] md:text-xs font-black uppercase tracking-[0.2em] text-text-secondary">Alamat</p>
                    <p className="text-base md:text-xl font-black leading-tight tracking-tight">
                      Wisma Juanda Permai Jl. Bouraq Blok B1 No. 15, Sedati Gede, Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-px h-px md:h-auto bg-black/5 self-stretch"></div>
                <div className="flex items-start gap-4 md:gap-6 text-left max-w-xs flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl md:text-2xl">
                    <i className="bx bxs-time"></i>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] md:text-xs font-black uppercase tracking-[0.2em] text-text-secondary">Jam Operasional</p>
                    <p className="text-base md:text-xl font-black leading-tight tracking-tight">Senin - Jumat: 09:00 - 17:00 <br />Sabtu: 09:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="space-y-6 md:space-y-10">
        <div className="glass p-2 md:p-4 rounded-3xl md:rounded-[64px] border-black/5 shadow-xl shadow-black/5 relative overflow-hidden h-75 md:h-125">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.047714009534!2d112.75474949999999!3d-7.373135199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e5e072a76abf%3A0xe5803d1aaf72795b!2sLampu%20PJU%20SinarSurya%20EnergiKu!5e1!3m2!1sid!2sid!4v1776048109065!5m2!1sid!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-2xl md:rounded-[48px] shadow-inner"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export const Impact = () => {
  useEffect(() => {
    updateSEO({
      title: 'Dampak Global',
      description: 'Melacak kontribusi nyata Niscahya dalam menjaga ekosistem bumi melalui penyediaan infrastruktur energi terbarukan yang ramah lingkungan.',
      keywords: 'dampak lingkungan pju tenaga surya, emisi karbon rendah, energi hijau indonesia, keberlanjutan energi'
    });
  }, []);

  return (
    <div className="space-y-16 md:space-y-32">
      <PageHero 
        title="Dampak Global" 
        subtitle="Melacak kontribusi nyata Niscahya dalam menjaga ekosistem bumi."
        icon="bx-globe"
      />
      <section className="glass p-8 md:p-12 rounded-3xl md:rounded-[64px] relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">Menyelamatkan <br /><span className="text-gradient">Atmosfer.</span></h2>
            <p className="text-base md:text-xl text-text-secondary font-medium leading-relaxed">
              Setiap unit yang dideploy adalah satu langkah menuju udara yang lebih bersih. Kami tidak hanya menjual produk, kami menginstal masa depan.
            </p>
            <div className="space-y-3 md:space-y-4">
              {['Setara 1.2jt Pohon Ditanam', '500+ MegaWatts Dihasilkan', 'Kemasan Tanpa Limbah'].map(text => (
                <div key={text} className="flex items-center gap-3 md:gap-4">
                  <i className="bx bx-check-circle text-primary text-xl md:text-2xl"></i>
                  <span className="font-black uppercase tracking-widest text-[10px] md:text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl text-center border-secondary/20">
              <h4 className="text-2xl md:text-4xl font-black text-secondary">-45%</h4>
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-text-secondary">Jejak Karbon</p>
            </div>
            <div className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl text-center border-primary/20">
              <h4 className="text-2xl md:text-4xl font-black text-primary">100%</h4>
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-text-secondary">Terbarukan</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const About = () => {
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
};

export const Sustainability = () => {
  useEffect(() => {
    updateSEO({
      title: 'Jalur Berkelanjutan',
      description: 'Roadmap keberlanjutan CV Niscahya Indonesia Cerdas menuju emisi nol bersih pada tahun 2030 melalui inovasi energi terbarukan.',
      keywords: 'roadmap energi terbarukan, net zero emission 2030, inovasi energi hijau, pju ramah lingkungan'
    });
  }, []);

  return (
    <div className="space-y-12 md:space-y-16">
      <PageHero 
        title="Jalur Berkelanjutan" 
        subtitle="Roadmap menuju emisi nol bersih pada tahun 2030."
        icon="bx-leaf"
      />
      <div className="relative space-y-8 md:space-y-12">
        {[
          { year: '2024', goal: '100% Komponen Dapat Didaur Ulang', status: 'Aktif' },
          { year: '2026', goal: 'Standar Optimasi Energi AI', status: 'Mendatang' },
          { year: '2030', goal: 'Visi Emisi Karbon Operasional Nol', status: 'Visi' }
        ].map((item, i) => (
          <motion.div key={i} whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -50 }} className="flex gap-6 md:gap-12 items-center group">
            <h3 className="text-4xl md:text-6xl font-black text-black/5 group-hover:text-primary transition-colors">{item.year}</h3>
            <div className="glass p-6 md:p-8 rounded-2xl md:rounded-4xl flex-1 flex justify-between items-center border-black/5 shadow-xl shadow-black/5">
              <span className="text-base md:text-xl font-bold uppercase tracking-tight">{item.goal}</span>
              <span className="px-3 py-1 bg-black/5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">{item.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const Projects = () => {
  useEffect(() => {
    updateSEO({
      title: 'Galeri Projek PJU Tenaga Surya',
      description: 'Lihat dokumentasi implementasi nyata sistem energi surya Niscahya di berbagai wilayah Indonesia. Bukti kualitas dan kepercayaan mitra kami.',
      keywords: 'proyek pju tenaga surya, galeri pju solar panel, portofolio niscahya, instalasi lampu jalan tenaga surya'
    });
  }, []);

  return (
    <div className="space-y-12 md:space-y-16">
      <PageHero 
        title="Galeri Projek" 
        subtitle="Dokumentasi implementasi nyata sistem energi surya Niscahya di berbagai wilayah Indonesia."
        icon="bx-images"
      />
      
      {/* Project Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { img: '/galeri/galeri1.jpg' },
          { img: '/galeri/galeri2.jpg' },
          { img: '/galeri/galeri3.jpg' },
          { img: '/galeri/galeri4.jpg' },
          { img: '/galeri/galeri5.jpg' },
          { img: '/galeri/galeri6.jpg' },
          { img: '/galeri/galeri7.jpg' },
          { img: '/galeri/galeri8.jpg' },
          { img: '/galeri/galeri9.jpg' },
          { img: '/galeri/galeri10.jpg' },
          { img: '/galeri/galeri11.jpg' },
          { img: '/galeri/galeri12.jpg' }
        ].map((proj, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative aspect-9/16 glass rounded-3xl md:rounded-[40px] overflow-hidden border-black/5"
          >
            <img 
              src={proj.img} 
              alt={`Project ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export const Careers = () => {
  useEffect(() => {
    updateSEO({
      title: 'Karir & Bergabung',
      description: 'Bergabunglah dengan misi Niscahya Indonesia Cerdas dalam mempercepat adopsi energi terbarukan di Indonesia. Temukan peluang karir menarik.',
      keywords: 'karir energi terbarukan, lowongan kerja pju, bergabung dengan niscahya, misi energi hijau'
    });
  }, []);

  return (
    <div className="space-y-12 md:space-y-16">
      <PageHero 
        title="Join Mission" 
        subtitle="Bekerja dengan teknologi terbaik untuk misi yang paling berarti."
        icon="bx-rocket"
      />
      <section className="space-y-4 md:space-y-6">
        {[
          { role: 'Energy System Engineer', loc: 'Jakarta / Remote', type: 'Full-time' },
          { role: 'AI Algorithm Developer', loc: 'Bandung', type: 'Full-time' },
          { role: 'Sustainable Supply Chain', loc: 'Surabaya', type: 'Contract' }
        ].map((job, i) => (
          <motion.div key={i} whileHover={{ x: 20 }} className="glass p-6 md:p-8 rounded-2xl md:rounded-4xl flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 border-black/5 shadow-xl shadow-black/5 cursor-pointer">
            <div>
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter">{job.role}</h4>
              <p className="text-text-secondary font-medium uppercase text-[10px] md:text-xs tracking-widest">{job.loc}</p>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <span className="text-xs md:text-sm font-bold text-primary uppercase tracking-widest">{job.type}</span>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-black/5 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all">
                <i className="bx bx-right-arrow-alt text-xl md:text-2xl"></i>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};
