import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createMateria as createMateriaService,
  updateMateria as updateMateriaService,
  getMateriaById,
} from "../../services/materiaService";
import { getFacultades } from "../../services/facultadService";
import type { TurnoMateria, Facultad } from "../../types";
import { useToast } from "../../components/ToastProvider";

const MateriaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const isEditing = Boolean(id);

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [creditos, setCreditos] = useState(0);
  const [turno, setTurno] = useState<TurnoMateria>("mañana");
  const [facultadId, setFacultadId] = useState("");
  const [facultades, setFacultades] = useState<Facultad[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingData(true);
      try {
        // Cargar facultades
        const facultadesData = await getFacultades();
        setFacultades(facultadesData);

        // Si estamos editando, cargar datos de la materia
        if (id) {
          const materia = await getMateriaById(id);
          setNombre(materia.nombre_materia);
          setCodigo(materia.codigo);
          setDescripcion(materia.descripcion || "");
          setCreditos(materia.creditos);
          setTurno(materia.turnos);
          setFacultadId(
            materia.facultadId !== undefined
              ? materia.facultadId.toString()
              : ""
          );
        }
      } catch (error) {
        console.error("Error loading data:", error);
        showError(
          "Error al cargar",
          "No se pudieron cargar los datos necesarios"
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, [id, showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!nombre.trim()) {
      showError("Campo obligatorio", "El nombre de la materia es obligatorio");
      return;
    }

    if (!codigo.trim()) {
      showError("Campo obligatorio", "El código es obligatorio");
      return;
    }

    if (!facultadId) {
      showError("Campo obligatorio", "Debe seleccionar una facultad");
      return;
    }

    if (creditos <= 0) {
      showError("Valor inválido", "Los créditos deben ser mayor a 0");
      return;
    }

    setLoading(true);

    const materiaData = {
      nombre_materia: nombre.trim(),
      codigo: codigo.trim(),
      descripcion: descripcion.trim(),
      creditos,
      turnos: turno,
      facultadId: parseInt(facultadId),
    };

    try {
      if (isEditing && id) {
        await updateMateriaService(id, materiaData);
        showSuccess(
          "Actualizado exitosamente",
          "La materia ha sido actualizada correctamente"
        );
      } else {
        await createMateriaService(materiaData);
        showSuccess(
          "Creado exitosamente",
          "La materia ha sido creada correctamente"
        );
      }
      navigate("/materia");
    } catch (error) {
      console.error("Error:", error);
      showError(
        "Error al guardar",
        "No se pudo guardar la materia. Por favor, intenta de nuevo."
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
            {isEditing ? "Editar Materia" : "Nueva Materia"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Modifica los datos de la materia"
              : "Completa los campos para agregar una nueva materia"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/materia")}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre de la Materia *
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Ej: Cálculo I"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label
                htmlFor="codigo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Código *
              </label>
              <input
                type="text"
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Ej: MAT101"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="creditos"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Créditos *
              </label>
              <input
                type="number"
                id="creditos"
                value={creditos}
                onChange={(e) => setCreditos(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Ej: 3"
                min="1"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label
                htmlFor="turno"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Turno *
              </label>
              <select
                id="turno"
                value={turno}
                onChange={(e) => setTurno(e.target.value as TurnoMateria)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                disabled={loading}
              >
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
                <option value="noche">Noche</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="facultadId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Facultad *
              </label>
              <select
                id="facultadId"
                value={facultadId}
                onChange={(e) => setFacultadId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                disabled={loading}
                required
              >
                <option value="">Seleccionar facultad</option>
                {facultades.map((facultad) => (
                  <option key={facultad.id} value={facultad.id}>
                    {facultad.descripcion}
                  </option>
                ))}
              </select>
            </div>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Descripción de la materia (opcional)"
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/materia")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>
                {loading
                  ? "Guardando..."
                  : isEditing
                  ? "Actualizar Materia"
                  : "Crear Materia"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MateriaForm;
