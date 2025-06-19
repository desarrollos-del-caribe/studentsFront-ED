import { useState, useEffect } from "react";
import AnalysisCard from "../components/AnalysisCard";
import { fetchAnalysis } from "../services/api";
import type { AnalysisData } from "../types/AnalysisData";

import Cleaning from "../components/sections/Cleaning";
import Statistics from "../components/sections/Statistics";
import AgeValidation from "../components/sections/AgeValidation";
import Countries from "../components/sections/Countries";
import Trimester from "../components/sections/Trimester";
import Predictions from "../components/sections/Predictions";
import DecisionTree from "../components/sections/DesicionTree";
import Clustering from "../components/sections/Clustering";
import LinePlot from "../components/sections/LinePlot";
import ThreeDPlot from "../components/sections/ThreeDPlot";
import BoxPlot from "../components/sections/BoxPlot";
import HeatMap from "../components/sections/HeatMap";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>("");

  useEffect(() => {
    fetchAnalysis()
      .then(setData)
      .catch((err) =>
        setError("Error al cargar los datos: " + err.message)
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" />
        <span className="ml-4 text-gray-700">Cargando...</span>
      </div>
    );

  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <>
      <div className="bg-blue-500 p-10" />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Análisis de Adicción a Redes Sociales
        </h1>
        <AnalysisCard setSelectedAction={setSelectedAction} />
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedAction === "cleaning" && <Cleaning data={data} />}
            {selectedAction === "statistics" && <Statistics data={data} />}
            {selectedAction === "age" && <AgeValidation data={data} />}
            {selectedAction === "countries" && <Countries data={data} />}
            {selectedAction === "trimester" && <Trimester data={data} />}
            {selectedAction === "predictions" && <Predictions data={data} />}
            {selectedAction === "decision_tree" && <DecisionTree data={data} />}
            {selectedAction === "clustering" && <Clustering data={data} />}
            {selectedAction === "line_plot" && <LinePlot data={data} />}
            {selectedAction === "3d_plot" && <ThreeDPlot data={data} />}
            {selectedAction === "boxplot" && <BoxPlot data={data} />}
            {selectedAction === "heatmap" && <HeatMap data={data} />}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
