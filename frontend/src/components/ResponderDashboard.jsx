import React, { useEffect, useState } from 'react';
import { ShieldAlert, Server, Smartphone } from 'lucide-react';

export default function ResponderDashboard() {
  const [data, setData] = useState({ packets: [], logs: [] });
  const [error, setError] = useState(false);

  useEffect(() => {
    // Poll the backend every 2 seconds to simulate a live dashboard
    const fetchInfo = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/packets');
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setError(false);
        }
      } catch (e) {
        setError(true);
      }
    };
    
    fetchInfo();
    const interval = setInterval(fetchInfo, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center space-x-4">
          <ShieldAlert className="w-10 h-10 text-red-500" />
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Emergencies</p>
            <p className="text-3xl font-black text-white">{data.packets.length}</p>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center space-x-4">
          <Server className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Backend Connection</p>
            <p className={`text-xl font-black ${error ? 'text-red-500' : 'text-green-500'}`}>
              {error ? 'OFFLINE' : 'ONLINE'}
            </p>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center space-x-4">
          <Smartphone className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">SMS Alerts Sent</p>
            <p className="text-3xl font-black text-white">{data.logs.length}</p>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Incoming distress packets */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-bold uppercase tracking-wider text-white">Incoming SOS Data</h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {data.packets.length === 0 ? (
              <p className="text-gray-500 font-mono text-sm">No packets received yet. Simulate an internet sync from the Mesh App.</p>
            ) : (
              data.packets.map((pkt) => (
                <div key={pkt.id} className="border border-gray-700 bg-gray-800/50 p-3 rounded-lg text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-xs text-darkBg ${
                      pkt.severity === 'critical' ? 'bg-critical' : pkt.severity === 'injured' ? 'bg-injured' : 'bg-stranded'
                    }`}>
                      {pkt.severity}
                    </span>
                    <span className="font-mono text-xs text-gray-500">Hops: {pkt.hops}</span>
                  </div>
                  <p className="text-gray-200 mb-2 font-serif text-lg">"{pkt.message}"</p>
                  <p className="font-mono text-xs text-gray-400">
                    Loc: {pkt.location.lat.toFixed(4)}, {pkt.location.lng.toFixed(4)}
                  </p>
                  <p className="font-mono text-[10px] text-gray-500 mt-1">ID: {pkt.id}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Twilio SMS Mock Logs */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-bold uppercase tracking-wider text-white">Automated Alerts System</h2>
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-bold">MOCK TWILIO</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-black/40">
            {data.logs.length === 0 ? (
              <p className="text-gray-500 font-mono text-sm">Waiting for incoming data to trigger alerts...</p>
            ) : (
              data.logs.map((log, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 bg-gray-800 pl-3 pr-2 py-2 text-sm font-mono text-gray-300">
                  <p className="text-purple-400 text-xs mb-1">[{new Date(log.timestamp).toLocaleTimeString()}] ALERT DISPATCHED:</p>
                  <p>{log.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
