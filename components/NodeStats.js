'use client';

import { useEffect, useState, useRef } from "react";
import { fetchAPI } from '@/lib/api';


export default function NodeStats({ nodeId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const isMounted = useRef(true);

  const fetchStats = async (isSilent = false) => {
    if (!nodeId) return;
    if (!isSilent) setLoading(true); // Chỉ hiện loading nếu không phải update ngầm

    try {
      // Gọi trực tiếp đến endpoint node cụ thể
      const r = await fetchAPI(`/lite/nodes/id/${nodeId}`);  
      if (isMounted.current) {
        // Cấu trúc API: { success: true, data: { stats: { ... } } }
        const nodeData = r?.data?.node || r?.node || r;
        setStats(nodeData);
	setCountdown(60); // Reset bộ đếm về 30 sau khi tải xong
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
    // 1. Tải dữ liệu lần đầu (hiện Loading)
    fetchStats();

    // 2. Thiết lập bộ đếm ngược 1 giây chạy một lần
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchStats(true); // Gọi cập nhật ngầm (silent) khi hết thời gian
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

      return () => {
      isMounted.current = false;
      clearInterval(timer);
    };
  }, [nodeId]); // Chạy lại nếu đổi nodeId

// Chỉ hiện màn hình Loading to nếu chưa có dữ liệu (lần đầu)
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (stats.error) return <ErrorState />;

  // Trích xuất dữ liệu từ cấu trúc API Netrum
  const isActive = stats.nodeStatus === "Active";
 
  // Trích xuất dữ liệu từ JSON thực tế
  const metrics = stats.nodeMetrics || {};
  const reqs = stats.requirementsCheck || {};

  return (
    <div className="space-y-6">
      {/* Bộ đếm thời gian giống NetworkStats */}
      <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between border border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          <span className="text-gray-400">Auto-refreshing Node Data</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Next update:</span>
          <span className="text-2xl font-mono text-blue-400">{countdown}s</span>
        </div>
      </div>
      {/* Header: Status & Wallet */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Node ID</h2>
            <p className="text-lg font-mono text-blue-400 break-all">{stats.nodeId}</p>
            <p className="text-xs text-gray-500 mt-1 font-mono">Wallet: {stats.wallet}</p>
            <p className="text-xs text-gray-500 mt-1 font-mono">Created: {stats.createdAt}</p>
            <p className="text-xs text-gray-500 mt-1 font-mono">Last claim: {stats.lastClaimTime}</p>
          </div>
          <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-xl border border-white/5 w-fit">
            <span className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className={`font-bold ${isActive ? 'text-green-400' : 'text-red-400'}`}>{stats.nodeStatus}</span>
          </div>
        </div>
      </div>

{/* Hardware Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="CPU" value={metrics.cpu} unit="Cores" status={reqs.cpu?.ok} />
        <MetricCard label="RAM" value={(metrics.ram / 1024).toFixed(1)} unit="GB" status={reqs.ram?.ok} />
        <MetricCard label="Disk" value={metrics.disk} unit="GB" status={reqs.disk?.ok} />
      </div>

      {/* Network Speeds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
          <span className="text-gray-400">Download Speed</span>
          <span className="text-xl font-bold text-white">{metrics.speed} <small className="text-gray-500">Mbps</small></span>
        </div>
        <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
          <span className="text-gray-400">Upload Speed</span>
          <span className="text-xl font-bold text-white">{metrics.uploadSpeed} <small className="text-gray-500">Mbps</small></span>
        </div>
      </div>

      {/* Requirements Footer */}
      <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
        <span className="text-sm text-blue-300">System Requirements Check:</span>
        <span className="font-bold text-blue-400">{reqs.status?.ok ? "✅ ALL PASSED" : "⚠️ FAILED"}</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, status, color = "blue" }) {
  return (
    <div className="bg-gray-800/30 border border-gray-700 p-4 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
      <p className="text-gray-500 text-xs font-bold uppercase">{label}</p>
      <p className="text-2xl font-black text-white mt-1">
        {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
      </p>
      {status !== undefined && (
        <span className={`absolute top-2 right-2 text-xs ${status ? 'text-green-500' : 'text-red-500'}`}>
          {status ? '●' : '●'}
        </span>
      )}
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
