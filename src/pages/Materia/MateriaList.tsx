import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMaterias, deleteMateria } from "../../services/materiaService";
import type { Materia } from "../../types";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useToast } from "../../components/ToastProvider";
import { countBibliografias } from "../../utils/materiaUtils";

const MateriaList = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    materia: Materia | null;
  }>({ isOpen: false, materia: null });
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchMaterias = async () => {
      const data = await getMaterias();
      setMaterias(data);
    };

    fetchMaterias();
  }, []);

  const handleDelete = async (id: number | undefined) => {
    // Verificar que el ID existe
    if (!id) {
      showError("Error", "ID de materia no válido");
      return;
    }

    // Encontrar la materia completa
    const materia = materias.find((m) => m.id === id);
    if (!materia) return;

    // Mostrar modal de confirmación
    setDeleteConfirm({ isOpen: true, materia });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.materia?.id) return;

    setLoading(true);
    try {
      await deleteMateria(deleteConfirm.materia.id);
      // Actualizar la lista eliminando la materia del estado
      setMaterias(
        materias.filter((materia) => materia.id !== deleteConfirm.materia?.id)
      );
      setDeleteConfirm({ isOpen: false, materia: null });
      showSuccess(
        "Eliminado exitosamente",
        "La materia ha sido eliminada correctamente"
      );
    } catch (error) {
      console.error("Error al eliminar la materia:", error);
      showError(
        "Error al eliminar",
        "No se pudo eliminar la materia. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, materia: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Materias</h1>
          <p className="text-gray-600 mt-1">Gestiona las materias académicas</p>
        </div>
        <Link
          to="/materia/new"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Nueva Materia</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-600 text-xl">📚</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Materias
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {materias.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-xl">🎯</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {materias.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 text-xl">📖</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Con Bibliografías
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  materias.filter((materia) => countBibliografias(materia) > 0)
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>{" "}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facultad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turno
              </th>
              {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bibliografías
              </th> */}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materias.map((materia) => (
              <tr key={materia.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {materia.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-sm">📚</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {materia.nombre_materia}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {materia.facultad || "Sin asignar"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      materia.turnos === "mañana"
                        ? "bg-yellow-100 text-yellow-800"
                        : materia.turnos === "tarde"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {materia.turnos?.charAt(0).toUpperCase() +
                      materia.turnos?.slice(1) || "Sin definir"}
                  </span>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {countBibliografias(materia)} bibliografía
                      {countBibliografias(materia) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/materia/${materia.id}`}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/materia/edit/${materia.id}`}
                      className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(materia.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {materias.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay materias registradas
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza agregando tu primera materia
            </p>
            <Link
              to="/materia/new"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Agregar Materia</span>
            </Link>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Eliminar Materia"
        message={`¿Estás seguro de que deseas eliminar la materia "${deleteConfirm.materia?.nombre_materia}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default MateriaList;
