import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMateriaById } from "../../services/materiaService";
import type { Materia } from "../../types";

const MateriaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [materia, setMateria] = useState<Materia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMateria = async () => {
      if (!id) {
        setError("ID de materia no válido");
        setLoading(false);
        return;
      }

      try {
        const data = await getMateriaById(id);
        setMateria(data);
      } catch (error) {
        console.error("Error fetching materia details:", error);
        setError("Error al cargar los detalles de la materia");
      } finally {
        setLoading(false);
      }
    };

    fetchMateria();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!materia) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">
          No se encontraron detalles para esta materia.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Detalles de la Materia
          </h1>
          <p className="text-gray-600 mt-1">
            Información completa de la materia
          </p>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/materia/edit/${materia.id}`}
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
          <Link
            to="/materia"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Volver</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-green-600 text-xl">📚</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {materia.nombre_materia}
              </h2>
              <p className="text-green-600 font-medium">
                Código: {materia.codigo}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Información Básica
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <p className="text-gray-900">{materia.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código
                </label>
                <p className="text-gray-900">{materia.codigo}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Créditos
                </label>
                <p className="text-gray-900">{materia.creditos}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Turno
                </label>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    materia.turnos === "mañana"
                      ? "bg-yellow-100 text-yellow-800"
                      : materia.turnos === "tarde"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {materia.turnos?.charAt(0).toUpperCase() +
                    materia.turnos?.slice(1)}
                </span>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Información Adicional
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facultad
                </label>
                <p className="text-gray-900">
                  {materia.facultad || "Sin asignar"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    materia.activo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {materia.activo ? "Activa" : "Inactiva"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Creación
                </label>
                <p className="text-gray-900">
                  {new Date(materia.fechaCreacion).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {materia.descripcion && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Descripción
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {materia.descripcion}
              </p>
            </div>
          )}

          {/* Material Detalle */}
          {materia.material_detalle && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Material Detalle
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {materia.material_detalle}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MateriaDetail;
