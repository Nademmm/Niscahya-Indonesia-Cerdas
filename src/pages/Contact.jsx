import { useEffect } from 'react';
import { motion } from 'framer-motion';

export const meta = () => {
  return [
    { title: "Hubungi Kami | Niscahya Indonesia Cerdas" },
    { name: "description", content: "Hubungi CV Niscahya Indonesia Cerdas untuk konsultasi PJU tenaga surya, penawaran proyek, dan kerjasama resmi. Marketing office Sidoarjo, Jawa Timur." },
    { name: "keywords", content: "kontak niscahya, pju surabaya, pju sidoarjo, konsultasi pju tenaga surya, alamat niscahya indonesia cerdas" },
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

export default function ContactPage() {
  return (
    <div className="space-y-12 md:space-y-16">
      <PageHero 
        title="Hubungi Kami" 
        subtitle="Kami siap membantu mewujudkan solusi energi terbaik untuk Anda. Hubungi kami melalui berbagai saluran komunikasi."
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
              title="Peta lokasi marketing office Niscahya Indonesia Cerdas"
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
}
