import React, { useState, useRef } from 'react';
import { ArrowLeft, Save, Sparkles, Lock, Image as ImageIcon, CheckCircle2, MessageSquare, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateContent } from '../../lib/gemini';

export default function SocialPostWriter() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Gen Z / Trendy');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ caption: string, hashtags: string[] }[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms = [
    { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-500' },
    { name: 'Twitter / X', icon: Twitter, color: 'text-sky-400' },
    { name: 'Facebook', icon: Facebook, color: 'text-blue-600' }
  ];

  const tones = ['Gen Z / Trendy', 'Professional', 'Funny / Witty', 'Inspirational', 'Casual', 'Aesthetic'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCaptions = async () => {
    if (!prompt.trim() && !imageFile) return;
    setLoading(true);
    setResults([]);
    try {
      let contents: any[] = [];
      let fullPrompt = `You are an expert Social Media Manager and Copywriter. Create 3 distinct social media captions for ${platform}. The tone should be "${tone}". `;
      
      if (prompt) {
         fullPrompt += `\nTopic/Details: ${prompt}\n`;
      }
      if (imageFile) {
         // Prepare image base64
         const base64String = imagePreview?.split(',')[1];
         if (base64String) {
           fullPrompt += `\nAlso base the captions accurately on the visual contents of the attached image.`;
           contents = [
             {
               role: 'user',
               parts: [
                 { text: fullPrompt },
                 {
                   inlineData: {
                     mimeType: imageFile.type,
                     data: base64String
                   }
                 }
               ]
             }
           ];
         } else {
           contents = [{ role: 'user', parts: [{ text: fullPrompt }] }];
         }
      } else {
         contents = [{ role: 'user', parts: [{ text: fullPrompt }] }];
      }

      fullPrompt += `\nOutput strictly as a JSON array of 3 objects, each having "caption" (string) and "hashtags" (array of strings).`;

      const response = await generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                caption: { type: "STRING" },
                hashtags: { type: "ARRAY", items: { type: "STRING" } }
              },
              required: ['caption', 'hashtags']
            }
          }
        }
      });
      const data = JSON.parse(response.text?.trim() || '[]');
      setResults(data);
    } catch (e: any) {
      console.error(e);
      alert('Error generating post: ' + (e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-neutral-900 font-sans">
      
      {/* Header matching a premium SaaS tool look */}
      <div className="bg-white border-b border-neutral-200 py-6 px-6 sm:px-12 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
             <button onClick={() => navigate('/')} className="text-neutral-500 hover:text-black mr-6 transition-colors">
               <ArrowLeft size={20} />
             </button>
             <h1 className="text-2xl font-black tracking-tight text-slate-800 flex items-center">
                <Sparkles className="text-indigo-600 mr-2" size={24}/> AI Post Generator
             </h1>
          </div>
          <button 
            onClick={() => setShowPremiumModal(true)}
            className="hidden sm:flex bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors items-center"
          >
            <Save size={16} className="mr-2 text-slate-500" /> Save Drafts
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Editor Settings (Left Column) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Social Platform</h3>
            <div className="grid grid-cols-2 gap-3">
               {platforms.map(p => (
                 <button
                   key={p.name}
                   onClick={() => setPlatform(p.name)}
                   className={`flex items-center p-3 rounded-xl border ${platform === p.name ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-neutral-200 hover:border-indigo-300 hover:bg-slate-50'} transition-all`}
                 >
                   <p.icon size={18} className={`${p.color} mr-2`} />
                   <span className={`text-sm font-semibold ${platform === p.name ? 'text-indigo-900' : 'text-slate-600'}`}>{p.name}</span>
                 </button>
               ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Voice & Tone</h3>
            <div className="flex flex-wrap gap-2">
              {tones.map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${tone === t ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Main Input & Output (Right Column) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
              <h2 className="text-xl font-bold text-slate-800 mb-2">What is your post about?</h2>
              <p className="text-sm text-slate-500 mb-6">Elaborate on the details or drop a photo and let our AI do the magic.</p>
              
              <textarea
                className="w-full min-h-[150px] p-4 bg-slate-50 border border-neutral-200 rounded-xl resize-y outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-700 text-base"
                placeholder="E.g. A new product launch for our coffee brand. It's organic and sourced from Colombia..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <div className="mt-4">
                 <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                 {imagePreview ? (
                    <div className="relative inline-block mt-2">
                       <img src={imagePreview} alt="Upload" className="h-32 object-cover rounded-xl border border-neutral-200 shadow-sm" />
                       <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-white text-slate-800 rounded-full w-6 h-6 flex items-center justify-center shadow-md border border-neutral-200 hover:bg-slate-100">×</button>
                    </div>
                 ) : (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-fit border border-indigo-100"
                    >
                      <ImageIcon size={16} className="mr-2" /> Add Image Context
                    </button>
                 )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={generateCaptions}
                  disabled={loading || (!prompt && !imageFile)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl disabled:opacity-50 transition-colors flex items-center shadow-md"
                >
                  {loading ? 'Generating Magic...' : 'Generate Valid Captions'} <Sparkles size={16} className="ml-2" />
                </button>
              </div>
           </div>

           {/* Results Area */}
           {(loading || results.length > 0) && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <CheckCircle2 className="text-emerald-500 mr-2" size={20}/> Top Results for {platform}
                </h3>
                
                {loading ? (
                   <div className="flex flex-col space-y-4">
                      {[1, 2, 3].map(i => (
                         <div key={i} className="animate-pulse bg-slate-50 p-6 rounded-xl border border-neutral-100">
                           <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                           <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                           <div className="h-3 bg-indigo-100 rounded w-1/4"></div>
                         </div>
                      ))}
                   </div>
                ) : (
                   <div className="flex flex-col space-y-6">
                      {results.map((res, i) => (
                         <div key={i} className="bg-white hover:bg-slate-50 p-6 rounded-xl border border-neutral-200 shadow-sm transition-all group relative">
                           <button 
                             onClick={() => navigator.clipboard.writeText(`${res.caption}\n\n${res.hashtags.join(' ')}`)}
                             className="absolute top-4 right-4 text-xs font-bold bg-white border border-neutral-200 text-slate-600 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-slate-50"
                           >
                             Copy
                           </button>
                           <p className="text-slate-700 whitespace-pre-wrap text-base leading-relaxed mb-4">{res.caption}</p>
                           <div className="flex flex-wrap gap-1.5 mt-auto">
                              {res.hashtags.map((tag, j) => (
                                 <span key={j} className="text-sm font-semibold text-indigo-600">
                                   {tag.startsWith('#') ? tag : `#${tag}`}
                                 </span>
                              ))}
                           </div>
                         </div>
                      ))}
                   </div>
                )}
              </div>
           )}

        </div>
      </div>

       {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-neutral-200 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl relative">
            <button onClick={() => setShowPremiumModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">×</button>
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-slate-800 mb-2">Upgrade to Save</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Saving drafts, history, and scheduled posts requires an active course subscription.</p>
            <button onClick={() => navigate('/courses')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md shadow-indigo-600/20">
              Explore Courses
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
