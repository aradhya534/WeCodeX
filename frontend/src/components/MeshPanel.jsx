import React, { useEffect, useRef, useState } from 'react';
import { meshSimulator } from '../services/meshSimulator';
import { Activity } from 'lucide-react';

export default function MeshPanel() {
  const canvasRef = useRef(null);
  const [logs, setLogs] = useState([]);
  
  // Basic nodes positions for visualization
  const nodes = {
    'Me': { x: 150, y: 150 },
    'Device A': { x: 50, y: 50 },
    'Device B': { x: 250, y: 50 },
    'Device C': { x: 50, y: 250 },
    'Device D': { x: 250, y: 250 },
    'Device E': { x: 70, y: 150 }
  };

  const [activeConnections, setActiveConnections] = useState([]);

  const lastNodeRef = useRef('Me');

  useEffect(() => {
    const unsubscribe = meshSimulator.subscribe((event) => {
      if (event.type === 'START') {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] Packet Created. ID: ${event.packet.id.substring(0,6)}`, ...prev]);
        setActiveConnections([]);
        lastNodeRef.current = 'Me';
      }
      
      if (event.type === 'HOP') {
        setLogs(prev => [
          `[${new Date().toLocaleTimeString()}] ${event.toast} | TTL: ${event.packet.ttl} | Hops: ${event.packet.hops}`, 
          ...prev
        ]);
        
        setActiveConnections(prev => {
          const newConns = [...prev, { from: lastNodeRef.current, to: event.peer }];
          lastNodeRef.current = event.peer;
          return newConns;
        });
      }

      if (event.type === 'ACK') {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${event.toast}`, ...prev]);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all connections
    ctx.lineWidth = 2;
    activeConnections.forEach(conn => {
      ctx.beginPath();
      ctx.setLineDash([5, 5]); // Dashed line for relays
      ctx.strokeStyle = '#34D399'; // Green stranded color or functional color
      if (conn.from === 'Me') {
        ctx.setLineDash([]); // Solid line for first connection
      }
      
      const p1 = nodes[conn.from] || nodes['Me'];
      const p2 = nodes[conn.to] || nodes['Me'];
      
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // Draw nodes
    Object.entries(nodes).forEach(([name, pos]) => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = name === 'Me' ? '#F87171' : '#374151'; // Me is critical red for vis
      ctx.fill();
      
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(name, pos.x, pos.y + 20);
      
      // highlight active node
      if (activeConnections.some(c => c.to === name)) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
        ctx.strokeStyle = '#34D399';
        ctx.setLineDash([]);
        ctx.stroke();
      }
    });

  }, [activeConnections]);

  return (
    <div className="bg-gray-900 rounded-xl flex flex-col shadow-lg border border-gray-800 h-full">
      <div className="p-4 sm:p-6 border-b border-gray-800 flex items-center space-x-3">
        <Activity className="text-blue-400 w-6 h-6" />
        <h2 className="text-xl font-bold uppercase tracking-wider">Mesh Visualization</h2>
      </div>

      <div className="p-4 flex justify-center items-center bg-darkBg overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={300} 
          className="border border-gray-800 rounded-lg bg-gray-950/50"
        />
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-48 border-t border-gray-800 bg-black/20">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Relay Logs (Mock)</h3>
        <div className="space-y-1">
          {logs.length === 0 && <p className="text-sm font-mono text-gray-600">Waiting for packets...</p>}
          {logs.map((log, i) => (
            <div key={i} className="text-xs font-mono text-gray-300 break-words">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
