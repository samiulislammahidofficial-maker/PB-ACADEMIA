import { motion } from 'motion/react';
import { BookOpen, Award, Users, ArrowRight, Video, QrCode, ClipboardList, Info, BookCheck, MessageSquare, Rocket, Brain } from 'lucide-react';
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
                আপনার <br />
                <span className="text-brand-primary">একাডেমিক সম্ভাবনা</span> <br />
                উন্মোচন করুন
              </h1>
              <p className="mt-8 text-lg text-neutral-300 max-w-lg leading-relaxed">
                PB Academia-এর সাথে হাজার হাজার মেধাবী শিক্ষার্থীদের সাথে যোগ দিন। 
                সেরা মেন্টর, লাইভ ক্লাস এবং পার্সোনালাইজড লার্নিং-এর মাধ্যমে আপনার উজ্জ্বল ভবিষ্যৎ নিশ্চিত করুন।
              </p>
              
              <div className="mt-12 flex items-center space-x-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center space-x-4">
                  <QrCode className="h-12 w-12 text-white" />
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">স্ক্যান করুন</p>
                    <p className="text-sm text-white font-bold">ঢাকা নোড</p>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
                >
                  এখনই শুরু করুন
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
          <div className="grid md:grid-cols-2 gap-12 mb-24">
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[4rem] p-12 relative overflow-hidden group border border-white/10 shadow-2xl">
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 text-blue-300 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  <span>নতুন ফিচার</span>
                </div>
                <h3 className="text-4xl font-display font-bold text-white uppercase tracking-tighter">QUIZ<span className="text-blue-500">BLUST</span></h3>
                <p className="mt-4 text-blue-100/70 font-medium text-sm">অষ্টম শ্রেণীর শিক্ষার্থীদের জন্য সম্পূর্ণ ফ্রি এক্সাম সলভ ব্যাচ।</p>
                <Link to="/quizblust" className="inline-block mt-8 px-8 py-4 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">ফ্রি জয়েন করুন</Link>
              </div>
              <Rocket className="h-40 w-40 text-white/5 absolute -bottom-10 -right-10 rotate-12" />
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-[4rem] p-12 relative overflow-hidden group border border-white/10 shadow-2xl">
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  <span>ফ্রি অ্যাক্সেস</span>
                </div>
                <h3 className="text-4xl font-display font-bold text-white uppercase tracking-tighter">BRAIN <span className="text-purple-500">TEASERS</span></h3>
                <p className="mt-4 text-purple-100/70 font-medium text-sm">মজাদার আইকিউ প্রশ্ন ও ধাঁধার মাধ্যমে নিজেকে ঝালিয়ে নিন।</p>
                <Link to="/brain-teasers" className="inline-block mt-8 px-8 py-4 bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">ধাঁধা সমাধান শুরু করুন</Link>
              </div>
              <Brain className="h-40 w-40 text-white/5 absolute -bottom-10 -right-10 -rotate-12" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" 
                alt="Student Illustration" 
                className="rounded-[3rem] shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-brand-secondary font-bold uppercase tracking-widest text-xs">আমাদের প্রতিশ্রুতি</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-display font-bold text-neutral-900 leading-tight">
                পরিস্থিতি যাই হোক না কেন, <br />
                <span className="text-brand-primary text-3xl italic">আপনার প্রস্তুতি থামবে না।</span>
              </h2>
              <p className="mt-8 text-neutral-600 leading-relaxed text-lg">
                আমরা একটি নিরবচ্ছিন্ন শিক্ষার অভিজ্ঞতা প্রদান করি যা আপনার প্রয়োজনের সাথে খাপ খায়। আমাদের প্ল্যাটফর্মটি নিশ্চিত করে যে অষ্টম থেকে দ্বাদশ শ্রেণীর শিক্ষার্থীরা যে কোনও সময়, যে কোনও জায়গায় সেরা একাডেমিক সহযোগিতা পায়।
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  'দেশের প্রথিতযশা প্রতিষ্ঠানের বিশেষজ্ঞ শিক্ষকবৃন্দ', 
                  'ইন্টারেক্টিভ ডাউট-ক্লিয়ারিং সেশন', 
                  'পারফরম্যান্স অ্যানালাইসিস রিপোর্ট'
                ].map((item) => (
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
            <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-primary uppercase tracking-tight">আমাদের প্রোগ্রামসমূহ</h2>
            <p className="mt-6 text-neutral-500 font-medium max-w-lg mx-auto">আপনার একাডেমিক লক্ষ্যের সাথে সামঞ্জস্যপূর্ণ প্রোগ্রামটি নির্বাচন করুন এবং সফলতার যাত্রা শুরু করুন।</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "সেকেন্ডারি কোর", classes: "অষ্টম - দশম শ্রেণী", desc: "ভবিষ্যতের সফলতার জন্য একটি শক্তিশালী ভিত্তি তৈরি করা।", img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop" },
              { title: "হায়ার সেকেন্ডারি", classes: "একাদশ - দ্বাদশ শ্রেণী", desc: "বোর্ড পরীক্ষা এবং তার পরবর্তী ধাপের জন্য উন্নত প্রস্তুতি।", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop" },
              { title: "অ্যাডমিশন প্রোগ্রাম", classes: "বিশ্ববিদ্যালয় প্রস্তুতি", desc: "প্রতিযোগিতামূলক ভর্তি পরীক্ষার জন্য কৌশলগত পরিকল্পনা।", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop" }
            ].map((program, i) => (
              <div key={i} className="bg-white rounded-[3rem] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-2xl transition-all group">
                <div className="h-64 overflow-hidden relative">
                  <img src={program.img} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-widest shadow-lg">
                    {program.classes}
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4 tracking-tight">{program.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-8">{program.desc}</p>
                  <Link to="/register" className="flex items-center space-x-2 text-brand-primary font-bold hover:space-x-4 transition-all">
                    <span>ভর্তি হোন</span>
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
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 uppercase tracking-tighter">আপনি কি তৈরি?</h2>
            <p className="text-brand-surface/80 text-lg mb-12 max-w-lg mx-auto">দেশের প্রথিতযশা একাডেমিক নেটওয়ার্কে যোগ দিন এবং আজই আপনার সফল ভবিষ্যৎ নিশ্চিত করুন।</p>
            <Link
              to="/register"
              className="inline-flex items-center px-10 py-4 bg-white text-brand-primary rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              যাত্রা শুরু করুন
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
