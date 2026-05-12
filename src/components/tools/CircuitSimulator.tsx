import React, { useState, useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges, 
  Node, 
  Edge, 
  Connection,
  ReactFlowProvider,
  useReactFlow,
  useOnSelectionChange,
  ConnectionMode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Zap, Battery, Activity, PlayCircle, ShieldAlert, CircleDot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { solveMNA } from '../../lib/mna';
import { ResistorNode, CapacitorNode, BatteryNode, JunctionNode, GroundNode } from './CustomNodes';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];
const generateId = () => Math.random().toString(36).substring(2, 9);

function CircuitDesigner() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  
  // Calc state
  const [calcMode, setCalcMode] = useState<'total' | 'eq_res' | 'eq_cap'>('total');
  const [calcNodeA, setCalcNodeA] = useState<string>('');
  const [calcNodeB, setCalcNodeB] = useState<string>('');
  const [calcResult, setCalcResult] = useState<string | null>(null);

  const { screenToFlowPosition, getNodes } = useReactFlow();

  const nodeTypes = useMemo(() => ({
    resistor: ResistorNode,
    capacitor: CapacitorNode,
    battery: BatteryNode,
    junction: JunctionNode,
    ground: GroundNode
  }), []);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true, style: { stroke: '#a3a3a3', strokeWidth: 2 } } as any, eds));
    },
    []
  );

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedNode(nodes.length === 1 ? nodes[0] : null);
      setSelectedEdge(edges.length === 1 ? edges[0] : null);
    },
  });

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let label = type.toUpperCase();
      let value = 10;
      if (type === 'junction') {
        value = 0;
        const jCount = getNodes().filter(n => n.type === 'junction').length;
        label = String.fromCharCode(65 + jCount); // A, B, C...
      } else {
        const tCount = getNodes().filter(n => n.type === type).length;
        label = `${type.charAt(0).toUpperCase()}${tCount + 1}`;
      }

      const newNode: Node = {
        id: generateId(),
        type,
        position,
        data: { 
          label,
          value: type === 'battery' ? 12 : value
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, getNodes]
  );
  
  const handleUpdateSelected = (field: string, val: any) => {
    if (!selectedNode) return;
    setNodes(nds => nds.map(n => {
      if (n.id === selectedNode.id) {
        return { ...n, data: { ...n.data, [field]: val } };
      }
      return n;
    }));
  };

  const getJunctions = () => nodes.filter(n => n.type === 'junction');

  const runSimulation = () => {
    setCalcResult(null);
    // Clear previous results
    setNodes(nds => nds.map(n => {
      const d = { ...n.data };
      delete d.voltage;
      delete d.current;
      return { ...n, data: d };
    }));

    // Find Nets
    const terminals: Record<string, string[]> = {};
    const getTerminalId = (nodeId: string, handleId: string) => `${nodeId}_${handleId}`;

    edges.forEach(edge => {
      const src = getTerminalId(edge.source, edge.sourceHandle!);
      const tgt = getTerminalId(edge.target, edge.targetHandle!);
      if (!terminals[src]) terminals[src] = [];
      if (!terminals[tgt]) terminals[tgt] = [];
      terminals[src].push(tgt);
      terminals[tgt].push(src);
    });

    const visited = new Set<string>();
    const nets: Record<string, number> = {};
    let netCount = 0;

    Object.keys(terminals).forEach(startTerminal => {
      if (!visited.has(startTerminal)) {
        netCount++;
        const queue = [startTerminal];
        visited.add(startTerminal);
        while (queue.length > 0) {
          const curr = queue.shift()!;
          nets[curr] = netCount;
          for (const neighbor of terminals[curr] || []) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          }
        }
      }
    });

    const getNodeNet = (nodeId: string, handleId: string) => nets[getTerminalId(nodeId, handleId)] || 0;

    // Build MNA components
    const resistors: {n1: number, n2: number, R: number, ref: string}[] = [];
    const voltageSources: {n1: number, n2: number, V: number, ref: string}[] = [];
    const currentSources: {n1: number, n2: number, I: number, ref: string}[] = [];

    // Map net aliases for Junctions & Grounds (they enforce all handles share same voltage)
    // Actually, junction is just 1 handle 'T1'.
    
    // Identify ground net
    let groundNet = 0;
    const groundNodes = nodes.filter(n => n.type === 'ground');
    if (groundNodes.length > 0) {
      groundNet = getNodeNet(groundNodes[0].id, 'T1');
      if (groundNet === 0) {
        // give it a new net if unconnected
        netCount++;
        groundNet = netCount;
        nets[getTerminalId(groundNodes[0].id, 'T1')] = groundNet;
      }
    }

    if (calcMode === 'eq_res' || calcMode === 'eq_cap') {
      if (!calcNodeA || !calcNodeB) {
        setCalcResult("Please select two junctions A and B.");
        return;
      }
      
      const netA = getNodeNet(calcNodeA, 'T1');
      const netB = getNodeNet(calcNodeB, 'T1');
      
      if (!netA || !netB || netA === netB) {
        setCalcResult("Junctions must be valid and distinct, connected to the circuit.");
        return;
      }

      groundNet = netB; // Force netB to be ground
      
      nodes.forEach(n => {
        const t1 = getNodeNet(n.id, 'T1');
        const t2 = getNodeNet(n.id, 'T2');
        if (t1 === 0 && t2 === 0) return;
        
        const val = Number(n.data.value) || 1;
        
        if (calcMode === 'eq_res') {
          if (n.type === 'resistor') {
            resistors.push({ n1: t1, n2: t2, R: val, ref: n.id });
          } else if (n.type === 'battery') {
             // Short circuit batteries
            voltageSources.push({ n1: t1, n2: t2, V: 0, ref: n.id });
          }
        } else if (calcMode === 'eq_cap') {
          if (n.type === 'capacitor') {
            resistors.push({ n1: t1, n2: t2, R: 1.0 / val, ref: n.id });
          }
        }
      });

      // Inject 1A from B to A -> Means B -> A: I enters A, leaves B. A=n1, B=n2.
      // currentSources flow from n1 to n2. So n1=B, n2=A.
      currentSources.push({ n1: netB, n2: netA, I: 1, ref: 'calc_source' });

    } else {
      // Total circuit
      nodes.forEach(n => {
        const t1 = getNodeNet(n.id, 'T1');
        const t2 = getNodeNet(n.id, 'T2');
        if (t1 === 0 && t2 === 0) return;
        const val = Number(n.data.value) || 10;
        
        if (n.type === 'resistor') {
          resistors.push({ n1: t1, n2: t2, R: val, ref: n.id });
        } else if (n.type === 'battery') {
          // T1 is Left. Standard battery: long line is positive. T1 is left. Left is positive.
          // So T1 to T2 means Voltage drop? A voltage source in MNA: V_n1 - V_n2 = V.
          // T1 is +, T2 is -. So n1=T1, n2=T2.
          voltageSources.push({ n1: t1, n2: t2, V: val, ref: n.id });
        }
      });
      // Pick an arbitrary ground if none exists
      if (groundNet === 0 && netCount > 0) groundNet = 1;
    }

    // Rewrite nets array so groundNet becomes 0.
    const netMap: Record<number, number> = {};
    let newNetIdx = 1;
    for (let i = 1; i <= netCount; i++) {
      if (i === groundNet) {
        netMap[i] = 0;
      } else {
        netMap[i] = newNetIdx++;
      }
    }
    
    // Translate references
    const trR = resistors.map(r => ({ ...r, n1: netMap[r.n1]||0, n2: netMap[r.n2]||0 }));
    const trVs = voltageSources.map(vs => ({ ...vs, n1: netMap[vs.n1]||0, n2: netMap[vs.n2]||0 }));
    const trIs = currentSources.map(c => ({ ...c, n1: netMap[c.n1]||0, n2: netMap[c.n2]||0 }));
    
    const trueNetCount = newNetIdx - 1;

    try {
      const { voltages, currents } = solveMNA(trueNetCount, trR, trVs, trIs);
      
      if (calcMode === 'eq_res') {
        const vA = voltages[netMap[getNodeNet(calcNodeA, 'T1')]] || 0;
        setCalcResult(`Eq. Resistance: ${Math.abs(vA).toFixed(3)} Ω`);
      } else if (calcMode === 'eq_cap') {
        const vA = voltages[netMap[getNodeNet(calcNodeA, 'T1')]] || 0;
        const C = 1.0 / Math.abs(vA || 1e-12);
        setCalcResult(`Eq. Capacitance: ${C.toFixed(3)} μF`);
      } else {
        // Total Circuit Update
        setNodes(nds => nds.map(n => {
          const t1 = netMap[getNodeNet(n.id, 'T1')] || 0;
          const t2 = netMap[getNodeNet(n.id, 'T2')] || 0;
          const v1 = voltages[t1] || 0;
          const v2 = voltages[t2] || 0;
          
          if (n.type === 'junction') {
            return { ...n, data: { ...n.data, voltage: v1 } };
          }
          if (n.type === 'resistor') {
            const diff = Math.abs(v1 - v2);
            const I = diff / (Number(n.data.value) || 10);
            return { ...n, data: { ...n.data, voltage: diff, current: I } };
          }
          if (n.type === 'battery') {
            const idx = trVs.findIndex(vs => vs.ref === n.id);
            const I = currents[idx] || 0;
            return { ...n, data: { ...n.data, current: Math.abs(I) } };
          }
          return n;
        }));
        setCalcResult("Simulation successful. See labels on components.");
      }
    } catch (e: any) {
      setCalcResult(`Simulation Error: Unstable or floating circuit.`);
    }
  };

  const activeNode = selectedNode ? nodes.find(n => n.id === selectedNode.id) : null;

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full">
      {/* Left Palette */}
      <div className="w-full md:w-60 bg-[#0a0a0a] border-r border-white/5 p-4 flex flex-col shrink-0 overflow-y-auto">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4">Components</h3>
        
        <div className="space-y-2">
          <div 
            className="px-3 py-2 border border-white/5 bg-white/5 rounded-lg cursor-grab text-amber-500 font-bold text-xs flex items-center hover:bg-white/10 transition-colors"
            onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'resistor')}
            draggable
          >
            <Activity className="mr-2" size={14} /> Resistor
          </div>
          
          <div 
            className="px-3 py-2 border border-white/5 bg-white/5 rounded-lg cursor-grab text-emerald-500 font-bold text-xs flex items-center hover:bg-white/10 transition-colors"
            onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'capacitor')}
            draggable
          >
            <Battery className="mr-2" size={14} /> Capacitor
          </div>
          
          <div 
            className="px-3 py-2 border border-white/5 bg-white/5 rounded-lg cursor-grab text-blue-500 font-bold text-xs flex items-center hover:bg-white/10 transition-colors"
            onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'battery')}
            draggable
          >
            <Zap className="mr-2" size={14} /> Battery
          </div>

          <div 
            className="px-3 py-2 border border-white/5 bg-white/5 rounded-lg cursor-grab text-purple-400 font-bold text-xs flex items-center hover:bg-white/10 transition-colors"
            onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'junction')}
            draggable
          >
            <CircleDot className="mr-2" size={14} /> Test Point (Node)
          </div>

          <div 
            className="px-3 py-2 border border-white/5 bg-white/5 rounded-lg cursor-grab text-green-400 font-bold text-xs flex items-center hover:bg-white/10 transition-colors"
            onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'ground')}
            draggable
          >
             Reference (Ground)
          </div>
        </div>

        <div className="mt-8">
          <p className="text-[10px] text-neutral-400 italic font-medium leading-relaxed">
            Drag components. Connect lines. Select a component to edit its properties.
          </p>
        </div>
      </div>

      {/* Center Canvas */}
      <div className="flex-1 relative bg-[#111]" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          connectionMode={ConnectionMode.Loose}
          className="bg-dot-pattern"
          deleteKeyCode={['Backspace', 'Delete']}
        >
          <Background color="#444" gap={16} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-72 bg-[#0a0a0a] border-l border-white/5 flex flex-col shrink-0 text-white shadow-2xl z-10">
        
        {/* Calc Mode Tab */}
        <div className="p-4 border-b border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3">Solve For</h3>
          <select 
            className="w-full p-2 bg-neutral-900 rounded font-bold text-xs outline-none border border-neutral-800 text-white focus:border-brand-primary"
            value={calcMode}
            onChange={(e) => setCalcMode(e.target.value as any)}
          >
            <option value="total">Full Circuit (DC Voltages/Currents)</option>
            <option value="eq_res">Equivalent Resistance</option>
            <option value="eq_cap">Equivalent Capacitance</option>
          </select>

          {(calcMode === 'eq_res' || calcMode === 'eq_cap') && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 block mb-1">Test Point A</label>
                <select className="w-full p-1.5 bg-neutral-900 rounded text-xs border border-neutral-800"
                  value={calcNodeA} onChange={e => setCalcNodeA(e.target.value)}>
                  <option value="">-Select-</option>
                  {getJunctions().map(j => <option key={j.id} value={j.id}>{j.data.label as string}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 block mb-1">Test Point B</label>
                <select className="w-full p-1.5 bg-neutral-900 rounded text-xs border border-neutral-800"
                  value={calcNodeB} onChange={e => setCalcNodeB(e.target.value)}>
                  <option value="">-Select-</option>
                  {getJunctions().map(j => <option key={j.id} value={j.id}>{j.data.label as string}</option>)}
                </select>
              </div>
            </div>
          )}

          <button 
            onClick={runSimulation}
            className="w-full mt-4 py-2 bg-brand-primary text-white font-black uppercase tracking-widest text-[10px] rounded hover:bg-brand-secondary transition-all flex items-center justify-center"
          >
            <PlayCircle className="mr-2" size={14} /> Calculate
          </button>

          {calcResult && (
            <div className={`mt-4 p-3 rounded-md text-xs font-bold border ${calcResult.includes('Error') ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-emerald-500 bg-emerald-500/10 text-emerald-400'}`}>
               {calcResult}
            </div>
          )}
        </div>

        {/* Selected Component Properties */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3">Selection Properties</h3>
          
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="bg-neutral-800 px-2 py-1 rounded text-[10px] uppercase font-black text-neutral-400 border border-neutral-700">
                  {selectedNode.type}
                </span>
                <input 
                  type="text" 
                  value={activeNode?.data.label as string}
                  onChange={(e) => handleUpdateSelected('label', e.target.value)}
                  className="flex-1 bg-transparent border-b border-dashed border-neutral-600 outline-none text-sm font-bold text-white px-1"
                />
              </div>

              {(activeNode?.type === 'resistor' || activeNode?.type === 'capacitor' || activeNode?.type === 'battery') && (
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 block mb-1">
                    Value 
                    {activeNode?.type === 'resistor' && ' (Ohms)'}
                    {activeNode?.type === 'capacitor' && ' (μF)'}
                    {activeNode?.type === 'battery' && ' (Volts)'}
                  </label>
                  <input 
                    type="number"
                    value={activeNode?.data.value as number}
                    onChange={(e) => handleUpdateSelected('value', Number(e.target.value))}
                    className="w-full p-2 bg-neutral-900 rounded font-bold text-sm outline-none border border-neutral-800 text-white focus:border-brand-primary"
                  />
                </div>
              )}

              <button
                onClick={() => setNodes(nds => nds.filter(n => n.id !== selectedNode.id))}
                className="w-full py-2 bg-red-600/10 text-red-500 hover:bg-red-600/20 border border-red-500/20 rounded font-black uppercase tracking-widest text-[10px] transition-colors"
              >
                Delete Component
              </button>
            </div>
          ) : selectedEdge ? (
            <div className="space-y-4">
              <div className="text-center py-4 text-neutral-400">
                <p className="text-xs font-bold mb-4">Wire Connection Selected</p>
                <button
                  onClick={() => setEdges(eds => eds.filter(e => e.id !== selectedEdge.id))}
                  className="w-full py-2 bg-red-600/10 text-red-500 hover:bg-red-600/20 border border-red-500/20 rounded font-black uppercase tracking-widest text-[10px] transition-colors"
                >
                  Delete Wire
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-600">
              <ShieldAlert className="mx-auto mb-2 opacity-20" size={32} />
              <p className="text-xs font-bold">Select a component<br/>to edit properties</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function CircuitSimulator() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden">
      <div className="border-b border-white/5 bg-[#0a0a0a] p-4 flex items-center justify-between shrink-0 h-[60px] z-20 shadow-sm">
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate('/')} className="text-neutral-400 hover:text-white flex items-center uppercase tracking-widest text-[10px] font-black transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Exit
          </button>
          <h2 className="text-lg font-display font-black uppercase tracking-tight flex items-center">
            <Zap className="mr-2 text-amber-500" size={18} /> Pro Circuit Editor
          </h2>
        </div>
      </div>
      <div className="flex-1 h-[calc(100vh-60px)]">
        <ReactFlowProvider>
          <CircuitDesigner />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
