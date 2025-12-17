'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';

export default function NetworkStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(30);

  const loadStats = async () => {
    setLoading(true);
    const result = await fetchAPI('/lite/nodes/stats');
    if (!result.error) {
      setStats(result.data?.stats);
    }
    setLoading(false);
    setCountdown(30);
  };

  useEffect(() => {
    loadStats();
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadStats();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between">
        <span className="text-gray-400">Next update in:</span>
        <span className="text-2xl font-mono text-blue-400">{countdown}s</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📈" title="Total Nodes" value={stats?.totalNodes || 'N/A'} color="blue" />
        <StatCard icon="✅" title="Active Nodes" value={stats?.activeNodes || 'N/A'} color="green" />
        <StatCard icon="🌐" title="Inactive Node" value={stats?.inactiveNodes || 'N/A'} color="purple" />
        <StatCard icon="⛏️" title="Total Tasks" value={stats?.totalTasks || 'N/A'} color="yellow" />
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📈" title="Total Nodes" value={stats?.totalNodes || 'N/A'} color="blue" />
        <StatCard icon="✅" title="Active Nodes" value={stats?.activeNodes || 'N/A'} color="green" />
        <StatCard icon="🌐" title="Inactive Node" value={stats?.inactiveNodes || 'N/A'} color="purple" />
        <StatCard icon="⛏️" title="Total Tasks" value={stats?.totalTasks || 'N/A'} color="yellow" />
      </div>

      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold mb-2">💎 Total Tokens</h3>
        <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          {stats?.totalTasks || 'N/A'} NPT
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: 'from-blue-900/50 to-blue-800/30 border-blue-500/30',
    green: 'from-green-900/50 to-green-800/30 border-green-500/30',
    purple: 'from-purple-900/50 to-purple-800/30 border-purple-500/30',
    yellow: 'from-yellow-900/50 to-yellow-800/30 border-yellow-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-6 border`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
