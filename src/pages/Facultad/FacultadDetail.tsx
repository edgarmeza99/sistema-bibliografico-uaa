import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getFacultadById } from "../../services/facultadService";
import type { Facultad } from "../../types";
import { useToast } from "../../components/ToastProvider";

const FacultadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [facultad, setFacultad] = useState<Facultad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacultad = async () => {
      if (!id) {
        setError("ID de facultad no válido");
        setLoading(false);
        return;
      }

      try {
        const data = await getFacultadById(id);
        setFacultad(data);
      } catch (error) {
        console.error("Error al cargar la facultad:", error);
        setError("Error al cargar los datos de la facultad");
        showError(
          "Error al cargar",
          "No se pudieron cargar los datos de la facultad"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFacultad();
  }, [id, showError]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (error || !facultad) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Error</h3>
          <p className="text-red-700 mt-1">
            {error || "Facultad no encontrada"}
          </p>
        </div>
        <button
          onClick={() => navigate("/facultad")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Detalles de Facultad #{facultad.id}
          </h1>
          <p className="text-gray-600 mt-1">
            Información completa de la facultad
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/facultad/edit/${facultad.id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Editar</span>
          </Link>
          <button
            onClick={() => navigate("/facultad")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Volver
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-xl">🏛️</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Información de la Facultad
              </h2>
              <p className="text-sm text-gray-600">ID: {facultad.id}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-900 whitespace-pre-wrap break-words">
                {facultad.descripcion || "No especificado"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">Facultad #{facultad.id}</div>
          <div className="flex space-x-3">
            <Link
              to={`/facultad/edit/${facultad.id}`}
              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors text-sm font-medium"
            >
              Editar
            </Link>
            <button
              onClick={() => navigate("/facultad")}
              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors text-sm font-medium"
            >
              Volver al listado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultadDetail;
