

// components/HandlesAdmin.jsx
import { useEffect, useState } from "react";
import defaultJson from "../data/handles.json";

export default function HandlesAdmin() {
  const [handles, setHandles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY; // public env for client usage (optional)
  const AIRTABLE_BASE = process.env.NEXT_PUBLIC_AIRTABLE_BASE;
  const AIRTABLE_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_TABLE || "Handles";

  useEffect(() => {
    // Try to load from Airtable (if keys available)
    async function load() {
      if (AIRTABLE_API_KEY && AIRTABLE_BASE) {
        try {
          const resp = await fetch(`/api/handles/get`);
          if (resp.ok) {
            const j = await resp.json();
            setHandles(j);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Airtable fetch failed", e.message);
        }
      }

      // fallback to localStorage -> repo default
      const local = localStorage.getItem("cineq_handles");
      if (local) {
        setHandles(JSON.parse(local));
      } else {
        setHandles(defaultJson);
      }
      setLoading(false);
    }
    load();
  }, []);

  function addCategory(cat) {
    if (!cat) return;
    setHandles(prev => ({ ...prev, [cat]: { productions: [], stars: [] } }));
  }
  function addHandle(cat, type, h) {
    if (!h) return;
    setHandles(prev => {
      const next = { ...prev };
      next[cat] = next[cat] || { productions: [], stars: [] };
      next[cat][type] = Array.from(new Set([...(next[cat][type] || []), h]));
      return next;
    });
  }
  function removeHandle(cat, type, h) {
    setHandles(prev => {
      const next = { ...prev };
      next[cat][type] = (next[cat][type] || []).filter(x => x !== h);
      return next;
    });
  }

  async function persistToAirtable(payload) {
    // client calls server side route
    const resp = await fetch(`/api/handles/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return resp.ok;
  }

  async function saveAll() {
    setSaving(true);
    // if Airtable available, call server route to persist; otherwise use localStorage
    if (AIRTABLE_API_KEY && AIRTABLE_BASE) {
      const ok = await persistToAirtable(handles);
      if (!ok) alert("Failed to save to Airtable. Check server logs.");
    } else {
      localStorage.setItem("cineq_handles", JSON.stringify(handles));
      alert("Saved locally (browser localStorage). For production, configure Airtable env vars.");
    }
    setSaving(false);
  }

  if (loading) return <div>Loading handles admin…</div>;

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Handles Admin</h3>
      <div className="mb-2">
        <button onClick={() => {
          const c = prompt("New category (e.g., bollywood)");
          if (c) addCategory(c.trim());
        }} className="px-3 py-1 bg-blue-600 text-white rounded">Add Category</button>
        <button onClick={saveAll} className="px-3 py-1 ml-2 bg-green-600 text-white rounded">{saving ? "Saving..." : "Save"}</button>
      </div>

      <div className="grid gap-4">
        {Object.keys(handles).map(cat => (
          <div key={cat} className="border p-3 rounded">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{cat}</div>
              <div className="text-sm text-gray-500">Productions · Stars</div>
            </div>

            <div className="mt-2">
              <div className="text-xs text-gray-400">Productions</div>
              <div className="flex gap-2 flex-wrap mt-2">
                {(handles[cat].productions || []).map(h => (
                  <div key={h} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2">
                    <span className="text-sm">{h}</span>
                    <button onClick={() => removeHandle(cat, "productions", h)} className="text-red-500 text-xs">x</button>
                  </div>
                ))}
                <button onClick={() => {
                  const h = prompt("Add production handle (without @)");
                  if (h) addHandle(cat, "productions", h.trim());
                }} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm">+ Add</button>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-gray-400">Stars</div>
              <div className="flex gap-2 flex-wrap mt-2">
                {(handles[cat].stars || []).map(h => (
                  <div key={h} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2">
                    <span className="text-sm">{h}</span>
                    <button onClick={() => removeHandle(cat, "stars", h)} className="text-red-500 text-xs">x</button>
                  </div>
                ))}
                <button onClick={() => {
                  const h = prompt("Add star handle (without @)");
                  if (h) addHandle(cat, "stars", h.trim());
                }} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm">+ Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
