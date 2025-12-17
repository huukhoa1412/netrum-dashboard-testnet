'use client';

import { useEffect, useState, useRef } from "react";
import { fetchAPI } from '@/lib/api';

export default function NodeStats({ nodeId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const fetchStats = async () => {
    if (!nodeId) return;
    try {
      // Gọi trực tiếp đến endpoint node cụ thể
      const r = await fetchAPI(`/lite/nodes/id/${nodeId}`);

      // --- PHẦN CONSOLE.LOG ĐỂ DEBUG ---
      console.group("🔍 Debug Node API");
      console.log("Endpoint:", `/lite/nodes/id/${nodeId}`);
      console.log("Raw Response:", r);
      
      if (isMounted.current) {
        // Cấu trúc API: { success: true, data: { stats: { ... } } }
        const nodeData = r?.data?.stats || r?.stats || r;
        setStats(nodeData);
      }
    } catch (e) {
      console.error("NodeStats fetch error:", e);
      if (isMounted.current) setStats({ error: true });
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    setLoading(true);
    fetchStats();

    // Tự động làm mới mỗi 60 giây
    const interval = setInterval(fetchStats, 60000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [nodeId]);

  if (loading) return <SkeletonLoader />;
  if (!stats || stats.error) return <ErrorState />;

  // Trích xuất dữ liệu từ cấu trúc API Netrum
  const lastSync = stats.lastSuccessfulSync?.details || {};
  const metrics = lastSync.metrics || {};
  const isActive = lastSync.syncStatus === "Active";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Status Header Area */}
      <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${isActive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <span className="text-2xl">{isActive ? '✅' : '❌'}</span>
          </div>
          <div>
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Node Status</h2>
            <p className={`text-2xl font-black ${isActive ? 'text-green-400' : 'text-red-400'}`}>
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Requirements</span>
          <span className={`text-lg font-bold ${lastSync.meetsRequirements ? 'text-blue-400' : 'text-yellow-400'}`}>
            {lastSync.meetsRequirements ? "PASSED" : "FAILED"}
          </span>
        </div>
      </div>

      {/* Hardware Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="CPU Logic" value={metrics.cpu} unit="Cores" color="blue" />
        <MetricCard label="Memory" value={metrics.ramGB} unit="GB" color="purple" />
        <MetricCard label="Disk Space" value={metrics.diskGB} unit="GB" color="green" />
        <MetricCard label="Network Speed" value={metrics.speedMbps} unit="Mbps" color="yellow" />
        <MetricCard label="Upload" value={metrics.uploadSpeedMbps} unit="Mbps" color="orange" />
        <MetricCard label="Node Version" value={stats.version} unit="" color="indigo" isText />
      </div>

      {/* Sync Details */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
        <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-tighter">Sync Timeline</h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Last Successful Sync:</span>
          <span className="text-white font-mono">{new Date(stats.lastSuccessfulSync?.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, color, isText = false }) {
  return (
    <div className="bg-gray-800/20 border border-gray-700/50 p-5 rounded-2xl hover:border-blue-500/30 transition-all group">
      <p className="text-gray-500 text-xs font-bold uppercase mb-2">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
          {value || "0"}
        </span>
        {!isText && <span className="text-xs font-bold text-gray-600">{unit}</span>}
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-24 bg-gray-800/50 rounded-2xl"></div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-24 bg-gray-800/20 rounded-2xl"></div>)}
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="text-center py-12 bg-red-900/10 border border-red-500/20 rounded-2xl">
      <p className="text-red-400 font-bold">Node ID not found or API error.</p>
      <p className="text-sm text-gray-500 mt-1">Please verify your ID in Settings.</p>
    </div>
  );
}
