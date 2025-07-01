import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getBibliografias,
  deleteBibliografia,
} from "../../services/bibliografiaService";
import type { Bibliografia } from "../../types";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useToast } from "../../components/ToastProvider";

const BibliografiaList = () => {
  const [bibliografias, setBibliografias] = useState<Bibliografia[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    bibliografia: Bibliografia | null;
  }>({ isOpen: false, bibliografia: null });

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchBibliografias = async () => {
      const data = await getBibliografias();
      setBibliografias(data);
    };

    fetchBibliografias();
  }, []);

  const handleDelete = async (id: number | undefined) => {
    // Verificar que el ID existe
    if (!id) {
      showError("Error", "ID de bibliografía no válido");
      return;
    }

    // Encontrar la bibliografía completa
    const bibliografia = bibliografias.find((b) => b.id === id);
    if (!bibliografia) return;

    // Mostrar modal de confirmación
    setDeleteConfirm({ isOpen: true, bibliografia });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.bibliografia?.id) return;

    setLoading(true);
    try {
      await deleteBibliografia(deleteConfirm.bibliografia.id);
      // Actualizar la lista eliminando la bibliografía del estado
      setBibliografias(
        bibliografias.filter(
          (bibliografia) => bibliografia.id !== deleteConfirm.bibliografia?.id
        )
      );
      setDeleteConfirm({ isOpen: false, bibliografia: null });
      showSuccess(
        "Eliminado exitosamente",
        "La bibliografía ha sido eliminada correctamente"
      );
    } catch (error) {
      console.error("Error al eliminar la bibliografía:", error);
      showError(
        "Error al eliminar",
        "No se pudo eliminar la bibliografía. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, bibliografia: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bibliografías</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el catálogo bibliográfico
          </p>
        </div>
        <Link
          to="/bibliografia/new"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
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
          <span>Nueva Bibliografía</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 text-xl">📖</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Bibliografías
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {bibliografias.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-xl">📚</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Con Recursos Principales
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  bibliografias.filter(
                    (b) =>
                      b.recursos_principales &&
                      b.recursos_principales.trim() !== ""
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-600 text-xl">📄</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Con Recursos Secundarios
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  bibliografias.filter(
                    (b) =>
                      b.recursos_secundarios &&
                      b.recursos_secundarios.trim() !== ""
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
                Recursos Principales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recursos Secundarios
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bibliografias.map((bibliografia) => (
              <tr key={bibliografia.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {bibliografia.id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-purple-600 text-sm">📖</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 break-words">
                        {bibliografia.recursos_principales ||
                          "Sin recursos principales"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 break-words">
                    {bibliografia.recursos_secundarios ||
                      "Sin recursos secundarios"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/bibliografia/${bibliografia.id}`}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/bibliografia/edit/${bibliografia.id}`}
                      className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(bibliografia.id)}
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

        {bibliografias.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📖</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay bibliografías registradas
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza agregando tu primera bibliografía
            </p>
            <Link
              to="/bibliografia/new"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
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
              <span>Agregar Bibliografía</span>
            </Link>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Eliminar Bibliografía"
        message={`¿Estás seguro de que deseas eliminar esta bibliografía (ID: ${deleteConfirm.bibliografia?.id})? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default BibliografiaList;
