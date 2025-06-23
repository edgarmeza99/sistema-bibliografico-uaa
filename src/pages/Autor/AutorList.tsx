import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Autor } from "../../types";
import { deleteAutor, getAutores } from "../../services/autorService";

const AutorList: React.FC = () => {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAutores = async () => {
      const data = await getAutores();
      setAutores(data);
      setLoading(false);
    };

    loadAutores();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este autor?")) {
      await deleteAutor(id);
      setAutores(autores.filter((autor) => autor.id !== id));
    }
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

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {autores.map((autor) => (
          <div
            key={autor.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">
                  {autor.nombre.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-500">
                ID: {autor.id}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {autor.nombre}
            </h3>

            {autor.email && (
              <p className="text-sm text-gray-600 mb-2">📧 {autor.email}</p>
            )}

            {autor.biografia && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {autor.biografia}
              </p>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <Link
                  to={`/autor/${autor.id}`}
                  className="text-xs text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                >
                  Ver
                </Link>
                <Link
                  to={`/autor/edit/${autor.id}`}
                  className="text-xs text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                >
                  Editar
                </Link>
              </div>
              <button
                onClick={() => handleDelete(autor.id)}
                className="text-xs text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {autores.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
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
  );
};

export default AutorList;
