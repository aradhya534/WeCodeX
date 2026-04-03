import React, { useEffect, useState } from 'react';
import { getOfflineData, seedOfflineData } from '../services/storageService';
import { Database, ChevronDown, ChevronUp } from 'lucide-react';

export default function OfflinePanel() {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      let items = await getOfflineData();
      if (!items || items.length === 0) {
        await seedOfflineData();
        items = await getOfflineData();
      }
      setData(items);
    };
    loadData();
  }, []);

  const toggle = (id) => {
    if (expanded === id) setExpanded(null);
    else setExpanded(id);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-800">
      <div className="flex items-center space-x-3 mb-6 border-b border-gray-800 pb-4">
        <Database className="text-purple-400 w-6 h-6" />
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider">Offline Cache</h2>
          <p className="text-xs text-gray-500 uppercase">Available Without Internet</p>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.id} className="border border-gray-800 rounded-lg overflow-hidden flex flex-col">
            <button 
              onClick={() => toggle(item.id)}
              className="bg-gray-800 p-4 flex justify-between items-center hover:bg-gray-750 transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <span className="font-bold uppercase tracking-wide text-gray-200">{item.title}</span>
              {expanded === item.id ? <ChevronUp className="text-gray-400 w-5 h-5"/> : <ChevronDown className="text-gray-400 w-5 h-5"/>}
            </button>
            
            {expanded === item.id && (
              <div className="p-4 bg-gray-950 text-gray-300 text-sm whitespace-pre-line font-serif border-t border-gray-800">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
