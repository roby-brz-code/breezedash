"use client";

import { useState } from "react";

const formatCurrency = (amount: number, currency = "USD") =>
  `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const merchantData = {
  name: "Pickem",
  availableBalance: 487320.5,
  operationalReserve: 175000.0,
  totalBalance: 662320.5,
  pendingPayins: 42180.0,
  payInVolume: 20298.91,
  payOutVolume: 13713.86,
  settlementSchedule: "T+3 Business Days",
  nextSettlementDate: "2025-02-21",
  nextSettlementAmount: 68450.0,
  avgDailyPayouts: 25000.0,
};

const upcomingSettlements = [
  { id: "STL-01247", date: "2025-02-21", amount: 68450.0, method: "Bank (SVB ****4375)", status: "Upcoming", period: "Feb 15 – 17" },
  { id: "STL-01248", date: "2025-02-24", amount: 71200.0, method: "Bank (SVB ****4375)", status: "Scheduled", period: "Feb 18 – 19" },
  { id: "STL-01249", date: "2025-02-25", amount: 65800.0, method: "Crypto Wallet", status: "Scheduled", period: "Feb 20" },
];

const pastSettlements = [
  { id: "STL-01246", date: "2025-02-19", amount: 72100.0, method: "Bank", status: "Processed", period: "Feb 13 – 14" },
  { id: "STL-01245", date: "2025-02-18", amount: 69800.0, method: "Bank", status: "Processed", period: "Feb 12" },
  { id: "STL-01244", date: "2025-02-14", amount: 74250.0, method: "Bank", status: "Processed", period: "Feb 10 – 11" },
  { id: "STL-01243", date: "2025-02-13", amount: 67500.0, method: "Bank", status: "Processed", period: "Feb 7 – 9" },
  { id: "STL-01242", date: "2025-02-12", amount: 71900.0, method: "Crypto", status: "Processed", period: "Feb 6" },
  { id: "STL-01241", date: "2025-02-11", amount: 68300.0, method: "Bank", status: "Processed", period: "Feb 5" },
];

const weeklyVolume = [
  { week: "Sep 22", payIn: 1200, payOut: 0 }, { week: "Sep 29", payIn: 2400, payOut: 0 },
  { week: "Oct 6", payIn: 3100, payOut: 800 }, { week: "Oct 13", payIn: 4200, payOut: 1200 },
  { week: "Oct 20", payIn: 5800, payOut: 2100 }, { week: "Oct 27", payIn: 7200, payOut: 3400 },
  { week: "Nov 3", payIn: 9800, payOut: 4200 }, { week: "Nov 10", payIn: 12400, payOut: 5800 },
  { week: "Nov 17", payIn: 14200, payOut: 7100 }, { week: "Nov 24", payIn: 16800, payOut: 9200 },
  { week: "Dec 1", payIn: 19200, payOut: 11400 }, { week: "Dec 8", payIn: 22100, payOut: 12800 },
  { week: "Dec 15", payIn: 28400, payOut: 15200 }, { week: "Dec 22", payIn: 31200, payOut: 18400 },
  { week: "Dec 29", payIn: 26800, payOut: 16200 }, { week: "Jan 5", payIn: 29400, payOut: 17800 },
  { week: "Jan 12", payIn: 32100, payOut: 19200 }, { week: "Jan 19", payIn: 30800, payOut: 18600 },
  { week: "Jan 26", payIn: 33400, payOut: 20100 }, { week: "Feb 2", payIn: 35200, payOut: 21800 },
  { week: "Feb 9", payIn: 34800, payOut: 20900 },
];

const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap max-w-xs">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-800" />
        </span>
      )}
    </span>
  );
};

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="inline ml-1 cursor-help opacity-40 hover:opacity-70 transition-opacity">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 7v4M8 5.5v-.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Processed: "bg-green-50 text-green-600 border-green-200",
    Upcoming: "bg-blue-50 text-blue-600 border-blue-200",
    Scheduled: "bg-gray-50 text-gray-500 border-gray-200",
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[status] || styles.Scheduled}`}>{status}</span>;
};

const SimpleChart = () => {
  const max = Math.max(...weeklyVolume.map((d) => d.payIn));
  const w = 700;
  const h = 120;
  const px = 0;
  const py = 10;
  const cw = w - px * 2;
  const ch = h - py * 2;
  const toX = (i: number) => px + (i / (weeklyVolume.length - 1)) * cw;
  const toY = (v: number) => py + ch - (v / max) * ch;
  const makePath = (key: "payIn" | "payOut") => weeklyVolume.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d[key])}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28">
      <path d={makePath("payIn")} fill="none" stroke="#6366f1" strokeWidth="2" />
      <path d={makePath("payOut")} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
    </svg>
  );
};

