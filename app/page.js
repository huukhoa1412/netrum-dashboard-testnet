'use client';

import { useState } from 'react';
import NetworkStats from '@/components/NetworkStats';
import NodeStats from '@/components/NodeStats';
import TaskStats from '@/components/TaskStats';
import Mining from '@/components/Mining';
import favicon from '../app/logo.png'; 

function NoNodeIdState({ setShowSettings }) {
  return (
    <div className="text-center py-20 bg-gray-800/20 rounded-3xl border border-dashed border-gray-700 animate-in fade-in zoom-in duration-500">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="text-xl font-bold text-white mb-2">No Node ID configured yet</h3>
      <p className="text-gray-400 mb-6 max-w-xs mx-auto">
        Vui lòng nhập Netrum Node ID trong phần cài đặt để bắt đầu theo dõi thông số của bạn.
      </p>
      <button 
        onClick={() => setShowSettings(true)}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20"
      >
        ⚙️ Open Settings
      </button>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('network');
  const [nodeId, setNodeId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Hàm để lưu và tự động chuyển tab
  const handleSave = () => {
    setShowSettings(false);
    if (nodeId || walletAddress) {
      setActiveTab('mining'); // Chuyển sang tab node sau khi nhập ID
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
    <header className="border-b border-gray-700 bg-black/30 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Khối Logo mới */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700 overflow-hidden">
                <img src={favicon.src} alt="Netrum Logo" className="w-10 h-10 object-contain p-1" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Netrum <span className="text-blue-500">Dashboard</span>
              </h1>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                Base Node Monitor
              </p>
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
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>⚙️</span> Settings
            </h2>
            
            <div className="space-y-4">
              {/* Ô nhập Node ID */}
              <div>
                <label className="block text-sm text-gray-400 mb-2 font-medium">Netrum Node ID</label>
                <input
                  type="text"
                  value={nodeId}
                  onChange={(e) => setNodeId(e.target.value)}
                  placeholder="e.g. 12345"
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all"
                />
              </div>

              {/* 2. Ô nhập Wallet Address mới thêm vào */}
              <div>
                <label className="block text-sm text-gray-400 mb-2 font-medium">Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white transition-all"
                />
                <p className="text-[10px] text-gray-500 mt-1 italic">* Dùng để theo dõi phần thưởng (Rewards)</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave} // Sử dụng hàm handleSave đã khai báo ở trên
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
{/* Navigation Tabs */}
<div className="container mx-auto px-4 py-6">
  <div className="flex gap-2 p-1 bg-black/20 rounded-xl w-fit border border-white/5 overflow-x-auto">
    <button
      onClick={() => setActiveTab('network')}
      className={`px-6 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
        activeTab === 'network' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-white/5 text-gray-400'
      }`}
    >
      📊 Network Overview
    </button>
    <button
      onClick={() => setActiveTab('node')}
      className={`px-6 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
        activeTab === 'node' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-white/5 text-gray-400'
      }`}
    >
      ⛏️ My Node Stats
    </button>
    
    {/* Tab Task Stats mới thêm vào */}
    <button
      onClick={() => setActiveTab('tasks')}
      className={`px-6 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
        activeTab === 'tasks' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-white/5 text-gray-400'
      }`}
    >
      📋 Task Stats
    </button>

       {/* Tab Mining mới */}
          <button
            onClick={() => setActiveTab('mining')}
            className={`px-6 py-2 rounded-lg whitespace-nowrap transition-all ${activeTab === 'mining' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}
          >
            ⚡ Mining Live
          </button>

  </div>
</div>

{/* Main Content Area */}
    <main className="container mx-auto px-4 pb-12 min-h-[50vh]">
        {activeTab === 'network' && <NetworkStats />}
        
        {/* 3. Truyền walletAddress vào các component nếu cần thiết */}
        {activeTab === 'node' && (
          (nodeId || walletAddress) ? (
            <NodeStats nodeId={nodeId} walletAddress={walletAddress} /> 
          ) : (
            <NoNodeIdState setShowSettings={setShowSettings} />
          )
        )}

        {activeTab === 'tasks' && (
          (nodeId || walletAddress) ? (
            <TaskStats nodeId={nodeId} walletAddress={walletAddress} />
          ) : (
            <NoNodeIdState setShowSettings={setShowSettings} />
          )
        )}


{/* Tab Mining mới thêm vào */}
  {activeTab === 'mining' && (
    (nodeId || walletAddress) ? (
      <Mining nodeId={nodeId} walletAddress={walletAddress} />
    ) : (
      <NoNodeIdState setShowSettings={setShowSettings} />
    )
  )}
      </main>

      <footer className="border-t border-gray-700 bg-black/30 backdrop-blur-md mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400">
          <p>Built for Netrum Labs Challenge • Code by Le Huu Khoa ⚡</p>
          <p className="text-sm mt-2">Updates every 30 seconds • Rate limited API</p>
        </div>
      </footer>
    </div>
  );
}
