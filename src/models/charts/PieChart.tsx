import * as d3 from "d3";
import type { ChartDataPoint } from "../../shared/types/ml";
import { useD3 } from "../../shared/hooks/useD3";

interface PieChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
}

export const PieChart = ({
  data,
  width = 400,
  height = 300,
}: PieChartProps) => {
  const ref = useD3(
    (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      const radius = Math.min(width, height) / 2 - 10;

      const g = svg
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const pie = d3
        .pie<ChartDataPoint>()
        .value((d) => d.value)
        .sort(null);

      const arc = d3
        .arc<d3.PieArcDatum<ChartDataPoint>>()
        .innerRadius(0)
        .outerRadius(radius);

      const labelArc = d3
        .arc<d3.PieArcDatum<ChartDataPoint>>()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.6);

      const arcs = g
        .selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

      arcs
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => d.data.color || color(i.toString()))
        .on(
          "mouseover",
          function (event: MouseEvent, d: d3.PieArcDatum<ChartDataPoint>) {
            d3.select(this).style("opacity", 0.7);

            const tooltip = d3
              .select("body")
              .append("div")
              .attr("class", "tooltip")
              .style("position", "absolute")
              .style("background", "rgba(0,0,0,0.8)")
              .style("color", "white")
              .style("padding", "8px")
              .style("border-radius", "4px")
              .style("font-size", "12px")
              .style("pointer-events", "none")
              .style("z-index", "1000");

            const percentage = (
              ((d.endAngle - d.startAngle) / (2 * Math.PI)) *
              100
            ).toFixed(1);
            tooltip
              .html(`${d.data.label}: ${d.data.value} (${percentage}%)`)
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 10 + "px");
          }
        )
        .on("mouseout", function () {
          d3.select(this).style("opacity", 1);
          d3.selectAll(".tooltip").remove();
        });

      // Labels
      arcs
        .append("text")
        .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text((d) => {
          const percentage =
            ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
          return percentage > 5 ? d.data.label : "";
        });

      // Leyenda
      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 100}, 20)`);

      const legendItems = legend
        .selectAll(".legend-item")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (_d, i) => `translate(0, ${i * 20})`);

      legendItems
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", (d, i) => d.color || color(i.toString()));

      legendItems
        .append("text")
        .attr("x", 16)
        .attr("y", 9)
        .style("font-size", "11px")
        .style("alignment-baseline", "middle")
        .text((d) => d.label);
    },
    [data, width, height]
  );

  return <svg ref={ref}></svg>;
};
