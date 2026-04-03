import React, { useState } from 'react';
import { getPackets, clearPackets } from '../services/storageService';
import { syncPacketsWithBackend } from '../services/packetService';
import { meshSimulator } from '../services/meshSimulator';
import { Settings, Play, CloudLightning } from 'lucide-react';

export default function DemoPanel({ setStatus }) {
  const [syncing, setSyncing] = useState(false);

  const simulateRelay = async () => {
    // Get packets from storage to simulate relayting them
    const packets = await getPackets();
    if (packets.length === 0) {
      alert("No packets in IndexedDB! Send an SOS first.");
      return;
    }
    
    // Simulate relay for the first packet in queue for demo
    await meshSimulator.simulateRelay(packets[0]);
  };

  const simulateInternet = async () => {
    const packets = await getPackets();
    if (packets.length === 0) {
      alert("No pending packets to sync!");
      return;
    }

    setSyncing(true);
    setStatus("Internet Restored. Syncing...");

    const success = await syncPacketsWithBackend(packets);
    
    if (success) {
      await clearPackets();
      setStatus("Sync Complete. Packets delivered to Backend.");
    } else {
      setStatus("Sync Failed. Backend unreachable.");
    }
    setSyncing(false);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 border-2 border-yellow-500/50 relative overflow-hidden mt-6">
      <div className="flex items-center space-x-2 text-yellow-500 mb-4">
        <Settings className="w-5 h-5" />
        <h3 className="font-bold uppercase tracking-widest text-sm">Demo Controls Panel</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={simulateRelay}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors font-bold uppercase text-xs tracking-wider"
        >
          <Play className="w-4 h-4" />
          <span>Simulate Relay</span>
        </button>

        <button 
          onClick={simulateInternet}
          disabled={syncing}
          className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors font-bold uppercase text-xs tracking-wider ring-1 ring-blue-400 ring-offset-2 ring-offset-darkBg"
        >
          <CloudLightning className="w-4 h-4" />
          <span>{syncing ? 'SYNCING...' : 'Simulate Internet'}</span>
        </button>
      </div>
      
      <p className="text-gray-400 text-xs mt-3 uppercase tracking-wider text-center">
        Use these controls to demonstrate offline-first relay and eventual delivery.
      </p>
    </div>
  );
}
