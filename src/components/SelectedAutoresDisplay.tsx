import React from "react";
import type { Autor } from "../types";

interface SelectedAutoresDisplayProps {
  autores: Autor[];
  selectedId: number | null;
  onRemove: () => void;
  onOpenSelector: () => void;
  disabled?: boolean;
}

const SelectedAutoresDisplay: React.FC<SelectedAutoresDisplayProps> = ({
  autores,
  selectedId,
  onRemove,
  onOpenSelector,
  disabled = false,
}) => {
  const selectedAutor = selectedId 
    ? autores.find(autor => autor.id === selectedId)
    : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Autor de la Bibliografía
          <span className="text-gray-500 font-normal ml-1">
            ({selectedId ? "1 seleccionado" : "ninguno seleccionado"})
          </span>
        </label>
        <button
          type="button"
          onClick={() => {
            console.log("Button clicked - opening autor selector");
            onOpenSelector();
          }}
          disabled={disabled}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {selectedId ? "Cambiar Autor" : "Seleccionar Autor"}
        </button>
      </div>

      {/* Selected autor */}
      {selectedAutor ? (
        <div className="space-y-2">
          <div
            key={selectedAutor.id}
            className="bg-orange-50 border border-orange-200 rounded-lg p-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm font-bold">
                    {selectedAutor.nombre.charAt(0).toUpperCase()}
                    {selectedAutor.apellido.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-orange-900">
                    {selectedAutor.nombre} {selectedAutor.apellido}
                  </p>
                  {selectedAutor.nacionalidad && (
                    <p className="text-xs text-orange-700 mt-1">
                      {selectedAutor.nacionalidad}
                    </p>
                  )}
                  <p className="text-xs text-orange-600 mt-1">ID: {selectedAutor.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove()}
                disabled={disabled}
                className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Eliminar autor"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="text-gray-400 text-4xl mb-2">👤</div>
          <p className="text-gray-600 text-sm mb-3">
            No hay autor seleccionado
          </p>
          <p className="text-gray-500 text-xs">
            Haz clic en "Seleccionar Autor" para asignar un autor a esta bibliografía
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectedAutoresDisplay;
