import React, { useState, useEffect } from 'react';
import DistressPanel from './components/DistressPanel';
import MeshPanel from './components/MeshPanel';
import OfflinePanel from './components/OfflinePanel';
import DemoPanel from './components/DemoPanel';
import ResponderDashboard from './components/ResponderDashboard';
import { getPackets } from './services/storageService';
import { WifiOff, Wifi, Map, RadioTower } from 'lucide-react';

export default function App() {
  const [statusMsg, setStatusMsg] = useState("");
  const [queuedCount, setQueuedCount] = useState(0);
  const [currentView, setCurrentView] = useState('mesh'); // 'mesh' | 'responder'

  const refreshQueue = async () => {
    const pkts = await getPackets();
    setQueuedCount(pkts.length);
  };

  useEffect(() => {
    refreshQueue();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
            Mesh<span className="text-green-400">SOS</span>
          </h1>
          <p className="text-gray-500 font-mono text-sm tracking-wide mt-1">Disaster Comm Network</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          
          {/* View Toggle */}
          <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1 mr-2">
             <button 
               onClick={() => setCurrentView('mesh')}
               className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center space-x-2 transition-colors ${currentView === 'mesh' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
             >
               <Map className="w-4 h-4" />
               <span>CIVILIAN UI</span>
             </button>

             <button 
               onClick={() => setCurrentView('responder')}
               className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center space-x-2 transition-colors ${currentView === 'responder' ? 'bg-blue-900/50 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
             >
              
               <RadioTower className="w-4 h-4" />
               <span>HQ RESPONDER</span>
             </button>
          </div>

          <div className="flex items-center space-x-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
            <WifiOff className="text-red-500 w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 text-shadow">Offline</span>
          </div>
          <div className="text-xs font-mono text-gray-400 border border-gray-800 px-3 py-1.5 rounded-full bg-gray-900">
            Queue: {queuedCount}
          </div>
        </div>
      </header>

      {currentView === 'mesh' ? (
        <>
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="space-y-6 h-full flex flex-col">
              <DistressPanel onPacketCreated={(p) => {
                refreshQueue();
                setStatusMsg(`Packet saved. ID: ${p.id.split('-')[0]}`);
              }} />
              <OfflinePanel />
            </div>
            <div className="h-[600px] lg:h-auto">
              <MeshPanel />
            </div>
          </div>

          {/* Demo Controls */}
          <DemoPanel setStatus={(msg) => {
            setStatusMsg(msg);
            refreshQueue();
          }} />
        </>
      ) : (
        <ResponderDashboard />
      )}
      
      {statusMsg && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-800 border border-gray-700 p-4 rounded-xl shadow-2xl flex items-center space-x-3 text-white">
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
           <span className="font-mono text-sm">{statusMsg}</span>
        </div>
      )}
    </div>
  );
}
