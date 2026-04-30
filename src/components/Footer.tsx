import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg tracking-tight text-neutral-900">PB ACADEMIA</span>
            </Link>
            <p className="mt-4 text-neutral-500 max-w-sm">
              Empowering students of class 8-12 with quality education, professional exams, and structured learning paths.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-neutral-500">
              <li><Link to="/" className="hover:text-blue-600">Courses</Link></li>
              <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 mb-4">Support</h4>
            <ul className="space-y-2 text-neutral-500">
              <li><Link to="/help" className="hover:text-blue-600">Help Center</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400">
          <p>© {new Date().getFullYear()} PB ACADEMIA. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for excellence.</p>
        </div>
      </div>
    </footer>
  );
}
