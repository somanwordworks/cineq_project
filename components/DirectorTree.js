// components/DirectorTree.js
// Fixed: was importing `data` (default) but referencing `directorsTelugu` (undefined)
// Now: proper named import + recursive full lineage tree + slide-in side panel

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { directorsTelugu } from "../data/directors-telugu";

// Inline SVG data URI — zero network requests, never 404s
const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%231A1A1A'/%3E%3Ccircle cx='100' cy='78' r='32' fill='%23333'/%3E%3Cellipse cx='100' cy='160' rx='52' ry='38' fill='%23333'/%3E%3C/svg%3E`;

const T = {
  ink: "#0F0F0F",
  paper: "#FAF8F4",
  red: "#C62828",
  gold: "#E6B852",
  muted: "#8A8680",
  border: "#E2DDD5",
  white: "#FFFFFF",
  nodeBg: "#1A1A1A",
  nodeStroke: "#333333",
};

// ─── Relation colours ────────────────────────────────────────────────────────
const REL_COLOR = {
  student: "#E6B852",       // gold  — mentored by this director
  workedUnder: "#4ADE80",   // green — directly assisted
  influencedBy: "#F97316",  // orange — influenced
  associatedTeam: "#60A5FA",// blue  — team/school
  root: "#C62828",          // red   — root director node
};

// ─── Build recursive hierarchy from flat data ────────────────────────────────
function buildNode(slug, db, visited = new Set()) {
  if (visited.has(slug)) return null;
  visited.add(slug);
  const dir = db[slug];
  if (!dir) return null;

  const children = (dir.students || [])
    .map((s) => {
      const child = buildNode(s, db, new Set(visited));
      if (!child) return null;
      return { ...child, relation: "student" };
    })
    .filter(Boolean);

  return {
    name: dir.name,
    slug: dir.slug,
    photo: dir.photo,
    relation: "root",
    workedUnder: dir.workedUnder || [],
    influencedBy: dir.influencedBy || [],
    associatedTeam: dir.associatedTeam || [],
    children,
  };
}

