import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMateriaById, updateMateria } from "../../services/materiaService";
import type { Materia, MateriaCreateData } from "../../types";
import MateriaBibliografias from "../../components/MateriaBibliografias";
import {
  hasBibliografias,
  countBibliografias,
  extractBibliografiaIds,
} from "../../utils/materiaUtils";
import { useToast } from "../../components/ToastProvider";
import ConfirmDialog from "../../components/ConfirmDialog";

const MateriaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [materia, setMateria] = useState<Materia | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    bibliografiaId: number | null;
    bibliografiaTitulo: string;
  }>({ isOpen: false, bibliografiaId: null, bibliografiaTitulo: "" });
  const { showSuccess, showError } = useToast();

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

  const handleRemoveBibliografia = (bibliografiaId: number) => {
    if (!materia) return;

    const bibliografia = materia.material_detalle?.find(
      (item) => item.bibliografia_id === bibliografiaId
    );

    setConfirmDelete({
      isOpen: true,
      bibliografiaId,
      bibliografiaTitulo: bibliografia?.recursos_principales || "Bibliografía",
    });
  };

  const confirmRemoveBibliografia = async () => {
    if (!materia || !confirmDelete.bibliografiaId || !id) return;

    setUpdating(true);
    try {
      // Obtener IDs actuales y remover el seleccionado
      const currentIds = extractBibliografiaIds(materia);
      const updatedIds = currentIds.filter(
        (bId) => bId !== confirmDelete.bibliografiaId
      );

      // Preparar datos para actualizar
      const updateData: MateriaCreateData = {
        facultad_id: parseInt(
          materia.facultad_id?.toString() ||
            materia.facultadId?.toString() ||
            "0"
        ),
        nombre_materia: materia.nombre_materia,
        turnos: materia.turnos,
        creditos:
          typeof materia.creditos === "string"
            ? parseInt(materia.creditos)
            : materia.creditos,
        material_detalle: updatedIds,
        codigo: materia.codigo || "",
        descripcion: materia.descripcion || "",
      };

      // Actualizar materia
      await updateMateria(id, updateData);

      // Recargar datos
      const updatedMateria = await getMateriaById(id);
      setMateria(updatedMateria);

      showSuccess(
        "Bibliografía eliminada",
        "La bibliografía ha sido removida de la materia correctamente"
      );
    } catch (error) {
      console.error("Error al eliminar bibliografía:", error);
      showError(
        "Error al eliminar",
        "No se pudo eliminar la bibliografía. Por favor, intenta de nuevo."
      );
    } finally {
      setUpdating(false);
      setConfirmDelete({
        isOpen: false,
        bibliografiaId: null,
        bibliografiaTitulo: "",
      });
    }
  };

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

          {/* Bibliografías */}
          {hasBibliografias(materia) && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex-1">
                  Bibliografías de la Materia
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {countBibliografias(materia)} bibliografía
                  {countBibliografias(materia) > 1 ? "s" : ""}
                </span>
              </div>
              <MateriaBibliografias
                bibliografias={materia.material_detalle || []}
                titulo=""
                maxVisible={10}
                showRemoveButton={true}
                onRemove={handleRemoveBibliografia}
                disabled={updating}
              />
            </div>
          )}

          {/* Mensaje si no hay bibliografías */}
          {!hasBibliografias(materia) && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Bibliografías de la Materia
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-gray-400 text-4xl mb-2">📚</div>
                <p className="text-gray-600 text-sm">
                  No hay bibliografías asignadas a esta materia
                </p>
                <Link
                  to={`/materia/edit/${materia.id}`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-3"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Agregar bibliografías
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onCancel={() =>
          setConfirmDelete({
            isOpen: false,
            bibliografiaId: null,
            bibliografiaTitulo: "",
          })
        }
        onConfirm={confirmRemoveBibliografia}
        title="Confirmar eliminación de bibliografía"
        message={`¿Estás seguro de que quieres eliminar "${confirmDelete.bibliografiaTitulo}" de esta materia? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
};

export default MateriaDetail;
