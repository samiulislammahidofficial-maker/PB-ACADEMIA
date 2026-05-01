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

const mentors = [
  { name: "Shahriar Sajir", uni: "Dhaka University (DU)", dept: "Dept: Nuclear Engineering", role: "Mentor at PB: Math", exp: "Experience: 3y+", img: "https://i.ibb.co/0wdj6Sj/18c049fd-815a-470b-a187-3922244f0093.jpg" },
  { name: "Farzaad Bin Sarwar", uni: "Islamic University of Technology (IUT)", dept: "Dept: Civil & Environmental Engineering", role: "Mentor at PB: Chemistry", exp: "Experience: 4y+", img: "https://i.ibb.co/MkbHL5dm/6291856579174796136.png" },
  { name: "Samiul Islam Mahid", uni: "Bangladesh University of Engineering and Technology (BUET)", dept: "Dept: Industrial & Production Engineering", role: "Mentor at PB: Physics", exp: "Experience: 4y+", img: "https://i.ibb.co/zH47xXCN/IMG-1755-Samiul-islam-Mahid.jpg" },
  { name: "Md Sayem Billah", uni: "Bangladesh University of Engineering and Technology (BUET)", dept: "Dept: Industrial & Production Engineering", role: "Mentor at PB: Math", exp: "Experience: 4y+", img: "https://i.ibb.co/4nW8k27V/IMG-20251111-WA0619-Seam-Billah.jpg" },
  { name: "Atuloan Audrie", uni: "Bangladesh University of Engineering and Technology (BUET)", dept: "Dept: Mechanical Engineering", role: "Mentor at PB: Physics", exp: "Experience: 2y+", img: "https://i.ibb.co/s9GBQVvx/IMG-20251219-WA0000-Atuloan-Audrie.jpg" },
  { name: "Ahnaf Ahsan", uni: "Dhaka Medical College (DMC)", dept: "Medical Operations", role: "Mentor at PB: Biology", exp: "Experience: 2y+", img: "https://i.ibb.co/chssGk33/IMG20221220122126-Ahnaf-Sayem.jpg" },
  { name: "Shafayei Tashin", uni: "Dhaka Medical College (DMC)", dept: "Medical Operations", role: "Mentor at PB: Biology", exp: "Experience: 2y+", img: "https://i.ibb.co/84fJmw4r/inbound1880949799825595534-Shafayei-Khan-Tashin.jpg" },
  { name: "Selmoon Habib", uni: "Popular Medical College (PMC)", dept: "Medical Operations", role: "Mentor at PB: Biology", exp: "Experience: 2y+", img: "https://i.ibb.co/m5r39j6N/inbound6074873297210308592-Selmoon-Habib.jpg" },
  { name: "Aindrela Rani Kar", uni: "Jahangirnagar University (JU)", dept: "Dept: Computer Science Engineering (CSE)", role: "Mentor at PB: ICT", exp: "Experience: 2y+", img: "https://i.ibb.co/S7DttQqz/inbound5164628309827598750-Aindrela-Kar.jpg" },
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
    <div className="flex flex-col overflow-hidden bg-brand-dark">
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
              <h1 className="text-6xl md:text-8xl font-display font-black text-white leading-[0.95] tracking-tighter">
                তোমার <br />
                <span className="text-brand-primary">একাডেমিক</span> <br />
                উন্মোচন করো
              </h1>
              <p className="mt-10 text-xl text-neutral-400 max-w-lg leading-relaxed font-medium">
                PB Academia-এর সাথে হাজার হাজার মেধাবী বন্ধুদের সাথে যোগ দাও। 
                সেরা মেন্টর, লাইভ ক্লাস এবং পার্সোনালাইজড লার্নিং-এর মাধ্যমে তোমার উজ্জ্বল ভবিষ্যৎ নিশ্চিত করো।
              </p>
              
              <div className="mt-12 flex items-center space-x-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center space-x-4">
                  <QrCode className="h-12 w-12 text-white" />
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">স্ক্যান করুন</p>
                    <p className="text-base text-white font-bold">ঢাকা নোড</p>
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
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 text-blue-300 text-xs font-black uppercase tracking-[0.3em] mb-6">
                  <span>নতুন ফিচার</span>
                </div>
                <h3 className="text-4xl font-display font-bold text-white uppercase tracking-tighter">QUIZ<span className="text-blue-500">BLUST</span></h3>
                <p className="mt-4 text-blue-100/70 font-medium text-lg">তোমাদের জন্য সম্পূর্ণ ফ্রি এক্সাম সলভ ব্যাচ। এখনই জয়েন করো!</p>
                <Link to="/quizblust" className="inline-block mt-8 px-8 py-4 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs">ফ্রি জয়েন করো</Link>
              </div>
              <Rocket className="h-40 w-40 text-white/5 absolute -bottom-10 -right-10 rotate-12" />
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-[4rem] p-12 relative overflow-hidden group border border-white/10 shadow-2xl">
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-[0.3em] mb-6">
                  <span>ফ্রি অ্যাক্সেস</span>
                </div>
                <h3 className="text-4xl font-display font-bold text-white uppercase tracking-tighter">BRAIN <span className="text-purple-500">TEASERS</span></h3>
                <p className="mt-4 text-purple-100/70 font-medium text-lg">মজাদার আইকিউ প্রশ্ন ও ধাঁধার মাধ্যমে নিজেকে ঝালিয়ে নাও।</p>
                <Link to="/brain-teasers" className="inline-block mt-8 px-8 py-4 bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs">সমাধান শুরু করো</Link>
              </div>
              <Brain className="h-40 w-40 text-white/5 absolute -bottom-10 -right-10 -rotate-12" />
            </div>
          </div>

          {/* Class Moments Gallery - Auto Scrolling Carousel */}
          <div className="mb-32">
            <div className="flex items-center justify-between mb-12 px-4 md:px-0">
              <div>
                <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-xs">Our Journey</span>
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
                    className="w-full h-full object-cover transition-transform duration-[3000ms] scale-110"
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
              <span className="text-brand-secondary font-black uppercase tracking-[0.3em] text-xs">আমাদের প্রতিশ্রুতি</span>
              <h2 className="mt-6 text-5xl md:text-7xl font-display font-black text-white leading-[1.1] uppercase tracking-tighter">
                পরিস্থিতি যাই হোক না <br />
                <span className="text-brand-primary italic">কেন, প্রস্তুতি থামবে না।</span>
              </h2>
              <p className="mt-10 text-neutral-400 leading-relaxed text-xl font-medium">
                আমরা একটি নিরবচ্ছিন্ন শিক্ষার অভিজ্ঞতা প্রদান করি যা তোমার প্রয়োজনের সাথে খাপ খায়। আমাদের প্ল্যাটফর্মটি নিশ্চিত করে যে ৮ম থেকে ১২শ শ্রেণীর শিক্ষার্থীরা যে কোনও সময়, যে কোনও জায়গায় সেরা একাডেমিক সহযোগিতা পায়।
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  'দেশের প্রথিতযশা প্রতিষ্ঠানের শিক্ষকবৃন্দ', 
                  'সরাসরি ডাউট-ক্লিয়ারিং সেশন', 
                  'পারফরম্যান্স অ্যানালাইসিস রিপোর্ট'
                ].map((item) => (
                  <li key={item} className="flex items-center space-x-3 text-neutral-300 font-bold uppercase tracking-tight text-base">
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

      {/* Mentors Section - High End Design */}
      <section className="py-32 bg-brand-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Executive Faculty</span>
              <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.9]">
                ELITE <br />
                <span className="text-brand-primary">MENTORS</span>
              </h2>
            </div>
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-[11px] max-w-sm mb-2">
              দেশের প্রথিতযশা প্রতিষ্ঠানের (BUET, DU, DMC, IUT) সেরা মেধাবীদের তত্ত্বাবধানে তোমার একাডেমিক ক্যারিয়ার শুরু করো।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {mentors.map((mentor, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="relative h-[450px] w-full rounded-[3.5rem] overflow-hidden border border-white/5 bg-brand-surface shadow-2xl transition-all duration-500 group-hover:border-brand-primary/50 group-hover:shadow-brand-primary/10">
                  {/* Background Accents */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors"></div>
                  
                  {/* Photo Container */}
                  <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img 
                      src={mentor.img} 
                      alt={mentor.name} 
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                    />
                    {/* Immersive Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary text-[9px] font-black uppercase tracking-widest rounded-full border border-brand-primary/30">
                        {mentor.role.split(': ')[1]}
                      </span>
                      <span className="text-neutral-500 text-[9px] font-black uppercase tracking-widest">
                        {mentor.exp}
                      </span>
                    </div>
                    
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 leading-none">
                      {mentor.name}
                    </h3>
                    
                    <div className="space-y-1">
                      <p className="text-brand-primary text-[11px] font-black uppercase tracking-widest flex items-center">
                        <Award className="h-3 w-3 mr-2" />
                        {mentor.uni}
                      </p>
                      <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-tight">
                        {mentor.dept}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter">প্রোগ্রামসমূহ</h2>
            <p className="mt-6 text-neutral-500 font-black max-w-lg mx-auto uppercase tracking-widest text-xs">তোমার একাডেমিক লক্ষ্যের প্রোগ্রামটি নির্বাচন করো এবং সফলতার যাত্রা শুরু করো।</p>
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
                  <div className="absolute top-6 left-6 bg-brand-primary px-4 py-2 rounded-xl text-xs font-black text-white uppercase tracking-widest shadow-lg">
                    {program.classes}
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">{program.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-8">{program.desc}</p>
                  <Link to="/register" className="flex items-center space-x-2 text-brand-primary font-black uppercase tracking-widest text-xs hover:space-x-4 transition-all">
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
              <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-xs">Headquarters</span>
              <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter mt-4 mb-10 leading-none">
                আমাদের <span className="text-brand-primary">ক্যাম্পাস</span>
              </h2>
              
              <div className="space-y-10">
                <div className="flex items-start space-x-8">
                  <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-brand-primary shrink-0 transition-transform hover:scale-110">
                    <MapPin className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-tight text-lg mb-2">অবস্থান</h4>
                    <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                      ১২ গ্রীন কর্নার (ইমানুয়েল ব্যাপ্টিস্ট চার্চের বিপরীতে), ঢাকা-১২০৫ <br />
                      12 Green Corner (Opposite of Immanuel Baptist Church), Dhaka-1205
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/qYaJDS3mqNz67L979" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center mt-4 text-blue-500 text-xs font-black uppercase tracking-widest hover:underline"
                    >
                      Google Maps-এ দেখুন <ArrowRight className="ml-2 h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-8">
                  <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 transition-transform hover:scale-110">
                    <Phone className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-tight text-lg mb-2">ফোন</h4>
                    <p className="text-neutral-400 text-lg font-black tracking-widest">01784-323041</p>
                  </div>
                </div>

                <div className="flex items-start space-x-8">
                  <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-orange-500 shrink-0 transition-transform hover:scale-110">
                    <Mail className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-tight text-lg mb-2">ইমেইল</h4>
                    <p className="text-neutral-400 text-lg font-medium">pbacademia25@gmail.com</p>
                    <p className="text-neutral-400 text-lg font-medium">admin@pbacademia.top</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-16 lg:mt-0 grid gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 p-2 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-sm shadow-2xl overflow-hidden"
              >
                <img 
                  src="https://i.ibb.co.com/prWFBywQ/Gemini-Generated-Image-3drk3j3drk3j3drk.png" 
                  alt="PB Academia Campus" 
                  className="rounded-[2.5rem] w-full h-[300px] object-cover"
                />
              </motion.div>

              <div className="relative z-10 bg-white/5 p-2 rounded-[3.5rem] border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden aspect-video">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.272186834165!2d90.37039014605929!3d23.744956667950293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b93d7907f1f3%3A0xe5f8664156d1c49!2sPB%20Academia!5e0!3m2!1sen!2sbd!4v1714584200000!5m2!1sen!2sbd" 
                  className="w-full h-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 rounded-[3rem]"
                  style={{ border: 0 }} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px]"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-primary/10 rounded-full blur-[120px]"></div>
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
              className="inline-flex items-center px-12 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-2xl"
            >
              যাত্রা শুরু করো
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
