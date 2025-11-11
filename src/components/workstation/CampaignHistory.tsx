"use client";

import React, { useEffect, useState } from "react";
import { getSimulations, deleteSimulation, SavedSim } from "@/utils/storage";

type Props = {
  onLoad: (sim: SavedSim) => void;
  refreshSignal?: number; // bump this to reload list
  maxItems?: number;
};

export default function CampaignHistory({
  onLoad,
  refreshSignal = 0,
  maxItems = 20,
}: Props) {
  const [items, setItems] = useState<SavedSim[]>([]);

  useEffect(() => {
    async function fetchItems() {
      const all = await getSimulations(); // await async
      setItems(all.slice(0, maxItems));
    }
    fetchItems();
  }, [refreshSignal, maxItems]);

  function handleDelete(id: string) {
    deleteSimulation(id).then(() => {
      getSimulations().then((all) => setItems(all.slice(0, maxItems)));
    });
  }

  function fmt(ts: number) {
    try {
      const d = new Date(ts);
      return d.toLocaleString();
    } catch {
      return ts.toString();
    }
  }

  if (!items.length) {
    return (
      <div className="mt-6 p-3 bg-white/5 rounded border border-white/10 text-sm text-gray-300">
        No saved simulations yet. Run a simulation to save it here.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-gray-200 mb-3">
        Recent Simulations
      </h4>
      <div className="space-y-3">
        {items.map((s) => (
          <div
            key={s.id}
            className="flex items-start justify-between bg-white/5 p-3 rounded border border-white/10"
          >
            <div className="flex-1">
              <div className="text-sm text-white font-semibold truncate">
                {s.subject || "(no subject)"}
              </div>
              <div className="text-xs text-gray-300">{s.persona || "—"}</div>
              <div className="text-xs text-gray-400 mt-1">
                {fmt(s.timestamp)}
              </div>
            </div>

            <div className="ml-4 flex flex-col gap-2">
              <button
                onClick={() => onLoad(s)}
                className="px-3 py-1 text-sm bg-[#E26D5A] hover:bg-[#c85849] text-white rounded"
              >
                Load
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="px-3 py-1 text-sm bg-transparent border border-white/20 text-gray-300 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
