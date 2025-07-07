import * as d3 from "d3";
import type { ChartDataPoint } from "../../../shared/types/ml";
import { useD3 } from "../../../shared/hooks/useD3";

interface LineChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const LineChart = ({
  data,
  width = 400,
  height = 300,
  xAxisLabel = "",
  yAxisLabel = "",
}: LineChartProps) => {
  const ref = useD3(
    (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      const margin = { top: 20, right: 30, bottom: 70, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Escalas
      const xScale = d3
        .scalePoint()
        .domain(data.map((d) => d.label))
        .range([0, innerWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value) || 0])
        .range([innerHeight, 0]);

      // Contenedor principal
      const g = svg
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Línea
      const line = d3
        .line<ChartDataPoint>()
        .x((d) => xScale(d.label) || 0)
        .y((d) => yScale(d.value))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Puntos
      g.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale(d.label) || 0)
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 4)
        .attr("fill", (d) => d.color || "#3b82f6")
        .on("mouseover", function (event: MouseEvent, d: ChartDataPoint) {
          d3.select(this).attr("r", 6);

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

          tooltip
            .html(`${d.label}: ${d.value}`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr("r", 4);
          d3.selectAll(".tooltip").remove();
        });

      // Eje X
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

      // Eje Y
      g.append("g").call(d3.axisLeft(yScale));

      // Labels de ejes
      if (xAxisLabel) {
        g.append("text")
          .attr(
            "transform",
            `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 10})`
          )
          .style("text-anchor", "middle")
          .text(xAxisLabel);
      }

      if (yAxisLabel) {
        g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - innerHeight / 2)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(yAxisLabel);
      }
    },
    [data, width, height, xAxisLabel, yAxisLabel]
  );

  return <svg ref={ref}></svg>;
};
