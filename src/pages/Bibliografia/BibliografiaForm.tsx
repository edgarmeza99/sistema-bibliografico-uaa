import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBibliografiaById,
  createBibliografia,
  updateBibliografia,
} from "../../services/bibliografiaService";
import { getAutores } from "../../services/autorService";
import type { Bibliografia, Autor, BibliografiaApiData } from "../../types";
import { useToast } from "../../components/ToastProvider";
import AutorModalSelector from "../../components/AutorModalSelector";
import SelectedAutoresDisplay from "../../components/SelectedAutoresDisplay";

const BibliografiaForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { showSuccess, showError } = useToast();

  const [recursosPrincipales, setRecursosPrincipales] = useState("");
  const [recursosSecundarios, setRecursosSecundarios] = useState("");
  const [selectedAutor, setSelectedAutor] = useState<number | null>(null);
  const [allAutores, setAllAutores] = useState<Autor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Debug para el modal
  useEffect(() => {
    console.log("BibliografiaForm - isModalOpen changed:", isModalOpen);
  }, [isModalOpen]);

  useEffect(() => {
    const fetchAutores = async () => {
      setLoadingData(true);
      try {
        const autoresData = await getAutores();
        setAllAutores(autoresData);
      } catch (error) {
        console.error("Error al cargar los autores:", error);
        showError(
          "Error al cargar",
          "No se pudieron cargar los autores disponibles"
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchAutores();
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      const fetchBibliografia = async () => {
        setLoadingData(true);
        try {
          const data: Bibliografia = await getBibliografiaById(id);
          setRecursosPrincipales(data.recursos_principales || "");
          setRecursosSecundarios(data.recursos_secundarios || "");
          // Cargar autor seleccionado si existe
          if (data.autor) {
            setSelectedAutor(data.autor.id);
          }
        } catch (error) {
          console.error("Error al cargar la bibliografía:", error);
          showError(
            "Error al cargar",
            "No se pudieron cargar los datos de la bibliografía"
          );
        } finally {
          setLoadingData(false);
        }
      };

      fetchBibliografia();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!recursosPrincipales.trim()) {
      showError(
        "Campo obligatorio",
        "Los recursos principales son obligatorios"
      );
      return;
    }

    setLoading(true);
    try {
      const bibliografiaData: BibliografiaApiData = {
        recursos_principales: recursosPrincipales.trim(),
        recursos_secundarios: recursosSecundarios.trim() || undefined,
      };

      // Solo incluir autores_id si hay un autor seleccionado
      if (selectedAutor) {
        bibliografiaData.autores_id = selectedAutor;
      }

      console.log("Sending bibliografia data:", bibliografiaData);
      console.log("Selected autor:", selectedAutor);

      if (isEdit && id) {
        await updateBibliografia(id, bibliografiaData);
        showSuccess(
          "Actualizado exitosamente",
          "La bibliografía ha sido actualizada correctamente"
        );
      } else {
        await createBibliografia(bibliografiaData);
        showSuccess(
          "Creado exitosamente",
          "La bibliografía ha sido creada correctamente"
        );
      }

      navigate("/bibliografia");
    } catch (error) {
      console.error("Error al guardar la bibliografía:", error);
      showError(
        "Error al guardar",
        "No se pudo guardar la bibliografía. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    console.log("Opening autor modal - current state:", isModalOpen);
    setIsModalOpen(true);
    console.log("Modal state after set:", true);
  };

  const handleCloseModal = () => {
    console.log("Closing autor modal");
    setIsModalOpen(false);
  };

  const handleAutoresChange = (newSelection: number[]) => {
    console.log("Autores selection changed:", newSelection);
    // Solo tomar el primer autor seleccionado
    const autorId = newSelection.length > 0 ? newSelection[0] : null;
    setSelectedAutor(autorId);
    console.log("Updated selected autor:", autorId);
  };

  const handleRemoveAutor = () => {
    console.log("Removing autor");
    setSelectedAutor(null);
    console.log("After removal, selected autor:", null);
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
            {isEdit ? "Editar Bibliografía" : "Nueva Bibliografía"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit
              ? "Modifica los datos de la bibliografía"
              : "Completa los campos para agregar una nueva bibliografía"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/bibliografia")}
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
              htmlFor="recursos-principales"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Recursos Principales *
            </label>
            <textarea
              id="recursos-principales"
              value={recursosPrincipales}
              onChange={(e) => setRecursosPrincipales(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical"
              placeholder="Ej: Libro: Fundamentos de Programación - Autor: Juan Pérez"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe los recursos bibliográficos principales (libros,
              manuales, etc.)
            </p>
          </div>

          <div>
            <label
              htmlFor="recursos-secundarios"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Recursos Secundarios
            </label>
            <textarea
              id="recursos-secundarios"
              value={recursosSecundarios}
              onChange={(e) => setRecursosSecundarios(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical"
              placeholder="Ej: Artículos online, Videos tutoriales de YouTube, Documentación web"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recursos complementarios como artículos, videos, páginas web, etc.
            </p>
          </div>

          {/* Selección de Autores */}
          <SelectedAutoresDisplay
            autores={allAutores}
            selectedId={selectedAutor}
            onRemove={handleRemoveAutor}
            onOpenSelector={handleOpenModal}
            disabled={loading}
          />

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/bibliografia")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Modal de selección de autores */}
      <AutorModalSelector
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedAutores={selectedAutor ? [selectedAutor] : []}
        onAutoresChange={handleAutoresChange}
        disabled={loading}
      />
    </div>
  );
};

export default BibliografiaForm;
