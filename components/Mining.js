'use client';

import { useEffect, useState, useRef } from "react";
import { fetchAPI } from '@/lib/api';

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-white/30 rounded ${className}`} />;
}

export default function Mining({ nodeId, walletAddress }) {
  const [canStartMining, setCanStartMining] = useState(false);
  const [lastMiningStart, setLastMiningStart] = useState(null);
  const [minedTokens, setMinedTokens] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [miningSpeed, setMiningSpeed] = useState(null);
  const [percentComplete, setPercentComplete] = useState(null);
  const [formattedRemainingTime, setFormattedRemainingTime] = useState(null);
  const [lastClaimTime, setLastClaimTime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCanStartMining(false);
    setLastMiningStart(null);
    setMinedTokens(null);
    setCanClaim(false);
    setMiningSpeed(null);
    setPercentComplete(null);
    setFormattedRemainingTime(null);
    setLastClaimTime(null);
    setLoading(true);
  }, [nodeId, walletAddress]);

    useEffect(() => {
    if (!walletAddress || !nodeId) return;

    const fetchAllData = async () => {
      setLoading(true); // Bắt đầu load
      try {
          const miningData = await fetchAPI(`/mining/cooldown/${nodeId}`)
          const claimData = await fetchAPI(`/claim/status/${walletAddress}`)
          const debugData = await fetchAPI(`/mining/debug/contract/${walletAddress}`)


        setCanStartMining(Boolean(miningData.data?.canStartMining ?? false));

        setLastMiningStart(miningData.data?.lastMiningStart ?? null);

        const mined = parseFloat(
          claimData.data?.minedTokensFormatted ??
            miningData.data?.minedTokens ??
            0
        );
        setMinedTokens(isNaN(mined) ? 0 : mined);

        setCanClaim(Boolean(claimData.data?.canClaim ?? false));
        setFormattedRemainingTime(
          claimData.data?.miningSession?.formattedRemainingTime ?? null
        );
        setLastClaimTime(claimData.data?.lastClaimTime ?? null);

        if (debugData.data?.contract?.miningInfo) {
          setMiningSpeed(
            parseFloat(debugData.data?.contract.miningInfo.speedPerSec ?? 0)
          );
          setPercentComplete(
            parseFloat(
              debugData.data?.contract.miningInfo.percentCompleteNumber ?? 0
            ) / 100
          );
        } else {
          setMiningSpeed(0);
          setPercentComplete(0);
        }
      } catch (e) {
        console.error("Mining fetch error:", e);
      } finally { 
	setLoading(false); // Kết thúc load
      }
    };

    fetchAllData();
    
    // Gợi ý: Tự động cập nhật mỗi 30 giây
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [nodeId, walletAddress]);


const formatDateTimeInline = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(
    d.getSeconds()
  )} ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};



  const status = canStartMining ? "mining" : "idle";
  const statusColors = {
    mining:
      "bg-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.45)]",
    idle:
      "bg-gray-500/40 text-gray-400 shadow-[0_0_12px_rgba(107,114,128,0.45)]",
  };

  const displayValue = (val, width = "w-16") =>
    loading || val === null ? <Skeleton className={`${width} h-5`} /> : val;

  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-6">
      <div
        className={cn(
          "absolute right-0 top-0 w-32 h-32 rounded-full blur-3xl",
          status === "mining" ? "bg-emerald-500/10" : "bg-gray-500/10"
        )}
      />

      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Thay Pickaxe bằng Emoji */}
            <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30 text-xl">
              ⛏️
            </div>
            <h3 className="font-semibold">Mining</h3>
          </div>

          <span
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
              statusColors[status]
            )}
          >
            <span
              className={cn(
                "w-2 h-2 mr-2 rounded-full animate-pulse-medium",
                status === "mining" ? "bg-emerald-400" : "bg-gray-400"
              )}
            />
            {status === "mining" ? "MINING" : "IDLE"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Metric
            icon={<span>🎁</span>} // Thay Gift
            label="Mined Tokens"
            value={displayValue(
              minedTokens !== null ? `${minedTokens.toFixed(2)} NPT` : null
            )}
          />
          <Metric
            icon={<span>⚡</span>} // Thay Zap
            label="Mining Speed"
            value={displayValue(
              miningSpeed !== null ? `${(miningSpeed / 1e18).toFixed(8)}/s` : null
            )}
          />
          <Metric
            icon={<span>🥞</span>} // Thay Layers
            label="Claim"
            value={
              loading ? <Skeleton className="w-16 h-5" /> : (
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs shadow-md",
                    canClaim
                      ? "bg-emerald-500/50 text-emerald-50"
                      : "bg-gray-400/50 text-gray-50"
                  )}
                >
                  {canClaim ? "Available" : "Unavailable"}
                </span>
              )
            }
          />
          <Metric
            icon={<span>⏳</span>} // Thay Timer
            label="Remaining Time"
            value={displayValue(formattedRemainingTime)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Metric
            icon={<span>🕒</span>} // Thay History
            label="Last Mining"
            value={displayValue(
              lastMiningStart ? formatDateTimeInline(lastMiningStart) : null
            )}
          />
          <Metric
            icon={<span>📅</span>} // Thay CalendarClock
            label="Last Claim"
            value={displayValue(
              lastClaimTime ? formatDateTimeInline(lastClaimTime) : null
            )}
          />
        </div>

        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/80 font-semibold flex items-center gap-1">
              <span className="text-green-300">📈</span> {/* Thay TrendingUp */}
              24h Progress
            </span>
            <span className="font-mono font-bold text-white">
              {percentComplete === null ? <Skeleton className="w-12 h-5" /> : `${percentComplete.toFixed(2)}%`}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 transition-all duration-1000"
              style={{ width: percentComplete === null ? "0%" : `${percentComplete}%` }}

            />
          </div>
        </div>
      </div>
    </div>
  );
}
function Metric({ icon, label, value }) {
  return (
    <div className="p-4 rounded-lg bg-muted/30 border flex flex-col items-start">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="font-mono text-sm font-medium text-white">{value}</p>
    </div>
  );
}