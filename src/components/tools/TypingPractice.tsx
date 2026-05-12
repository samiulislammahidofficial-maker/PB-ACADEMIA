import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Keyboard, Award, Timer as TimerIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_WORDS = "the quick brown fox jumps over the lazy dog and a good student studies well to pass exams smart students prepare early for tests the future belongs to those who learn computer programming and software development requires typing skills problem solving ability algorithm efficiency data structures logic gates machine learning artificial intelligence web interfaces responsive design cloud computing secure networking database management performance optimization reactive frontend architecture scalable backend services".split(' ');

function generateWords(count: number) {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(DEFAULT_WORDS[Math.floor(Math.random() * DEFAULT_WORDS.length)]);
  }
  return words;
}

export default function TypingPractice() {
  const navigate = useNavigate();
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timerDuration, setTimerDuration] = useState(30);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Typing Dojo | PB Academia";
    resetTest();
  }, [timerDuration]);

  const resetTest = useCallback(() => {
    setTargetWords(generateWords(200));
    setUserInput('');
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setTimeElapsed(0);
    setWpm(0);
    setAccuracy(100);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (started && !finished) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime!) / 1000);
        if (elapsed >= timerDuration) {
          endTest(timerDuration);
        } else {
          setTimeElapsed(elapsed);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started, finished, startTime, timerDuration]);

  const endTest = (finalTimeElapsed: number) => {
    setFinished(true);
    const charsTyped = userInput.length;
    const wordsTyped = charsTyped / 5;
    const finalWpm = Math.round((wordsTyped / finalTimeElapsed) * 60);
    setWpm(finalWpm || 0);

    const targetText = targetWords.join(' ');
    let correct = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === targetText[i]) correct++;
    }
    const acc = charsTyped > 0 ? Math.round((correct / charsTyped) * 100) : 0;
    setAccuracy(acc);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    const val = e.target.value;
    if (!started && val.length > 0) {
      setStarted(true);
      setStartTime(Date.now());
    }
    setUserInput(val);
  };

  const targetText = targetWords.join(' ');

  const renderWords = () => {
    return targetText.split('').map((char, index) => {
      let colorClass = 'text-neutral-500'; // Upcoming
      if (index < userInput.length) {
        if (userInput[index] === char) {
          colorClass = 'text-white'; // Correct
        } else {
          colorClass = 'text-rose-500 bg-rose-500/20'; // Incorrect
        }
      } else if (index === userInput.length) {
        colorClass = 'border-l-2 border-brand-primary text-neutral-500 animate-pulse'; // Cursor
      }
      return (
        <span key={index} className={colorClass}>{char}</span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <header className="border-b border-white/5 bg-[#0a0a0a] p-6 lg:px-12 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate('/dashboard')} className="text-neutral-400 hover:text-white flex items-center uppercase tracking-widest text-xs font-black transition-colors">
            <ArrowLeft size={16} className="mr-2" /> EXIT
          </button>
          <div className="hidden sm:flex h-8 w-[1px] bg-white/10"></div>
          <h1 className="text-xl md:text-2xl font-display font-black uppercase tracking-tighter flex items-center">
            <Keyboard className="mr-3 text-pink-500" size={24} />
            Typing <span className="text-pink-500 ml-2">Dojo</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4 bg-white/5 p-1 rounded-lg">
          {[15, 30, 60].map(t => (
            <button 
              key={t}
              onClick={() => { setTimerDuration(t); }}
              className={`px-4 py-2 rounded-md text-xs font-black tracking-widest uppercase transition-colors ${timerDuration === t ? 'bg-pink-500 text-white' : 'text-neutral-500 hover:text-white'}`}
            >
              {t}s
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative max-w-5xl mx-auto w-full">
        
        {finished ? (
          <div className="w-full flex flex-col items-center bg-[#0a0a0a] border border-white/10 rounded-3xl p-12 shadow-2xl animate-in fade-in zoom-in duration-500">
             <Award className="text-yellow-500 mb-6" size={64} />
             <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 text-center">Practice Complete</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl mb-12">
               <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5">
                 <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2">Speed (WPM)</h3>
                 <p className="text-6xl font-black text-white">{wpm}</p>
               </div>
               <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5">
                 <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2">Accuracy</h3>
                 <p className="text-6xl font-black text-emerald-400">{accuracy}%</p>
               </div>
               <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5">
                 <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-2">Time</h3>
                 <p className="text-6xl font-black text-pink-500">{timerDuration}s</p>
               </div>
             </div>

             <button 
               onClick={resetTest}
               className="flex items-center space-x-3 bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors"
             >
               <RotateCcw size={20} />
               <span>Restart Test</span>
             </button>
          </div>
        ) : (
          <div className="w-full relative" onClick={() => inputRef.current?.focus()}>
            
            <div className="flex items-center justify-between mb-8 text-neutral-400 font-mono text-xl">
              <div className="flex items-center text-pink-500 font-bold">
                 <TimerIcon className="mr-2" size={24} />
                 {timerDuration - timeElapsed}s
              </div>
              {!started && <div className="text-xs font-bold uppercase tracking-widest animate-pulse">Start typing to begin</div>}
            </div>

            <div className="relative overflow-hidden h-40">
              <div className="text-3xl font-mono leading-relaxed tracking-wide select-none filter">
                {renderWords()}
              </div>
            </div>

            <input 
              ref={inputRef}
              type="text" 
              className="opacity-0 absolute top-0 left-0 w-full h-full pointer-events-none"
              value={userInput}
              onChange={handleInputChange}
              onBlur={() => {
                if(!finished) inputRef.current?.focus();
              }}
              autoFocus
            />

            <div className="mt-16 flex justify-center">
               <button 
                 onClick={resetTest}
                 className="flex items-center space-x-2 text-neutral-500 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors font-bold uppercase tracking-widest text-xs"
               >
                 <RotateCcw size={16} />
                 <span>Restart</span>
               </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
