import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  createMateria as createMateriaService,
  updateMateria as updateMateriaService,
  getMateriaById,
} from "../../services/materiaService";
import type { TurnoMateria } from "../../types";

const MateriaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [creditos, setCreditos] = useState(0);
  const [turno, setTurno] = useState<TurnoMateria>("mañana");
  const [facultadId, setFacultadId] = useState("");
  const facultades = [
    { id: 1, descripcion: "Facultad de Ciencias Económicas y Empresariales" },
    {
      id: 2,
      descripcion: "Facultad de Ciencias Jurídicas, Políticas y Sociales",
    },
    {
      id: 3,
      descripcion: "Facultad de Ciencias de la Educación y la Comunicación",
    },
    { id: 4, descripcion: "Facultad de Ciencias de la Salud" },
    { id: 5, descripcion: "Facultad de Ciencias y Tecnologías" },
  ];
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Cargar facultades para el select

    if (id) {
      setIsEditing(true);
      setLoadingData(true);
      getMateriaById(id)
        .then((materia) => {
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
        })
        .catch((error) => {
          console.error("Error loading materia:", error);
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!codigo.trim()) {
      newErrors.codigo = "El código es requerido";
    }

    if (!facultadId) {
      newErrors.facultadId = "Debe seleccionar una facultad";
    }

    if (creditos <= 0) {
      newErrors.creditos = "Los créditos deben ser mayor a 0";
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

    const materiaData = {
      nombre_materia: nombre,
      codigo,
      descripcion,
      creditos,
      turnos: turno,
      facultad: facultades.find((f) => f.id.toString() === facultadId)
        ?.descripcion,
    };

    try {
      if (isEditing) {
        await updateMateriaService(id!, materiaData);
      } else {
        await createMateriaService(materiaData);
      }
      navigate("/materia");
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: "Ocurrió un error al guardar la materia" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Loading indicator for data fetching */}
      {loadingData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <div className="text-blue-700 text-sm">
              Cargando datos de la materia...
            </div>
          </div>
        </div>
      )}

      {/* Debug info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
        <p>
          <strong>Debug:</strong>
        </p>
        <p>ID: {id || "No ID"}</p>
        <p>Is Editing: {isEditing ? "Sí" : "No"}</p>
        <p>Loading Data: {loadingData ? "Sí" : "No"}</p>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/materia" className="hover:text-green-600 transition-colors">
          Materias
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium">
          {isEditing ? "Editar Materia" : "Nueva Materia"}
        </span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 text-xl">📚</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Editar Materia" : "Nueva Materia"}
            </h1>
            <p className="text-gray-600">
              {isEditing
                ? "Modifica los datos de la materia"
                : "Completa la información para crear una nueva materia"}
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.nombre
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Ej: Cálculo I"
              disabled={loading}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.codigo
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Ej: MAT101"
              disabled={loading}
            />
            {errors.codigo && (
              <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
            )}
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.creditos
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Ej: 3"
              min="1"
              disabled={loading}
            />
            {errors.creditos && (
              <p className="mt-1 text-sm text-red-600">{errors.creditos}</p>
            )}
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.facultadId
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              disabled={loading}
            >
              <option value="">Seleccionar facultad</option>
              {facultades.map((facultad) => (
                <option key={facultad.id} value={facultad.id}>
                  {facultad.descripcion}
                </option>
              ))}
            </select>
            {errors.facultadId && (
              <p className="mt-1 text-sm text-red-600">{errors.facultadId}</p>
            )}
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

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Link
            to="/materia"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </Link>
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
                ? "Actualizar"
                : "Crear Materia"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MateriaForm;
