// pages/directors/telugu/index.jsx
// Clean redesign: collapsible lineage tree directly on the page
// No image grid, no 404s — shows the full mentor→student hierarchy

import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { directorsTelugu } from "../../../data/directors-telugu";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

// ─── Theme ───────────────────────────────────────────────────────────────────
const T = {
    bg: "#0F0F0F",
    surface: "#141414",
    surface2: "#1A1A1A",
    border: "#222",
    gold: "#E6B852",
    red: "#C62828",
    white: "#FFFFFF",
    muted: "#8A8680",
    green: "#4ADE80",
    orange: "#F97316",
};

// ─── Build tree from flat data ────────────────────────────────────────────────
function buildForest(db) {
    const allStudents = new Set(
        Object.values(db).flatMap((d) => d.students || [])
    );
    const roots = Object.keys(db).filter((slug) => !allStudents.has(slug));

    function buildNode(slug, depth = 0) {
        const dir = db[slug];
        if (!dir) return null;
        return {
            slug,
            name: dir.name,
            workedUnder: dir.workedUnder || [],
            influencedBy: dir.influencedBy || [],
            associatedTeam: dir.associatedTeam || [],
            students: (dir.students || [])
                .map((s) => buildNode(s, depth + 1))
                .filter(Boolean),
            depth,
        };
    }

    return roots.map((slug) => buildNode(slug)).filter(Boolean);
}

