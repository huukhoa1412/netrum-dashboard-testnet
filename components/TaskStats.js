'use client';

import { useEffect, useState, useRef } from "react";
import { fetchAPI } from '@/lib/api';


function formatTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())} - ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export default function TaskStats({ nodeId }) {
  const [taskData, setTaskData] = useState(null)
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    setTaskData(null);
    if (!nodeId) return;

    let active = true;

    const fetchTaskStats = async () => {

    try {
      // Gọi trực tiếp đến endpoint node cụ thể
      const r = await fetchAPI(`/polling/node-stats/${nodeId}`);
        
      if (!active) return;

        setTaskData(r && !r.error ? r : { error: true });

      } catch (e) {

        console.error("TaskStats fetch error:", e);

        if (!active) return;

        setTaskData({ error: true });

      }

    };
	
    fetchTaskStats();

    return () => {
      isMounted.current = false;
      active = false;
    };
  }, [nodeId]);
// --- LOGIC RENDER PHẢI NẰM TRONG NÀY ---
  if (!taskData) return <SkeletonLoader />;
  
  if (taskData.error) return (
    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center">
      ⚠️ Failed to load Task Stats. Node ID may be invalid.
    </div>
  );

  const {
    lastPolledAt,
    lastTaskCompleted,
    lastTaskAssigned,
    ttsPowerStatus,
    availableRam,
    taskCount,
  } = taskData.data;
console.log("Trạng thái taskData hiện tại:", taskData);

  return (
    <div className="bg-gray-800/20 border border-white/5 rounded-3xl p-6 animate-in fade-in duration-500">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="text-blue-500">📋</span> Task Execution Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ul className="space-y-4">
          <StatItem label="Total Tasks" value={(taskCount ?? 0)} highlight />
          <StatItem label="TTS Power Status" value={ttsPowerStatus || "OFF"} isStatus />
          <StatItem label="Available RAM" value={`${(availableRam ?? 0).toLocaleString()} GB`} />
        </ul>

        <ul className="space-y-4">
          <StatItem label="Last Polled" value={formatTime(lastPolledAt)} isTime />
          <StatItem label="Last Task Assigned" value={formatTime(lastTaskAssigned)} isTime />
          <StatItem label="Last Task Completed" value={formatTime(lastTaskCompleted)} isTime />
        </ul>
      </div>
    </div>
  );
}

// --- CÁC COMPONENT PHỤ ---

function StatItem({ label, value, highlight, isStatus, isTime }) {
  return (
    <li className="flex flex-col p-3 bg-white/5 rounded-xl border border-white/5">
      <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</span>
      <span className={`text-sm mt-1 font-mono ${
        highlight ? 'text-blue-400 text-lg font-bold' : 
        isStatus && value === 'ON' ? 'text-green-400 font-bold' : 'text-gray-200'
      }`}>
        {value}
      </span>
    </li>
  );
}

function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 w-48 bg-gray-800 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-16 bg-gray-800/50 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}