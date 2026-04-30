import { motion } from 'motion/react';
import { BookOpen, Award, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Curated Courses",
    description: "Structured content for Class 8-12 mapped to your school curriculum."
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Regular Exams",
    description: "Compete with peers and track your performance with monthly tests."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Expert Mentors",
    description: "Learn from teachers who care about your growth and academic success."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function LandingPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 bg-brand-70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-4 mb-8"
              >
                <div className="h-[2px] w-12 bg-brand-10"></div>
                <span className="text-[10px] font-black text-brand-10 uppercase tracking-[0.4em]">Established 2024 // Dhaka</span>
              </motion.div>
              <h1 className="text-7xl md:text-9xl font-display font-black text-white tracking-tighter leading-[0.85] uppercase">
                PB <br /> <span className="text-brand-10">ACADEMIA</span>
              </h1>
              <p className="mt-12 text-lg text-neutral-400 max-w-lg font-bold uppercase tracking-widest leading-loose">
                The elite coaching protocol for students of class 8 to 12. 
                Integrating global academic standards with local excellence.
              </p>
              <div className="mt-16 flex flex-col sm:flex-row gap-8">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="px-12 py-6 bg-brand-10 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all flex items-center justify-center shadow-2xl shadow-brand-10/30"
                  >
                    Initiate Protocol <ArrowRight className="ml-3 h-4 w-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="https://facebook.com/pbacademia"
                    target="_blank"
                    rel="noreferrer"
                    className="px-12 py-6 bg-brand-20 border border-white/10 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-md"
                  >
                    Uplink FB
                  </a>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="px-12 py-6 bg-brand-20 border border-white/10 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-md"
                  >
                    Verify ID
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="mt-24 lg:mt-0 relative"
            >
              <div className="aspect-square bg-neutral-900 rounded-[4rem] overflow-hidden shadow-[0_0_150px_rgba(59,130,246,0.15)] relative border border-white/5 group">
                <img 
                  src="https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=2070&auto=format&fit=crop" 
                  alt="High quality education" 
                  className="object-cover w-full h-full grayscale opacity-30 mix-blend-overlay group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="bg-brand-20/80 backdrop-blur-2xl p-12 rounded-[3rem] shadow-2xl border border-white/10 text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-10 to-transparent"></div>
                    <img src="https://i.ibb.co.com/zhjhrK7K/PB-Academia-logo-1.png" alt="Logo Large" className="h-24 w-24 mx-auto mb-10 object-contain drop-shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
                    <div className="flex items-center justify-center space-x-3 text-brand-10 mb-8">
                      <div className="h-2 w-2 bg-brand-10 rounded-full animate-ping"></div>
                      <span className="font-black text-[10px] uppercase tracking-[0.4em]">Node Active: Dhaka_Central</span>
                    </div>
                    <p className="text-white font-black leading-tight uppercase tracking-tight text-2xl italic px-4">"Academic Excellence Redefined for the Next Generation."</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features with Staggered Animation */}
      <section className="py-48 bg-brand-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-32"
          >
            <h2 className="text-6xl font-display font-black text-white uppercase tracking-tighter">Strategic Impact</h2>
            <p className="mt-6 text-neutral-500 font-black uppercase tracking-[0.4em] text-[10px]">Tier-1 Instructional Core</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-16"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-brand-70 p-12 rounded-[3.5rem] border border-white/5 hover:border-brand-10/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <img src="https://i.ibb.co.com/zhjhrK7K/PB-Academia-logo-1.png" alt="" className="h-20 w-20 grayscale" />
                </div>
                <div className="h-20 w-20 bg-brand-10/10 text-brand-10 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-brand-10 group-hover:text-white transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-black text-white mb-6 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-neutral-500 font-bold leading-relaxed uppercase text-[11px] tracking-widest">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-32 bg-brand-70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white mb-20 uppercase tracking-tighter">Strategic Cohorts</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls) => (
              <div key={cls} className="px-12 py-8 bg-brand-20 text-white rounded-[2rem] font-black text-2xl border border-white/5 hover:border-brand-10 shadow-2xl hover:shadow-brand-10/10 transition-all cursor-default uppercase tracking-tighter">
                {cls}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-brand-70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-10 rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)]">
            <div className="relative z-10">
              <h2 className="text-5xl font-black mb-8 uppercase tracking-tighter leading-tight">Authorize Your <br /> Future Success</h2>
              <p className="text-blue-100 font-bold uppercase tracking-widest text-[10px] mb-12 max-w-md mx-auto leading-loose">Join the most advanced academic network. Admission restricted to high-potential candidates.</p>
              <Link
                to="/register"
                className="inline-flex items-center px-12 py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-neutral-100 transition-all shadow-2xl"
              >
                Access Signal
              </Link>
            </div>
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/20 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