// ─── Single tree node row ─────────────────────────────────────────────────────
function DirectorRow({ node, db, onSelect, selectedSlug, depth = 0 }) {
    const [open, setOpen] = useState(depth < 2);
    const hasChildren = node.students.length > 0;
    const isSelected = selectedSlug === node.slug;

    return (
        <div>
            <div
                onClick={() => {
                    onSelect(node.slug);
                    if (hasChildren) setOpen((o) => !o);
                }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 16px 9px",
                    paddingLeft: 16 + depth * 28,
                    cursor: "pointer",
                    background: isSelected ? "#1f1a0e" : "transparent",
                    borderLeft: isSelected ? `2px solid ${T.gold}` : "2px solid transparent",
                    transition: "background 0.15s",
                    userSelect: "none",
                }}
                onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "#1a1a1a";
                }}
                onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
            >
                {/* Expand toggle */}
                <span style={{
                    width: 18, height: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: hasChildren ? T.gold : "transparent",
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                    background: hasChildren ? "#1f1a0e" : "transparent",
                    border: hasChildren ? `1px solid ${T.gold}44` : "none",
                    borderRadius: 4,
                }}>
                    {hasChildren ? (open ? "−" : "+") : ""}
                </span>

                {/* Depth connector dot */}
                {depth > 0 && (
                    <span style={{
                        width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                        background: depth === 1 ? T.gold : depth === 2 ? T.green : T.muted,
                    }} />
                )}

                {/* Name */}
                <span style={{
                    color: depth === 0 ? T.white : depth === 1 ? "#ddd" : T.muted,
                    fontSize: depth === 0 ? 15 : 13,
                    fontWeight: depth === 0 ? 600 : 400,
                    fontFamily: depth === 0 ? "'Bebas Neue', Impact, sans-serif" : "system-ui",
                    letterSpacing: depth === 0 ? 1 : 0,
                    flex: 1,
                }}>
                    {node.name}
                </span>

                {/* Student count */}
                {hasChildren && (
                    <span style={{
                        fontSize: 10, color: T.gold, fontFamily: "system-ui",
                        background: "#1f1a0e", padding: "2px 7px",
                        borderRadius: 10, border: `1px solid ${T.gold}33`,
                        flexShrink: 0,
                    }}>
                        {node.students.length}
                    </span>
                )}
            </div>

            {/* Children */}
            {open && hasChildren && (
                <div style={{
                    borderLeft: `1px solid #222`,
                    marginLeft: 16 + depth * 28 + 9,
                }}>
                    {node.students.map((child) => (
                        <DirectorRow
                            key={child.slug}
                            node={child}
                            db={db}
                            onSelect={onSelect}
                            selectedSlug={selectedSlug}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Side panel ───────────────────────────────────────────────────────────────
const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%231A1A1A'/%3E%3Ccircle cx='100' cy='78' r='32' fill='%232a2a2a'/%3E%3Cellipse cx='100' cy='158' rx='52' ry='38' fill='%232a2a2a'/%3E%3C/svg%3E`;

const photoCache = {};

function SidePanel({ slug, db, onClose, onNavigate }) {
    const dir = db[slug];
    const [photo, setPhoto] = React.useState(null);
    const [photoLoading, setPhotoLoading] = React.useState(true);
    const [knownFor, setKnownFor] = React.useState([]);

    React.useEffect(() => {
        if (!dir) return;
        setPhoto(null);
        setPhotoLoading(true);
        setKnownFor([]);

        if (photoCache[slug]) {
            setPhoto(photoCache[slug].photo);
            setKnownFor(photoCache[slug].knownFor || []);
            setPhotoLoading(false);
            return;
        }

        fetch(`/api/director-photo?name=${encodeURIComponent(dir.name)}`)
            .then((r) => r.json())
            .then((data) => {
                photoCache[slug] = { photo: data.photo, knownFor: data.knownFor || [] };
                setPhoto(data.photo);
                setKnownFor(data.knownFor || []);
            })
            .catch(() => { photoCache[slug] = { photo: null, knownFor: [] }; })
            .finally(() => setPhotoLoading(false));
    }, [slug]);

    if (!dir) return null;

    const InfoRow = ({ label, color, slugs, labels }) => {
        if (!slugs?.length && !labels?.length) return null;
        const items = slugs
            ? slugs.map((s) => ({ label: db[s]?.name || s, slug: s }))
            : labels.map((l) => ({ label: l, slug: null }));

        return (
            <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 3, height: 14, background: color, borderRadius: 2 }} />
                    <span style={{
                        color: "#666", fontSize: 10, fontFamily: "system-ui",
                        textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600,
                    }}>{label}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {items.map(({ label: l, slug: s }) => (
                        <span
                            key={l}
                            onClick={() => s && db[s] && onNavigate(s)}
                            style={{
                                fontSize: 12, fontFamily: "system-ui",
                                color: color, background: `${color}11`,
                                border: `1px solid ${color}33`,
                                padding: "4px 10px", borderRadius: 16,
                                cursor: s && db[s] ? "pointer" : "default",
                            }}
                        >{l}</span>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div style={{
            background: "#141414",
            borderLeft: `2px solid ${T.gold}`,
            height: "100%",
            overflowY: "auto",
        }}>
            {/* Header with photo */}
            <div style={{
                padding: "20px 20px 16px",
                borderBottom: `1px solid #1e1e1e`,
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        {/* Photo */}
                        <div style={{
                            width: 64, height: 64, borderRadius: "50%",
                            overflow: "hidden", border: `2px solid ${T.gold}`,
                            flexShrink: 0, background: "#1a1a1a",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            {photoLoading ? (
                                <div style={{
                                    width: 64, height: 64, borderRadius: "50%",
                                    background: "linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)",
                                    animation: "shimmer 1.4s infinite",
                                }} />
                            ) : (
                                <img
                                    src={photo || PLACEHOLDER_SVG}
                                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_SVG; }}
                                    alt={dir.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            )}
                        </div>
                        <div>
                            <h2 style={{
                                fontFamily: "'Bebas Neue', Impact, sans-serif",
                                fontSize: 22, color: T.white, margin: 0, letterSpacing: 1,
                            }}>{dir.name}</h2>
                            <span style={{
                                fontSize: 11, color: T.red, fontFamily: "system-ui",
                                textTransform: "uppercase", letterSpacing: 1,
                            }}>Telugu</span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: "#222", border: "none", color: T.muted,
                        width: 28, height: 28, borderRadius: "50%",
                        cursor: "pointer", fontSize: 16, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>×</button>
                </div>

                {/* Known for */}
                {knownFor.length > 0 && (
                    <div>
                        <span style={{ color: "#444", fontSize: 10, fontFamily: "system-ui", textTransform: "uppercase", letterSpacing: 1 }}>Known for</span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
                            {knownFor.map((film) => (
                                <span key={film} style={{
                                    fontSize: 11, fontFamily: "system-ui",
                                    color: "#aaa", background: "#1a1a1a",
                                    border: "1px solid #2a2a2a",
                                    padding: "3px 8px", borderRadius: 4,
                                }}>{film}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Relations */}
            <div style={{ padding: "20px" }}>
                <InfoRow label="Worked Under" color={T.green} slugs={dir.workedUnder} />
                <InfoRow label="Influenced By" color={T.orange} slugs={dir.influencedBy} />
                <InfoRow label="Mentored / Students" color={T.gold} slugs={dir.students} />
                <InfoRow label="School / Camp" color="#60A5FA" labels={dir.associatedTeam} />

                {!dir.workedUnder?.length && !dir.influencedBy?.length &&
                    !dir.students?.length && !dir.associatedTeam?.length && (
                        <p style={{ color: "#444", fontSize: 13, fontFamily: "system-ui" }}>
                            No lineage data recorded.
                        </p>
                    )}
            </div>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TeluguDirectorsPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [selectedSlug, setSelectedSlug] = useState(null);

    const db = directorsTelugu;
    const forest = useMemo(() => buildForest(db), []);

    // Filter: if searching, show flat list; else show tree
    const allDirs = Object.values(db);
    const filtered = search
        ? allDirs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
        : null;

    return (
        <>
            <style>{`
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
      `}</style>
            <Header />
            <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column" }}>

                {/* Top bar */}
                <div style={{
                    padding: "16px 24px",
                    borderBottom: `1px solid ${T.border}`,
                    display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
                }}>
                    <button
                        onClick={() => router.push("/directors")}
                        style={{
                            background: "transparent", border: `1px solid ${T.border}`,
                            color: T.muted, padding: "6px 14px", borderRadius: 6,
                            cursor: "pointer", fontSize: 12, fontFamily: "system-ui",
                        }}
                    >← All Languages</button>

                    <div>
                        <h1 style={{
                            fontFamily: "'Bebas Neue', Impact, sans-serif",
                            fontSize: 22, color: T.white, margin: 0, letterSpacing: 1,
                        }}>Telugu Director Lineage</h1>
                    </div>

                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Legend */}
                        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                            {[
                                { color: T.gold, label: "Root" },
                                { color: T.gold, label: "Student" },
                                { color: T.green, label: "Worked under" },
                                { color: T.orange, label: "Influenced by" },
                            ].map(({ color, label }) => (
                                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
                                    <span style={{ color: T.muted, fontSize: 11, fontFamily: "system-ui" }}>{label}</span>
                                </div>
                            ))}
                        </div>

                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setSelectedSlug(null); }}
                            style={{
                                background: T.surface2, border: `1px solid ${T.border}`,
                                borderRadius: 6, color: T.white, fontSize: 13,
                                padding: "6px 12px", fontFamily: "system-ui", outline: "none",
                                width: 160,
                            }}
                        />
                    </div>
                </div>

                {/* Body: tree + panel side by side */}
                <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 120px)" }}>

                    {/* Tree column */}
                    <div style={{
                        flex: 1, overflowY: "auto",
                        borderRight: selectedSlug ? `1px solid ${T.border}` : "none",
                    }}>
                        {/* Search results: flat list */}
                        {filtered ? (
                            <div style={{ padding: "8px 0" }}>
                                {filtered.length === 0 && (
                                    <p style={{ color: "#444", padding: "24px", fontFamily: "system-ui", fontSize: 13 }}>
                                        No directors found for "{search}"
                                    </p>
                                )}
                                {filtered.map((dir) => (
                                    <div
                                        key={dir.slug}
                                        onClick={() => setSelectedSlug(dir.slug)}
                                        style={{
                                            padding: "10px 20px",
                                            cursor: "pointer",
                                            background: selectedSlug === dir.slug ? "#1f1a0e" : "transparent",
                                            borderLeft: selectedSlug === dir.slug ? `2px solid ${T.gold}` : "2px solid transparent",
                                            color: T.white, fontSize: 14, fontFamily: "system-ui",
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1a1a"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = selectedSlug === dir.slug ? "#1f1a0e" : "transparent"; }}
                                    >
                                        <span>{dir.name}</span>
                                        {dir.students?.length > 0 && (
                                            <span style={{ fontSize: 10, color: T.gold, fontFamily: "system-ui" }}>
                                                {dir.students.length} mentee{dir.students.length > 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Full tree */
                            <div style={{ padding: "8px 0" }}>
                                {forest.map((root) => (
                                    <DirectorRow
                                        key={root.slug}
                                        node={root}
                                        db={db}
                                        onSelect={setSelectedSlug}
                                        selectedSlug={selectedSlug}
                                        depth={0}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Side panel */}
                    {selectedSlug && (
                        <div style={{ width: 340, flexShrink: 0, overflowY: "auto" }}>
                            <SidePanel
                                slug={selectedSlug}
                                db={db}
                                onClose={() => setSelectedSlug(null)}
                                onNavigate={(slug) => setSelectedSlug(slug)}
                            />
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
