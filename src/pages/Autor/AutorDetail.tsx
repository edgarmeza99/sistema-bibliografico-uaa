import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { Autor } from "../../types";
import { getAutorById, deleteAutor } from "../../services/autorService";

const AutorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [autor, setAutor] = useState<Autor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAutor = async () => {
      if (!id) return;

      try {
        const data = await getAutorById(id);
        setAutor(data);
      } catch (error) {
        console.error("Error al cargar autor:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAutor();
  }, [id]);

  const handleDelete = async () => {
    if (!autor || !id) return;

    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar a ${autor.nombre} ${autor.apellido}?`
      )
    ) {
      try {
        await deleteAutor(id);
        navigate("/autor");
      } catch (error) {
        console.error("Error al eliminar autor:", error);
      }
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "No especificada";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del autor...</p>
        </div>
      </div>
    );
  }

  if (!autor) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">❌</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Autor no encontrado
        </h3>
        <p className="text-gray-500 mb-4">
          El autor que buscas no existe o ha sido eliminado
        </p>
        <Link
          to="/autor"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Volver a Autores</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/autor"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {autor.nombre} {autor.apellido}
              </h1>
              <p className="text-gray-600 mt-1">Detalles del autor</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Link
              to={`/autor/edit/${autor.id}`}
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
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Author Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start space-x-6 mb-8">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-3xl">
                {autor.nombre.charAt(0).toUpperCase()}
                {autor.apellido.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {autor.nombre} {autor.apellido}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>ID: {autor.id}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{autor.activo ? "Activo" : "Inactivo"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Información Personal
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nacionalidad
                </label>
                <p className="text-gray-900">
                  {autor.nacionalidad || "No especificada"}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Fechas Importantes
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <p className="text-gray-900">
                  {formatDate(autor.fechaNacimiento)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Registro
                </label>
                <p className="text-gray-900">
                  {formatDate(autor.fechaCreacion)}
                </p>
              </div>
            </div>
          </div>

          {/* Biography */}
          {autor.biografia && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Biografía
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {autor.biografia}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutorDetail;
