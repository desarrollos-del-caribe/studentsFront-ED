import type { AnalysisData } from "../../types/Analysis";
import PlotDisplay from "../PlotDisplay";

const Clustering: React.FC<{ data: AnalysisData }> = ({ data }) => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold">Clustering</h2>
    <p>Distribución de clusters:</p>
    <ul>
      {Object.entries(data.cluster_info).map(([cluster, count]) => (
        <li key={cluster}>
          Cluster {cluster}: {count} estudiantes
        </li>
      ))}
    </ul>
    <PlotDisplay src={data.plots.clustering_3d} alt="Gráfico 3D de Clustering" />
  </div>
);

export default Clustering;