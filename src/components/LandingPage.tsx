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

export default function LandingPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                Unlock Your Potential with <span className="text-blue-600">PB ACADEMIA</span>
              </h1>
              <p className="mt-6 text-xl text-neutral-600 max-w-lg">
                The premier coaching destination for students of class 8 to 12. 
                Experience interactive learning, periodic exams, and expert guidance.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg hover:shadow-blue-200"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-neutral-100 text-neutral-900 rounded-xl font-bold text-lg hover:bg-neutral-200 transition-all flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16 lg:mt-0 relative"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?q=80&w=2070&auto=format&fit=crop" 
                  alt="Students studying in Bangladesh context" 
                  className="object-cover w-full h-full mix-blend-multiply opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-xs transform -rotate-2 border border-blue-100">
                    <div className="flex items-center space-x-2 text-blue-600 mb-2">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-black text-xs uppercase tracking-widest">PB Verified</span>
                    </div>
                    <p className="text-neutral-900 font-bold leading-tight uppercase tracking-tight">"The most trusted learning platform for SSC and HSC candidates."</p>
                    <div className="mt-4 flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">PB</div>
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Dhaka Academic Excellence</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900">Why Choose PB ACADEMIA?</h2>
            <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">We provide a holistic learning environment designed to help you excel in academics.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-neutral-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12">Target Classes</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls) => (
              <div key={cls} className="px-10 py-6 bg-blue-50 text-blue-700 rounded-2xl font-bold text-2xl border-2 border-blue-100 hover:border-blue-500 transition-all cursor-default">
                {cls}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-[2.5rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
              <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">Join hundreds of students who are already achieving their goals with our monthly programs.</p>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-neutral-100 transition-all shadow-lg"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
