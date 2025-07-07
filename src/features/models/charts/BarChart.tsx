import * as d3 from "d3";
import type { ChartDataPoint } from "../../../shared/types/ml";
import { useD3 } from "../../../shared/hooks/useD3";

interface BarChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const BarChart = ({
  data,
  width = 400,
  height = 300,
  xAxisLabel = "",
  yAxisLabel = "",
}: BarChartProps) => {
  const ref = useD3(
    (svg) => {
      const margin = { top: 20, right: 30, bottom: 70, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Escalas
      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([0, innerWidth])
        .padding(0.1);

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

      // Barras
      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.label) || 0)
        .attr("y", (d) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => innerHeight - yScale(d.value))
        .attr("fill", (d) => d.color || "#3b82f6")
        .on("mouseover", function (event, d) {
          d3.select(this).attr("opacity", 0.7);

          // Tooltip
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
          d3.select(this).attr("opacity", 1);
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
