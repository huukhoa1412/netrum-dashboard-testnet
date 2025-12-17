'use client';

import { useEffect, useState, useRef } from "react";
import { fetchAPI } from '@/lib/api';

export default function NodeStats({ nodeId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const fetchStats = async () => {
    if (!nodeId) return;
    try {
      const r = await fetchAPI(`/lite/nodes/id/${nodeId}`);
      
      // LOG JSON để kiểm tra cấu trúc thực tế trong console
      console.log("📥 Node API Response:", r);

      if (isMounted.current) {
        // Theo JSON của bạn: Dữ liệu nằm trong r.node
        if (r && r.success) {
          setData(r.node);
        } else {
          setData({ error: true });
        }
      }
    } catch (e) {
      console.error("❌ Fetch Error:", e);
      if (isMounted.current) setData({ error: true });
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update mỗi 30s
    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [nodeId]);

  if (loading) return <div className="text-center py-10 animate-pulse text-gray-400">Loading Node Data...</div>;
  if (!data || data.error) return <div className="text-center py-10 text-red-400">Node not found or API Error.</div>;

  // Trích xuất dữ liệu từ JSON thực tế
  const metrics = data.nodeMetrics || {};
  const reqs = data.requirementsCheck || {};
  const isOnline = data.nodeStatus === "Active";

  return (
    <div className="space-y-6">
      {/* Header: Status & Wallet */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Node ID</h2>
            <p className="text-lg font-mono text-blue-400 break-all">{data.nodeId}</p>
            <p className="text-xs text-gray-500 mt-1 font-mono">Wallet: {data.wallet}</p>
          </div>
          <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-xl border border-white/5 w-fit">
            <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className={`font-bold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>{data.nodeStatus}</span>
          </div>
        </div>
      </div>

      {/* Hardware Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="CPU" value={metrics.cpu} unit="Cores" status={reqs.cpu?.ok} />
        <MetricCard label="RAM" value={(metrics.ram / 1024).toFixed(1)} unit="GB" status={reqs.ram?.ok} />
        <MetricCard label="Disk" value={metrics.disk} unit="GB" status={reqs.disk?.ok} />
        <MetricCard label="Tasks" value={data.taskCount?.toLocaleString()} unit="Done" color="purple" />
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
