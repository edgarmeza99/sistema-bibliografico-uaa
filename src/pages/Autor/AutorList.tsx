import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Autor } from "../../types";
import { deleteAutor, getAutores } from "../../services/autorService";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useToast } from "../../components/ToastProvider";

const AutorList: React.FC = () => {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    autor: Autor | null;
  }>({ isOpen: false, autor: null });
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const loadAutores = async () => {
      try {
        const data = await getAutores();
        setAutores(data);
      } catch (error) {
        console.error("Error al cargar autores:", error);
        showError("Error", "No se pudieron cargar los autores");
      } finally {
        setLoading(false);
      }
    };

    loadAutores();
  }, [showError]);

  const handleDelete = async (id: number) => {
    const autor = autores.find((a) => a.id === id);
    if (!autor) return;

    setDeleteConfirm({ isOpen: true, autor });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.autor?.id) return;

    try {
      await deleteAutor(deleteConfirm.autor.id);
      setAutores(
        autores.filter((autor) => autor.id !== deleteConfirm.autor?.id)
      );
      setDeleteConfirm({ isOpen: false, autor: null });
      showSuccess(
        "Eliminado exitosamente",
        "El autor ha sido eliminado correctamente"
      );
    } catch (error) {
      console.error("Error al eliminar autor:", error);
      showError(
        "Error al eliminar",
        "No se pudo eliminar el autor. Por favor, intenta de nuevo."
      );
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "No especificada";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando autores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Autores</h1>
          <p className="text-gray-600 mt-1">Gestiona los autores del sistema</p>
        </div>
        <Link
          to="/autor/new"
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
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
          <span>Nuevo Autor</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-orange-600 text-xl">👤</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Autores</p>
              <p className="text-2xl font-bold text-gray-900">
                {autores.length}
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
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {autores.filter((autor) => autor.activo).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-xl">📖</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Con Biografía</p>
              <p className="text-2xl font-bold text-gray-900">
                {autores.filter((autor) => autor.biografia).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Authors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nacionalidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Nacimiento
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {autores.map((autor) => (
              <tr key={autor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {autor.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 text-sm font-bold">
                        {autor.nombre.charAt(0).toUpperCase()}
                        {autor.apellido.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {autor.nombre} {autor.apellido}
                      </div>
                      {autor.biografia && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {autor.biografia.length > 50
                            ? `${autor.biografia.substring(0, 50)}...`
                            : autor.biografia}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {autor.nacionalidad || "No especificada"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(autor.fechaNacimiento)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/autor/${autor.id}`}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs transition-colors"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/autor/edit/${autor.id}`}
                      className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded text-xs transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(autor.id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded text-xs transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {autores.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay autores registrados
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza agregando tu primer autor
            </p>
            <Link
              to="/autor/new"
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
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
              <span>Agregar Autor</span>
            </Link>
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onCancel={() => setDeleteConfirm({ isOpen: false, autor: null })}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que quieres eliminar a ${deleteConfirm.autor?.nombre} ${deleteConfirm.autor?.apellido}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
};

export default AutorList;
