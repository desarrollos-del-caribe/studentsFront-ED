import { useState } from "react";
import AnalysisCard from "../components/AnalysisCard";
import AgeValidation from "../components/sections/AgeValidation";
import Countries from "../components/sections/Countries";
import Cleaning from "../components/sections/Cleaning";
import Statistics from "../components/sections/Statistics";
import Outliers from "../components/sections/Outliers";
import Plots from "../components/sections/Plots";
import LinearRegression from "../components/sections/LinearRegression";
import LogisticRegression from "../components/sections/LogisticRegression";
import Correlation from "../components/sections/Correlation";
import DecisionTree from "../components/sections/DecisionTree";
import { FaCloudDownloadAlt } from "react-icons/fa";

const Dashboard: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectFileBoolean, setSelectFileBoolean] = useState<boolean>(false);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];

    setSelectedFile(file);
    setSelectFileBoolean(true);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Análisis de Adicción a Redes Sociales
        </h1>
        <div className="p-4 bg-white shadow rounded mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Cargar archivo CSV:
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-500 hover:border-gray-500 hover:bg-gray-400 transform transition duration-300 ease-in-out hover:shadow-lg"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaCloudDownloadAlt className="h-20 w-20 text-white" />
                <p className="mb-2 text-sm text-white">
                  {selectedFile
                    ? `Archivo seleccionado: ${selectedFile.name}`
                    : "Arrastra y suelta un archivo Excel, CSV o archivo con datos aquí"}
                </p>
                <p className="text-xs text-white">XLSX, CSV, SQL u OTRO</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={selectFileBoolean}
                accept=".csv"
              />
            </label>
          </div>
        </div>
        <AnalysisCard setSelectedAction={setSelectedAction} />
        <div className="grid">
          {selectedAction === "cleaning" && <Cleaning />}
          {selectedAction === "statistics" && <Statistics />}
          {selectedAction === "age" && <AgeValidation />}
          {selectedAction === "countries" && <Countries />}
          {selectedAction === "outliers" && <Outliers />}
          {selectedAction === "plots" && <Plots />}
          {selectedAction === "linear_regression" && <LinearRegression />}
          {selectedAction === "logistic_regression" && <LogisticRegression />}
          {selectedAction === "correlation" && <Correlation />}
          {selectedAction === "decision_tree" && <DecisionTree />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
