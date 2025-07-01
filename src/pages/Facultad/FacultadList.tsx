import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFacultades, deleteFacultad } from "../../services/facultadService";
import type { Facultad } from "../../types";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useToast } from "../../components/ToastProvider";

const FacultadList = () => {
  const [facultades, setFacultades] = useState<Facultad[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    facultad: Facultad | null;
  }>({ isOpen: false, facultad: null });

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchFacultades = async () => {
      const data = await getFacultades();
      setFacultades(data);
    };

    fetchFacultades();
  }, []);

  const handleDelete = async (id: string | undefined) => {
    // Verificar que el ID existe
    if (!id) {
      showError("Error", "ID de facultad no válido");
      return;
    }

    // Encontrar la facultad completa
    const facultad = facultades.find((f) => f.id === id);
    if (!facultad) return;

    // Mostrar modal de confirmación
    setDeleteConfirm({ isOpen: true, facultad });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.facultad?.id) return;

    setLoading(true);
    try {
      await deleteFacultad(deleteConfirm.facultad.id);
      // Actualizar la lista eliminando la facultad del estado
      setFacultades(
        facultades.filter(
          (facultad) => facultad.id !== deleteConfirm.facultad?.id
        )
      );
      setDeleteConfirm({ isOpen: false, facultad: null });
      showSuccess(
        "Eliminado exitosamente",
        "La facultad ha sido eliminada correctamente"
      );
    } catch (error) {
      console.error("Error al eliminar la facultad:", error);
      showError(
        "Error al eliminar",
        "No se pudo eliminar la facultad. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, facultad: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facultades</h1>
          <p className="text-gray-600 mt-1">
            Gestiona las facultades del sistema
          </p>
        </div>
        <Link
          to="/facultad/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
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
          <span>Nueva Facultad</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-xl">🏛️</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Facultades
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {facultades.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {facultades.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 text-xl">📋</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Con Descripción
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  facultades.filter(
                    (f) => f.descripcion && f.descripcion.trim() !== ""
                  ).length
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
                Descripción
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {facultades.map((facultad) => (
              <tr key={facultad.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {facultad.id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm">🏛️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 break-words">
                        {facultad.descripcion || "Sin descripción"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/facultad/${facultad.id}`}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/facultad/edit/${facultad.id}`}
                      className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(facultad.id)}
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

        {facultades.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏛️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay facultades registradas
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza agregando tu primera facultad
            </p>
            <Link
              to="/facultad/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
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
              <span>Agregar Facultad</span>
            </Link>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Eliminar Facultad"
        message={`¿Estás seguro de que deseas eliminar esta facultad (ID: ${deleteConfirm.facultad?.id})? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default FacultadList;
