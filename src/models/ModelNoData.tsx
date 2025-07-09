import { RenderIcon } from "../shared/components";
export default function ModelNoData() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center space-x-6">
          <div className="grid justify-center mb-6">
            <div className="bg-gray-100 p-4 rounded-full">
              <RenderIcon
                icon="chart-bar"
                className="h-16 w-16 text-gray-400"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No hay datos disponibles
          </h1>
          <p className="text-gray-600 mb-6">
            Si el problema persiste, por favor contacta al administrador del
            sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
