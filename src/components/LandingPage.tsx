import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Award, Users, ArrowRight, Video, QrCode, ClipboardList, Info, BookCheck, MessageSquare, Rocket, Brain, ChevronLeft, ChevronRight, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const moments = [
  "https://i.ibb.co.com/BVrnC4Qz/Untitled-design-5.png",
  "https://i.ibb.co.com/fVmJ4czt/482218862-1153713516548135-4998947808767412318-n.jpg",
  "https://i.ibb.co.com/prP48Xzk/Untitled-design-4.png",
  "https://i.ibb.co.com/BHxqgXTv/fbfe08da-0769-41af-bb5e-3ab953c6b34f.jpg",
  "https://i.ibb.co.com/ZpTkHT4q/Untitled-design-8.png",
  "https://i.ibb.co.com/bnjWcbX/Untitled-design-6.png"
];

export default function LandingPage() {
  const [currentMoment, setCurrentMoment] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMoment((prev) => (prev + 1) % moments.length);
    }, 3000); // 3 seconds stay
    return () => clearInterval(timer);
  }, []);
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
                তোমার <br />
                <span className="text-brand-primary">একাডেমিক সম্ভাবনা</span> <br />
                উন্মোচন করো
              </h1>
              <p className="mt-8 text-lg text-neutral-300 max-w-lg leading-relaxed">
                PB Academia-এর সাথে হাজার হাজার মেধাবী তোমার বন্ধুদের সাথে যোগ দাও। 
                সেরা মেন্টর, লাইভ ক্লাস এবং পার্সোনালাইজড লার্নিং-এর মাধ্যমে তোমার উজ্জ্বল ভবিষ্যৎ নিশ্চিত করো।
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
                <p className="mt-4 text-blue-100/70 font-medium text-sm">তোমাদের জন্য সম্পূর্ণ ফ্রি এক্সাম সলভ ব্যাচ। এখনই জয়েন করো!</p>
                <Link to="/quizblust" className="inline-block mt-8 px-8 py-4 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">ফ্রি জয়েন করো</Link>
              </div>
              <Rocket className="h-40 w-40 text-white/5 absolute -bottom-10 -right-10 rotate-12" />
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-[4rem] p-12 relative overflow-hidden group border border-white/10 shadow-2xl">
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  <span>ফ্রি অ্যাক্সেস</span>
                </div>
                <h3 className="text-4xl font-display font-bold text-white uppercase tracking-tighter">BRAIN <span className="text-purple-500">TEASERS</span></h3>
                <p className="mt-4 text-purple-100/70 font-medium text-sm">মজাদার আইকিউ প্রশ্ন ও ধাঁধার মাধ্যমে নিজেকে ঝালিয়ে নাও।</p>
                <Link to="/brain-teasers" className="inline-block mt-8 px-8 py-4 bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">সমাধান শুরু করো</Link>
              </div>
              <Brain className="h-40 w-40 text-white/5 absolute -bottom-10 -right-10 -rotate-12" />
            </div>
          </div>

          {/* Class Moments Gallery - Auto Scrolling Carousel */}
          <div className="mb-32">
            <div className="flex items-center justify-between mb-12 px-4 md:px-0">
              <div>
                <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-[10px]">Our Journey</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter mt-2">CLASS <span className="text-brand-primary">MOMENTS</span></h2>
              </div>
              <div className="flex space-x-2">
                {moments.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${currentMoment === i ? 'w-8 bg-brand-primary' : 'w-2 bg-white/10'}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="relative h-[300px] md:h-[600px] w-full bg-neutral-900 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMoment}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0"
                >
                  <img 
                    src={moments[currentMoment]} 
                    alt={`Moment ${currentMoment + 1}`} 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button 
                onClick={() => setCurrentMoment((prev) => (prev - 1 + moments.length) % moments.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-brand-primary transition-all z-20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={() => setCurrentMoment((prev) => (prev + 1) % moments.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-brand-primary transition-all z-20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] rounded-full"></div>
              <img 
                src="https://i.ibb.co.com/BVrnC4Qz/Untitled-design-5.png" 
                alt="Student Illustration" 
                className="rounded-[3rem] shadow-2xl relative z-10 border border-white/10"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-brand-secondary font-bold uppercase tracking-widest text-[10px]">আমাদের প্রতিশ্রুতি</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-display font-bold text-white leading-tight uppercase tracking-tighter">
                পরিস্থিতি যাই হোক না কেন, <br />
                <span className="text-brand-primary text-3xl italic">তোমার প্রস্তুতি থামবে না।</span>
              </h2>
              <p className="mt-8 text-neutral-400 leading-relaxed text-md">
                আমরা একটি নিরবচ্ছিন্ন শিক্ষার অভিজ্ঞতা প্রদান করি যা তোমার প্রয়োজনের সাথে খাপ খায়। আমাদের প্ল্যাটফর্মটি নিশ্চিত করে যে ৮ম থেকে ১২শ শ্রেণীর শিক্ষার্থীরা যে কোনও সময়, যে কোনও জায়গায় সেরা একাডেমিক সহযোগিতা পায়।
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  'দেশের প্রথিতযশা প্রতিষ্ঠানের শিক্ষকবৃন্দ', 
                  'সরাসরি ডাউট-ক্লিয়ারিং সেশন', 
                  'পারফরম্যান্স অ্যানালাইসিস রিপোর্ট'
                ].map((item) => (
                  <li key={item} className="flex items-center space-x-3 text-neutral-300 font-bold uppercase tracking-tight text-sm">
                    <div className="h-6 w-6 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center">
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

      {/* Programs Section */}
      <section className="py-24 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter">প্রোগ্রামসমূহ</h2>
            <p className="mt-6 text-neutral-500 font-medium max-w-lg mx-auto uppercase tracking-widest text-[10px]">তোমার একাডেমিক লক্ষ্যের প্রোগ্রামটি নির্বাচন করো এবং সফলতার যাত্রা শুরু করো।</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "সেকেন্ডারি কোর", classes: "৮ম - ১০ম শ্রেণী", desc: "ভবিষ্যতের সফলতার জন্য একটি শক্তিশালী ভিত্তি তৈরি করা।", img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop" },
              { title: "হায়ার সেকেন্ডারি", classes: "১১শ - ১২শ শ্রেণী", desc: "বোর্ড পরীক্ষা এবং তার পরবর্তী ধাপের জন্য উন্নত প্রস্তুতি।", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop" },
              { title: "অ্যাডমিশন প্রোগ্রাম", classes: "ভর্তি প্রস্তুতি", desc: "বিশ্ববিদ্যালয় ভর্তি পরীক্ষার জন্য কৌশলগত পরিকল্পনা।", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop" }
            ].map((program, i) => (
              <div key={i} className="bg-neutral-900 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
                <div className="h-64 overflow-hidden relative">
                  <img src={program.img} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40" />
                  <div className="absolute top-6 left-6 bg-brand-primary px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                    {program.classes}
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">{program.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-8">{program.desc}</p>
                  <Link to="/register" className="flex items-center space-x-2 text-brand-primary font-black uppercase tracking-widest text-[10px] hover:space-x-4 transition-all">
                    <span>ভর্তি হও</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Section */}
      <section className="py-24 bg-brand-surface relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-[10px]">Headquarters</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter mt-4 mb-8">
                আমাদের <span className="text-brand-primary">ক্যাম্পাস</span>
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-tight text-sm mb-1">অবস্থান</h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      ১২ গ্রীন কর্নার (ইমানুয়েল ব্যাপ্টিস্ট চার্চের বিপরীতে), ঢাকা-১২০৫ <br />
                      12 Green Corner (Opposite of Immanuel Baptist Church), Dhaka-1205
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/qYaJDS3mqNz67L979" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center mt-4 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                      Google Maps-এ দেখুন <ArrowRight className="ml-2 h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-tight text-sm mb-1">ফোন</h4>
                    <p className="text-neutral-400 text-sm font-bold">01784-323041</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-tight text-sm mb-1">ইমেইল</h4>
                    <p className="text-neutral-400 text-sm">pbacademia25@gmail.com</p>
                    <p className="text-neutral-400 text-sm">admin@pbacademia.top</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-16 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 p-4 bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-sm shadow-2xl"
              >
                <img 
                  src="https://i.ibb.co.com/prWFBywQ/Gemini-Generated-Image-3drk3j3drk3j3drk.png" 
                  alt="PB Academia Campus" 
                  className="rounded-[3.5rem] w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32 bg-brand-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-primary rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-brand-primary/20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 uppercase tracking-tighter">তুমি কি তৈরি?</h2>
            <p className="text-white/70 text-lg mb-12 max-w-lg mx-auto font-medium leading-relaxed">দেশের প্রথিতযশা একাডেমিক নেটওয়ার্কে যোগ দাও এবং আজই তোমার সফল ভবিষ্যৎ নিশ্চিত করো।</p>
            <Link
              to="/register"
              className="inline-flex items-center px-12 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all shadow-2xl"
            >
              যাত্রা শুরু করো
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
