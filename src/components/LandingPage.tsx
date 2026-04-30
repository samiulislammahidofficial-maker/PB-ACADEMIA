import { motion } from 'motion/react';
import { BookOpen, Award, Users, ArrowRight, Video, QrCode, ClipboardList, Info, BookCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* Hero Section - Inspired by the "Get Our Free App" screenshot style but for web */}
      <section className="relative pt-20 pb-32 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary via-transparent to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
                Unlock Your <br />
                <span className="text-brand-primary">Academic Potential</span>
              </h1>
              <p className="mt-8 text-lg text-neutral-300 max-w-lg leading-relaxed">
                Join thousands of students achieving excellence with PB Academia. 
                Expert mentors, live interactive classes, and personalized learning.
              </p>
              
              <div className="mt-12 flex items-center space-x-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center space-x-4">
                  <QrCode className="h-12 w-12 text-white" />
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Scan to join</p>
                    <p className="text-sm text-white font-bold">Dhaka Node</p>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
                >
                  Start Learning Now
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="mt-16 lg:mt-0 relative"
            >
              <div className="relative z-10 bg-white/5 p-4 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
                  alt="Student Dashboard Preview" 
                  className="rounded-[2.5rem] shadow-2xl"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-secondary/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Inspired by the student illustration screenshot */}
      <section className="py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" 
                alt="Student Illustration" 
                className="rounded-[3rem] shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-brand-secondary font-bold uppercase tracking-widest text-xs">Our Commitment</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-display font-bold text-neutral-900 leading-tight">
                No matter the situation, <br />
                <span className="text-brand-primary text-3xl italic">Your preparation won't stop.</span>
              </h2>
              <p className="mt-8 text-neutral-600 leading-relaxed text-lg">
                We provide a seamless learning experience that adapts to your needs. 
                Our platform ensures that students of Class 8-12 get the best-in-class 
                academic support, anytime, anywhere.
              </p>
              <ul className="mt-10 space-y-4">
                {['Expert faculty from top institutions', 'Interactive doubt-clearing sessions', 'Performance analysis reports'].map((item) => (
                  <li key={item} className="flex items-center space-x-3 text-neutral-700 font-medium">
                    <div className="h-5 w-5 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section - Inspired by the purple header screenshot */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-primary">Our Programs</h2>
            <p className="mt-6 text-neutral-500 font-medium max-w-lg mx-auto">Select the program that fits your academic goals and start your journey towards excellence.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Secondary Core", classes: "Class 8 - 10", desc: "Building a strong foundation for future success.", img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop" },
              { title: "Higher Secondary", classes: "Class 11 - 12", desc: "Advanced preparation for board exams and beyond.", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop" },
              { title: "Admission Program", classes: "University Prep", desc: "Strategic planning for competitive entrance tests.", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop" }
            ].map((program, i) => (
              <div key={i} className="bg-white rounded-[3rem] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-2xl transition-all group">
                <div className="h-64 overflow-hidden relative">
                  <img src={program.img} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-widest shadow-lg">
                    {program.classes}
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">{program.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-8">{program.desc}</p>
                  <Link to="/register" className="flex items-center space-x-2 text-brand-primary font-bold hover:space-x-4 transition-all">
                    <span>Enroll Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-primary rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">Ready to start?</h2>
            <p className="text-brand-surface/80 text-lg mb-12 max-w-lg mx-auto">Join the most advanced academic network and authorize your future success today.</p>
            <Link
              to="/register"
              className="inline-flex items-center px-10 py-4 bg-white text-brand-primary rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              Get Operative Access
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
