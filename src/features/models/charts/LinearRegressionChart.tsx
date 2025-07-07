import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { ScatterDataPoint } from '../../../shared/types/ml';

interface LinearRegressionChartProps {
  data: ScatterDataPoint[];
  regressionLine: { slope: number; intercept: number };
  width: number;
  height: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
}

const LinearRegressionChart = ({
  data,
  regressionLine,
  width,
  height,
  xAxisLabel = 'Horas de Uso de Redes Sociales',
  yAxisLabel = 'Horas de Sueño por Noche',
  title = 'Regresión Lineal: Uso de Redes vs Sueño',
}: LinearRegressionChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        // Separate user point (with label) from dataset points
        const userPoint = data.find(point => point.label === 'Tu Predicción');
        const datasetPoints = data.filter(point => point.label !== 'Tu Predicción');

        // Calculate points for regression line
        const xValues = data.map(point => point.x);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const regressionPoints = [
          { x: minX, y: regressionLine.slope * minX + regressionLine.intercept },
          { x: maxX, y: regressionLine.slope * maxX + regressionLine.intercept },
        ];

        chartRef.current = new Chart(ctx, {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: 'Datos del Dataset',
                data: datasetPoints,
                backgroundColor: '#2196F3',
                pointRadius: 5,
                pointHoverRadius: 7,
              },
              ...(userPoint ? [{
                label: 'Tu Predicción',
                data: [userPoint],
                backgroundColor: '#FFC107', // Yellow for highlight
                pointRadius: 8,
                pointHoverRadius: 10,
              }] : []),
              {
                label: 'Línea de Regresión',
                data: regressionPoints,
                type: 'line',
                borderColor: '#F44336',
                backgroundColor: 'transparent',
                fill: false,
                pointRadius: 0,
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              title: {
                display: true,
                text: title,
                font: { size: 16 },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: xAxisLabel,
                },
                min: 0,
                max: Math.ceil(maxX) + 1,
              },
              y: {
                title: {
                  display: true,
                  text: yAxisLabel,
                },
                min: 0,
                max: Math.ceil(Math.max(...data.map(point => point.y)) + 1),
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, regressionLine, xAxisLabel, yAxisLabel, title]);

  return (
    <div style={{ width, height, position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default LinearRegressionChart;