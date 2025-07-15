import React from "react";
import type { Bibliografia } from "../types";


interface SelectedBibliografiasDisplayProps {
  bibliografias: Bibliografia[];
  selectedIds: number[];
  onRemove: (bibliografiaId: number) => void;
  onOpenSelector: () => void;
  disabled?: boolean;
}

const SelectedBibliografiasDisplay: React.FC<SelectedBibliografiasDisplayProps> = ({
  bibliografias,
  selectedIds,
  onRemove,
  onOpenSelector,
  disabled = false,
}) => {
  const selectedBibliografias = bibliografias.filter(bib => 
    selectedIds.includes(bib.id)
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Bibliografías de la Materia
          <span className="text-gray-500 font-normal ml-1">
            ({selectedIds.length} seleccionadas)
          </span>
        </label>
        <button
          type="button"
          onClick={() => {
            console.log("Button clicked - opening selector");
            onOpenSelector();
          }}
          disabled={disabled}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {selectedIds.length > 0 ? "Editar Selección" : "Seleccionar Bibliografías"}
        </button>
      </div>

      {/* Selected bibliografias */}
      {selectedBibliografias.length > 0 ? (
        <div className="space-y-2">
          {selectedBibliografias.map((bibliografia) => (
            <div
              key={bibliografia.id}
              className="bg-blue-50 border border-blue-200 rounded-lg p-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900">
                    {bibliografia.recursos_principales}
                  </p>
                  {bibliografia.recursos_secundarios && (
                    <p className="text-xs text-blue-700 mt-1">
                      {bibliografia.recursos_secundarios}
                    </p>
                  )}
                  <p className="text-xs text-blue-600 mt-1">ID: {bibliografia.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(bibliografia.id)}
                  disabled={disabled}
                  className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Eliminar bibliografía"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="text-gray-400 text-4xl mb-2">📚</div>
          <p className="text-gray-600 text-sm mb-3">
            No hay bibliografías seleccionadas
          </p>
          <p className="text-gray-500 text-xs">
            Haz clic en "Seleccionar Bibliografías" para agregar recursos bibliográficos a esta materia
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectedBibliografiasDisplay;
