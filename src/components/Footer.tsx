import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src="/logo.png" alt="PB Academia Logo" className="h-10 w-10 object-contain rounded-lg" />
              <span className="font-black text-xl tracking-tighter text-white uppercase group-hover:text-blue-500 transition-colors">PB ACADEMIA</span>
            </Link>
            <p className="mt-8 text-neutral-500 max-w-sm text-xs font-bold uppercase tracking-widest leading-loose">
              The elite academic intelligence unit catering to high-potential candidates of Class 8-12. 
              Dhaka's most advanced learning infrastructure.
            </p>
            <div className="mt-8 flex items-center space-x-6">
              <motion.a 
                whileHover={{ y: -5, color: '#3b82f6' }}
                href="https://facebook.com/pbacademia" 
                target="_blank" 
                rel="noreferrer"
                className="text-neutral-600 transition-colors"
                id="footer-facebook-link"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -5, color: '#3b82f6' }}
                href="#" 
                className="text-neutral-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -5, color: '#3b82f6' }}
                href="#" 
                className="text-neutral-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
          <div>
            <h4 className="font-black text-white mb-6 uppercase tracking-widest text-[10px]">Operations</h4>
            <ul className="space-y-3 text-neutral-500 font-black uppercase tracking-widest text-[10px]">
              <li><Link to="/" className="hover:text-blue-500 transition-colors">Courses</Link></li>
              <li><Link to="/about" className="hover:text-blue-500 transition-colors">Strategic</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 transition-colors">Direct Link</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white mb-6 uppercase tracking-widest text-[10px]">Protocols</h4>
            <ul className="space-y-3 text-neutral-500 font-black uppercase tracking-widest text-[10px]">
              <li><Link to="/help" className="hover:text-blue-500 transition-colors">Core Support</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-500 transition-colors">Data Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-500 transition-colors">Usage Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
          <p>© {new Date().getFullYear()} PB ACADEMIA. SECURITY VERIFIED.</p>
          <p className="mt-4 md:mt-0">Dhaka Academic Excellence Unit</p>
        </div>
      </div>
    </footer>
  );
}
