import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, BookOpen, ChevronRight, Menu, Home, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const curriculumData = [
  {
    class: 'Class 8',
    topics: [
      { name: 'Linear Equation', latex: 'y = 2x + 3' },
      { name: 'Linear Pair', latex: ['x + y = 5', 'x - y = 1'] }
    ]
  },
  {
    class: 'Class 9-10',
    topics: [
      { name: 'Quadratic Equation', latex: 'y = x^2 - 5x + 6' },
      { name: 'Circle', latex: 'x^2 + y^2 = 25' },
      { name: 'Sine Wave', latex: 'y = \\sin(x)' },
      { name: 'Cosine Wave', latex: 'y = \\cos(x)' }
    ]
  },
  {
    class: 'Class 11-12',
    topics: [
      { name: 'Parabola', latex: 'y^2 = 12x' },
      { name: 'Ellipse', latex: '\\frac{x^2}{16} + \\frac{y^2}{9} = 1' },
      { name: 'Hyperbola', latex: '\\frac{x^2}{16} - \\frac{y^2}{9} = 1' },
      { name: 'Exponential Function', latex: 'y = e^x' },
      { name: 'Logarithmic Function', latex: 'y = \\ln(x)' }
    ]
  }
];

export default function GraphCalculator() {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [calculator, setCalculator] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let calcInstance: any = null;

    const initDesmos = () => {
      if (calculatorRef.current && (window as any).Desmos) {
        // Clear container to prevent duplicate instances
        calculatorRef.current.innerHTML = '';
        calcInstance = (window as any).Desmos.GraphingCalculator(calculatorRef.current, {
          expressions: true,
          settingsMenu: true,
          zoomButtons: true,
        });
        setCalculator(calcInstance);
      }
    };

    if ((window as any).Desmos) {
      initDesmos();
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
      script.async = true;
      script.onload = initDesmos;
      document.head.appendChild(script);
    }

    return () => {
      if (calcInstance) {
        calcInstance.destroy();
      }
    };
  }, []);

  const loadEquation = (latex: string | string[]) => {
    if (!calculator) return;
    
    // Clear current expressions
    calculator.setBlank();

    if (Array.isArray(latex)) {
      latex.forEach((expr, index) => {
        calculator.setExpression({ id: `expr-${index}`, latex: expr });
      });
    } else {
      calculator.setExpression({ id: 'expr-0', latex });
    }
    
    // On mobile, close sidebar after Selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    // Aggressive DOM removal for desmos branding as a fallback
    const interval = setInterval(() => {
      const selectors = [
        '.dcg-powered-by', 
        '.dcg-logo', 
        '.dcg-bottom-right-container a',
        '.dcg-branding'
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
           el.remove();
        });
      });
      
      // Check if keypad is visible
      const keypad = document.querySelector('.dcg-keypad');
      if (keypad) {
        const style = window.getComputedStyle(keypad);
        if (style.display !== 'none' && keypad.clientHeight > 0 && style.visibility !== 'hidden') {
          setIsKeypadOpen(true);
        } else {
          setIsKeypadOpen(false);
        }
      } else {
        setIsKeypadOpen(false);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#050505] text-white">
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden absolute inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, x: -320 }}
              animate={{ width: 320, x: 0 }}
              exit={{ width: 0, x: -320 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute md:relative z-50 h-full border-r border-white/5 bg-brand-dark/95 backdrop-blur-xl md:bg-brand-dark overflow-hidden flex flex-col flex-shrink-0"
            >
              <div className="p-6 overflow-y-auto flex-1 w-80">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-brand-primary/10 rounded-xl">
                      <Calculator className="w-6 h-6 text-brand-primary" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-widest text-white">Graph Lab</h2>
                  </div>
                  <button className="md:hidden p-2 text-neutral-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
                    <X className="w-5 h-5"/>
                  </button>
                </div>

                <div className="mb-8">
                  <select 
                    value="/graph-calculator"
                    onChange={(e) => navigate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm font-bold uppercase tracking-widest text-brand-secondary focus:border-brand-primary shadow-inner outline-none appearance-none"
                  >
                    <option className="text-neutral-900" value="/graph-calculator">Graph Calculator</option>
                    <option className="text-neutral-900" value="/scientific-calculator">Scientific Calculator</option>
                    <option className="text-neutral-900" value="/3d-shapes">3D Constructor</option>
                    <option className="text-neutral-900" value="/circuit-simulator">Circuit Simulator</option>
                  </select>
                </div>
                
                <div className="space-y-6">
                  {curriculumData.map((cls, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-center space-x-2 text-brand-secondary">
                        <BookOpen className="w-4 h-4" />
                        <h3 className="font-bold tracking-widest uppercase text-sm">{cls.class} (BD)</h3>
                      </div>
                      <div className="space-y-2">
                        {cls.topics.map((topic, i) => (
                          <button
                            key={i}
                            onClick={() => loadEquation(topic.latex)}
                            className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-brand-primary/10 border border-white/5 hover:border-brand-primary/30 transition-all flex items-center justify-between group"
                          >
                            <span className="text-sm font-medium text-neutral-300 group-hover:text-white">{topic.name}</span>
                            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-brand-primary" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 relative bg-white flex flex-col">
          {/* Controls designed to cover any remaining desmos logo next to keyboard */}
          <div className={`absolute bottom-1.5 left-[60px] z-[9999] flex items-center space-x-2 bg-white px-2 py-1.5 rounded-xl shadow-[0_0_15px_15px_white] transition-opacity duration-300 ${isKeypadOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-brand-dark text-white p-2.5 rounded-xl shadow-lg hover:bg-brand-dark/80 transition-colors border border-white/10"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-brand-primary text-white p-2.5 rounded-xl shadow-lg hover:bg-brand-primary/80 transition-colors flex items-center space-x-2 border border-brand-primary/50"
              title="Back to Home"
            >
              <Home className="w-5 h-5" />
            </button>
            <div className="pl-4 pr-6 pb-1 pt-1 font-display font-black text-2xl tracking-tighter text-[#222] select-none bg-white">
              PB ACADEMIA
            </div>
          </div>

          <div ref={calculatorRef} className="flex-1 relative graph-container-override" />
          
          {/* Custom branding overlay */}
          <div className={`absolute left-1/2 bottom-2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-4 z-50 text-[10px] font-black uppercase tracking-widest text-[#555] bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/50 shadow-sm pointer-events-none transition-opacity duration-300 ${isKeypadOpen ? 'opacity-0' : 'opacity-100'}`}>
            Powered by <span className="text-brand-primary">PORAR BOJHA</span>
          </div>
          
          <style>{`
            .dcg-branding,
            .dcg-powered-by,
            .dcg-action-link,
            .dcg-logo,
            .dcg-bottom-right-container a[href*="desmos"],
            .dcg-container .dcg-bottom-right-container,
            .dcg-container .dcg-branding-container {
              display: none !important;
              opacity: 0 !important;
              visibility: hidden !important;
              pointer-events: none !important;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
