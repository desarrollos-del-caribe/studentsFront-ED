import * as d3 from 'd3';
import { useD3 } from '../../../shared/hooks/useD3';
import type { ChartDataPoint } from '../../../shared/types/ml';

interface SVMChartProps {
  datasetPoints: ChartDataPoint[];
  userPoint: { x: number; y: number };
  width?: number;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const SVMChart = ({
  datasetPoints,
  userPoint,
  width = 600,
  height = 400,
  xAxisLabel = 'Horas de Uso de Redes Sociales',
  yAxisLabel = 'Horas de Sueño por Noche',
}: SVMChartProps) => {
  const ref = useD3(
    (svg) => {
      // Configuración de márgenes y dimensiones
      const margin = { top: 20, right: 30, bottom: 70, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Filtrar datos válidos
      const validPoints = datasetPoints.filter(
        (point) => typeof point.x === 'number' && typeof point.y === 'number' && !isNaN(point.x) && !isNaN(point.y)
      );

      if (validPoints.length === 0) {
        console.warn('No valid data provided for SVMChart. Rendering empty chart.');
        svg.selectAll('*').remove();
        svg
          .append('text')
          .attr('x', width / 2)
          .attr('y', height / 2)
          .attr('text-anchor', 'middle')
          .text('No hay datos válidos para mostrar');
        return;
      }

      // Escalas
      const xValues = validPoints.map((p) => p.x).concat([userPoint.x]);
      const yValues = validPoints.map((p) => p.y).concat([userPoint.y]);
      const xScale = d3
        .scaleLinear()
        .domain([Math.min(...xValues) - 1, Math.max(...xValues) + 1])
        .range([0, innerWidth]);
      const yScale = d3
        .scaleLinear()
        .domain([Math.min(...yValues) - 1, Math.max(...yValues) + 1])
        .range([innerHeight, 0]);

      // Contenedor principal
      const g = svg
        .attr('width', width)
        .attr('height', height)
        .selectAll('g')
        .data([null])
        .join('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Calcular frontera de decisión aproximada
      const class0Points = validPoints.filter((p) => p.label === 0);
      const class1Points = validPoints.filter((p) => p.label === 1);
      const avgXClass0 = class0Points.length ? d3.mean(class0Points, (p) => p.x) || 0 : 0;
      const avgYClass0 = class0Points.length ? d3.mean(class0Points, (p) => p.y) || 0 : 0;
      const avgXClass1 = class1Points.length ? d3.mean(class1Points, (p) => p.x) || 0 : 0;
      const avgYClass1 = class1Points.length ? d3.mean(class1Points, (p) => p.y) || 0 : 0;

      // Calcular pendiente e intercepto de la frontera
      const slope = (avgYClass1 - avgYClass0) / (avgXClass1 - avgXClass0 || 1);
      const intercept = avgYClass0 - slope * avgXClass0;

      // Identificar vectores de soporte aproximados
      const distanceToBoundary = (point: ChartDataPoint) => {
        // Distancia de un punto (x, y) a la línea ax + by + c = 0
        // Línea: y = mx + b -> mx - y + b = 0
        const a = slope;
        const b = -1;
        const c = intercept;
        return Math.abs(a * point.x + b * point.y + c) / Math.sqrt(a * a + b * b);
      };

      const supportVectors = validPoints
        .map((point) => ({
          ...point,
          distance: distanceToBoundary(point),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, Math.min(6, validPoints.length)) // Tomar los 6 puntos más cercanos como vectores de soporte
        .map((p) => ({ x: p.x, y: p.y, label: p.label }));

      // Línea de frontera y márgenes
      const xMin = xScale.domain()[0];
      const xMax = xScale.domain()[1];
      const marginOffset = 0.5; // Ajustar el margen para que sea visible
      const boundaryPoints = [
        { x: xMin, y: slope * xMin + intercept },
        { x: xMax, y: slope * xMax + intercept },
      ];
      const margin1Points = [
        { x: xMin, y: slope * xMin + intercept + marginOffset },
        { x: xMax, y: slope * xMax + intercept + marginOffset },
      ];
      const margin2Points = [
        { x: xMin, y: slope * xMin + intercept - marginOffset },
        { x: xMax, y: slope * xMax + intercept - marginOffset },
      ];

      // Dibujar región del margen (área sombreada)
      g.append('path')
        .datum([
          { x: xMin, y: slope * xMin + intercept + marginOffset },
          { x: xMax, y: slope * xMax + intercept + marginOffset },
          { x: xMax, y: slope * xMax + intercept - marginOffset },
          { x: xMin, y: slope * xMin + intercept - marginOffset },
        ])
        .attr('fill', 'rgba(200, 200, 200, 0.3)')
        .attr('d', d3.area()
          .x((d) => xScale(d.x))
          .y0((d) => yScale(d.y))
          .y1((d) => yScale(slope * d.x + intercept - marginOffset)));

      // Dibujar líneas de la frontera y márgenes
      g.append('path')
        .datum(boundaryPoints)
        .attr('fill', 'none')
        .attr('stroke', '#000000')
        .attr('stroke-width', 2)
        .attr('d', d3.line()
          .x((d) => xScale(d.x))
          .y((d) => yScale(d.y)));
      g.append('path')
        .datum(margin1Points)
        .attr('fill', 'none')
        .attr('stroke', '#666666')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5,5')
        .attr('d', d3.line()
          .x((d) => xScale(d.x))
          .y((d) => yScale(d.y)));
      g.append('path')
        .datum(margin2Points)
        .attr('fill', 'none')
        .attr('stroke', '#666666')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5,5')
        .attr('d', d3.line()
          .x((d) => xScale(d.x))
          .y((d) => yScale(d.y)));

      // Dibujar puntos del dataset
      g.selectAll('.point')
        .data(validPoints)
        .join('circle')
        .attr('class', 'point')
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y))
        .attr('r', 5)
        .attr('fill', (d) => (d.label === 0 ? '#4CAF50' : '#F44336'))
        .on('mouseover', function (event, d) {
          d3.select(this).attr('r', 7).attr('opacity', 0.7);
          const tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.8)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', '1000')
            .html(`Uso: ${d.x.toFixed(2)}h, Sueño: ${d.y.toFixed(2)}h, Clase: ${d.label === 0 ? 'No Afecta' : 'Afecta'}`);
          tooltip
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', 5).attr('opacity', 1);
          d3.selectAll('.tooltip').remove();
        });

      // Dibujar vectores de soporte
      g.selectAll('.support-vector')
        .data(supportVectors)
        .join('circle')
        .attr('class', 'support-vector')
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y))
        .attr('r', 6)
        .attr('fill', 'none')
        .attr('stroke', (d) => (d.label === 0 ? '#2E7D32' : '#C62828'))
        .attr('stroke-width', 2)
        .on('mouseover', function (event, d) {
          d3.select(this).attr('r', 8);
          const tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.8)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', '1000')
            .html(`Vector de Soporte: Uso: ${d.x.toFixed(2)}h, Sueño: ${d.y.toFixed(2)}h, Clase: ${d.label === 0 ? 'No Afecta' : 'Afecta'}`);
          tooltip
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', 6);
          d3.selectAll('.tooltip').remove();
        });

      // Dibujar punto del usuario
      g.append('circle')
        .attr('cx', xScale(userPoint.x))
        .attr('cy', yScale(userPoint.y))
        .attr('r', 8)
        .attr('fill', '#2196F3')
        .attr('stroke', '#000000')
        .attr('stroke-width', 2)
        .on('mouseover', function (event) {
          d3.select(this).attr('r', 10);
          const tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.8)')
            .style('color', 'white')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', '1000')
            .html(`Tu Predicción: Uso: ${userPoint.x.toFixed(2)}h, Sueño: ${userPoint.y.toFixed(2)}h`);
          tooltip
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', 8);
          d3.selectAll('.tooltip').remove();
        });