function buildForestData(db) {
  // Root directors = those not listed as a student of anyone
  const allStudents = new Set(
    Object.values(db).flatMap((d) => d.students || [])
  );
  const roots = Object.keys(db).filter((slug) => !allStudents.has(slug));
  return roots
    .map((slug) => buildNode(slug, db, new Set()))
    .filter(Boolean);
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function DirectorTree({ lang = "te" }) {
  const svgRef = useRef();
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(new Set());

  // Build forest once
  const db = directorsTelugu; // extend later: { te: directorsTelugu, ta: ..., }[lang]
  const forest = buildForestData(db);

  const toggleNode = useCallback((slug) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  useEffect(() => {
    renderTree();
  }, [collapsed, selectedDirector]);

  function renderTree() {
    const el = svgRef.current;
    if (!el) return;
    d3.select(el).selectAll("*").remove();

    const width = 1800;

    // Clone forest and prune collapsed
    function pruneCollapsed(node) {
      if (collapsed.has(node.slug)) return { ...node, children: [] };
      return { ...node, children: (node.children || []).map(pruneCollapsed) };
    }

    // Build a virtual root wrapping the forest
    const virtualRoot = {
      name: "__root__",
      slug: "__root__",
      children: forest.map(pruneCollapsed),
    };

    const root = d3.hierarchy(virtualRoot);
    const nodeCount = root.descendants().length;
    const height = Math.max(900, nodeCount * 38);

    const treeLayout = d3.tree().size([height - 120, width - 500]);
    treeLayout(root);

    const svg = d3
      .select(el)
      .attr("width", width)
      .attr("height", height)
      .style("cursor", "grab")
      .style("background", T.ink);

    const g = svg.append("g").attr("transform", "translate(80, 0)");

    svg.call(
      d3.zoom().scaleExtent([0.3, 2.5]).on("zoom", (e) => {
        g.attr("transform", e.transform);
      })
    );

    // ── Links ──
    g.selectAll("path.link")
      .data(root.links().filter((l) => l.source.data.slug !== "__root__"))
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr(
        "d",
        d3.linkHorizontal()
          .x((d) => d.y + 160)
          .y((d) => d.x)
      )
      .attr("stroke", (d) => REL_COLOR[d.target.data.relation] || "#555")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d) =>
        d.target.data.relation === "influencedBy" ? "5 4" : "0"
      )
      .attr("opacity", 0.6);

    // ── Nodes ──
    const nodes = g
      .selectAll("g.node")
      .data(root.descendants().filter((d) => d.data.slug !== "__root__"))
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y + 160}, ${d.x})`)
      .style("cursor", "pointer");

    // Outer glow ring for root directors
    nodes
      .filter((d) => d.depth === 1)
      .append("circle")
      .attr("r", 28)
      .attr("fill", "none")
      .attr("stroke", T.red)
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.5);

    // Photo clip path
    const defs = svg.append("defs");
    nodes.each(function (d) {
      defs
        .append("clipPath")
        .attr("id", `clip-${d.data.slug}`)
        .append("circle")
        .attr("r", 22);
    });

    // Node circle background
    nodes
      .append("circle")
      .attr("r", 22)
      .attr("fill", T.nodeBg)
      .attr("stroke", (d) => REL_COLOR[d.data.relation] || T.nodeStroke)
      .attr("stroke-width", 2);

    // Director photo
    nodes
      .append("image")
      .attr("href", (d) => d.data.photo || PLACEHOLDER)
      .attr("x", -22)
      .attr("y", -22)
      .attr("width", 44)
      .attr("height", 44)
      .attr("clip-path", (d) => `url(#clip-${d.data.slug})`)
      .attr("preserveAspectRatio", "xMidYMid slice")
      .on("error", function () {
        d3.select(this).attr("href", PLACEHOLDER);
      });

    // Expand/collapse indicator
    nodes
      .filter((d) => (d.data.children?.length > 0 || db[d.data.slug]?.students?.length > 0))
      .append("circle")
      .attr("cx", 18)
      .attr("cy", -18)
      .attr("r", 8)
      .attr("fill", T.gold)
      .attr("stroke", T.ink)
      .attr("stroke-width", 1.5);

    nodes
      .filter((d) => (d.data.children?.length > 0 || db[d.data.slug]?.students?.length > 0))
      .append("text")
      .attr("x", 18)
      .attr("y", -14)
      .attr("text-anchor", "middle")
      .attr("fill", T.ink)
      .style("font-size", "11px")
      .style("font-weight", "700")
      .style("pointer-events", "none")
      .text((d) => (collapsed.has(d.data.slug) ? "+" : "−"));

    // Name label
    nodes
      .append("text")
      .attr("x", 30)
      .attr("dy", "0.35em")
      .attr("fill", T.white)
      .style("font-size", "13px")
      .style("font-family", "system-ui, sans-serif")
      .style("font-weight", (d) => (d.depth === 1 ? "600" : "400"))
      .text((d) => d.data.name);

    // Click handlers
    nodes.on("click", (event, d) => {
      event.stopPropagation();
      if (
        db[d.data.slug]?.students?.length > 0 ||
        (d.data.children || []).length > 0
      ) {
        toggleNode(d.data.slug);
      }
      setSelectedDirector(db[d.data.slug] || null);
      setPanelOpen(true);
    });
  }

  const dir = selectedDirector;

  return (
    <div style={{ position: "relative", width: "100%", background: T.ink, minHeight: "100vh" }}>
      {/* Legend */}
      <div style={{
        display: "flex", gap: 20, padding: "12px 20px",
        borderBottom: `1px solid #222`, flexWrap: "wrap",
      }}>
        {[
          { label: "Mentored (student of)", color: REL_COLOR.student },
          { label: "Worked under", color: REL_COLOR.workedUnder },
          { label: "Influenced by", color: REL_COLOR.influencedBy },
          { label: "Root director", color: REL_COLOR.root },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            <span style={{ color: T.muted, fontSize: 12, fontFamily: "system-ui" }}>{label}</span>
          </div>
        ))}
        <span style={{ color: "#555", fontSize: 12, fontFamily: "system-ui", marginLeft: "auto" }}>
          Click a node to expand · Scroll to zoom · Drag to pan
        </span>
      </div>

      {/* D3 Tree */}
      <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "85vh" }}>
        <svg ref={svgRef} />
      </div>

      {/* ── Side Panel ── */}
      <div style={{
        position: "fixed", top: 0, right: panelOpen ? 0 : "-420px",
        width: 400, height: "100vh", background: "#111",
        borderLeft: `2px solid ${T.gold}`,
        transition: "right 0.35s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 1000, overflowY: "auto",
        boxShadow: panelOpen ? "-8px 0 40px rgba(0,0,0,0.6)" : "none",
      }}>
        {dir && (
          <>
            {/* Header */}
            <div style={{
              position: "relative",
              background: `linear-gradient(to bottom, #1a1a1a, #111)`,
              padding: "32px 24px 20px",
              borderBottom: `1px solid #222`,
            }}>
              <button
                onClick={() => setPanelOpen(false)}
                style={{
                  position: "absolute", top: 16, right: 16,
                  background: "#222", border: "none", color: T.muted,
                  width: 32, height: 32, borderRadius: "50%",
                  cursor: "pointer", fontSize: 18, lineHeight: "32px",
                  textAlign: "center",
                }}
              >×</button>

              <img
                src={dir.photo || PLACEHOLDER}
                onError={(e) => { e.target.src = PLACEHOLDER; }}
                alt={dir.name}
                style={{
                  width: 80, height: 80, borderRadius: "50%",
                  objectFit: "cover", border: `3px solid ${T.gold}`,
                  marginBottom: 14,
                }}
              />
              <h2 style={{
                color: T.white, margin: 0,
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: 26, letterSpacing: 1,
              }}>{dir.name}</h2>
              <span style={{
                display: "inline-block", marginTop: 6, padding: "3px 10px",
                background: "#1f1f1f", border: `1px solid ${T.red}`,
                borderRadius: 4, color: T.red, fontSize: 11,
                fontFamily: "system-ui", textTransform: "uppercase", letterSpacing: 1,
              }}>{dir.language}</span>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 24px" }}>

              {/* Worked Under */}
              {dir.workedUnder?.length > 0 && (
                <Section title="Worked Under" color={REL_COLOR.workedUnder}>
                  {dir.workedUnder.map((slug) => (
                    <Pill key={slug} label={db[slug]?.name || slug}
                      color={REL_COLOR.workedUnder}
                      onClick={() => { setSelectedDirector(db[slug]); }} />
                  ))}
                </Section>
              )}

              {/* Influenced By */}
              {dir.influencedBy?.length > 0 && (
                <Section title="Influenced By" color={REL_COLOR.influencedBy}>
                  {dir.influencedBy.map((slug) => (
                    <Pill key={slug} label={db[slug]?.name || slug}
                      color={REL_COLOR.influencedBy}
                      onClick={() => { setSelectedDirector(db[slug]); }} />
                  ))}
                </Section>
              )}

              {/* Students / Mentees */}
              {dir.students?.length > 0 && (
                <Section title="Mentored / Students" color={REL_COLOR.student}>
                  {dir.students.map((slug) => (
                    <Pill key={slug} label={db[slug]?.name || slug}
                      color={REL_COLOR.student}
                      onClick={() => { setSelectedDirector(db[slug]); }} />
                  ))}
                </Section>
              )}

              {/* Associated School / Team */}
              {dir.associatedTeam?.length > 0 && (
                <Section title="School / Camp" color={REL_COLOR.associatedTeam}>
                  {dir.associatedTeam.map((t) => (
                    <Pill key={t} label={t} color={REL_COLOR.associatedTeam} />
                  ))}
                </Section>
              )}

              {/* Empty state */}
              {!dir.workedUnder?.length && !dir.influencedBy?.length &&
               !dir.students?.length && !dir.associatedTeam?.length && (
                <p style={{ color: T.muted, fontSize: 13, fontFamily: "system-ui" }}>
                  No lineage data available for this director.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Backdrop */}
      {panelOpen && (
        <div
          onClick={() => setPanelOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
}

// ─── Small sub-components ─────────────────────────────────────────────────────
function Section({ title, color, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
      }}>
        <div style={{ width: 3, height: 16, background: color, borderRadius: 2 }} />
        <span style={{
          color: "#aaa", fontSize: 11, fontFamily: "system-ui",
          textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600,
        }}>{title}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

function Pill({ label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: `1px solid ${color}33`,
        color: color,
        padding: "5px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontFamily: "system-ui",
        cursor: onClick ? "pointer" : "default",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => { if (onClick) e.target.style.background = `${color}22`; }}
      onMouseLeave={(e) => { e.target.style.background = "transparent"; }}
    >
      {label}
    </button>
  );
}
