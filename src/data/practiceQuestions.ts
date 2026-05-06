export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface PracticeSet {
  id: string;
  title: string;
  class: number;
  subject: string;
  questions: Question[];
  durationMinutes: number;
}

export const practiceSets: PracticeSet[] = [
  {
    id: 'class8-gen-science-1',
    title: 'সাধারণ বিজ্ঞান মডেল টেস্ট ১ (Class 8)',
    class: 8,
    subject: 'General Science',
    durationMinutes: 10,
    questions: [
      { id: 'q1', text: 'কোষের শক্তিঘর কোনটি?', options: ['নিউক্লিয়াস', 'মাইটোকন্ড্রিয়া', 'রাইবোজোম', 'গলজি বস্তু'], correctAnswer: 1 },
      { id: 'q2', text: 'নিচের কোনটি ধাতু?', options: ['অক্সিজেন', 'পারদ', 'কার্বন', 'নাইট্রোজেন'], correctAnswer: 1 },
      { id: 'q3', text: 'পানির স্ফুটনাঙ্ক কত?', options: ['৮০°C', '৯০°C', '১০০°C', '১২০°C'], correctAnswer: 2 },
      { id: 'q4', text: 'মানবদেহে কতটি হাড় থাকে?', options: ['১৮০', '২০৬', '২১০', '২৫০'], correctAnswer: 1 },
      { id: 'q5', text: 'আলোর প্রতিসরণের সূত্র কয়টি?', options: ['১টি', '২টি', '৩টি', '৪টি'], correctAnswer: 1 },
      { id: 'q6', text: 'সৌরজগতের ক্ষুদ্রতম গ্রহ কোনটি?', options: ['বুধ', 'শুক্র', 'মঙ্গল', 'পৃথিবী'], correctAnswer: 0 },
      { id: 'q7', text: 'আয়তনের দিক থেকে বড় কোনটি?', options: ['বৃস্পতি', 'শনি', 'নেপচুন', 'পৃথিবী'], correctAnswer: 0 },
      { id: 'q8', text: 'রক্তের গ্রুপ কয়টি?', options: ['২টি', '৪টি', '৬টি', '৮টি'], correctAnswer: 1 },
      { id: 'q9', text: 'মস্তিষ্কের ওজন কত?', options: ['১.৫ কেজি', '১ কেজি', '২ কেজি', '০.৫ কেজি'], correctAnswer: 0 },
      { id: 'q10', text: 'চোখের লেন্সের প্রকৃতি কেমন?', options: ['উত্তল', 'অবতল', 'সমতল', 'মিশ্র'], correctAnswer: 0 }
    ]
  },
  {
    id: 'class8-math-1',
    title: 'গণিত মডেল টেস্ট ১ (Class 8)',
    class: 8,
    subject: 'Mathematics',
    durationMinutes: 15,
    questions: [
      { id: 'm1', text: 'নিচের কোনটি অমূলদ সংখ্যা?', options: ['√৪', '√৯', '√২', '√১৬'], correctAnswer: 2 },
      { id: 'm2', text: 'বর্গের ক্ষেত্রফল ২৫ বর্গ সেমি হলে এর বাহুর দৈর্ঘ্য কত?', options: ['৫ সেমি', '√৫ সেমি', '১০ সেমি', '২৫ সেমি'], correctAnswer: 0 },
      { id: 'm3', text: '(a+b)² = ?', options: ['a²+b²', 'a²-2ab+b²', 'a²+2ab+b²', 'a²+2ab-b²'], correctAnswer: 2 },
      { id: 'm4', text: 'বৃত্তের কেন্দ্র থেকে পরিধির দূরত্বকে কী বলে?', options: ['ব্যাস', 'পেরিমিটার', 'ব্যাসার্ধ', 'জ্যা'], correctAnswer: 2 },
      { id: 'm5', text: 'যেকোনো ত্রিভুজের তিন কোণের সমষ্টি কত?', options: ['৯০°', '১৮০°', '৩৬০°', '২৭০°'], correctAnswer: 1 }
    ]
  },
  {
    id: 'ssc-phys-1',
    title: 'পদার্থবিজ্ঞান মডেল টেস্ট ১ (SSC)',
    class: 10,
    subject: 'Physics',
    durationMinutes: 15,
    questions: [
      { id: 'p1', text: 'বেগের পরিবর্তনের হারকে কী বলে?', options: ['সরণ', 'দ্রুতি', 'ত্বরণ', 'মন্দন'], correctAnswer: 2 },
      { id: 'p2', text: 'বলের একক কী?', options: ['জুল', 'ওয়াট', 'নিউটন', 'প্যাসকেল'], correctAnswer: 2 },
      { id: 'p3', text: 'কাজ করার সামর্থ্যকে কী বলে?', options: ['ক্ষমতা', 'শক্তি', 'বল', 'চাপ'], correctAnswer: 1 },
      { id: 'p4', text: 'গতিশক্তি Ek = ?', options: ['mv²', '½mv²', 'mgh', 'v/t'], correctAnswer: 1 },
      { id: 'p5', text: 'তাপমাত্রার SI একক কী?', options: ['সেলসিয়াস', 'ফারেনহাইট', 'কেলভিন', 'জুল'], correctAnswer: 2 }
    ]
  },
  {
    id: 'ssc-chem-1',
    title: 'রসায়ন মডেল টেস্ট ১ (SSC)',
    class: 10,
    subject: 'Chemistry',
    durationMinutes: 12,
    questions: [
      { id: 'c1', text: 'পানির অণুতে অক্সিজেনের যোজনী কত?', options: ['১', '২', '৩', '৪'], correctAnswer: 1 },
      { id: 'c2', text: 'সোডিয়ামের ল্যাটিন নাম কী?', options: ['Kalium', 'Natrium', 'Cuprum', 'Ferrum'], correctAnswer: 1 },
      { id: 'c3', text: 'পর্যায় সারণিতে গ্রুপের সংখ্যা কয়টি?', options: ['৭টি', '১৮টি', '১০টি', '৫টি'], correctAnswer: 1 },
      { id: 'c4', text: 'নিচের কোনটি নিষ্ক্রিয় গ্যাস?', options: ['হাইড্রোজেন', 'অক্সিজেন', 'হিলিয়াম', 'নাইট্রোজেন'], correctAnswer: 2 }
    ]
  },
  {
    id: 'class9-math-1',
    title: 'গণিত মডেল টেস্ট ১ (Class 9)',
    class: 9,
    subject: 'Mathematics',
    durationMinutes: 20,
    questions: [
      { id: 'gm1', text: 'sin²θ + cos²θ = ?', options: ['০', '১', '২', '৩'], correctAnswer: 1 },
      { id: 'gm2', text: 'তিনের ঘনমূল কোনটি?', options: ['√৩', '³√৩', '৯', '২৭'], correctAnswer: 1 },
      { id: 'gm3', text: 'লগারিদমের ভিত্তি ১০ হলে একে কী বলে?', options: ['স্বাভাবিক লগ', 'সাধারণ লগ', 'প্রাকৃতিক লগ', 'জটিল লগ'], correctAnswer: 1 },
      { id: 'gm4', text: 'বৃত্তের বৃহত্তম জ্যা কোনটি?', options: ['ব্যাসার্ধ', 'ব্যাস', 'চাপ', 'পরিধি'], correctAnswer: 1 }
    ]
  },
  {
    id: 'class8-bangla-1',
    title: 'বাংলা ভাষা ও সাহিত্য (Class 8)',
    class: 8,
    subject: 'Bangla',
    durationMinutes: 10,
    questions: [
      { id: 'b1', text: 'বাংলা ভাষার আদি উৎস কোনটি?', options: ['বৈদিক', 'প্রাকৃত', 'সংস্কৃত', 'ফারসি'], correctAnswer: 1 },
      { id: 'b2', text: 'বিদ্রোহী কবি কে?', options: ['রবীন্দ্রনাথ ঠাকুর', 'কাজী নজরুল ইসলাম', 'জসীমউদ্দীন', 'জীবনানন্দ দাশ'], correctAnswer: 1 },
      { id: 'b3', text: 'বাংলা বর্ণমালায় স্বরবর্ণ কয়টি?', options: ['৯টি', '১০টি', '১১টি', '১২টি'], correctAnswer: 2 }
    ]
  },
  {
    id: 'class8-ict-2',
    title: 'তথ্য ও যোগাযোগ প্রযুক্তি টেস্ট ২',
    class: 8,
    subject: 'ICT',
    durationMinutes: 10,
    questions: [
      { id: 'i1', text: 'RAM এর পূর্ণরূপ কী?', options: ['Random Access Memory', 'Read Access Memory', 'Rapid Access Memory', 'Run Access Memory'], correctAnswer: 0 },
      { id: 'i2', text: 'নিচের কোনটি আউটপুট ডিভাইস?', options: ['মাউস', 'কিবোর্ড', 'মনিটর', 'স্ক্যানার'], correctAnswer: 2 }
    ]
  },
  {
    id: 'class9-phys-2',
    title: 'Physics Chapter 1-2 (Class 9)',
    class: 9,
    subject: 'Physics',
    durationMinutes: 15,
    questions: [
      { id: 'ph1', text: 'নিচের কোনটি স্কেলার রাশি?', options: ['বেগ', 'বল', 'ত্বরণ', 'দ্রুতি'], correctAnswer: 3 },
      { id: 'ph2', text: 'সময়ের সাথে সরণের পরিবর্তনের হারকে কী বলে?', options: ['ত্বরণ', 'মন্দন', 'বেগ', 'দ্রুতি'], correctAnswer: 2 }
    ]
  },
  {
    id: 'class10-hmath-1',
    title: 'উচ্চতর গণিত ১ (SSC)',
    class: 10,
    subject: 'Higher Math',
    durationMinutes: 20,
    questions: [
      { id: 'hm1', text: '3x + 1 > 7 হলে x এর মান কত হবে?', options: ['x > 2', 'x < 2', 'x = 2', 'x > 3'], correctAnswer: 0 },
      { id: 'hm2', text: 'অসীমতক সমষ্টির সূত্র কোনটি?', options: ['S = a/(1-r)', 'S = a/(r-1)', 'S = n/2(a+l)', 'S = ar^n'], correctAnswer: 0 }
    ]
  },
  {
    id: 'class8-islam-1',
    title: 'ইসলাম ও নৈতিক শিক্ষা (Class 8)',
    class: 8,
    subject: 'Religion',
    durationMinutes: 10,
    questions: [
      { id: 'r1', text: 'আকাইদ শব্দের অর্থ কী?', options: ['বিশ্বাস', 'ইবাদত', 'আমল', 'তাকওয়া'], correctAnswer: 0 },
      { id: 'r2', text: 'কালেমা তাইয়্যেবা অর্থ কী?', options: ['পবিত্র বাক্য', 'সফল বাক্য', 'মহান বাক্য', 'সুন্দর বাক্য'], correctAnswer: 0 }
    ]
  },
  {
    id: 'class10-biology-2',
    title: 'Biology Chapter 4: Bioenergetics (SSC)',
    class: 10,
    subject: 'Biology',
    durationMinutes: 15,
    questions: [
      { id: 'b41', text: 'ATP এর পূর্ণরূপ কী?', options: ['Adenosine Triphosphate', 'Adenosine Diphosphate', 'Adenosine Monophosphate', 'Alanine Triphosphate'], correctAnswer: 0 },
      { id: 'b42', text: 'সালোকসংশ্লেষণ প্রক্রিয়ায় উপজাত হিসেবে কী নির্গত হয়?', options: ['CO2', 'O2', 'H2', 'N2'], correctAnswer: 1 }
    ]
  },
  {
    id: 'class9-gs-1',
    title: 'সাধারণ বিজ্ঞান মডেল টেস্ট ২ (Class 9)',
    class: 9,
    subject: 'General Science',
    durationMinutes: 12,
    questions: [
      { id: 'gs1', text: 'পানিতে দ্রবণীয় ভিটামিন কোনটি?', options: ['ভিটামিন A', 'ভিটামিন D', 'ভিটামিন C', 'ভিটামিন E'], correctAnswer: 2 },
      { id: 'gs2', text: 'বায়ুমণ্ডলে অক্সিজেনের পরিমাণ কত?', options: ['২১%', '৭৮%', '০.০৩%', '০.৯%'], correctAnswer: 0 }
    ]
  },
  {
    id: 'class10-ict-2',
    title: 'ICT Chapter 1-3 (SSC)',
    class: 10,
    subject: 'ICT',
    durationMinutes: 10,
    questions: [
      { id: 'i101', text: 'ই-লার্নিং এর পূর্ণরূপ কী?', options: ['Easy Learning', 'Electronic Learning', 'Effective Learning', 'Extra Learning'], correctAnswer: 1 },
      { id: 'i102', text: 'নিচের কোনটি সামাজিক যোগাযোগ মাধ্যম?', options: ['Google', 'Facebook', 'Yahoo', 'Bing'], correctAnswer: 1 }
    ]
  },
  {
    id: 'class8-bgs-1',
    title: 'বাংলাদেশ ও বিশ্বপরিচয় (Class 8)',
    class: 8,
    subject: 'BGS',
    durationMinutes: 10,
    questions: [
      { id: 'bgs1', text: 'মুক্তিযুদ্ধের সময় বাংলাদেশকে কয়টি সেক্টরে ভাগ করা হয়?', options: ['৯টি', '১০টি', '১১টি', '১২টি'], correctAnswer: 2 },
      { id: 'bgs2', text: 'মুজিবনগর সরকার কবে গঠিত হয়?', options: ['১০ এপ্রিল ১৯৭১', '১৭ এপ্রিল ১৯৭১', '২৫ মার্চ ১৯৭১', '১৬ ডিসেম্বর ১৯৭১'], correctAnswer: 0 }
    ]
  },
  {
    id: 'ssc-genmath-2',
    title: 'গণিত মডেল টেস্ট ২ (SSC)',
    class: 10,
    subject: 'Mathematics',
    durationMinutes: 20,
    questions: [
      { id: 'gm21', text: 'বর্গের চার কোণের সমষ্টি কত ডিগ্রী?', options: ['৯০', '১৮০', '২৭০', '৩৬০'], correctAnswer: 3 },
      { id: 'gm22', text: 'সমান্তর ধারার n-তম পদের সূত্র কী?', options: ['a+(n-1)d', 'a+nd', 'ar^(n-1)', 'n/2(2a+(n-1)d)'], correctAnswer: 0 }
    ]
  }
];
