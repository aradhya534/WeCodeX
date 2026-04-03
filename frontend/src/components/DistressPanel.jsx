import React, { useState } from 'react';
import { createPacket } from '../services/packetService';
import { AlertCircle, Activity, Navigation, Save } from 'lucide-react';

export default function DistressPanel({ onPacketCreated }) {
  const [severity, setSeverity] = useState('critical');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const handleSOS = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    
    // Simulate GPS acquisition and packet creation
    const packet = await createPacket(message, severity);
    setLastSaved(packet);
    
    if (onPacketCreated) {
      onPacketCreated(packet);
    }
    
    setIsSending(false);
    setMessage('');
  };

  const severityOptions = [
    { value: 'critical', label: 'CRITICAL', color: 'bg-critical text-darkBg' },
    { value: 'injured', label: 'INJURED', color: 'bg-injured text-darkBg' },
    { value: 'stranded', label: 'STRANDED', color: 'bg-stranded text-darkBg' }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-800">
      <div className="flex items-center space-x-3 mb-6">
        <AlertCircle className="text-red-500 w-8 h-8" />
        <h2 className="text-xl font-bold uppercase tracking-wider">Distress Beacon</h2>
      </div>

      <div className="space-y-6">
        {/* Severity Selector */}
        <div>
          <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wide">Severity Level</label>
          <div className="grid grid-cols-3 gap-2">
            {severityOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSeverity(opt.value)}
                className={`py-3 px-2 rounded-lg font-bold text-sm min-h-[56px] transition-all
                  ${severity === opt.value 
                    ? opt.color + ' ring-2 ring-white ring-offset-2 ring-offset-darkBg' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wide">Distress Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe situation, injuries, etc."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-white focus:border-transparent min-h-[120px] resize-none"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleSOS}
          disabled={isSending || !message.trim()}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xl rounded-xl py-4 min-h-[64px] flex flex-col items-center justify-center transition-colors disabled:opacity-50 pulse-animation relative overflow-hidden"
        >
          {isSending ? (
            <span className="flex items-center space-x-2">
              <Navigation className="animate-spin" />
              <span>ACQUIRING GPS...</span>
            </span>
          ) : (
            <span>SEND SOS (OFFLINE)</span>
          )}
        </button>

        {lastSaved && (
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 flex items-start space-x-3">
            <Save className="text-green-400 w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-mono text-gray-300">
              <p className="text-green-400">Packet Saved to offline IndexedDB queue.</p>
              <p>ID: {lastSaved.id.split('-')[0]}...</p>
              <p>Loc: {lastSaved.location.lat.toFixed(4)}, {lastSaved.location.lng.toFixed(4)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
