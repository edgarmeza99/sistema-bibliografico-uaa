import React, { useState, useEffect } from "react";
import { getAutores } from "../services/autorService";
import type { Autor } from "../types";
import { useToast } from "./ToastProvider";

interface AutorModalSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAutores: number[];
  onAutoresChange: (autores: number[]) => void;
  disabled?: boolean;
}

const AutorModalSelector: React.FC<AutorModalSelectorProps> = ({
  isOpen,
  onClose,
  selectedAutores,
  onAutoresChange,
  disabled = false,
}) => {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelected, setTempSelected] = useState<number | null>(null);
  const { showError } = useToast();

  useEffect(() => {
    console.log("AutorModalSelector - isOpen changed:", isOpen);
    if (isOpen) {
      setTempSelected(selectedAutores.length > 0 ? selectedAutores[0] : null);
      loadAutores();
    }
  }, [isOpen, selectedAutores]);

  const loadAutores = async () => {
    try {
      setLoading(true);
      const data = await getAutores();
      setAutores(data);
    } catch (error) {
      console.error("Error al cargar autores:", error);
      showError("Error", "No se pudieron cargar los autores");
    } finally {
      setLoading(false);
    }
  };

  const handleAutorToggle = (autorId: number) => {
    if (disabled) return;

    // Solo permitir seleccionar un autor
    if (tempSelected === autorId) {
      setTempSelected(null); // Deseleccionar si ya está seleccionado
    } else {
      setTempSelected(autorId); // Seleccionar nuevo autor
    }
  };

  const handleSave = () => {
    onAutoresChange(tempSelected ? [tempSelected] : []);
    onClose();
  };

  const handleCancel = () => {
    setTempSelected(selectedAutores.length > 0 ? selectedAutores[0] : null);
    setSearchTerm("");
    onClose();
  };

  const filteredAutores = autores.filter((autor) =>
    `${autor.nombre} ${autor.apellido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (autor.nacionalidad && 
     autor.nacionalidad.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isOpen) {
    console.log("AutorModalSelector - not rendering (isOpen:", isOpen, ")");
    return null;
  }

  console.log("AutorModalSelector - rendering modal");

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-10"
          onClick={handleCancel}
          aria-hidden="true"
        ></div>

        {/* Spacer for centering */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full z-20">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Seleccionar Autor
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {tempSelected ? "1 autor seleccionado" : "Ningún autor seleccionado"}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-6 py-4">
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar autores por nombre o nacionalidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={disabled}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Selected count */}
            {tempSelected && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-sm text-orange-800">
                  <strong>1</strong> autor seleccionado
                </p>
              </div>
            )}

            {/* List */}
            <div className="border border-gray-200 rounded-md max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando autores...</p>
                </div>
              ) : filteredAutores.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {searchTerm
                    ? "No se encontraron autores que coincidan con la búsqueda"
                    : "No hay autores disponibles"}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAutores.map((autor) => (
                    <div
                      key={autor.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        disabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handleAutorToggle(autor.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          checked={tempSelected === autor.id}
                          onChange={() => handleAutorToggle(autor.id)}
                          disabled={disabled}
                          className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 disabled:cursor-not-allowed"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 text-sm font-bold">
                                {autor.nombre.charAt(0).toUpperCase()}
                                {autor.apellido.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {autor.nombre} {autor.apellido}
                              </p>
                              {autor.nacionalidad && (
                                <p className="text-sm text-gray-500">
                                  {autor.nacionalidad}
                                </p>
                              )}
                              {autor.biografia && (
                                <p className="text-xs text-gray-400 mt-1 truncate">
                                  {autor.biografia.length > 80
                                    ? `${autor.biografia.substring(0, 80)}...`
                                    : autor.biografia}
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">ID: {autor.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={disabled}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={disabled}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Selección {tempSelected ? "(1)" : "(0)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutorModalSelector;
