import React, { useState } from 'react';
import { evaluate, complex, max, min, matrix, multiply, inv, det, add, subtract } from 'mathjs';
import { ArrowLeft, Home, Settings, Settings2, Calculator, Grid3x3, Sigma, FunctionSquare, LayoutGrid, XSquare, Variable, Activity, Hash, ArrowRightLeft, AlignJustify } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ScientificCalculator() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('Calculate');
  const [showHome, setShowHome] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [angleUnit, setAngleUnit] = useState('Deg'); // Deg or Rad

  // For specific modes
  const [eqType, setEqType] = useState('Simultaneous');
  const [polyDegree, setPolyDegree] = useState('2');
  const [simulVars, setSimulVars] = useState('2');

  const modes = [
    { name: 'Calculate', icon: Calculator },
    { name: 'Statistics', icon: Sigma },
    { name: 'Distribution', icon: Activity },
    { name: 'Spreadsheet', icon: LayoutGrid },
    { name: 'Table', icon: AlignJustify },
    { name: 'Equation', icon: FunctionSquare },
    { name: 'Inequality', icon: ArrowRightLeft },
    { name: 'Complex', icon: Hash },
    { name: 'Matrix', icon: Grid3x3 },
    { name: 'Vector', icon: ArrowRightLeft },
    { name: 'Base-N', icon: Hash },
    { name: 'Ratio', icon: Variable }
  ];

  const handlePress = (val: string) => {
    if (val === 'EXE') {
      try {
        let expr = display;
        if (angleUnit === 'Deg') {
          // A very basic replace for sin/cos/tan to evaluate in degrees
          expr = expr.replace(/sin\(/g, 'sin((pi/180)*');
          expr = expr.replace(/cos\(/g, 'cos((pi/180)*');
          expr = expr.replace(/tan\(/g, 'tan((pi/180)*');
        }
        
        let res = evaluate(expr);
        if (typeof res === 'number') {
          // Fix precision issues
          res = Number(res.toPrecision(13));
        }
        setResult(res.toString());
      } catch (e) {
        setResult('Syntax ERROR');
      }
    } else if (val === 'AC') {
      setDisplay('');
      setResult('');
    } else if (val === 'DEL') {
      setDisplay(prev => prev.slice(0, -1));
      setResult('');
    } else if (val === 'HOME') {
      setShowHome(!showHome);
    } else if (val === 'SETTINGS') {
      setSettingsOpen(!settingsOpen);
    } else {
      setDisplay(prev => prev + val);
      setResult('');
    }
  };

  const TopButton = ({ label, onClick, isSmall = false }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center group active:scale-95 transition-transform`}>
      <div className={`rounded-full bg-neutral-800 border-b-2 border-neutral-900 shadow-sm flex items-center justify-center text-white font-bold
        ${isSmall ? 'w-8 h-4' : 'w-10 h-6'}`}>
      </div>
      <span className="text-[8px] text-neutral-400 mt-1 font-bold group-hover:text-white uppercase tracking-widest">{label}</span>
    </button>
  );

  const keySets = [
    [
      { label: 'x', val: 'x' }, { label: 'π', val: 'pi' }, { label: '√', val: 'sqrt(' }, { label: 'x²', val: '^2' }, { label: 'xʸ', val: '^' }
    ],
    [
      { label: 'log', val: 'log(' }, { label: 'ln', val: 'ln(' }, { label: '-', val: '-' }, { label: 'deg', val: 'deg' }
    ],
    [
      { label: 'sin', val: 'sin(' }, { label: 'cos', val: 'cos(' }, { label: 'tan', val: 'tan(' }, { label: '(', val: '(' }, { label: ')', val: ')' }
    ]
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050505] flex flex-col items-center py-12 px-6 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/')} className="text-neutral-400 hover:text-white flex items-center uppercase tracking-widest text-[10px] font-black">
            <ArrowLeft size={16} className="mr-2" /> Back
          </button>
        </div>

        {/* Casio Body */}
        <div className="bg-[#1a1a1a] rounded-t-[2.5rem] p-4 pb-8 shadow-2xl relative border-x border-t border-neutral-800 border-b-[8px] border-b-neutral-900 mx-auto max-w-[340px]">
          
          <div className="flex justify-between px-2 pt-2 mb-2">
            <div className="text-white font-bold text-xs uppercase tracking-widest">CASIO</div>
            <div className="text-white text-[10px] uppercase font-mono tracking-widest">fx-991CW</div>
          </div>
          
          {/* Screen area */}
          <div className="bg-[#9ea79a] border-4 border-neutral-900 rounded-lg h-36 mb-6 p-2 flex flex-col relative overflow-hidden shadow-inner">
            {/* Status bar */}
            <div className="flex justify-between text-[10px] text-black font-mono border-b border-black/10 pb-1 mb-1">
              <span>{angleUnit} √() {mode === 'Complex' && ' i '}</span>
              <span>{mode}</span>
            </div>
            
            {showHome ? (
               <div className="flex-1 grid grid-cols-2 gap-1 overflow-y-auto">
                 {modes.map((m) => (
                   <div 
                     key={m.name} 
                     onClick={() => { setMode(m.name); setShowHome(false); setDisplay(''); setResult(''); }}
                     className={`flex items-center text-xs p-1 cursor-pointer font-bold font-mono ${mode === m.name ? 'bg-black text-white' : 'text-black'}`}
                   >
                     <m.icon size={12} className="mr-2" /> {m.name}
                   </div>
                 ))}
               </div>
            ) : settingsOpen ? (
               <div className="flex-1 flex flex-col text-black font-mono text-xs">
                 <div className="font-bold border-b border-black/20 mb-2 pb-1">Settings</div>
                 <div className="cursor-pointer hover:bg-black/10 p-1" onClick={() => { setAngleUnit(angleUnit === 'Deg' ? 'Rad' : 'Deg'); setSettingsOpen(false); }}>1: Angle Unit: {angleUnit}</div>
                 <div className="cursor-pointer hover:bg-black/10 p-1" onClick={() => { setDisplay(''); setResult(''); setSettingsOpen(false); }}>2: Reset Calculator</div>
                 <div className="cursor-pointer hover:bg-black/10 p-1" onClick={() => setSettingsOpen(false)}>3: Exit</div>
               </div>
            ) : (
               <div className="flex-1 flex flex-col justify-end text-black font-mono">
                  {mode === 'Equation' ? (
                     <div className="flex flex-col text-xs space-y-1">
                       <div className="font-bold border-b border-black/20 pb-1 mb-1">Equation Tool</div>
                       <div className="p-1">Advanced eq. solving requires UI extension. Mode set to EQ.</div>
                     </div>
                  ) : mode === 'Matrix' ? (
                     <div className="flex flex-col text-xs space-y-1">
                       <div className="font-bold border-b border-black/20 pb-1 mb-1">Matrix 4x4 Tool</div>
                       <div className="p-1">MatA x MatB (Demo). Type operations.</div>
                       <div className="text-right text-lg">{display}</div>
                       <div className="text-right text-xl font-bold">{result}</div>
                     </div>
                  ) : (
                     <>
                        <div className="text-sm tracking-widest break-all text-left min-h-[40px] whitespace-pre-wrap">{display}</div>
                        <div className="text-right text-2xl font-bold tracking-tighter mt-auto">{result}</div>
                     </>
                  )}
               </div>
            )}
          </div>
          <div className="text-center text-[10px] text-neutral-400 font-bold tracking-[0.3em] mb-4">CLASSWIZ</div>

          {/* Top buttons row */}
          <div className="flex justify-between items-start px-2 mb-4">
             <TopButton label="ON" onClick={() => { setDisplay(''); setResult(''); }} isSmall />
             <div className="flex space-x-2">
               <TopButton label="HOME" onClick={() => handlePress('HOME')} isSmall />
               <TopButton label="SETTINGS" onClick={() => handlePress('SETTINGS')} isSmall />
             </div>
          </div>
          
          {/* D-Pad + Function keys */}
          <div className="flex justify-between px-2 mb-6">
             <div className="grid grid-cols-2 gap-2 mt-4 flex-1">
               <button className="h-6 bg-neutral-800 rounded-full flex items-center justify-center text-[9px] text-yellow-500 font-bold">SHIFT</button>
               <button className="h-6 bg-neutral-800 rounded-full flex items-center justify-center text-[9px] text-white font-bold">ALPHA</button>
               <button className="h-6 bg-neutral-800 rounded-full flex items-center justify-center text-[9px] text-white font-bold">VARIABLE</button>
               <button className="h-6 bg-neutral-800 rounded-full flex items-center justify-center text-[9px] text-white font-bold">f(x)</button>
             </div>
             
             {/* D-Pad */}
             <div className="mx-4 relative w-20 h-20 bg-neutral-800 rounded-full shadow-inner border border-neutral-900 border-t-neutral-700 active:scale-95 transition-transform flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">OK</div>
                <div className="absolute top-1 text-[10px] text-neutral-400">▲</div>
                <div className="absolute bottom-1 text-[10px] text-neutral-400">▼</div>
                <div className="absolute left-2 text-[10px] text-neutral-400">◀</div>
                <div className="absolute right-2 text-[10px] text-neutral-400">▶</div>
             </div>

             <div className="grid border border-neutral-800 rounded-xl h-16 w-8 grid-rows-2">
               <button className="border-b border-neutral-800 text-[12px] text-white flex items-center justify-center">^</button>
               <button className="text-[12px] text-white flex items-center justify-center">v</button>
             </div>
          </div>

          <div className="flex justify-between px-2 mb-4 space-x-2">
             <button className="flex-1 h-6 bg-neutral-800 rounded-full text-white text-[9px] font-bold">CATALOG</button>
             <button className="flex-1 h-6 bg-neutral-800 rounded-full text-white text-[9px] font-bold">TOOLS</button>
          </div>

          {/* Math Functions */}
          <div className="grid grid-cols-5 gap-2 px-1 mb-6">
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress('x')}>𝑥</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress('sqrt(')}>√</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono flex items-center justify-center font-bold" onClick={()=>handlePress('^2')}>x²</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono flex items-center justify-center font-bold" onClick={()=>handlePress('^')}>xⁿ</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress('log(')}>log</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress('ln(')}>ln</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress('sin(')}>sin</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress('cos(')}>cos</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress('tan(')}>tan</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress('i')}>𝑖</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress('%')}>%</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress('(')}>(</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress(')')}>)</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress('pi')}>π</button>
            <button className="bg-neutral-800 h-8 rounded text-white text-xs font-mono font-bold" onClick={()=>handlePress('e')}>e</button>
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-5 gap-y-3 gap-x-2 px-1">
            <button className="bg-neutral-200 h-10 rounded-full text-black text-lg shadow-sm font-bold active:bg-neutral-300" onClick={()=>handlePress('7')}>7</button>
            <button className="bg-neutral-200 h-10 rounded-full text-black text-lg shadow-sm font-bold active:bg-neutral-300" onClick={()=>handlePress('8')}>8</button>
            <button className="bg-neutral-200 h-10 rounded-full text-black text-lg shadow-sm font-bold active:bg-neutral-300" onClick={()=>handlePress('9')}>9</button>
            <button className="bg-neutral-700 h-10 rounded-full text-white shadow-sm font-bold text-sm" onClick={()=>handlePress('DEL')}>DEL</button>
            <button className="bg-neutral-700 h-10 rounded-full text-white shadow-sm font-bold text-sm bg-blue-600 border-blue-700" onClick={()=>handlePress('AC')}>AC</button>
            
            <button className="bg-neutral-200 h-10 rounded-full text-black text-lg shadow-sm font-bold active:bg-neutral-300" onClick={()=>handlePress('4')}>4</button>
            <button className="bg-neutral-200 h-10 rounded-full text-black text-lg shadow-sm font-bold active:bg-neutral-300" onClick={()=>handlePress('5')}>5</button>
            <button className="bg-neutral-200 h-10 rounded-full text-black text-lg shadow-sm font-bold active:bg-neutral-300" onClick={()=>handlePress('6')}>6</button>
            <button className="bg-neutral-700 h-10 rounded-full text-white text-lg shadow-sm font-bold" onClick={()=>handlePress('*')}>×</button>
            <button className="bg-neutral-700 h-10 rounded-full text-white text-lg shadow-sm font-bold" onClick={()=>handlePress('/')}>÷</button>
            
            <button className="bg-neutral-200 h-10 rounded-full text-black text-lg shadow-sm font-bold active:bg-neutral-300" onClick={()=>handlePress('1')}>1</button>
            <button className="bg-neutral-200 h-10 rounded-full text-black text-lg shadow-sm font-bold active:bg-neutral-300" onClick={()=>handlePress('2')}>2</button>
            <button className="bg-neutral-200 h-10 rounded-full text-black text-lg shadow-sm font-bold active:bg-neutral-300" onClick={()=>handlePress('3')}>3</button>
            <button className="bg-neutral-700 h-10 rounded-full text-white text-lg shadow-sm font-bold" onClick={()=>handlePress('+')}>+</button>
            <button className="bg-neutral-700 h-10 rounded-full text-white text-lg shadow-sm font-bold" onClick={()=>handlePress('-')}>-</button>
            
            <button className="bg-neutral-200 h-10 rounded-full text-black text-lg shadow-sm font-bold active:bg-neutral-300" onClick={()=>handlePress('0')}>0</button>
            <button className="bg-neutral-200 h-10 rounded-full text-black text-lg shadow-sm font-bold active:bg-neutral-300" onClick={()=>handlePress('.')}>.</button>
            <button className="bg-neutral-200 h-10 rounded-full text-black text-sm shadow-sm font-bold active:bg-neutral-300" onClick={()=>handlePress('*10^')}>×10ˣ</button>
            <button className="bg-neutral-700 h-10 rounded-full text-white text-[10px] shadow-sm font-bold" onClick={()=>handlePress('Ans')}>Ans</button>
            <button className="bg-brand-primary h-10 rounded-full text-white shadow-sm font-bold text-sm" onClick={()=>handlePress('EXE')}>EXE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

