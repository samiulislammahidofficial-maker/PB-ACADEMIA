import React from 'react';
import { Handle, Position } from '@xyflow/react';

const HStyle = { width: 10, height: 10, background: 'white', border: '2px solid #1e1b4b', zIndex: 10 };

export function ResistorNode({ data, isConnectable, selected }: any) {
  const isVertical = data.direction === 'vertical';
  return (
    <div className={`flex flex-col items-center ${selected ? 'drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]' : ''}`}>
      <span className="text-[10px] font-bold text-amber-500 mb-1">{data.value} Ω</span>
      <div className={`relative flex items-center justify-center text-amber-500 transition-all ${isVertical ? 'w-[30px] h-[60px]' : 'w-[60px] h-[30px]'}`}>
        <Handle type="source" position={isVertical ? Position.Top : Position.Left} id="T1" style={isVertical ? {...HStyle, top: -5} : {...HStyle, left: -5}} isConnectable={isConnectable} />
        <svg width="60" height="20" viewBox="0 0 60 20" className={`drop-shadow-lg transition-transform ${isVertical ? 'rotate-90' : ''}`}>
          <polyline points="0,10 10,10 15,0 25,20 35,0 45,20 50,10 60,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter"/>
        </svg>
        <Handle type="source" position={isVertical ? Position.Bottom : Position.Right} id="T2" style={isVertical ? {...HStyle, bottom: -5} : {...HStyle, right: -5}} isConnectable={isConnectable} />
      </div>
      <span className="text-[9px] text-neutral-400 mt-1">{data.label}</span>
      {data.voltage !== undefined && (
        <div className="text-[9px] text-emerald-400 font-bold mt-1 bg-black/60 px-2 py-0.5 rounded">
          {data.voltage.toFixed(2)}V | {data.current.toFixed(2)}A
        </div>
      )}
    </div>
  );
}

export function CapacitorNode({ data, isConnectable, selected }: any) {
  const isVertical = data.direction === 'vertical';
  return (
    <div className={`flex flex-col items-center ${selected ? 'drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : ''}`}>
      <span className="text-[10px] font-bold text-emerald-500 mb-1">{data.value} μF</span>
      <div className={`relative flex items-center justify-center text-emerald-500 transition-all ${isVertical ? 'w-[30px] h-[60px]' : 'w-[60px] h-[30px]'}`}>
        <Handle type="source" position={isVertical ? Position.Top : Position.Left} id="T1" style={isVertical ? {...HStyle, top: -5} : {...HStyle, left: -5}} isConnectable={isConnectable} />
        <svg width="60" height="20" viewBox="0 0 60 20" className={`drop-shadow-lg transition-transform ${isVertical ? '-rotate-90' : ''}`}>
          <line x1="0" y1="10" x2="26" y2="10" stroke="currentColor" strokeWidth="2" />
          <line x1="26" y1="2" x2="26" y2="18" stroke="currentColor" strokeWidth="2" />
          <line x1="34" y1="2" x2="34" y2="18" stroke="currentColor" strokeWidth="2" />
          <line x1="34" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="2" />
        </svg>
        <Handle type="source" position={isVertical ? Position.Bottom : Position.Right} id="T2" style={isVertical ? {...HStyle, bottom: -5} : {...HStyle, right: -5}} isConnectable={isConnectable} />
      </div>
      <span className="text-[9px] text-neutral-400 mt-1">{data.label}</span>
    </div>
  );
}

export function BatteryNode({ data, isConnectable, selected }: any) {
  const isVertical = data.direction === 'vertical';
  return (
    <div className={`flex flex-col items-center ${selected ? 'drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]' : ''}`}>
      <span className="text-[10px] font-bold text-blue-500 mb-1">{data.value} V</span>
      <div className={`relative flex items-center justify-center text-blue-500 transition-all ${isVertical ? 'w-[40px] h-[60px]' : 'w-[60px] h-[40px]'}`}>
        <Handle type="source" position={isVertical ? Position.Top : Position.Left} id="T1" style={isVertical ? {...HStyle, top: -5} : {...HStyle, left: -5}} isConnectable={isConnectable} />
        {!isVertical && <span className="absolute left-2 top-0 text-[10px] font-black text-blue-400">+</span>}
        {isVertical && <span className="absolute left-0 top-1 text-[10px] font-black text-blue-400">+</span>}
        
        <svg width="60" height="30" viewBox="0 0 60 30" className={`drop-shadow-lg transition-transform ${isVertical ? 'rotate-90' : ''}`}>
          <line x1="0" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="2" />
          <line x1="22" y1="5" x2="22" y2="25" stroke="currentColor" strokeWidth="2" />
          <line x1="32" y1="10" x2="32" y2="20" stroke="currentColor" strokeWidth="4" />
          <line x1="32" y1="15" x2="60" y2="15" stroke="currentColor" strokeWidth="2" />
        </svg>
        
        {!isVertical && <span className="absolute right-2 top-1 text-[12px] font-black text-blue-400">-</span>}
        {isVertical && <span className="absolute left-0 bottom-1 text-[12px] font-black text-blue-400">-</span>}
        
        <Handle type="source" position={isVertical ? Position.Bottom : Position.Right} id="T2" style={isVertical ? {...HStyle, bottom: -5} : {...HStyle, right: -5}} isConnectable={isConnectable} />
      </div>
      <span className="text-[9px] text-neutral-400 mt-1">{data.label}</span>
      {data.current !== undefined && (
        <div className="text-[9px] text-emerald-400 font-bold mt-1 bg-black/60 px-2 py-0.5 rounded">
          {data.current.toFixed(2)}A
        </div>
      )}
    </div>
  );
}

export function JunctionNode({ data, isConnectable, selected }: any) {
  return (
    <div className={`relative flex flex-col items-center justify-center w-8 h-8 rounded-full ${selected ? 'bg-purple-500/40 border-purple-400 border-2' : 'bg-white/10 border-white/20 border'} text-white font-black text-xs transition-colors shadow-lg`}>
       {data.label}
       <Handle type="source" position={Position.Top} id="T1" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 24, height: 24, opacity: 0, zIndex: 10 }} isConnectable={isConnectable} />
       {data.voltage !== undefined && (
         <div className="absolute -bottom-6 whitespace-nowrap text-[9px] text-emerald-400 font-bold bg-black/60 px-2 py-0.5 rounded">
           {data.voltage.toFixed(2)}V
         </div>
       )}
    </div>
  );
}

export function GroundNode({ isConnectable, selected }: any) {
  return (
    <div className={`relative flex flex-col items-center justify-center w-10 h-10 ${selected ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'text-neutral-400'}`}>
       <Handle type="source" position={Position.Top} id="T1" style={{...HStyle, top: -5}} isConnectable={isConnectable} />
       <svg width="24" height="24" viewBox="0 0 30 30" stroke="currentColor" strokeWidth="2">
         <line x1="15" y1="0" x2="15" y2="15" />
         <line x1="5" y1="15" x2="25" y2="15" />
         <line x1="10" y1="20" x2="20" y2="20" />
         <line x1="13" y1="25" x2="17" y2="25" />
       </svg>
    </div>
  );
}
