
///components/DirectorTree.jsx//

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { directorsTelugu } from "@/data/directors-telugu";
import TreeLegend from "@/components/TreeLegend";
import DirectorModal from "@/components/DirectorModal";

export default function DirectorTree({ slug }) {
  const svgRef = useRef();
  const [selectedDirector, setSelectedDirector] = useState(null);

  useEffect(() => {
    const data = buildTreeData(slug);

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup SVG
    const width = 1600;
    const height = 900;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("cursor", "grab");

    // Group wrapper for zooming
    const svgGroup = svg.append("g").attr("class", "tree-container");

    // Enable Zoom + Pan
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        svgGroup.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Build D3 Tree Layout
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([height - 100, width - 400]);
    treeLayout(root);

    // Draw Links
    svgGroup
      .selectAll("path.link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d) => d.y + 200)
          .y((d) => d.x)
      )
      .attr("stroke", (d) => {
        const target = d.target.data;
        if (target.relation === "workedUnder") return "green";
        if (target.relation === "influencedBy") return "orange";
        if (target.relation === "associatedTeam") return "blue";
        return "#666";
      })
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) => {
        const target = d.target.data;
        if (target.relation === "influencedBy") return "4 4";
        if (target.relation === "associatedTeam") return "6 4";
        return "0";
      })
      .attr("fill", "none");

    // Draw Nodes
    const nodes = svgGroup
      .selectAll("g.node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y + 200}, ${d.x})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (d.data.slug) {
          setSelectedDirector(d.data);
        }
      });

    // Node Circle
    nodes
      .append("circle")
      .attr("r", 22)
      .attr("fill", "#1f1f1f")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Node Labels
    nodes
      .append("text")
      .attr("dy", 5)
      .attr("x", 35)
      .style("fill", "#fff")
      .style("font-size", "15px")
      .text((d) => d.data.name);
  }, [slug]);

  return (
    <div className="relative w-full overflow-auto bg-black p-4 rounded-xl">
      <TreeLegend />

      <svg ref={svgRef}></svg>

      {/* Modal */}
      <DirectorModal
        director={selectedDirector}
        onClose={() => setSelectedDirector(null)}
      />
    </div>
  );
}

// ------------------------------------------------------
// Build Tree Data - Convert flat dataset to hierarchy
// ------------------------------------------------------
function buildTreeData(slug) {
  const rootDir = directorsTelugu[slug];
  if (!rootDir) return { name: "Not found", children: [] };

  const workedUnder = rootDir.workedUnder.map((s) => ({
    ...directorsTelugu[s],
    relation: "workedUnder",
    children: [],
  }));

  const influencedBy = rootDir.influencedBy.map((s) => ({
    ...directorsTelugu[s],
    relation: "influencedBy",
    children: [],
  }));

  const associatedTeam = (rootDir.associatedTeam || []).map((team) => ({
    name: team,
    relation: "associatedTeam",
    children: [],
  }));

  const students = rootDir.students.map((s) => ({
    ...directorsTelugu[s],
    relation: "student",
    children: [],
  }));

  return {
    name: rootDir.name,
    slug: rootDir.slug,
    relation: "root",
    children: [
      ...workedUnder,
      ...influencedBy,
      ...associatedTeam,
      ...students,
    ],
  };
}
