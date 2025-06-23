import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBibliografias } from "../../services/bibliografiaService";
import type { Bibliografia } from "../../types";

const BibliografiaList = () => {
  const [bibliografias, setBibliografias] = useState<Bibliografia[]>([]);

  useEffect(() => {
    const fetchBibliografias = async () => {
      const data = await getBibliografias();
      setBibliografias(data);
    };

    fetchBibliografias();
  }, []);

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

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por título, autor, ISBN..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
            <option value="">Todos los tipos</option>
            <option value="libro">Libros</option>
            <option value="articulo">Artículos</option>
            <option value="revista">Revistas</option>
          </select>
          <button className="px-4 py-2 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
            Filtrar
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bibliografias.map((bibliografia) => (
          <div
            key={bibliografia.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">📖</span>
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                {bibliografia.tipo || "Libro"}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {bibliografia.titulo}
            </h3>

            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Autor:</span>{" "}
              {bibliografia.autores
                ?.map((a) => `${a.nombre} ${a.apellido}`)
                .join(", ") || "Sin autor"}
            </p>

            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">Año:</span>{" "}
              {bibliografia.fechaPublicacion
                ? new Date(bibliografia.fechaPublicacion).getFullYear()
                : "N/A"}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <Link
                  to={`/bibliografia/${bibliografia.id}`}
                  className="text-xs text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                >
                  Ver
                </Link>
                <Link
                  to={`/bibliografia/edit/${bibliografia.id}`}
                  className="text-xs text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                >
                  Editar
                </Link>
              </div>
              <button className="text-xs text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {bibliografias.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
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
  );
};

export default BibliografiaList;