      // Ejes
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');
      g.append('g')
        .call(d3.axisLeft(yScale));

      // Etiquetas de ejes
      if (xAxisLabel) {
        g.append('text')
          .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 10})`)
          .style('text-anchor', 'middle')
          .text(xAxisLabel);
      }
      if (yAxisLabel) {
        g.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - margin.left)
          .attr('x', 0 - innerHeight / 2)
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .text(yAxisLabel);
      }

      // Leyenda
      const legend = g.append('g')
        .attr('transform', `translate(${innerWidth - 120}, 10)`);
      legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 5)
        .attr('fill', '#4CAF50');
      legend.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text('No Afecta');
      legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 20)
        .attr('r', 5)
        .attr('fill', '#F44336');
      legend.append('text')
        .attr('x', 15)
        .attr('y', 25)
        .style('font-size', '12px')
        .text('Afecta');
      legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 40)
        .attr('r', 6)
        .attr('fill', 'none')
        .attr('stroke', '#2E7D32')
        .attr('stroke-width', 2);
      legend.append('text')
        .attr('x', 15)
        .attr('y', 45)
        .style('font-size', '12px')
        .text('Vector de Soporte (No Afecta)');
      legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 60)
        .attr('r', 6)
        .attr('fill', 'none')
        .attr('stroke', '#C62828')
        .attr('stroke-width', 2);
      legend.append('text')
        .attr('x', 15)
        .attr('y', 65)
        .style('font-size', '12px')
        .text('Vector de Soporte (Afecta)');
      legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 80)
        .attr('r', 6)
        .attr('fill', '#2196F3')
        .attr('stroke', '#000000')
        .attr('stroke-width', 2);
      legend.append('text')
        .attr('x', 15)
        .attr('y', 85)
        .style('font-size', '12px')
        .text('Tu Predicción');
    },
    [datasetPoints, userPoint, width, height, xAxisLabel, yAxisLabel]
  );

  return <svg ref={ref}></svg>;
};
