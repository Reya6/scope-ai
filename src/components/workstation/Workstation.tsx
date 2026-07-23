// src/components/workstation/Workstation.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  getSimulations,
  saveSimulation,
  clearSimulations,
  supabase,
} from "@/utils/storage";
import { Folder, Trash2, Search, UserPlus } from "lucide-react";

type Metric = { value: number; ciLow?: number; ciHigh?: number };
type SimResult = {
  metrics?: Record<string, Metric>;
  rationales?: Record<string, string>;
  summary?: string;
  sampleResponses?: string[];
  variants?: Array<{ name: string; metrics: Record<string, Metric> }>;
  result?: any;
};
type GeneratedVariant = {
  name?: string;
  subject: string;
  body: string;
  notes?: string;
};
type SavedSim = {
  id: string;
  subject: string;
  body: string;
  persona: string;
  numVariants: number;
  result: any;
  timestamp: number;
  synced?: boolean;
};

const USE_REAL_API = true;
const NAVBAR_HEIGHT = 64; // adjust if your navbar is taller

export default function Workstation() {
  // Inputs
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [persona, setPersona] = useState("");
  const [numVariants, setNumVariants] = useState(1);

  // Simulation
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Variant generation
  const [showVariantGen, setShowVariantGen] = useState(false);
  const [variantCount, setVariantCount] = useState(2);
  const [variantLoading, setVariantLoading] = useState(false);
  const [generatedVariants, setGeneratedVariants] = useState<
    GeneratedVariant[]
  >([]);

  // Memory sidebar
  const [saved, setSaved] = useState<SavedSim[]>([]);
  const [showMemory, setShowMemory] = useState(false);
  const [search, setSearch] = useState("");

  // Invite modal (NEW, minimal and isolated)
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCompanyId, setInviteCompanyId] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);

  const topRef = useRef<HTMLDivElement | null>(null);

  // Utility
  function pct(n: number) {
    if (typeof n !== "number" || Number.isNaN(n)) return "0%";
    return `${Math.round(n * 100)}%`;
  }

  // Load saved simulations: local first, then try Supabase (robust: try both table names)
  useEffect(() => {
    try {
      const local = getSimulations() ?? [];
      setSaved(Array.isArray(local) ? local : []);
    } catch (e) {
      setSaved([]);
    }

    async function loadRemote() {
      if (!supabase) return;

      try {
        // try both 'campaigns' and 'simulations' tables (whichever exists)
        const tables = ["campaigns", "simulations"];
        let remoteData: any[] | null = null;

        for (const table of tables) {
          try {
            const { data, error } = await supabase
              .from(table)
              .select("*")
              .order("created_at", { ascending: false })
              .limit(200);
            if (error) {
              // table might not exist — continue to next
              continue;
            }
            if (data && Array.isArray(data) && data.length > 0) {
              remoteData = data;
              break;
            }
          } catch (err) {
            // ignore and continue
            continue;
          }
        }

        if (!remoteData) return;

        // Normalize remote rows to SavedSim shape and merge with local (prefer latest timestamp)
        const normalized = remoteData.map((r: any) => ({
          id: r.id,
          subject: r.subject ?? "",
          body: r.body ?? "",
          persona: r.persona ?? "",
          numVariants: r.num_variants ?? 1,
          result: r.result ?? null,
          timestamp: r.created_at
            ? new Date(r.created_at).getTime()
            : Date.now(),
          synced: true,
        })) as SavedSim[];

        // merge by id, prefer latest timestamp
        const local = getSimulations() ?? [];
        const map = new Map<string, SavedSim>();
        [...normalized, ...(Array.isArray(local) ? local : [])].forEach((s) => {
          const ex = map.get(s.id);
          if (!ex || s.timestamp > ex.timestamp) map.set(s.id, s);
        });

        const merged = Array.from(map.values()).sort(
          (a, b) => b.timestamp - a.timestamp,
        );
        setSaved(merged);
      } catch (err) {
        console.warn("Failed to load remote saved sims:", err);
      }
    }
    loadRemote();
  }, []);

  // Save current simulation — handles both sync and async saveSimulation implementations
  async function saveCurrentSim() {
    if (!result) return;
    try {
      const maybe = saveSimulation({
        subject,
        body,
        persona,
        numVariants,
        result,
      } as any);

      // support both sync and async implementations
      const savedItem = (await Promise.resolve(maybe)) as SavedSim;
      if (!savedItem) return;
      setSaved((prev) => [savedItem, ...(Array.isArray(prev) ? prev : [])]);

      // If supabase is available and savedItem isn't marked synced, try to upsert remote copy
      if (supabase && !savedItem?.synced) {
        try {
          // try both tables; stop once one succeeds
          const tables = ["campaigns", "simulations"];
          for (const table of tables) {
            try {
              const { error } = await supabase.from(table).upsert([
                {
                  id: savedItem.id,
                  subject: savedItem.subject,
                  body: savedItem.body,
                  persona: savedItem.persona,
                  num_variants: savedItem.numVariants ?? 1,
                  result: savedItem.result,
                  created_at: new Date(savedItem.timestamp).toISOString(),
                },
              ]);
              if (!error) break;
            } catch {
              // ignore and try next table
              continue;
            }
          }
        } catch (e) {
          console.warn("Remote upsert failed:", e);
        }
      }
    } catch (e) {
      console.error("saveCurrentSim error:", e);
    }
  }

  // Delete individual simulation (local + try remote)
  async function deleteSim(id: string) {
    try {
      const remaining = (Array.isArray(saved) ? saved : []).filter(
        (s) => s.id !== id,
      );
      setSaved(remaining);
      localStorage.setItem("simulations", JSON.stringify(remaining));

      if (supabase) {
        const tables = ["campaigns", "simulations"];
        for (const table of tables) {
          try {
            const { error } = await supabase.from(table).delete().eq("id", id);
            if (!error) break;
          } catch {
            // continue trying other table name
          }
        }
      }
    } catch (err) {
      console.warn("deleteSim error:", err);
    }
  }

  // Run simulation (unchanged)
  async function runSim() {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body,
          persona,
          audience: persona,
          numVariants,
        }),
      });
      if (!res.ok) throw new Error(`Simulation failed (${res.status})`);
      const json = await res.json();
      const data = json?.result ?? json;
      setResult(data);
      setTimeout(
        () => topRef.current?.scrollIntoView({ behavior: "smooth" }),
        80,
      );
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Simulation failed");
    } finally {
      setLoading(false);
    }
  }

  // Variant helpers (unchanged)
  function normalizeVariants(raw: any, count: number): GeneratedVariant[] {
    try {
      const arr =
        raw?.result?.variants ??
        raw?.variants ??
        (Array.isArray(raw) ? raw : null);
      if (Array.isArray(arr))
        return arr.slice(0, count).map((v: any, i: number) => ({
          name: v.name ?? `Variant ${i + 1}`,
          subject: v.subject ?? `Variant ${i + 1}`,
          body: v.body ?? JSON.stringify(v),
        }));
    } catch (e) {
      console.warn("normalizeVariants error", e);
    }
    return [];
  }

  async function generateVariants() {
    setError(null);
    if (!subject && !body) {
      setError("Enter a subject or body first");
      return;
    }
    setVariantLoading(true);
    try {
      const res = await fetch("/api/generate-variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body, persona, variantCount }),
      });
      if (!res.ok) throw new Error(`Variant generation failed (${res.status})`);
      const json = await res.json();
      const resultObj = json?.result ?? json;
      const variants = normalizeVariants(resultObj, variantCount);
      setGeneratedVariants(variants);
      setTimeout(() => {
        const el = document.querySelector("#variant-section");
        if (el) (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
      }, 80);
    } catch (e: any) {
      setError(e?.message ?? "Failed to generate variants");
    } finally {
      setVariantLoading(false);
    }
  }

  function simulateVariant(v: GeneratedVariant) {
    setSubject(v.subject);
    setBody(v.body);
    setTimeout(() => runSim(), 150);
  }

  const filteredSims = (Array.isArray(saved) ? saved : []).filter(
    (s) =>
      (s.subject ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (s.persona ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  // ---------- Invite helpers (MINIMAL changes only) ----------
  const openInvite = async () => {
    setInviteMessage(null);
    // attempt to prefill company id if we can (non-blocking)
    try {
      if (!supabase) {
        // supabase not initialized client-side — skip session prefill
      } else {
        const sessionResp = await supabase.auth.getSession();
        const user = sessionResp?.data?.session?.user;
        if (user && user.id) {
          // optionally we could fetch user's company from backend — skipping to keep minimal
          // just prefill invited_by implicitly when sending (done in sendInvite server-side)
        }
      }
    } catch {
      // ignore
    }
    setShowInvite(true);
  };

  const closeInvite = () => {
    setShowInvite(false);
    setInviteEmail("");
    setInviteCompanyId("");
    setInviteLoading(false);
    setInviteMessage(null);
  };

  const sendInvite = async () => {
    setInviteMessage(null);
    if (!inviteEmail || !inviteEmail.includes("@")) {
      setInviteMessage("Enter a valid email address.");
      return;
    }
    setInviteLoading(true);
    try {
      // try to get current user id if supabase client available; this is non-fatal if not present
      let invited_by: string | null = null;
      try {
        if (supabase) {
          const sessionResp = await supabase.auth.getSession();
          invited_by = sessionResp?.data?.session?.user?.id ?? null;
        }
      } catch {
        invited_by = null;
      }

      const payload: any = {
        email: inviteEmail,
      };
      if (inviteCompanyId) payload.companyId = inviteCompanyId;
      if (invited_by) payload.invitedBy = invited_by;

      const res = await fetch("/api/enterprise/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json?.success === false) {
        const msg = json?.error ?? `Invite failed (${res.status})`;
        setInviteMessage(String(msg));
        setInviteLoading(false);
        return;
      }

      setInviteMessage("Invite sent successfully.");
      setInviteLoading(false);
      // keep modal open for review for short time, then close
      setTimeout(() => {
        closeInvite();
      }, 1400);
    } catch (err: any) {
      console.error("Invite error:", err);
      setInviteMessage("Invite failed — check server logs.");
      setInviteLoading(false);
    }
  };

  // ----------------------------------------------------

  return (
    <div className="relative flex">
      {/* Sidebar */}
      {showMemory && (
        <aside
          className="w-72 bg-white/10 border-r border-white/20 p-4 text-white fixed left-0 z-20 rounded-r-xl shadow-lg backdrop-blur-md"
          style={{
            top: `${NAVBAR_HEIGHT}px`,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          }}
          aria-label="Saved simulations"
        >
          <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h3 className="font-semibold text-lg">Saved Simulations</h3>
            </div>

            {/* Search Bar (non-scrolling) */}
            <div className="relative mb-3 flex-shrink-0">
              <Search
                size={16}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-7 pr-2 py-1.5 text-sm rounded bg-white/5 text-white border border-white/10 focus:outline-none"
                aria-label="Search saved simulations"
              />
            </div>

            {/* Scrollable list (vertical scroll inside panel) */}
            <div
              className="flex-1 overflow-y-auto pr-1"
              style={{ minHeight: 0 }}
              role="list"
            >
              {filteredSims.length === 0 ? (
                <p className="text-gray-400 text-sm">No saved simulations.</p>
              ) : (
                <ul className="space-y-3">
                  {filteredSims.map((s) => (
                    <li
                      key={s.id}
                      className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/15 transition flex items-start justify-between"
                    >
                      <div
                        className="cursor-pointer flex-1 pr-2"
                        onClick={() => {
                          setSubject(s.subject);
                          setBody(s.body);
                          setPersona(s.persona);
                          setResult(s.result);
                          setShowMemory(false);
                        }}
                      >
                        <p className="font-medium text-sm truncate">
                          {s.subject || "Untitled Campaign"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(s.timestamp).toLocaleString()}
                        </p>
                      </div>

                      {/* Individual delete button */}
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          deleteSim(s.id);
                        }}
                        aria-label={`Delete saved simulation ${s.subject}`}
                        className="ml-3 flex-shrink-0"
                        title="Delete"
                      >
                        <Trash2
                          size={16}
                          className="text-red-400 hover:text-red-500 cursor-pointer"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Sticky footer with Clear All */}
            <div className="mt-3 flex-shrink-0 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  clearSimulations();
                  setSaved([]);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded"
                aria-label="Clear all saved simulations"
              >
                Clear All
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Section */}
      <div
        ref={topRef}
        className={`max-w-4xl mx-auto p-6 bg-white/5 rounded-md border border-white/10 transition-all ${
          showMemory ? "ml-72" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Campaign Workstation
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMemory((s) => !s)}
              className="p-2 bg-[#E26D5A] rounded hover:bg-[#c85849] transition"
              title="Toggle Memory"
            >
              <Folder size={20} />
            </button>

            {/* Invite button (NEW) */}
            <button
              onClick={openInvite}
              className="p-2 bg-[#1F2937] rounded hover:bg-gray-700 transition flex items-center gap-1"
              title="Invite team member"
            >
              <UserPlus size={18} />
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject line"
            className="w-full p-3 rounded bg-white/5 text-white border border-white/10"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body content"
            rows={6}
            className="w-full p-3 rounded bg-white/5 text-white border border-white/10"
          />
          <input
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="Recipient persona"
            className="w-full p-3 rounded bg-white/5 text-white border border-white/10"
          />

          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-300">Variants</label>
            <input
              type="number"
              min={1}
              max={6}
              value={numVariants}
              onChange={(e) => setNumVariants(Number(e.target.value))}
              className="w-20 p-2 rounded bg-white/5 text-white border border-white/10"
            />
            <button
              onClick={runSim}
              disabled={loading}
              className="ml-auto px-4 py-2 bg-[#E26D5A] hover:bg-[#c85849] transition-colors rounded text-white font-semibold"
            >
              {loading ? "Simulating..." : "Run Simulation"}
            </button>
          </div>
          {error && <div className="text-red-400 mt-2">{error}</div>}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                AI Campaign Analysis
              </h3>
              <button
                onClick={saveCurrentSim}
                className="text-sm bg-[#E26D5A] px-3 py-1 rounded hover:bg-[#c85849]"
              >
                Save
              </button>
            </div>

            {result.metrics && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(result.metrics).map(([key, metric]) => (
                  <div
                    key={key}
                    className="bg-white/10 p-4 rounded-lg border border-white/20 shadow-sm hover:bg-white/20 transition"
                  >
                    <div className="text-lg font-semibold text-white capitalize">
                      {key} Probability
                    </div>
                    <div className="text-2xl font-bold text-[#E26D5A] mt-1">
                      {pct(metric.value)}
                    </div>
                    {result.rationales?.[key] && (
                      <p className="text-sm text-gray-200 mt-2">
                        {result.rationales[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {result.summary && (
              <div className="bg-white/10 p-5 rounded-lg border border-white/20">
                <h4 className="font-semibold text-white mb-2">Summary</h4>
                <p className="text-sm text-gray-200">{result.summary}</p>
              </div>
            )}

            {result.sampleResponses?.length ? (
              <div className="bg-white/10 p-5 rounded-lg border border-white/20">
                <h4 className="font-semibold text-white mb-2">
                  Sample Responses
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
                  {result.sampleResponses.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}

        {/* Variant Generator */}
        <div
          id="variant-section"
          className="mt-10 border-t border-white/10 pt-6"
        >
          <button
            onClick={() => setShowVariantGen((s) => !s)}
            className="px-5 py-2 bg-[#E26D5A] text-white rounded hover:bg-[#c85849] transition font-semibold"
          >
            {showVariantGen ? "Hide Variant Generator" : "Generate Variants"}
          </button>

          {showVariantGen && (
            <div className="mt-6 bg-white/5 p-5 rounded border border-white/10">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-300">Variants:</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={variantCount}
                  onChange={(e) => setVariantCount(Number(e.target.value))}
                  className="ml-2 w-20 p-2 rounded bg-white/5 text-white border border-white/10"
                />
                <button
                  onClick={generateVariants}
                  disabled={variantLoading}
                  className="ml-4 px-4 py-2 bg-[#E26D5A] text-white rounded hover:bg-[#c85849] transition"
                >
                  {variantLoading ? "Generating..." : "Create Variants"}
                </button>
              </div>

              {generatedVariants.length > 0 && (
                <div className="mt-6 space-y-4">
                  {generatedVariants.map((v, i) => (
                    <div
                      key={i}
                      className="bg-white/10 p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center border border-white/20"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1">
                          {v.name ?? `Variant ${i + 1}`}
                        </div>
                        <div className="text-sm text-gray-200 mb-2">
                          <strong>Subject:</strong> {v.subject}
                        </div>
                        <div className="text-sm text-gray-200 whitespace-pre-line">
                          {v.body}
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0 md:ml-4 flex flex-col gap-2">
                        <button
                          onClick={() => simulateVariant(v)}
                          className="px-3 py-2 bg-[#E26D5A] text-white rounded hover:bg-[#c85849]"
                        >
                          Simulate
                        </button>
                        <button
                          onClick={() =>
                            navigator.clipboard?.writeText(
                              `Subject: ${v.subject}\n\n${v.body}`,
                            )
                          }
                          className="px-3 py-2 bg-white/10 text-white rounded hover:bg-white/20"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal (NEW) */}
      {showInvite && (
        <div
          className="fixed left-0 right-0 z-50 flex items-start justify-center"
          style={{ top: `${NAVBAR_HEIGHT + 16}px`, pointerEvents: "auto" }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white border border-black rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Invite Team Member</h3>
              <button
                onClick={closeInvite}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Close invite"
              >
                ×
              </button>
            </div>

            <label className="block text-sm mb-1">Email</label>
            <input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="someone@example.com"
              className="w-full p-3 rounded border border-gray-300 mb-3 text-black"
              type="email"
            />

            <label className="block text-sm mb-1">Company ID (optional)</label>
            <input
              value={inviteCompanyId}
              onChange={(e) => setInviteCompanyId(e.target.value)}
              placeholder="company-id (optional)"
              className="w-full p-3 rounded border border-gray-300 mb-3 text-black"
              type="text"
            />

            {inviteMessage && (
              <div className="text-sm mb-3 text-amber-600">{inviteMessage}</div>
            )}

            <div className="flex gap-3">
              <button
                onClick={sendInvite}
                disabled={inviteLoading}
                className="flex-1 bg-[#E26D5A] text-white py-2 rounded font-semibold hover:bg-[#c85849]"
              >
                {inviteLoading ? "Sending..." : "Send Invite"}
              </button>
              <button
                onClick={closeInvite}
                className="flex-1 border border-gray-300 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
