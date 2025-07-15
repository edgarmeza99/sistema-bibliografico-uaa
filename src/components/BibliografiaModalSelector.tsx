import React, { useState, useEffect } from "react";
import { getBibliografias } from "../services/bibliografiaService";
import type { Bibliografia } from "../types";
import { useToast } from "./ToastProvider";

interface BibliografiaModalSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBibliografias: number[];
  onBibliografiasChange: (bibliografias: number[]) => void;
  disabled?: boolean;
}

const BibliografiaModalSelector: React.FC<BibliografiaModalSelectorProps> = ({
  isOpen,
  onClose,
  selectedBibliografias,
  onBibliografiasChange,
  disabled = false,
}) => {
  const [bibliografias, setBibliografias] = useState<Bibliografia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelected, setTempSelected] = useState<number[]>([]);
  const { showError } = useToast();

  useEffect(() => {
    console.log("BibliografiaModalSelector - isOpen changed:", isOpen);
    if (isOpen) {
      setTempSelected([...selectedBibliografias]);
      loadBibliografias();
    }
  }, [isOpen, selectedBibliografias]);

  const loadBibliografias = async () => {
    try {
      setLoading(true);
      const data = await getBibliografias();
      setBibliografias(data);
    } catch (error) {
      console.error("Error al cargar bibliografías:", error);
      showError("Error", "No se pudieron cargar las bibliografías");
    } finally {
      setLoading(false);
    }
  };

  const handleBibliografiaToggle = (bibliografiaId: number) => {
    if (disabled) return;

    const isSelected = tempSelected.includes(bibliografiaId);
    if (isSelected) {
      setTempSelected(tempSelected.filter((id) => id !== bibliografiaId));
    } else {
      // Evitar duplicados
      if (!tempSelected.includes(bibliografiaId)) {
        setTempSelected([...tempSelected, bibliografiaId]);
      }
    }
  };

  const handleSave = () => {
    onBibliografiasChange(tempSelected);
    onClose();
  };

  const handleCancel = () => {
    setTempSelected([...selectedBibliografias]);
    setSearchTerm("");
    onClose();
  };

  const filteredBibliografias = bibliografias.filter((bibliografia) =>
    bibliografia.recursos_principales
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (bibliografia.recursos_secundarios && 
     bibliografia.recursos_secundarios.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isOpen) {
    console.log("BibliografiaModalSelector - not rendering (isOpen:", isOpen, ")");
    return null;
  }

  console.log("BibliografiaModalSelector - rendering modal");

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
                  Seleccionar Bibliografías
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {tempSelected.length} bibliografía{tempSelected.length !== 1 ? 's' : ''} seleccionada{tempSelected.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  placeholder="Buscar bibliografías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={disabled}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
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
            {tempSelected.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>{tempSelected.length}</strong> bibliografía{tempSelected.length !== 1 ? 's' : ''} seleccionada{tempSelected.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* List */}
            <div className="border border-gray-200 rounded-md max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando bibliografías...</p>
                </div>
              ) : filteredBibliografias.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {searchTerm
                    ? "No se encontraron bibliografías que coincidan con la búsqueda"
                    : "No hay bibliografías disponibles"}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredBibliografias.map((bibliografia) => (
                    <div
                      key={bibliografia.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        disabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handleBibliografiaToggle(bibliografia.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={tempSelected.includes(bibliografia.id)}
                          onChange={() => handleBibliografiaToggle(bibliografia.id)}
                          disabled={disabled}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {bibliografia.recursos_principales}
                          </p>
                          {bibliografia.recursos_secundarios && (
                            <p className="text-sm text-gray-500 mt-1">
                              {bibliografia.recursos_secundarios}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">ID: {bibliografia.id}</p>
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
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={disabled}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Selección ({tempSelected.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibliografiaModalSelector;
