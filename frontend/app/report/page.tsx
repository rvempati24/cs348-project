"use client";

import { useState, useEffect, useCallback } from "react";

const API = "http://127.0.0.1:8080";

const CATEGORIES: { key: string; label: string }[] = [
  { key: "greens_speed", label: "Greens Speed" },
  { key: "greens_quality", label: "Greens Quality" },
  { key: "fairway_quality", label: "Fairway Quality" },
  { key: "bunker_maintenance", label: "Bunker Maint." },
  { key: "tee_boxes", label: "Tee Boxes" },
  { key: "rough_condition", label: "Rough" },
  { key: "pace_of_play", label: "Pace of Play" },
  { key: "staff_friendliness", label: "Staff" },
  { key: "value_for_money", label: "Value" },
];

interface ReportRow {
  course_id: number;
  name: string;
  city: string;
  state: string;
  region: string;
  avg_score: number;
  visit_count: number;
  category_averages: Record<string, number>;
  trend: "up" | "down" | "stable" | "new";
  prev_avg_score: number | null;
}

function scoreBadgeBg(score: number): string {
  if (score >= 8.5) return "bg-primary text-on-primary";
  if (score >= 7.0) return "bg-secondary text-on-secondary";
  if (score >= 5.5) return "bg-secondary-fixed text-on-secondary-fixed";
  return "bg-error-container text-on-error-container";
}

function TrendChip({ trend, prev }: { trend: string; prev: number | null }) {
  if (trend === "new") {
    return (
      <span className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
        First Data
      </span>
    );
  }
  if (trend === "up") {
    return (
      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
        ↑ Improving
        {prev !== null && <span className="text-on-surface-variant font-normal">from {prev.toFixed(1)}</span>}
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="flex items-center gap-1 text-xs font-bold text-error">
        ↓ Declining
        {prev !== null && <span className="text-on-surface-variant font-normal">from {prev.toFixed(1)}</span>}
      </span>
    );
  }
  return (
    <span className="text-xs font-bold text-on-surface-variant">→ Stable</span>
  );
}

