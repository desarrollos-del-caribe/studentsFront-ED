import { useD3 } from "../../../shared/hooks/useD3";
import * as d3 from "d3";

interface ScatterDataPoint {
  x: number;
  y: number;
  cluster: number;
}

interface ScatterPlotProps {
  data: ScatterDataPoint[];
  width?: number;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
}

export function ScatterPlot({
  data,
  width = 600,
  height = 400,
  xAxisLabel = "X",
  yAxisLabel = "Y",
  title = "Scatter Plot",
}: ScatterPlotProps) {
  const ref = useD3(
    (svg) => {
      // Limpiar contenido previo
      svg.selectAll("*").remove();

      // Configurar dimensiones y márgenes
      const margin = { top: 40, right: 80, bottom: 60, left: 80 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Crear escalas
      const xExtent = d3.extent(data, (d) => d.x) as [number, number];
      const yExtent = d3.extent(data, (d) => d.y) as [number, number];

      // Añadir un poco de padding a las escalas
      const xPadding = (xExtent[1] - xExtent[0]) * 0.05;
      const yPadding = (yExtent[1] - yExtent[0]) * 0.05;

      const xScale = d3
        .scaleLinear()
        .domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
        .range([0, innerWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
        .range([innerHeight, 0]);

      // Escala de colores para los clusters
      const clusters = Array.from(new Set(data.map((d) => d.cluster))).sort();
      const colorScale = d3
        .scaleOrdinal<string, string>()
        .domain(clusters.map(String))
        .range(["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]);

      // Crear contenedor principal
      const g = svg
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Título
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "#1f2937")
        .text(title);

      // Ejes
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(".2f"));

      const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2f"));

      // Eje X
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "12px");

      // Eje Y
      g.append("g").call(yAxis).selectAll("text").style("font-size", "12px");

      // Etiquetas de los ejes
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - innerHeight / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#374151")
        .text(yAxisLabel);

      g.append("text")
        .attr(
          "transform",
          `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 10})`
        )
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#374151")
        .text(xAxisLabel);

      // Crear tooltip
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "scatter-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "1000");

      // Puntos del scatter plot
      g.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .style("fill", (d) => colorScale(String(d.cluster)))
        .style("opacity", 0.7)
        .style("stroke", "white")
        .style("stroke-width", 1)
        .style("cursor", "pointer")
        .on("mouseover", function (_event, d) {
          d3.select(this)
            .transition()
            .duration(100)
            .attr("r", 7)
            .style("opacity", 1);

          tooltip.style("visibility", "visible").html(`
            <div>
              <strong>Cluster:</strong> ${d.cluster}<br/>
              <strong>${xAxisLabel}:</strong> ${d.x.toFixed(3)}<br/>
              <strong>${yAxisLabel}:</strong> ${d.y.toFixed(3)}
            </div>
          `);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition()
            .duration(100)
            .attr("r", 5)
            .style("opacity", 0.7);

          tooltip.style("visibility", "hidden");
        });

      // Leyenda
      const legend = g
        .append("g")
        .attr("transform", `translate(${innerWidth + 20}, 20)`);

      const legendItems = legend
        .selectAll(".legend-item")
        .data(clusters)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (_d, i) => `translate(0, ${i * 25})`);

      legendItems
        .append("circle")
        .attr("r", 6)
        .style("fill", (d) => colorScale(String(d)))
        .style("stroke", "white")
        .style("stroke-width", 1);

      legendItems
        .append("text")
        .attr("x", 15)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .style("font-size", "12px")
        .style("fill", "#374151")
        .text((d) => `Cluster ${d}`);

      // Limpiar tooltip al desmontar
      return () => {
        d3.select("body").selectAll(".scatter-tooltip").remove();
      };
    },
    [data, width, height, xAxisLabel, yAxisLabel, title]
  );

  return (
    <div className="scatter-plot-container">
      <svg ref={ref}></svg>
    </div>
  );
}
