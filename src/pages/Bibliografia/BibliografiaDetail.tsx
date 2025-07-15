import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBibliografiaById } from "../../services/bibliografiaService";
import type { Bibliografia } from "../../types";
import { useToast } from "../../components/ToastProvider";

const BibliografiaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [bibliografia, setBibliografia] = useState<Bibliografia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBibliografia = async () => {
      if (!id) {
        setError("ID de bibliografía no válido");
        setLoading(false);
        return;
      }

      try {
        const data = await getBibliografiaById(id);
        console.log("BibliografiaDetail - Data received:", data);
        console.log("BibliografiaDetail - Autor data:", data.autor);
        setBibliografia(data);
      } catch (error) {
        console.error("Error al cargar la bibliografía:", error);
        setError("Error al cargar los datos de la bibliografía");
        showError(
          "Error al cargar",
          "No se pudieron cargar los datos de la bibliografía"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBibliografia();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (error || !bibliografia) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Error</h3>
          <p className="text-red-700 mt-1">
            {error || "Bibliografía no encontrada"}
          </p>
        </div>
        <button
          onClick={() => navigate("/bibliografia")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
            Detalles de Bibliografía #{bibliografia.id}
          </h1>
          <p className="text-gray-600 mt-1">
            Información completa de la bibliografía
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/bibliografia/edit/${bibliografia.id}`}
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
            onClick={() => navigate("/bibliografia")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Volver
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-purple-50 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 text-xl">📖</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Información de la Bibliografía
              </h2>
              <p className="text-sm text-gray-600">ID: {bibliografia.id}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Recursos Principales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recursos Principales
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-900 whitespace-pre-wrap break-words">
                {bibliografia.recursos_principales || "No especificado"}
              </p>
            </div>
          </div>

          {/* Recursos Secundarios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recursos Secundarios
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-600 whitespace-pre-wrap break-words">
                {bibliografia.recursos_secundarios || "No especificado"}
              </p>
            </div>
          </div>

          {/* Autor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Autor
            </label>
            {bibliografia.autor ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-lg font-bold">
                      {bibliografia.autor.nombre.charAt(0).toUpperCase()}
                      {bibliografia.autor.apellido.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-medium text-orange-900">
                      {bibliografia.autor.nombre} {bibliografia.autor.apellido}
                    </p>
                    {bibliografia.autor.nacionalidad && (
                      <p className="text-sm text-orange-700 mt-1">
                        Nacionalidad: {bibliografia.autor.nacionalidad}
                      </p>
                    )}
                    {bibliografia.autor.biografia && (
                      <p className="text-sm text-orange-600 mt-2">
                        {bibliografia.autor.biografia}
                      </p>
                    )}
                    <p className="text-xs text-orange-500 mt-2">ID: {bibliografia.autor.id}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                <div className="text-gray-400 text-2xl mb-2">👤</div>
                <p className="text-gray-600 text-sm">No hay autor asignado</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Bibliografía #{bibliografia.id}
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/bibliografia/edit/${bibliografia.id}`}
              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors text-sm font-medium"
            >
              Editar
            </Link>
            <button
              onClick={() => navigate("/bibliografia")}
              className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-md transition-colors text-sm font-medium"
            >
              Volver al listado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibliografiaDetail;