export default function ReportPage() {
  const [states, setStates] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [results, setResults] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const [filterState, setFilterState] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    fetch(`${API}/api/courses/filters`)
      .then((r) => r.json())
      .then((d) => { setStates(d.states); setRegions(d.regions); });
  }, []);

  const runReport = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterState) params.set("state", filterState);
    if (filterRegion) params.set("region", filterRegion);
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    if (minScore > 0) params.set("min_score", String(minScore));
    const res = await fetch(`${API}/api/report?${params}`);
    setResults(await res.json());
    setFetched(true);
    setLoading(false);
  }, [filterState, filterRegion, dateFrom, dateTo, minScore]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runReport();
  }

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-8 py-12">

      {/* Hero Header */}
      <header className="mb-12">
        <span className="font-label text-secondary font-extrabold tracking-[0.2em] text-xs">
          THE DIGITAL CLUBHOUSE
        </span>
        <h1 className="font-headline text-5xl font-extrabold text-primary tracking-tight mb-4 mt-2">
          Course Conditions Report
        </h1>
        <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          The definitive daily digest of greens, fairways, and atmosphere across the nation&apos;s premier clubs.
        </p>
      </header>

      {/* Filter Controls */}
      <section className="bg-surface-container-low p-8 rounded-xl mb-16 whisper-shadow">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end mb-8">
            {/* State */}
            <div className="flex flex-col gap-2">
              <label className="font-label text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                State
              </label>
              <div className="relative">
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  className="w-full appearance-none bg-surface-container-lowest border-none rounded-lg p-3 font-body text-sm focus:ring-2 focus:ring-secondary text-primary outline-none"
                >
                  <option value="">All States</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">▾</span>
              </div>
            </div>

            {/* Region */}
            <div className="flex flex-col gap-2">
              <label className="font-label text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                Region
              </label>
              <div className="relative">
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="w-full appearance-none bg-surface-container-lowest border-none rounded-lg p-3 font-body text-sm focus:ring-2 focus:ring-secondary text-primary outline-none"
                >
                  <option value="">All Regions</option>
                  {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">▾</span>
              </div>
            </div>

            {/* Date From */}
            <div className="flex flex-col gap-2">
              <label className="font-label text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                Date Range Start
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-surface-container-lowest border-none rounded-lg p-3 font-body text-sm focus:ring-2 focus:ring-secondary text-primary outline-none"
              />
            </div>

            {/* Date To */}
            <div className="flex flex-col gap-2">
              <label className="font-label text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                Date Range End
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-surface-container-lowest border-none rounded-lg p-3 font-body text-sm focus:ring-2 focus:ring-secondary text-primary outline-none"
              />
            </div>
          </div>

          {/* Min score + Run */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-8">
            <div className="flex flex-col gap-2 w-full sm:w-72">
              <div className="flex justify-between items-center">
                <label className="font-label text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                  Min Overall Rating
                </label>
                <span className="text-secondary font-bold text-sm">
                  {minScore === 0 ? "Any" : `${minScore.toFixed(1)}+`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minScore}
                onChange={(e) => setMinScore(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-label text-xs font-bold tracking-widest uppercase flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shrink-0"
            >
              {loading ? "Running…" : "Run Report"}
            </button>
          </div>
        </form>
      </section>

      {/* Results */}
      {!fetched && (
        <div className="text-center py-20">
          <p className="font-label text-[10px] uppercase tracking-widest text-outline font-bold">
            Set your filters above and run the report
          </p>
        </div>
      )}

      {fetched && (
        <div className="grid grid-cols-1 gap-12">
          {results.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-low rounded-xl">
              <p className="font-headline text-xl font-bold text-primary mb-2">No courses found</p>
              <p className="text-on-surface-variant text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            results.map((row) => (
              <div
                key={row.course_id}
                className="group bg-surface-container-lowest rounded-xl whisper-shadow overflow-hidden transition-all duration-300"
              >
                <div className="p-8 flex flex-col md:flex-row gap-8">
                  {/* Identity panel */}
                  <div className="w-full md:w-1/3 relative">
                    {/* Colored swatch standing in for course image */}
                    <div className="w-full h-48 md:h-full min-h-[160px] rounded-lg bg-gradient-to-br from-primary-container to-primary flex items-end p-4">
                      <span className="font-label text-[10px] uppercase tracking-widest text-on-primary-container font-bold">
                        {row.region}
                      </span>
                    </div>
                    {/* Overlapping score badge */}
                    <div className={`absolute -top-4 -right-4 w-20 h-20 beli-badge rounded-full ${scoreBadgeBg(row.avg_score)} flex flex-col items-center justify-center`}>
                      <span className="font-headline text-2xl font-bold leading-none">{row.avg_score.toFixed(1)}</span>
                      <span className="font-label text-[8px] tracking-tighter uppercase opacity-80">Overall</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-label text-[10px] font-bold tracking-widest text-secondary uppercase">
                          {row.city}, {row.state}
                        </span>
                      </div>
                      <h2 className="font-headline text-3xl font-bold text-primary mb-1">{row.name}</h2>
                      <div className="flex items-center gap-6 mt-3">
                        <span className="text-on-surface-variant text-sm font-semibold">
                          {row.visit_count} visit{row.visit_count !== 1 ? "s" : ""}
                        </span>
                        <TrendChip trend={row.trend} prev={row.prev_avg_score} />
                      </div>
                    </div>

                    {/* Category bars */}
                    <div className="mt-8 pt-8 border-t border-surface-container-high grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                      {CATEGORIES.map(({ key, label }) => {
                        const val = row.category_averages[key];
                        if (val === undefined) return null;
                        const pct = ((val - 1) / 9) * 100;
                        return (
                          <div key={key}>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="font-label text-[9px] font-bold text-on-surface-variant tracking-wider uppercase">
                                {label}
                              </span>
                              <span className="text-[10px] font-bold text-primary">{val.toFixed(1)}</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {fetched && results.length > 0 && (
        <div className="mt-12 flex justify-center">
          <span className="font-label text-[10px] uppercase tracking-widest font-black text-outline">
            {results.length} course{results.length !== 1 ? "s" : ""} in results
          </span>
        </div>
      )}
    </main>
  );
}
