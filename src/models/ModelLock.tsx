import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "../shared/components/Button";

export default function ModelLock() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Modelo Bloqueado
          </h1>
          <p className="text-gray-600 mb-8">
            Este modelo requiere completar el cuestionario para ser
            desbloqueado.
          </p>
          <div className="space-x-4">
            <Link to="/form">
              <Button>Completar Cuestionario</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary">Volver al Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
