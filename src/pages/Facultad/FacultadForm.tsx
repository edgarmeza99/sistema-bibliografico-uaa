import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createFacultad,
  updateFacultad,
  getFacultadById,
} from "../../services/facultadService";

const FacultadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      getFacultadById(id)
        .then((facultad) => {
          setNombre(facultad.nombre);
          setDescripcion(facultad.descripcion || "");
        })
        .catch((error) => {
          console.error("Error loading facultad:", error);
        });
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const facultadData = { nombre, descripcion };
    try {
      if (isEditing) {
        await updateFacultad(id!, facultadData);
      } else {
        await createFacultad(facultadData);
      }
      navigate("/facultad");
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: "Ocurrió un error al guardar la facultad" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/facultad" className="hover:text-blue-600 transition-colors">
          Facultades
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium">
          {isEditing ? "Editar Facultad" : "Nueva Facultad"}
        </span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-xl">🏛️</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Editar Facultad" : "Nueva Facultad"}
            </h1>
            <p className="text-gray-600">
              {isEditing
                ? "Modifica los datos de la facultad"
                : "Completa la información para crear una nueva facultad"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-6"
      >
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div className="text-red-700 text-sm">{errors.submit}</div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre de la Facultad *
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.nombre
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Ej: Facultad de Ingeniería"
              disabled={loading}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Descripción opcional de la facultad..."
              disabled={loading}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Link
            to="/facultad"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>
              {loading
                ? "Guardando..."
                : isEditing
                ? "Actualizar"
                : "Crear Facultad"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacultadForm;
