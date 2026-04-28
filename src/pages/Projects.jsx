import { useEffect } from 'react';
import { motion } from 'framer-motion';

export const meta = () => {
  return [
    { title: "Galeri Projek PJU Tenaga Surya | Niscahya Indonesia Cerdas" },
    { name: "description", content: "Lihat dokumentasi implementasi nyata sistem energi surya Niscahya di berbagai wilayah Indonesia. Bukti kualitas dan kepercayaan mitra kami." },
    { name: "keywords", content: "proyek pju tenaga surya, galeri pju solar panel, portofolio niscahya, instalasi lampu jalan tenaga surya" },
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

export default function ProjectsPage() {
  return (
    <div className="space-y-12 md:space-y-16">
      <PageHero 
        title="Galeri Projek" 
        subtitle="Dokumentasi implementasi nyata sistem energi surya Niscahya di berbagai wilayah Indonesia."
      />
      
      {/* Project Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { img: '/galeri/galeri1.webp' },
          { img: '/galeri/galeri2.webp' },
          { img: '/galeri/galeri3.webp' },
          { img: '/galeri/galeri4.webp' },
          { img: '/galeri/galeri5.webp' },
          { img: '/galeri/galeri6.webp' },
          { img: '/galeri/galeri7.webp' },
          { img: '/galeri/galeri8.webp' },
          { img: '/galeri/galeri9.webp' },
          { img: '/galeri/galeri10.webp' },
          { img: '/galeri/galeri11.webp' },
          { img: '/galeri/galeri12.webp' }
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
              loading="lazy"
              decoding="async"
              width="900"
              height="1600"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </motion.div>
        ))}
      </section>
    </div>
  );
}
