import type { ModelVisualizationData, ChartDataPoint, ScatterDataPoint } from '../../shared/types/ml';

// Colores predefinidos para gráficos
export const chartColors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
  '#ec4899', '#6366f1', '#14b8a6', '#f472b6'
];

// Función para generar datos aleatorios
export const generateRandomData = (count: number, min: number = 0, max: number = 100): ChartDataPoint[] => {
  return Array.from({ length: count }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: Math.random() * (max - min) + min,
    color: chartColors[i % chartColors.length]
  }));
};

// Función para generar datos de precisión de modelo
export const generateModelAccuracyData = (): ChartDataPoint[] => [
  { label: 'Random Forest', value: 0.92, color: chartColors[0] },
  { label: 'SVM', value: 0.88, color: chartColors[1] },
  { label: 'Neural Network', value: 0.95, color: chartColors[2] },
  { label: 'Logistic Regression', value: 0.82, color: chartColors[3] },
  { label: 'Decision Tree', value: 0.78, color: chartColors[4] }
];

// Función para generar datos de evolución temporal
export const generateTimeSeriesData = (epochs: number = 10): ChartDataPoint[] => {
  return Array.from({ length: epochs }, (_, i) => ({
    label: `Época ${i + 1}`,
    value: Math.exp(-i / 3) + Math.random() * 0.1, // Decrecimiento exponencial con ruido
    color: chartColors[0]
  }));
};

// Función para generar datos de distribución
export const generateDistributionData = (): ChartDataPoint[] => [
  { label: 'Clase A', value: 45, color: chartColors[2] },
  { label: 'Clase B', value: 30, color: chartColors[1] },
  { label: 'Clase C', value: 25, color: chartColors[5] }
];

// Función para generar importancia de características
export const generateFeatureImportanceData = (): ChartDataPoint[] => [
  { label: 'Edad', value: 0.35, color: chartColors[4] },
  { label: 'Ingresos', value: 0.28, color: chartColors[5] },
  { label: 'Educación', value: 0.22, color: chartColors[6] },
  { label: 'Experiencia', value: 0.15, color: chartColors[7] }
];

// Función para crear visualizaciones completas de ejemplo
export const createExampleDashboard = (): ModelVisualizationData[] => [
  {
    title: 'Precisión por Algoritmo',
    type: 'bar',
    data: generateModelAccuracyData(),
    width: 500,
    height: 350,
    xAxisLabel: 'Algoritmos',
    yAxisLabel: 'Precisión'
  },
  {
    title: 'Evolución del Error',
    type: 'line',
    data: generateTimeSeriesData(8).map(item => ({
      ...item,
      value: 1 - item.value // Convertir a error (1 - precisión)
    })),
    width: 500,
    height: 350,
    xAxisLabel: 'Épocas',
    yAxisLabel: 'Error'
  },
  {
    title: 'Distribución de Predicciones',
    type: 'pie',
    data: generateDistributionData(),
    width: 400,
    height: 400
  },
  {
    title: 'Importancia de Características',
    type: 'bar',
    data: generateFeatureImportanceData(),
    width: 500,
    height: 350,
    xAxisLabel: 'Características',
    yAxisLabel: 'Importancia'
  }
];

// Función para crear métricas de modelo
export const createModelMetricsVisualization = (
  accuracy: number, 
  precision: number, 
  recall: number, 
  f1Score: number
): ModelVisualizationData => ({
  title: 'Métricas del Modelo',
  type: 'bar',
  data: [
    { label: 'Accuracy', value: accuracy, color: chartColors[0] },
    { label: 'Precision', value: precision, color: chartColors[1] },
    { label: 'Recall', value: recall, color: chartColors[2] },
    { label: 'F1-Score', value: f1Score, color: chartColors[3] }
  ],
  width: 500,
  height: 350,
  xAxisLabel: 'Métricas',
  yAxisLabel: 'Valor'
});

// Tipos para datos de clustering
interface KMeansDataPoint {
  features?: number[];
  cluster?: number;
  label?: string;
  [key: string]: unknown;
}

interface KMeansResult {
  data: KMeansDataPoint[];
  [key: string]: unknown;
}

// Función para transformar datos de clustering KMeans a formato scatter
export const transformKMeansToScatter = (
  kmeansData: KMeansResult,
  featureX: string = 'feature1',
  featureY: string = 'feature2'
): ScatterDataPoint[] => {
  if (!kmeansData || !kmeansData.data || !Array.isArray(kmeansData.data)) {
    return [];
  }

  return kmeansData.data.map((point: KMeansDataPoint, index: number) => ({
    x: (point[featureX] as number) || point.features?.[0] || Math.random() * 10,
    y: (point[featureY] as number) || point.features?.[1] || Math.random() * 10,
    cluster: point.cluster || 0,
    label: point.label || `Punto ${index + 1}`
  }));
};

// Función para generar datos de scatter plot de ejemplo
export const generateScatterPlotData = (numPoints: number = 50): ScatterDataPoint[] => {
  const clusters = [0, 1, 2];
  const centerPoints = [
    { x: 2, y: 2 },
    { x: 6, y: 6 },
    { x: 2, y: 6 }
  ];

  return Array.from({ length: numPoints }, (_, i) => {
    const cluster = clusters[i % clusters.length];
    const center = centerPoints[cluster];
    
    return {
      x: center.x + (Math.random() - 0.5) * 2,
      y: center.y + (Math.random() - 0.5) * 2,
      cluster,
      label: `Punto ${i + 1}`
    };
  });
};
