'use client';

import { useState } from 'react';
import NetworkStats from '@/components/NetworkStats';
import NodeStats from '@/components/NodeStats';

export default function Home() {
  const [activeTab, setActiveTab] = useState('network');
  const [nodeId, setNodeId] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Hàm để lưu và tự động chuyển tab
  const handleSave = () => {
    setShowSettings(false);
    if (nodeId) {
      setActiveTab('node'); // Chuyển sang tab node sau khi nhập ID
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      <header className="border-b border-gray-700 bg-black/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Netrum Dashboard</h1>
                <p className="text-sm text-gray-400">Base Node Monitor</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </header>

      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">⚙️ Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Node ID</label>
                <input
                  type="text"
                  value={nodeId}
                  onChange={(e) => setNodeId(e.target.value)}
                  placeholder="Enter your node ID"
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 outline-none text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Save
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
{/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 p-1 bg-black/20 rounded-xl w-fit border border-white/5">
          <button
            onClick={() => setActiveTab('network')}
            className={`px-6 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
              activeTab === 'network' ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'
            }`}
          >
            📊 Network Overview
          </button>
          <button
            onClick={() => setActiveTab('node')}
            className={`px-6 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
              activeTab === 'node' ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'
            }`}
          >
            ⛏️ My Node Stats
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 pb-12 min-h-[50vh]">
        {activeTab === 'network' && <NetworkStats />}
        
        {activeTab === 'node' && (
          nodeId ? (
            <NodeStats nodeId={nodeId} />
          ) : (
            <div className="text-center py-20 bg-gray-800/20 rounded-3xl border border-dashed border-gray-700">
              <p className="text-gray-400 mb-4">No Node ID configured yet</p>
              <button 
                onClick={() => setShowSettings(true)}
                className="text-blue-400 hover:underline font-medium"
              >
                Click here to enter your Node ID in Settings
              </button>
            </div>
          )
        )}
      </main>

      <footer className="border-t border-gray-700 bg-black/30 backdrop-blur-md mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400">
          <p>Built for Netrum Labs Challenge • Built on Base ⚡</p>
          <p className="text-sm mt-2">Updates every 30 seconds • Rate limited API</p>
        </div>
      </footer>
    </div>
  );
}
