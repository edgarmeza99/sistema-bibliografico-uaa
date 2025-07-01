import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createFacultad,
  updateFacultad,
  getFacultadById,
} from "../../services/facultadService";
import { useToast } from "../../components/ToastProvider";

const FacultadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [descripcion, setDescripcion] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoadingData(true);
      getFacultadById(id)
        .then((facultad) => {
          setDescripcion(facultad.descripcion || "");
        })
        .catch((error) => {
          console.error("Error loading facultad:", error);
          showError(
            "Error al cargar",
            "No se pudieron cargar los datos de la facultad"
          );
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [id, showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      showError("Campo obligatorio", "La descripción es obligatoria");
      return;
    }

    setLoading(true);

    const facultadData = { descripcion: descripcion.trim() };
    try {
      if (isEditing && id) {
        await updateFacultad(id, facultadData);
        showSuccess(
          "Actualizado exitosamente",
          "La facultad ha sido actualizada correctamente"
        );
      } else {
        await createFacultad(facultadData);
        showSuccess(
          "Creado exitosamente",
          "La facultad ha sido creada correctamente"
        );
      }
      navigate("/facultad");
    } catch (error) {
      console.error("Error:", error);
      showError(
        "Error al guardar",
        "No se pudo guardar la facultad. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Editar Facultad" : "Nueva Facultad"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Modifica los datos de la facultad"
              : "Completa los campos para agregar una nueva facultad"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/facultad")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Cancelar
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción *
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Ej: Facultad de Ingeniería"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ingresa el nombre y descripción de la facultad
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/facultad")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>
                {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultadForm;
