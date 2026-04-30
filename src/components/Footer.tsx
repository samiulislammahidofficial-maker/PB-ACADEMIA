import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 bg-brand-surface rounded-full overflow-hidden transition-all group-hover:scale-105 border border-neutral-100 shadow-sm">
                <img src="https://i.ibb.co.com/9394X1bB/fb-profile-pic-1.png" alt="PB Academia Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-neutral-900">PB ACADEMIA</span>
            </Link>
            <p className="mt-8 text-neutral-500 max-w-sm text-sm font-medium leading-relaxed">
              Empowering the next generation of leaders through cutting-edge education and mentorship. Dhaka's premier destination for academic excellence.
            </p>
            <div className="mt-10 flex items-center space-x-5">
              {[
                { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com/pbacademia" },
                { icon: <Instagram className="h-5 w-5" />, href: "#" },
                { icon: <Twitter className="h-5 w-5" />, href: "#" },
                { icon: <Youtube className="h-5 w-5" />, href: "#" },
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -4, color: '#5d3fd3' }}
                  href={social.href}
                  className="h-10 w-10 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-center text-neutral-400 transition-all hover:border-brand-primary/20 hover:bg-white"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 mb-6 text-sm">Programs</h4>
            <ul className="space-y-4 text-neutral-500 text-sm font-medium">
              <li><Link to="/courses" className="hover:text-brand-primary transition-colors">Class 8-10</Link></li>
              <li><Link to="/courses" className="hover:text-brand-primary transition-colors">HSC Foundation</Link></li>
              <li><Link to="/courses" className="hover:text-brand-primary transition-colors">Skill Development</Link></li>
              <li><Link to="/courses" className="hover:text-brand-primary transition-colors">Strategic Admissions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 mb-6 text-sm">Support</h4>
            <ul className="space-y-4 text-neutral-500 text-sm font-medium">
              <li><Link to="/help" className="hover:text-brand-primary transition-colors">Help Center</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-neutral-400 uppercase tracking-widest gap-4">
          <p>© {new Date().getFullYear()} PB ACADEMIA. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-6">
            <span>Designed in Dhaka</span>
            <div className="h-1 w-1 rounded-full bg-neutral-200"></div>
            <span>Academic Performance Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
