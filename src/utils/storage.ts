// src/utils/storage.ts

import { createClient } from "@supabase/supabase-js";

export type SavedSim = {
  id: string;
  subject: string;
  body: string;
  persona: string;
  numVariants: number;
  result: any;
  timestamp: number;
  synced?: boolean;
};

const STORAGE_KEY = "simulations";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/* ----------------------------- SUPABASE HELPERS ----------------------------- */

// ✅ Get all simulations from Supabase first
export async function getSimulations(): Promise<SavedSim[]> {
  // If Supabase available → fetch from DB
  if (supabase) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("campaigns")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Error fetching Supabase campaigns:", error.message);
        } else if (data && data.length > 0) {
          // Convert Supabase fields to the SavedSim shape used by the app
          const normalized = data.map((item: any) => ({
            id: item.id,
            subject: item.subject ?? "",
            body: item.body ?? "",
            persona: item.persona ?? "",
            numVariants: item.num_variants ?? 1,
            result: item.result ?? null,
            timestamp: item.created_at
              ? new Date(item.created_at).getTime()
              : Date.now(),
            synced: true,
          })) as SavedSim[];

          // also cache locally for offline use
          if (typeof window !== "undefined") {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(normalized),
            );
          }

          return normalized;
        }
      }
    } catch (err) {
      console.warn("Supabase campaigns fetch failed:", err);
    }
  }

  // Fallback to local storage if Supabase fails
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      console.warn("Local storage read failed");
    }
  }

  return [];
}

// ✅ Save one simulation (to both Supabase + localStorage)
export async function saveSimulation(
  sim: Omit<SavedSim, "id" | "timestamp" | "synced">,
): Promise<SavedSim> {
  const newSim: SavedSim = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    synced: false,
    ...sim,
  };

  // Save to Supabase if available
  if (supabase) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("campaigns").insert([
          {
            id: newSim.id,
            user_id: user.id,
            subject: newSim.subject,
            body: newSim.body,
            persona: newSim.persona,
            result: newSim.result,
            created_at: new Date(newSim.timestamp).toISOString(),
          },
        ]);

        if (!error) {
          newSim.synced = true;
        } else {
          console.warn("Supabase save failed:", error.message);
        }
      }
    } catch (err) {
      console.warn("Supabase save failed:", err);
    }
  }

  // Always store locally
  if (typeof window !== "undefined") {
    const all = getLocalSimulations();
    const updated = [newSim, ...all].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return newSim;
}

// ✅ Delete single simulation
export async function deleteSimulation(id: string) {
  if (supabase) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("campaigns")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          console.warn("Supabase delete failed:", error.message);
        }
      }
    } catch (err) {
      console.warn("Supabase delete failed:", err);
    }
  }

  if (typeof window !== "undefined") {
    const all = getLocalSimulations().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}

// ✅ Clear all simulations
export async function clearSimulations() {
  if (supabase) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("campaigns")
          .delete()
          .eq("user_id", user.id);

        if (error) {
          console.warn("Supabase clear failed:", error.message);
        }
      }
    } catch (err) {
      console.warn("Supabase clear failed:", err);
    }
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ✅ Local helper for fallback
function getLocalSimulations(): SavedSim[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}