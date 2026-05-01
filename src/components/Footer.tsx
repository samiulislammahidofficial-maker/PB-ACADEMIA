import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-white/5 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 bg-white/5 rounded-full overflow-hidden transition-all group-hover:scale-105 border border-white/10 shadow-sm">
                <img src="https://i.ibb.co.com/9394X1bB/fb-profile-pic-1.png" alt="PB Academia Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-black text-2xl tracking-tighter text-white">PB ACADEMIA</span>
            </Link>
            <p className="mt-8 text-neutral-400 max-w-sm text-lg font-medium leading-relaxed">
              Empowering the next generation of leaders through cutting-edge education and mentorship. Dhaka's premier destination for academic excellence.
            </p>
            <div className="mt-12 flex flex-col space-y-8">
              <div className="flex items-center space-x-5">
                {[
                  { icon: <Facebook className="h-5 w-5" />, href: "https://www.facebook.com/profile.php?id=61584555539761" },
                  { icon: <Youtube className="h-5 w-5" />, href: "https://www.youtube.com/@PBAcademia" },
                ].map((social, i) => (
                  <motion.a 
                    key={i}
                    whileHover={{ y: -4, color: '#2563eb' }}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-neutral-500 transition-all hover:border-brand-primary/40 hover:bg-white/10 shadow-xl"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Direct Contact</p>
                <p className="text-xl font-black text-white group">01784-323041</p>
                <div className="flex flex-col space-y-2">
                  <a href="mailto:pbacademia25@gmail.com" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">pbacademia25@gmail.com</a>
                  <a href="mailto:admin@pbacademia.top" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">admin@pbacademia.top</a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-black text-white mb-8 text-[10px] uppercase tracking-widest text-brand-primary">Programs</h4>
            <ul className="space-y-5 text-neutral-400 text-sm font-bold uppercase tracking-tight">
              <li><Link to="/courses" className="hover:text-white transition-colors">Class 8-10</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">HSC Foundation</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Skill Development</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Strategic Admissions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white mb-8 text-[10px] uppercase tracking-widest text-brand-primary">Support</h4>
            <ul className="space-y-5 text-neutral-400 text-sm font-bold uppercase tracking-tight">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-neutral-500 uppercase tracking-widest gap-6 text-center md:text-left">
          <p>© {new Date().getFullYear()} PB ACADEMIA. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-8">
            <span className="hover:text-neutral-300 transition-colors cursor-default tracking-[0.2em]">Designed in Dhaka</span>
            <div className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse"></div>
            <span className="hover:text-neutral-300 transition-colors cursor-default tracking-[0.2em]">Academic Performance Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