const SidebarItem = ({ icon, label, active, hasArrow }: { icon: string; label: string; active?: boolean; hasArrow?: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer text-sm ${active ? "text-blue-600 bg-blue-50 font-medium" : "text-gray-500 hover:bg-gray-50"}`}>
    <span className="text-base">{icon}</span>
    <span className="flex-1">{label}</span>
    {hasArrow && <span className="text-xs text-gray-400">&rsaquo;</span>}
  </div>
);

export default function MerchantDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timePeriod, setTimePeriod] = useState("Weekly");
  const reservePct = ((merchantData.operationalReserve / merchantData.totalBalance) * 100).toFixed(1);

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm">{merchantData.name}</span>
          <span className="text-gray-400 text-xs ml-auto">&udarr;</span>
        </div>
        <div className="p-3 space-y-0.5 flex-1">
          <SidebarItem icon="&#127968;" label="Home" active={activeTab === "overview"} />
          <SidebarItem icon="&#128179;" label="Payments" hasArrow />
          <SidebarItem icon="&#128202;" label="Reporting" />
          <SidebarItem icon="&#128196;" label="Settlements" active={activeTab === "settlements"} />
          <SidebarItem icon="&#128200;" label="Forecast" active={activeTab === "forecast"} />
          <SidebarItem icon="&#128279;" label="Quick Links" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Tab bar */}
        <div className="bg-white border-b border-gray-200 px-8">
          <div className="flex gap-1">
            {[
              { key: "overview", label: "Home" },
              { key: "settlements", label: "Settlements" },
              { key: "forecast", label: "Cash Forecast" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm border-b-2 transition-colors ${
                  activeTab === tab.key ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {/* ============ OVERVIEW TAB ============ */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Transactions chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-blue-600 font-semibold text-sm">Transactions</h3>
                  <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div className="flex gap-8">
                  <div className="flex-1">
                    <SimpleChart />
                    <div className="flex gap-5 mt-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0.5 bg-indigo-500 rounded" />
                        <span className="text-xs text-gray-400">Pay-in volume</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0.5 bg-indigo-300 rounded" style={{ backgroundImage: "repeating-linear-gradient(90deg, #818cf8 0, #818cf8 3px, transparent 3px, transparent 6px)" }} />
                        <span className="text-xs text-gray-400">Pay-out volume</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right min-w-[160px]">
                    <p className="text-xs text-gray-400">Pay-in volume</p>
                    <p className="text-lg font-bold text-gray-900">${merchantData.payInVolume.toLocaleString()} USD</p>
                    <p className="text-xs text-gray-400 mt-3">Pay-out volume</p>
                    <p className="text-lg font-bold text-gray-900">${merchantData.payOutVolume.toLocaleString()} USDC</p>
                  </div>
                </div>
              </div>

              {/* Balance */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-blue-600 font-semibold text-sm">Balances</h3>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-400">Available balance</p>
                    <p className="text-2xl font-bold text-gray-900 mt-0.5">{formatCurrency(merchantData.availableBalance)}</p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="text-xs text-gray-400">Operational reserve</p>
                      <Tooltip text="7x avg daily payouts (3-week rolling). Recalculated weekly. Ensures 1 week of payout runway.">
                        <InfoIcon />
                      </Tooltip>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-0.5">{formatCurrency(merchantData.operationalReserve)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total balance</p>
                    <p className="text-2xl font-bold text-gray-900 mt-0.5">{formatCurrency(merchantData.totalBalance)}</p>
                  </div>
                </div>
                {/* Balance bar */}
                <div className="mt-4">
                  <div className="flex rounded-full h-2 overflow-hidden bg-gray-100">
                    <div className="bg-blue-500 rounded-l-full transition-all" style={{ width: `${100 - parseFloat(reservePct)}%` }} />
                    <div className="bg-blue-200 rounded-r-full transition-all" style={{ width: `${reservePct}%` }} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs text-gray-400">Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-200" />
                      <span className="text-xs text-gray-400">Reserve ({reservePct}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next settlement + Reports side by side */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-blue-600 font-semibold text-sm mb-3">Next Settlement</h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(merchantData.nextSettlementAmount)}</p>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(merchantData.nextSettlementDate)}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-gray-400">Schedule</p>
                        <Tooltip text="Settlements are calculated daily and released on a rolling T+3 business day cycle.">
                          <InfoIcon />
                        </Tooltip>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{merchantData.settlementSchedule}</p>
                    </div>
                  </div>
                  {/* Mini upcoming list */}
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                    {upcomingSettlements.map((s) => (
                      <div key={s.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-mono">{s.id}</span>
                          <span className="text-xs text-gray-500">{formatDate(s.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(s.amount)}</span>
                          <StatusBadge status={s.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-blue-600 font-semibold text-sm">Recent Settlements</h3>
                    <button onClick={() => setActiveTab("settlements")} className="text-xs text-blue-500 hover:text-blue-600">View all &nearr;</button>
                  </div>
                  <div className="space-y-2">
                    {pastSettlements.slice(0, 5).map((s) => (
                      <div key={s.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-mono">{s.id}</span>
                          <span className="text-xs text-gray-500">{formatDate(s.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(s.amount)}</span>
                          <StatusBadge status={s.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ SETTLEMENTS TAB ============ */}
          {activeTab === "settlements" && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-blue-600 font-semibold text-sm">Upcoming Settlements</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["ID", "Period", "Settlement Date", "Amount", "Method", "Status"].map((h) => (
                        <th key={h} className={`text-xs font-medium text-gray-400 pb-2.5 pr-4 ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingSettlements.map((s) => (
                      <tr key={s.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pr-4 text-sm font-mono text-gray-500">{s.id}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500">{s.period}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500">{formatDate(s.date)}</td>
                        <td className="py-3 pr-4 text-sm font-medium text-gray-900 text-right">{formatCurrency(s.amount)}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500">{s.method}</td>
                        <td className="py-3"><StatusBadge status={s.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-blue-600 font-semibold text-sm">Settlement History</h3>
                  <button className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5">
                    <span>&darr;</span> Export CSV
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["ID", "Period", "Settlement Date", "Amount", "Method", "Status"].map((h) => (
                        <th key={h} className={`text-xs font-medium text-gray-400 pb-2.5 pr-4 ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pastSettlements.map((s) => (
                      <tr key={s.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pr-4 text-sm font-mono text-gray-500">{s.id}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500">{s.period}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500">{formatDate(s.date)}</td>
                        <td className="py-3 pr-4 text-sm font-medium text-gray-900 text-right">{formatCurrency(s.amount)}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500">{s.method}</td>
                        <td className="py-3"><StatusBadge status={s.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ FORECAST TAB ============ */}
          {activeTab === "forecast" && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Est. Settlements (Next 7 Days)", value: 205450, color: "text-gray-900" },
                  { label: "Est. User Payouts (Next 7 Days)", value: 176400, color: "text-gray-900" },
                  { label: "Projected Available Balance", value: 516370.5, color: "text-green-600" },
                ].map((card, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs text-gray-400 mb-1">{card.label}</p>
                    <p className={`text-xl font-bold ${card.color}`}>{formatCurrency(card.value)}</p>
                    <p className="text-xs text-gray-400 mt-1">Based on 3-week rolling average</p>
                  </div>
                ))}
              </div>

              {/* Pipeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-blue-600 font-semibold text-sm mb-4">Settlement Pipeline</h3>
                <div className="space-y-3">
                  {[
                    { label: "Processing (T+0)", amount: 103700, color: "bg-gray-300", pct: 30 },
                    { label: "Reconciling (T+1)", amount: 97300, color: "bg-blue-300", pct: 28 },
                    { label: "Ready for Release (T+2)", amount: 88900, color: "bg-blue-400", pct: 26 },
                    { label: "Settling Today (T+3)", amount: 68450, color: "bg-blue-600", pct: 20 },
                  ].map((stage, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-40 text-sm text-gray-600">{stage.label}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden">
                        <div className={`h-full rounded-full ${stage.color} flex items-center justify-end pr-3 transition-all`} style={{ width: `${stage.pct + 20}%` }}>
                          <span className="text-xs font-medium text-white">{formatCurrency(stage.amount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forecast table */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-blue-600 font-semibold text-sm mb-4">7-Day Settlement Forecast</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Date", "Est. Pay-ins", "Est. User Payouts", "Est. Settlement", "Proj. Balance"].map((h) => (
                        <th key={h} className={`text-xs font-medium text-gray-400 pb-2.5 pr-4 ${h !== "Date" ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: "Feb 21", payins: 99400, payouts: 25200, settlement: 68450, balance: 487320 },
                      { date: "Feb 22 (Sat)", payins: 95200, payouts: 24800, settlement: 0, balance: 557720 },
                      { date: "Feb 23 (Sun)", payins: 92100, payouts: 23900, settlement: 0, balance: 625920 },
                      { date: "Feb 24", payins: 101300, payouts: 25600, settlement: 71200, balance: 630420 },
                      { date: "Feb 25", payins: 98700, payouts: 24500, settlement: 65800, balance: 638820 },
                      { date: "Feb 26", payins: 97500, payouts: 26100, settlement: 67800, balance: 642420 },
                      { date: "Feb 27", payins: 100800, payouts: 25400, settlement: 69500, balance: 648320 },
                    ].map((day, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="py-2.5 pr-4 text-sm text-gray-600">{day.date}</td>
                        <td className="py-2.5 pr-4 text-sm text-right text-green-600">+{formatCurrency(day.payins)}</td>
                        <td className="py-2.5 pr-4 text-sm text-right text-orange-500">-{formatCurrency(day.payouts)}</td>
                        <td className="py-2.5 pr-4 text-sm text-right font-medium text-gray-900">{day.settlement > 0 ? formatCurrency(day.settlement) : "\u2014"}</td>
                        <td className="py-2.5 text-sm text-right font-medium text-gray-700">{formatCurrency(day.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-3">Estimates based on trailing 3-week averages. Actual amounts may vary. No settlements on weekends.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
