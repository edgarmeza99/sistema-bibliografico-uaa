import React from "react";
import type { MaterialDetalle } from "../types";


interface MateriaBibliografiasProps {
  bibliografias: MaterialDetalle[];
  titulo?: string;
  maxVisible?: number;
  showRemoveButton?: boolean;
  onRemove?: (bibliografiaId: number) => void;
  disabled?: boolean;
}

const MateriaBibliografias: React.FC<MateriaBibliografiasProps> = ({
  bibliografias,
  titulo = "Bibliografías",
  maxVisible = 3,
  showRemoveButton = false,
  onRemove,
  disabled = false,
}) => {
  if (!bibliografias || bibliografias.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No hay bibliografías asignadas
      </div>
    );
  }

  const visibleBibliografias = bibliografias.slice(0, maxVisible);
  const remainingCount = bibliografias.length - maxVisible;

  const handleRemove = (bibliografiaId: number) => {
    if (onRemove && !disabled) {
      onRemove(bibliografiaId);
    }
  };

  return (
    <div className="space-y-2">
      {titulo && <h4 className="text-sm font-medium text-gray-700">{titulo}</h4>}
      <div className="space-y-2">
        {visibleBibliografias.map((bibliografia) => (
          <div
            key={bibliografia.id}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 truncate">
                  {bibliografia.recursos_principales}
                </p>
                {bibliografia.recursos_secundarios && (
                  <p className="text-xs text-blue-700 mt-1 truncate">
                    {bibliografia.recursos_secundarios}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  ID: {bibliografia.bibliografia_id}
                </span>
                {showRemoveButton && onRemove && (
                  <button
                    type="button"
                    onClick={() => handleRemove(bibliografia.bibliografia_id)}
                    disabled={disabled}
                    className="inline-flex items-center p-1 border border-transparent rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Eliminar bibliografía"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="text-xs text-gray-500 text-center py-2 bg-gray-50 rounded-lg border border-gray-200">
            +{remainingCount} bibliografía{remainingCount > 1 ? 's' : ''} más
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
        <span>Total: {bibliografias.length} bibliografía{bibliografias.length > 1 ? 's' : ''}</span>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span>Recursos bibliográficos</span>
        </div>
      </div>
    </div>
  );
};

export default MateriaBibliografias;
