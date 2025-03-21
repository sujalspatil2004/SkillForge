// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";


// const PathwayGraph = ({ pathway }) => {
//   const svgRef = useRef();

//   useEffect(() => {
//     if (!pathway || !pathway.name || !pathway.children) {
//       console.error("Invalid pathway data:", pathway);
//       return;
//     }

//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove(); // Clear previous content

//     const width = svgRef.current.clientWidth;
//     const height = width * 0.75;

//     // Add SVG and set its viewBox to scale properly
//     const g = svg
//       .attr("viewBox", `0 0 ${width} ${height}`)
//       .attr("preserveAspectRatio", "xMidYMid meet")
//       .append("g")
//       .attr("transform", "translate(50, 0)");

//     // Create a hierarchy
//     const root = d3.hierarchy(pathway);
//     const treeLayout = d3.tree().size([height - 100, width - 200]);
//     treeLayout(root);

//     console.log(root); // Debug the tree structure

//     // Define curved links
//     const linkGenerator = d3
//       .linkHorizontal()
//       .x((d) => d.y)
//       .y((d) => d.x);

//     // Add links
//     g.selectAll(".link")
//       .data(root.links())
//       .enter()
//       .append("path")
//       .attr("class", "link")
//       .attr("d", linkGenerator)
//       .style("fill", "none")
//       .style("stroke", "#888")
//       .style("stroke-width", 2);

//     // Add nodes
//     const nodes = g
//       .selectAll(".node")
//       .data(root.descendants())
//       .enter()
//       .append("g")
//       .attr("class", "node")
//       .attr("transform", (d) => `translate(${d.y},${d.x})`);

//     // Add circles to nodes
//     nodes
//       .append("circle")
//       .attr("r", 12) // Circle radius
//       .style("fill", (d) => (d.children ? "#3498db" : "#2ecc71"))
//       .style("stroke", "#fff")
//       .style("stroke-width", 3)
//       .style("filter", "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2))");

//     // Add text to nodes dynamically
//     nodes
//       .append("text")
//       .style("font-size", "14px")
//       .style("fill", "#333")
//       .style("font-weight", "bold")
//       .style("font-family", "Arial, sans-serif")
//       .style("pointer-events", "none") // Prevent text from interfering with mouse events
//       .attr("dy", 5) // Center vertically
//       .attr("dx", function (d) {
//         const circleRadius = 12; // Match the circle's radius
//         const textWidth = this.getBBox().width; // Get width of the current text element
//         return circleRadius + 5; // Offset text by radius + padding
//       })
//       .style("text-anchor", "start") // Align text to the left edge
//       .text((d) => d.data.name);

//     // Add title for hover tooltip
//     nodes.append("title").text((d) => d.data.name);

//     // Add zoom and pan functionality
//     const zoomBehavior = d3.zoom().on("zoom", (event) => {
//       g.attr("transform", event.transform);
//     });

//     svg.call(zoomBehavior);

//     // Set SVG width and height as responsive values
//     svg.attr("width", "100%").attr("height", height);
//   }, [pathway]);

//   return (
//     <div style={{ width: "100%", height: "500px", overflow: "auto" }}>
//       <svg ref={svgRef}></svg>
//     </div>
//   );
// };

// export default PathwayGraph;



import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PathwayGraph = ({ pathway }) => {
  const svgRef = useRef();

  useEffect(() => {
    console.log("Pathway data in PathwayGraph:", pathway); // Debugging statement

    if (!pathway || !pathway.name || !pathway.children) {
      console.error("Invalid pathway data:", pathway);
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const width = svgRef.current.clientWidth;
    const height = width * 0.75;

    // Add SVG and set its viewBox to scale properly
    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", "translate(50, 0)");

    // Create a hierarchy
    const root = d3.hierarchy(pathway);
    const treeLayout = d3.tree().size([height - 100, width - 200]);
    treeLayout(root);

    console.log(root); // Debug the tree structure

    // Define curved links
    const linkGenerator = d3
      .linkHorizontal()
      .x((d) => d.y)
      .y((d) => d.x);

    // Add links
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", linkGenerator)
      .style("fill", "none")
      .style("stroke", "#888")
      .style("stroke-width", 2);

    // Add nodes
    const nodes = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    // Add circles to nodes
    nodes
      .append("circle")
      .attr("r", 12) // Circle radius
      .style("fill", (d) => (d.children ? "#3498db" : "#2ecc71"))
      .style("stroke", "#fff")
      .style("stroke-width", 3)
      .style("filter", "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2))");


      
    // Add text to nodes dynamically
    nodes
      .append("text")
      .style("font-size", "14px")
      .style("fill", "#333")
      .style("font-weight", "bold")
      .style("font-family", "Arial, sans-serif")
      .style("pointer-events", "none") // Prevent text from interfering with mouse events
      .attr("dy", 5) // Center vertically
      .attr("dx", function (d) {
        const circleRadius = 12; // Match the circle's radius
        const textWidth = this.getBBox().width; // Get width of the current text element
        return circleRadius + 5; // Offset text by radius + padding
      })
      .style("text-anchor", "start") // Align text to the left edge
      .text((d) => d.data.name);

    // Add title for hover tooltip
    nodes.append("title").text((d) => d.data.name);

    // Add zoom and pan functionality
    const zoomBehavior = d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

    svg.call(zoomBehavior);

    // Set SVG width and height as responsive values
    svg.attr("width", "100%").attr("height", height);
  }, [pathway]);

  return (
    <div style={{ width: "100%", height: "500px", overflow: "auto" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PathwayGraph;