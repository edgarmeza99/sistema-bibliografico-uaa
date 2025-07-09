import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { Autor, AutorApiData } from "../../types";
import {
  createAutor,
  updateAutor,
  getAutorById,
} from "../../services/autorService";

const AutorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [autor, setAutor] = useState<Partial<Autor>>({
    nombre: "",
    apellido: "",
    biografia: "",
    nacionalidad: "",
    fechaNacimiento: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const loadAutor = async () => {
        setLoading(true);
        try {
          const data = await getAutorById(id);
          setAutor({
            ...data,
            fechaNacimiento: data.fechaNacimiento
              ? (new Date(data.fechaNacimiento)
                  .toISOString()
                  .split("T")[0] as any)
              : undefined,
          });
        } catch (error) {
          console.error("Error al cargar autor:", error);
        } finally {
          setLoading(false);
        }
      };
      loadAutor();
    }
  }, [id, isEditing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAutor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // Mapear los datos del formulario al formato que espera la API
      const autorData: AutorApiData = {
        nombre: autor.nombre || "",
        apellido: autor.apellido || "",
        fecha_nacimiento: autor.fechaNacimiento
          ? new Date(autor.fechaNacimiento)
          : undefined,
        nacionalidad: autor.nacionalidad,
        biografia: autor.biografia,
      };

      if (isEditing && id) {
        await updateAutor(id, autorData);
      } else {
        await createAutor(autorData);
      }

      navigate("/autor");
    } catch (error) {
      console.error("Error al guardar autor:", error);
    } finally {
      setSubmitLoading(false);
    }
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
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
              {isEditing ? "Editar Autor" : "Nuevo Autor"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing
                ? "Modifica los datos del autor"
                : "Agrega un nuevo autor al sistema"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={autor.nombre || ""}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ingresa el nombre"
              />
            </div>

            {/* Apellido */}
            <div>
              <label
                htmlFor="apellido"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Apellido *
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={autor.apellido || ""}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ingresa el apellido"
              />
            </div>

            {/* Nacionalidad */}
            <div>
              <label
                htmlFor="nacionalidad"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nacionalidad
              </label>
              <input
                type="text"
                id="nacionalidad"
                name="nacionalidad"
                value={autor.nacionalidad || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ej: Mexicana, Argentina, etc."
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div className="md:col-span-2">
              <label
                htmlFor="fechaNacimiento"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={(autor.fechaNacimiento as any) || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Biografía */}
          <div>
            <label
              htmlFor="biografia"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Biografía
            </label>
            <textarea
              id="biografia"
              name="biografia"
              value={autor.biografia || ""}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Escribe una breve biografía del autor..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              to="/autor"
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {submitLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isEditing ? "Actualizar" : "Crear"} Autor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutorForm;
