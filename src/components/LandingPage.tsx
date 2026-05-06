import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Rocket, 
  Brain, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  CheckCircle2, 
  GraduationCap, 
  Trophy, 
  ShieldCheck, 
  Zap,
  Facebook,
  Youtube,
  Instagram,
  Timer,
  Users,
  Video,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SLIDES = [
  { label: 'ঢাবি ভর্তি প্রস্তুতি — Batch 2025', icon: '🏫', name: 'ঢাকা বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি', meta: '৬ মাস • লাইভ+অফলাইন • ৩২০ জন ভর্তি', chip: 'LIVE', chipCls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { label: 'BUET ভর্তি কোচিং — Batch 2025', icon: '⚙️', name: 'BUET ও প্রকৌশল বিশ্ববিদ্যালয় ভর্তি', meta: '৮ মাস • বিষয়ভিত্তিক • ১৮৫ জন ভর্তি', chip: 'NEW', chipCls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { label: 'মেডিকেল ভর্তি কোচিং — Batch 2025', icon: '🩺', name: 'মেডিকেল ও ডেন্টাল কলেজ ভর্তি', meta: '৭ মাস • DPS সিরিজ • সিট প্রায় পূর্ণ!', chip: 'সিট প্রায় পূর্ণ', chipCls: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { label: 'SSC বিশেষ ব্যাচ — ভর্তি চলছে', icon: '📐', name: 'SSC ও HSC বিশেষ ব্যাচ', meta: '৪ মাস • সাপ্তাহিক টেস্ট • A+ লক্ষ্য', chip: 'NEW', chipCls: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' }
];

const mentors = [
  { name: "Shahriar Sajir", uni: "Dhaka University (DU)", dept: "Dept: Nuclear Engineering", role: "Mentor at PB: Math", exp: "Experience: 3y+", img: "https://i.ibb.co/0wdj6Sj/18c049fd-815a-470b-a187-3922244f0093.jpg", pos: "object-top" },
  { name: "Farzaad Bin Sarwar", uni: "IUT", dept: "Dept: CEE", role: "Mentor at PB: Chemistry", exp: "Experience: 4y+", img: "https://i.ibb.co/MkbHL5dm/6291856579174796136.png", pos: "object-center" },
  { name: "Samiul Islam Mahid", uni: "BUET", dept: "Dept: IPE", role: "Mentor at PB: Physics", exp: "Experience: 4y+", img: "https://i.ibb.co/zH47xXCN/IMG-1755-Samiul-islam-Mahid.jpg", pos: "object-top" },
  { name: "Md Sayem Billah", uni: "BUET", dept: "Dept: IPE", role: "Mentor at PB: Math", exp: "Experience: 4y+", img: "https://i.ibb.co/4nW8k27V/IMG-20251111-WA0619-Seam-Billah.jpg", pos: "object-top" },
  { name: "Ahnaf Ahsan", uni: "DMC", dept: "Medical Operations", role: "Mentor at PB: Biology", exp: "Experience: 2y+", img: "https://i.ibb.co/chssGk33/IMG20221220122126-Ahnaf-Sayem.jpg", pos: "object-top" },
  { name: "Shafayei Tashin", uni: "DMC", dept: "Medical Operations", role: "Mentor at PB: Biology", exp: "Experience: 2y+", img: "https://i.ibb.co/84fJmw4r/inbound1880949799825595534-Shafayei-Khan-Tashin.jpg", pos: "object-top" },
];

export default function LandingPage() {
  const [curSlide, setCurSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#7c3aed] to-[#2563eb]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[length:32px_32px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-display font-bold text-xs uppercase tracking-[0.2em] mb-10">
                <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_#f59e0b]"></span>
                <span>ভর্তি সিজন ২০২৫ শুরু হয়েছে</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter mb-10">
                স্বপ্নের <span className="text-amber-400">বিশ্ববিদ্যালয়ে</span> <br />
                চান্স পাওয়ার <br />
                সেরা প্রস্তুতি
              </h1>
              
              <p className="text-white/80 text-xl font-medium leading-relaxed max-w-lg mb-12">
                PB Academia — বাংলাদেশের সবচেয়ে বিশ্বস্ত অনলাইন একাডেমিক প্লাটফর্ম। সেরা মেন্টর ও কৌশলী প্রস্তুতির মাধ্যমে তোমার স্বপ্ন জয় করো।
              </p>
              
              <div className="flex flex-wrap gap-6 mb-20">
                <Link to="/register" className="px-10 py-5 bg-amber-500 text-[#1e1b4b] rounded-2xl font-display font-black uppercase tracking-widest text-sm shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all">
                  কোর্স দেখো ✦
                </Link>
                <a href="#contact" className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-display font-black uppercase tracking-widest text-sm border border-white/20 hover:bg-white/20 transition-all">
                  বিনামূল্যে পরামর্শ
                </a>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-white/20">
                {[
                  { n: '৫০০+', l: 'সফল শিক্ষার্থী' },
                  { n: '৯৮%', l: 'সাফল্যের হার' },
                  { n: '২০+', l: 'বিশেষজ্ঞ শিক্ষক' },
                  { n: '৩+', l: 'বছরের অভিজ্ঞতা' }
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black text-amber-400 font-display leading-none">{s.n}</div>
                    <div className="text-[10px] text-white/50 uppercase font-black tracking-widest mt-2">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Hero Slider */}
            <div className="mt-20 lg:mt-0 relative group">
              <div className="bg-[#1e1b4b] rounded-[4rem] border border-white/10 p-4 shadow-[0_32px_80px_rgba(30,27,75,0.4)] relative overflow-hidden aspect-[4/3] group-hover:scale-[1.01] transition-transform duration-700">
                <AnimatePresence mode="wait">
                  {isLoaded && (
                    <motion.div
                      key={curSlide}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b] via-transparent to-transparent opacity-80 z-10"></div>
                      <img 
                        src={`https://images.unsplash.com/photo-${curSlide === 0 ? '1523050854058-8df90110c9f1' : curSlide === 1 ? '1571260899304-425eee4c7efc' : curSlide === 2 ? '1580582932707-520aed937b7b' : '1434030216411-0b793f4b4173'}?w=1000&auto=format&fit=crop`} 
                        className="w-full h-full object-cover grayscale opacity-90"
                        alt="Slide"
                        loading="eager"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute top-10 left-10 flex items-center space-x-3 z-20">
                   <div className="px-5 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center space-x-3">
                      <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{SLIDES[curSlide].label}</span>
                   </div>
                </div>

                <div className="absolute bottom-10 left-8 right-8 z-20">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-3xl border border-white/20 p-8 rounded-[3rem] shadow-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                        {SLIDES[curSlide].icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{SLIDES[curSlide].name}</h3>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1 tracking-[0.1em]">{SLIDES[curSlide].meta}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-lg ${SLIDES[curSlide].chipCls}`}>
                      {SLIDES[curSlide].chip}
                    </span>
                  </motion.div>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                  {SLIDES.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurSlide(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${curSlide === i ? 'w-10 bg-amber-400' : 'w-2 bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center space-x-5 z-30 animate-bounce-slow">
                <div className="h-14 w-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl">🏆</div>
                <div>
                  <div className="text-2xl font-black text-[#1e1b4b] leading-none">৯৮%</div>
                  <div className="text-[10px] text-[#1e1b4b]/40 font-black uppercase tracking-widest mt-1">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-amber-500 py-6 overflow-hidden border-y-2 border-[#1e1b4b]/10 shadow-xl relative z-20">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center">
              {[
                { t: '🎓 ঢাবি ভর্তি প্রস্তুতি', l: 'du' },
                { t: '⚙️ BUET ও প্রকৌশল', l: 'eng' },
                { t: '🩺 মেডিকেল ভর্তি কোচিং', l: 'med' }, 
                { t: '📚 ক্লাস ৮ একাডেমিক', l: 'c8' },
                { t: '📐 ক্লাস ৯ একাডেমিক', l: 'c9' },
                { t: '📝 SSC টার্গেট ব্যাচ', l: 'c10' },
                { t: '🧬 HSC একাডেমিক', l: 'hsc-a' },
                { t: '🏫 জাহাঙ্গীরনগর ভর্তি', l: 'du' },
                { t: '🎯 ৫০০০+ প্রশ্নের সমাধান', l: 'qb' }
              ].map((item, j) => (
                <div key={j} className="flex items-center mx-12">
                  <a href={`#${item.l}`} className="text-[#1e1b4b] font-display font-black uppercase tracking-widest text-base hover:text-white transition-colors">{item.t}</a>
                  <span className="ml-12 text-[#1e1b4b]/20 text-xl font-bold italic">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── PROGRAMS ── */}
      <section id="courses" className="py-40 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-purple-100 rounded-full border border-purple-200 text-purple-600 font-display font-bold text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm">
              <span>✦ আমাদের কোর্সসমূহ</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-[#1e1b4b] uppercase tracking-tighter leading-tight">
              তোমার <span className="text-purple-600">লক্ষ্য</span> অনুযায়ী ব্যাচ বেছে নাও
            </h2>
            <p className="mt-8 text-neutral-500 font-bold uppercase tracking-widest text-xs">৮ম-১২শ শ্রেণী পর্যন্ত অনলাইন ও অফলাইন একাডেমিক ব্যাচ চলছে!</p>
          </div>

          {[
            { 
              title: "Secondary (Class 8-10)", 
              courses: [
                { id: 'c8', icon: '🎒', tag: 'Class 8', title: '৮ম শ্রেণীর একাডেমিক ব্যাচ', desc: 'পদার্থ, রসায়ন, সাধারণ গণিত, উচ্চতর গণিত ও আইসিটি। নতুন কারিকুলাম ভিত্তিক বিশেষ প্রস্তুতি।', time: 'প্রতি মাস', mode: 'অনলাইন ও অফলাইন', priceOffline: '১,৫০০', priceOnline: '১,০০০', color: 'from-blue-50 to-indigo-50', tagColor: 'bg-blue-100 text-blue-600', isPerSubject: true, isMonthly: true },
                { id: 'c9', icon: '📐', tag: 'Class 9', title: '৯ম শ্রেণীর একাডেমিক ব্যাচ', desc: 'নতুন কারিকুলাম অনুযায়ী বিজ্ঞান শাখার পূর্ণাঙ্গ কোর্স (Phy, Chem, Math, ICT)।', time: 'প্রতি মাস', mode: 'অনলাইন ও অফলাইন', priceOffline: '১,৫০০', priceOnline: '১,০০০', color: 'from-emerald-50 to-teal-50', tagColor: 'bg-emerald-100 text-emerald-600', isPerSubject: true, isMonthly: true },
                { id: 'c10', icon: '📝', tag: 'SSC Batch', title: '১০ম শ্রেণী ও SSC টার্গেট ব্যাচ', desc: 'SSC পরীক্ষার চূড়ান্ত প্রস্তুতির জন্য এ প্লাস ম্যাজিক ব্যাচ। বোর্ড প্রশ্ন এনালাইসিস।', time: 'প্রতি মাস', mode: 'অনলাইন ও অফলাইন', priceOffline: '১,৫০০', priceOnline: '১,০০০', color: 'from-indigo-50 to-blue-50', tagColor: 'bg-indigo-100 text-indigo-600', isPerSubject: true, isMonthly: true },
                { id: 'qb', icon: '⚡', tag: 'FREE', title: 'QuizBlust: Class 8 Special', desc: 'ক্লাস ৮ এর বন্ধুদের জন্য একদম ফ্রি সব এক্সাম সলভ ব্যাচ! কুইজ ও সমাধান।', time: 'চলমান', mode: 'অনলাইন', price: '০', color: 'from-amber-50 to-orange-50', tagColor: 'bg-amber-100 text-amber-700' },
              ]
            },
            { 
              title: "Higher Secondary (Class 11-12)", 
              courses: [
                { id: 'hsc-a', icon: '🧬', tag: 'Academic', title: 'HSC একাডেমিক ব্যাচ', desc: 'ফিজিক্স, কেমিস্ট্রি, হায়ার ম্যাথ, বায়োলজি ও আইসিটি। বিষয়ভিত্তিক পছন্দের সুযোগ।', time: '২ বছর', mode: '১৭০০৳ / বিষয়', price: '১,৭০০', color: 'from-purple-50 to-violet-50', tagColor: 'bg-purple-100 text-purple-600', isPerSubject: true },
                { id: 'hsc-test', icon: '📖', tag: 'Test Paper', title: 'এইচএসসি টেস্ট পেপার সলভ', desc: 'বিগত বছরের বোর্ড প্রশ্ন ও টপ কলেজের প্রশ্ন সমাধান। ইনটেনসিভ সেশন।', time: '৩ মাস', mode: 'বোর্ড স্ট্যান্ডার্ড', price: '৩,৫০০', color: 'from-rose-50 to-red-50', tagColor: 'bg-rose-100 text-rose-600' },
              ]
            },
            { 
              title: "Admission (Varsity & Medical)", 
              courses: [
                { id: 'du', icon: '🏫', tag: 'Admission', title: 'ঢাকা বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি', desc: 'ক, খ, গ, ঘ ও চ ইউনিটের পূর্ণাঙ্গ প্রস্তুতি। বিশেষজ্ঞ শিক্ষক ও প্রশ্ন বিশ্লেষণ।', time: '৬ মাস', mode: 'লাইভ+অফলাইন', price: '৮,৫০০', color: 'from-blue-50 to-indigo-50', tagColor: 'bg-blue-100 text-blue-600' },
                { id: 'eng', icon: '⚙️', tag: 'Engineering', title: 'BUET ও প্রকৌশল ভর্তি', desc: 'পদার্থ, রসায়ন ও গণিতে গভীর প্রস্তুতি। BUET-এর ছাত্রদের দ্বারা পরিচালিত।', time: '৮ মাস', mode: 'বিষয়ভিত্তিক', price: '১০,০০০', color: 'from-gray-50 to-slate-200', tagColor: 'bg-gray-200 text-gray-700' },
                { id: 'med', icon: '🩺', tag: 'Medical', title: 'মেডিকেল ও ডেন্টাল ভর্তি', desc: 'জীববিজ্ঞান, রসায়ন ও পদার্থে বিশেষজ্ঞ প্রশিক্ষণ। ডাক্তারি ক্যারিয়ার গড়ুন।', time: '৭ মাস', mode: 'এক্সপার্ট', price: '৯,৫০০', color: 'from-pink-50 to-rose-50', tagColor: 'bg-pink-100 text-pink-600' },
              ]
            }
          ].map((segment, idx) => (
            <div key={idx} id={segment.courses[0].id} className="mb-32 last:mb-0 scroll-mt-32">
              <div className="flex items-center space-x-6 mb-16">
                 <div className="h-0.5 flex-grow bg-neutral-200"></div>
                 <h3 className="text-lg font-black uppercase tracking-[0.3em] text-[#1e1b4b]/40 italic">{segment.title}</h3>
                 <div className="h-0.5 flex-grow bg-neutral-200"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {segment.courses.map((c, i) => (
                  <div key={i} id={c.id} className="bg-white rounded-[4rem] border-2 border-transparent hover:border-purple-200 transition-all shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_rgba(124,58,237,0.1)] overflow-hidden group flex flex-col scroll-mt-32">
                    <div className={`h-48 flex items-center justify-center text-8xl bg-gradient-to-br ${c.color} relative overflow-hidden`}>
                      <span className={`absolute top-8 left-8 px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm ${c.tagColor}`}>{c.tag}</span>
                      {c.icon}
                    </div>
                    <div className="p-12 flex-grow flex flex-col">
                      <h3 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tighter mb-6 leading-tight group-hover:text-purple-600 transition-colors">{c.title}</h3>
                      <p className="text-neutral-400 text-base leading-relaxed mb-10 line-clamp-2">{c.desc}</p>
                      
                      {c.isPerSubject && (
                        <div className="mb-10">
                          <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">বিষয় বেছে নাও:</div>
                          <div className="flex flex-wrap gap-2">
                            {['পদার্থ', 'রসায়ন', 'গণিত', 'জীববিজ্ঞান', 'আইসিটি'].map(s => (
                              <span key={s} className="px-3 py-1.5 bg-purple-50 text-[10px] font-bold text-purple-600 rounded-lg cursor-pointer hover:bg-purple-600 hover:text-white transition-colors">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col space-y-3 mb-12">
                         <span className="flex items-center px-4 py-2 bg-neutral-50 rounded-xl text-[10px] font-black text-neutral-500 uppercase tracking-widest"><Timer className="h-3.5 w-3.5 mr-2 text-purple-600" /> {c.time}</span>
                         <span className="flex items-center px-4 py-2 bg-neutral-50 rounded-xl text-[10px] font-black text-neutral-500 uppercase tracking-widest"><Users className="h-3.5 w-3.5 mr-2 text-blue-600" /> {c.mode}</span>
                      </div>

                      <div className="mt-auto pt-10 border-t border-neutral-100 flex items-center justify-between">
                        <div>
                          {c.priceOffline && c.priceOnline ? (
                            <div className="space-y-1">
                              <div className="text-2xl font-black text-[#1e1b4b] font-display flex items-baseline">
                                <span className="text-[10px] text-neutral-400 mr-3 uppercase tracking-widest w-16 shrink-0 text-left">অফলাইন</span> ৳{c.priceOffline}
                              </div>
                              <div className="text-2xl font-black text-purple-600 font-display flex items-baseline">
                                <span className="text-[10px] text-neutral-400 mr-3 uppercase tracking-widest w-16 shrink-0 text-left">অনলাইন</span> ৳{c.priceOnline}
                              </div>
                            </div>
                          ) : (
                            <div className="text-3xl font-black text-[#1e1b4b] font-display">৳{c.price}</div>
                          )}
                          <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
                            {c.isPerSubject ? (c.isMonthly ? 'প্রতি বিষয় (মাসিক)' : 'ভর্তির পর বিষয় পছন্দ করো') : 'পূর্ণাঙ্গ কোর্স'}
                          </div>
                        </div>
                        <Link to="/register" className="px-10 py-4 bg-purple-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-purple-700 shadow-xl shadow-purple-600/20 transition-all">ভর্তি হন</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES / WHY US ── */}
      <section id="features" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            {/* Left Graphics */}
            <div className="bg-gradient-to-br from-[#7c3aed] to-[#2563eb] rounded-[5rem] p-16 relative overflow-hidden shadow-3xl">
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-400/20 rounded-full blur-[140px]"></div>
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-[140px]"></div>
              
              <div className="grid grid-cols-2 gap-8 relative z-10">
                {[
                  { n: '৫০০+', l: 'সফল শিক্ষার্থী', i: '👨‍🎓' },
                  { n: '৯৮%', l: 'সাফল্যের হার', i: '🏆' },
                  { n: '২০+', l: 'বিশেষজ্ঞ শিক্ষক', i: '🏢' },
                  { n: '৩+', l: 'বছরের অভিজ্ঞতা', i: '⏳' }
                ].map((s, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-3xl border border-white/20 p-10 rounded-[3.5rem] text-center"
                  >
                    <div className="text-5xl mb-6">{s.i}</div>
                    <div className="text-4xl font-black text-amber-400 font-display mb-2">{s.n}</div>
                    <div className="text-[10px] text-white/70 font-black uppercase tracking-widest leading-none">{s.l}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Content */}
            <div>
              <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-blue-100 rounded-full border border-blue-200 text-blue-600 font-display font-bold text-[10px] uppercase tracking-[0.2em] mb-10">
                <span>✦ কেন PB ACADEMIA?</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-display font-black text-[#1e1b4b] uppercase tracking-tighter leading-[0.9] mb-10">
                বাংলাদেশে <span className="text-purple-600">সেরা</span> ভর্তি কোচিং
              </h2>
              <p className="text-neutral-500 text-xl font-medium leading-relaxed mb-16 max-w-xl">
                আমরা শুধু পড়াই না — প্রতিটি শিক্ষার্থীর স্বপ্নকে বাস্তবে রূপ দিতে 
                আধুনিক প্রযুক্তি ও অভিজ্ঞতার সমন্বয়ে কাজ করি।
              </p>
              
              <div className="space-y-12">
                {[
                  { title: "বিশ্ববিদ্যালয় উত্তীর্ণ মেধাবী শিক্ষকমণ্ডলী", desc: "ঢাবি, বুয়েট ও মেডিকেলে পড়া শিক্ষকরা — যাঁরা নিজেরাই সেরা ছিলেন।", icon: <GraduationCap className="h-8 w-8" />, color: "bg-purple-100 text-purple-600" },
                  { title: "নিয়মিত মক টেস্ট ও বিস্তারিত ফিডব্যাক", desc: "সাপ্তাহিক মক টেস্ট, ভুল বিশ্লেষণ ও বিস্তারিত পারফরম্যান্স রিপোর্ট।", icon: <Trophy className="h-8 w-8" />, color: "bg-blue-100 text-blue-600" },
                  { title: "অনলাইন ও অফলাইন উভয় পদ্ধতি", desc: "লাইভ ক্লাস, রেকর্ডেড ভিডিও ও অ্যাপ — যেকোনো জায়গা থেকে পড়ার সুযোগ।", icon: <Zap className="h-8 w-8" />, color: "bg-amber-100 text-amber-700" },
                  { title: "সাশ্রয়ী মূল্য ও বৃত্তির সুবিধা", desc: "মেধাভিত্তিক বৃত্তি ও অসচ্ছল মেধাবীদের জন্য বিশেষ ছাড়ের ব্যবস্থা।", icon: <ShieldCheck className="h-8 w-8" />, color: "bg-emerald-100 text-emerald-600" }
                ].map((f, i) => (
                  <div key={i} className="flex space-x-10 group">
                    <div className={`${f.color} h-20 w-20 rounded-3xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform group-hover:rotate-6`}>
                      {f.icon}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tighter mb-3 leading-none">{f.title}</h4>
                      <p className="text-neutral-400 text-base leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEACHERS ── */}
      <section id="teachers" className="py-40 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32">
            <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-purple-100 rounded-full border border-purple-200 text-purple-600 font-display font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
              <span>✦ আমাদের শিক্ষকমণ্ডলী</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-[#1e1b4b] uppercase tracking-tighter leading-tight">
              বিশেষজ্ঞ ও <span className="text-purple-600">অনুপ্রেরণাদায়ী</span> শিক্ষকগণ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {mentors.map((mentor, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="bg-white p-12 rounded-[4rem] border-2 border-neutral-100 hover:border-purple-200 transition-colors text-center shadow-xl group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -z-10"></div>
                
                <div className="relative mb-10 flex justify-center">
                  <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="h-40 w-40 rounded-full border-8 border-white shadow-2xl relative z-10 overflow-hidden outline outline-2 outline-neutral-100 group-hover:outline-purple-200 transition-all">
                    <img src={mentor.img} alt={mentor.name} className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all scale-110 group-hover:scale-100 duration-700 ${mentor.pos}`} />
                  </div>
                </div>

                <h4 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tighter mb-3 leading-none">{mentor.name}</h4>
                <div className="text-purple-600 font-black uppercase tracking-widest text-xs mb-4">{mentor.role.split(': ')[1]}</div>
                <div className="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mb-10 italic">{mentor.uni} • {mentor.exp}</div>
                
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-5 py-2 bg-purple-50 text-purple-600 text-[9px] font-black uppercase tracking-widest rounded-xl">ঢাবি ভর্তি</span>
                  <span className="px-5 py-2 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-xl">ইঞ্জিনিয়ারিং</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAMPUS SHOWCASE ── */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="lg:grid lg:grid-cols-2 gap-24 items-center">
             <div>
                <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-neutral-100 rounded-full border border-neutral-200 text-neutral-600 font-display font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
                  <span>✦ আমাদের ক্যাম্পাস</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-black text-[#1e1b4b] uppercase tracking-tighter leading-tight mb-10">
                  পড়াশোনার <span className="text-blue-600">সেরা</span> পরিবেশ
                </h2>
                <p className="text-neutral-500 text-xl font-medium leading-relaxed mb-12">
                  আমাদের ক্যাম্পাসটি শীতাতপ নিয়ন্ত্রিত এবং আধুনিক শিক্ষা উপকরণে সজ্জিত। ১২ গ্রীন কর্নার, ঢাকা-১২০৫ লোকেশনে অবস্থিত আমাদের এই ক্যাম্পাসটি শিক্ষার্থীদের জন্য নিরাপদ ও পড়াশোনার উপযুক্ত পরিবেশ নিশ্চিত করে।
                </p>
                <Link to="/register" className="inline-flex items-center px-10 py-5 bg-[#1e1b4b] text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-neutral-800 transition-all">
                   ক্যাম্পাস ভিজিট করুন <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
             </div>
             <div className="mt-16 lg:mt-0 relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative rounded-[5rem] overflow-hidden shadow-3xl border-8 border-white">
                   <img 
                     src="https://i.ibb.co.com/xK0kjbwG/Gemini-Generated-Image-3drk3j3drk3j3drk-1.png" 
                     className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-1000" 
                     alt="Campus Life" 
                   />
                   <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] text-white">
                      <div className="text-lg font-black uppercase tracking-widest leading-none mb-2 italic">Green Corner Campus</div>
                      <div className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Dhaka-1205, Bangladesh</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ... */}
      <section className="py-40 bg-gradient-to-br from-[#1e1b4b] to-[#7c3aed] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[length:32px_32px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-32">
            <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-amber-500/20 backdrop-blur-md rounded-full border border-amber-500/30 text-amber-400 font-display font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
              <span>✦ সাফল্যের গল্প</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-tight">
              আমাদের শিক্ষার্থীদের <span className="text-amber-400">অনুভূতি</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { q: "ক্লাস ৯-এর বিজ্ঞান বিভাগের বিষয়গুলো নিয়ে আমার ভয় ছিল, কিন্তু PB Academia-র মেন্টরদের কারণে ফিজিক্স ও ম্যাথ এখন আমার প্রিয় বিষয়। রেজাল্টও আগের চেয়ে অনেক ভালো!", a: "সামিয়া রহমান", n: "সা", i: "ক্লাস ১০ (বিজ্ঞান) • ভিকারুননিসা", grad: "from-amber-400 to-amber-200" },
              { q: "৮ম শ্রেণীর ফাউন্ডেশন কোর্সটি আমার বেসিক অনেক স্ট্রং করে দিয়েছে। বিশেষ করে ম্যাথ ও ইংলিশের শর্টকাট টেকনিকগুলো অসাধারণ। অনলাইন ক্লাসেও অফলাইনের অনুভূতি পাই।", a: "আফিফ ইত্তেহাদ", n: "আ", i: "ক্লাস ৮ • রাজউক উত্তরা", grad: "from-blue-400 to-blue-200" },
              { q: "SSC প্রস্তুতির সময় বিজিএস ও আইসিটি নিয়ে চিন্তায় ছিলাম। PB Academia-র গাইডলাইন ও নোটগুলো পরীক্ষার আগের রাতে অনেক সাহায্য করেছে। A+ পাওয়া এখন সহজ মনে হচ্ছে।", a: "নুসরাত জাহান", n: "নু", i: "SSC পরীক্ষার্থী • হলিক্রস", grad: "from-pink-400 to-pink-200" }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-2xl border border-white/20 p-16 rounded-[4.5rem] hover:bg-white/15 transition-all shadow-2xl flex flex-col"
              >
                <div className="flex space-x-1.5 text-amber-400 mb-10">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400" />)}
                </div>
                <p className="text-white/80 text-xl font-medium leading-relaxed mb-16 italic">"{t.q}"</p>
                <div className="mt-auto flex items-center space-x-8">
                  <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center font-display font-black text-[#1e1b4b] text-2xl shadow-xl border-4 border-white/20`}>
                    {t.n}
                  </div>
                  <div>
                    <h5 className="text-white text-xl font-black uppercase tracking-tight leading-none mb-1.5">{t.a}</h5>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest tracking-[0.2em]">{t.i}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY CARDS (QUIZBLUST / BRAIN TEASERS) ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-indigo-950 to-blue-900 rounded-[4rem] p-16 relative overflow-hidden group border border-white/10 shadow-3xl"
            >
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-500/20 rounded-full border border-blue-500/30 text-blue-300 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
                  <span>নতুন ফিচার</span>
                </div>
                <h3 className="text-5xl font-display font-black text-white uppercase tracking-tighter mb-4">QUIZ<span className="text-blue-500">BLUST</span></h3>
                <p className="text-blue-100/70 font-medium text-xl leading-relaxed max-w-sm">কুইজব্লাস্ট: ক্লাস ৮ এর বন্ধুদের জন্য একদম ফ্রি সব এক্সাম সলভ ব্যাচ! আজই জয়েন করো।</p>
                <Link to="/quizblust" className="inline-flex items-center mt-12 px-10 py-5 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-blue-500 transition-all group-hover:shadow-blue-500/40">
                   ফ্রি জয়েন করো <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </div>
              <Rocket className="h-64 w-64 text-white/5 absolute -bottom-16 -right-16 rotate-12 transition-transform group-hover:translate-x-4 group-hover:-translate-y-4 duration-1000" />
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-950 to-indigo-900 rounded-[4rem] p-16 relative overflow-hidden group border border-white/10 shadow-3xl"
            >
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
                  <span>ফ্রি অ্যাক্সেস</span>
                </div>
                <h3 className="text-5xl font-display font-black text-white uppercase tracking-tighter mb-4">BRAIN <span className="text-purple-500">TEASERS</span></h3>
                <p className="text-purple-100/70 font-medium text-xl leading-relaxed max-w-sm">মজাদার আইকিউ প্রশ্ন ও ধাঁধার মাধ্যমে নিজেকে ঝালিয়ে নাও এবং মস্তিষ্কের কার্যক্ষমতা বাড়াও।</p>
                <Link to="/brain-teasers" className="inline-flex items-center mt-12 px-10 py-5 bg-purple-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-purple-500 transition-all group-hover:shadow-purple-500/40">
                   সমাধান শুরু করো <Brain className="ml-3 h-4 w-4" />
                </Link>
              </div>
              <Brain className="h-64 w-64 text-white/5 absolute -bottom-16 -right-16 -rotate-12 transition-transform group-hover:-translate-x-4 group-hover:-translate-y-4 duration-1000" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32">
            <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-amber-100 rounded-full border border-amber-200 text-amber-700 font-display font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
              <span>✦ যোগাযোগ করো</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-[#1e1b4b] uppercase tracking-tighter leading-tight">
              আমাদের সাথে <span className="text-purple-600">কথা বলো</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-32 items-start">
            {/* Info */}
            <div className="space-y-16">
              <div className="flex space-x-10 group">
                <div className="h-20 w-20 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <MapPin className="h-10 w-10" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tighter mb-3 leading-none">ক্যাম্পাস লোকেশন</h4>
                  <p className="text-neutral-500 text-lg leading-relaxed font-medium">১২ গ্রীন কর্নার, ঢাকা-১২০৫ (ইমানুয়েল ব্যাপ্টিস্ট চার্চের বিপরীতে)</p>
                  <a href="https://www.google.com/maps/search/12+Green+Corner,+Dhaka-1205" target="_blank" rel="noreferrer" className="inline-flex items-center mt-6 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline">Google Maps-এ দেখুন <ArrowRight className="ml-2 h-3.5 w-3.5" /></a>
                </div>
              </div>

              <div className="flex space-x-10 group">
                <div className="h-20 w-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <Phone className="h-10 w-10" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tighter mb-3 leading-none">হেল্পলাইন ডেস্ক</h4>
                  <p className="text-neutral-500 text-2xl font-display font-black tracking-widest leading-none">+880 1784-323041</p>
                  <p className="text-neutral-400 text-[9px] font-bold uppercase tracking-widest mt-3 italic">শনি-বৃহস্পতি: সকাল ১০টা - রাত ৯টা</p>
                </div>
              </div>

              <div className="flex space-x-10 group">
                <div className="h-20 w-20 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <Mail className="h-10 w-10" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-[#1e1b4b] uppercase tracking-tighter mb-3 leading-none">ইমেইল সাপোর্ট</h4>
                  <p className="text-neutral-500 text-lg font-medium">admin@pbacademia.top</p>
                  <p className="text-neutral-500 text-lg font-medium">pbacademia25@gmail.com</p>
                </div>
              </div>

              <div className="flex space-x-6 pt-16 border-t border-neutral-100">
                 <a href="https://www.facebook.com/profile.php?id=61584555539761" target="_blank" rel="noreferrer" className="h-14 w-14 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 hover:bg-blue-600 hover:text-white transition-colors shadow-sm"><Facebook className="h-6 w-6" /></a>
                 <a href="https://www.youtube.com/@PBAcademia" target="_blank" rel="noreferrer" className="h-14 w-14 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 hover:bg-red-600 hover:text-white transition-colors shadow-sm"><Youtube className="h-6 w-6" /></a>
                 <a href="https://www.instagram.com/pb_academia" target="_blank" rel="noreferrer" className="h-14 w-14 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 hover:bg-pink-600 hover:text-white transition-colors shadow-sm"><Instagram className="h-6 w-6" /></a>
              </div>
            </div>

            {/* Form */}
            <div className="bg-[#fafafa] p-16 rounded-[5rem] border-2 border-neutral-100 shadow-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-[80px]"></div>
               <h3 className="text-3xl font-black text-[#1e1b4b] uppercase tracking-tighter mb-12 flex items-center italic">ভর্তির আবেদন করুন ✍️</h3>
               <div className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#1e1b4b] uppercase tracking-widest ml-5">পূর্ণ নাম *</label>
                       <input type="text" placeholder="তোমার নাম" className="w-full h-16 px-8 rounded-3xl bg-white border-2 border-neutral-100 outline-none focus:border-purple-600 transition-all font-bold text-base shadow-sm" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-[#1e1b4b] uppercase tracking-widest ml-5">মোবাইল নম্বর *</label>
                       <input type="tel" placeholder="+880" className="w-full h-16 px-8 rounded-3xl bg-white border-2 border-neutral-100 outline-none focus:border-purple-600 transition-all font-bold text-base shadow-sm" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#1e1b4b] uppercase tracking-widest ml-5">আগ্রহী কোর্স *</label>
                    <select className="w-full h-16 px-8 rounded-3xl bg-white border-2 border-neutral-100 outline-none focus:border-purple-600 transition-all font-bold text-base shadow-sm appearance-none cursor-pointer">
                       <option>কোর্স বেছে নাও</option>
                       <option>ঢাকা বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি</option>
                       <option>BUET কোচিং</option>
                       <option>মেডিকেল কোচিং</option>
                       <option>অনলাইন ব্যাচ</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#1e1b4b] uppercase tracking-widest ml-5">বার্তা / প্রশ্ন</label>
                    <textarea placeholder="কিভাবে সাহায্য করতে পারি?" className="w-full h-40 p-8 rounded-[2.5rem] bg-white border-2 border-neutral-100 outline-none focus:border-purple-600 transition-all font-bold text-base shadow-sm resize-none"></textarea>
                  </div>
                  <button className="w-full py-6 bg-purple-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all">আবেদন পাঠাও →</button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEW SUBMISSION SECTION ── */}
      <section className="bg-[#1e1b4b] py-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h3 className="text-4xl font-display font-black text-amber-400 uppercase tracking-tighter mb-6">রিভিউ দিন 📝</h3>
            <p className="text-white/60 font-medium mb-12">আপনার মূল্যবান মতামত আমাদের অনুপ্রাণিত করে।</p>
            
            <form className="bg-white/5 backdrop-blur-xl p-12 md:p-16 rounded-[4rem] border border-white/10 shadow-3xl space-y-8" onSubmit={(e) => { e.preventDefault(); alert('ধন্যবাদ! আপনার রিভিউটি pbacademia25@gmail.com এ পাঠানো হয়েছে।'); }}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input type="text" placeholder="তোমার নাম" required className="w-full h-16 px-8 rounded-3xl bg-white/5 border border-white/10 outline-none focus:border-amber-400 transition-all font-bold text-base text-white placeholder:text-white/20" />
                  <input type="text" placeholder="তোমার স্কুল/কলেজ" required className="w-full h-16 px-8 rounded-3xl bg-white/5 border border-white/10 outline-none focus:border-amber-400 transition-all font-bold text-base text-white placeholder:text-white/20" />
               </div>
               <div className="flex justify-center space-x-2 text-white/20">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-8 w-8 cursor-pointer hover:text-amber-400 transition-colors" />
                  ))}
               </div>
               <textarea placeholder="মতামত লিখুন..." required className="w-full h-40 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 outline-none focus:border-amber-400 transition-all font-bold text-base text-white placeholder:text-white/20 resize-none"></textarea>
               <button type="submit" className="px-12 py-5 bg-amber-500 text-[#1e1b4b] rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-amber-500/20 hover:scale-105 transition-all">সাবমিট করুন</button>
            </form>
        </div>
      </section>
    </div>
  );
}
