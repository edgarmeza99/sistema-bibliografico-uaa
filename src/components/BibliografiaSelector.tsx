import React, { useState, useEffect } from "react";
import { useToast } from "./ToastProvider";
import type { Bibliografia } from "../types";
import { getBibliografias } from "../services/bibliografiaService";


interface BibliografiaSelectorProps {
  selectedBibliografias: number[];
  onBibliografiasChange: (bibliografia: number[]) => void;
  disabled?: boolean;
}

const BibliografiaSelector: React.FC<BibliografiaSelectorProps> = ({
  selectedBibliografias,
  onBibliografiasChange,
  disabled = false,
}) => {
  const [bibliografias, setBibliografias] = useState<Bibliografia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showError } = useToast();

  useEffect(() => {
    const loadBibliografias = async () => {
      try {
        const data = await getBibliografias();
        setBibliografias(data);
      } catch (error) {
        console.error("Error al cargar bibliografías:", error);
        showError("Error", "No se pudieron cargar las bibliografías");
      } finally {
        setLoading(false);
      }
    };

    loadBibliografias();
  }, [showError]);

  const handleBibliografiaToggle = (bibliografiaId: number) => {
    if (disabled) return;

    const isSelected = selectedBibliografias.includes(bibliografiaId);
    if (isSelected) {
      onBibliografiasChange(
        selectedBibliografias.filter((id) => id !== bibliografiaId)
      );
    } else {
      onBibliografiasChange([...selectedBibliografias, bibliografiaId]);
    }
  };

  const filteredBibliografias = bibliografias.filter((bibliografia) =>
    bibliografia.recursos_principales
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getSelectedBibliografiasTitles = () => {
    return bibliografias
      .filter((bib) => selectedBibliografias.includes(bib.id))
      .map((bib) => bib.recursos_principales);
  };

  if (loading) {
    return (
      <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Bibliografías de la Materia
        <span className="text-gray-500 font-normal ml-1">
          ({selectedBibliografias.length} seleccionadas)
        </span>
      </label>

      {/* Selected bibliografias summary */}
      {selectedBibliografias.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm font-medium text-blue-800 mb-2">
            Bibliografías seleccionadas:
          </p>
          <div className="flex flex-wrap gap-2">
            {getSelectedBibliografiasTitles().map((title, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {title.length > 30 ? `${title.substring(0, 30)}...` : title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar bibliografías..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <svg
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
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

      {/* Bibliografias list */}
      <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto">
        {filteredBibliografias.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm
              ? "No se encontraron bibliografías que coincidan con la búsqueda"
              : "No hay bibliografías disponibles"}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBibliografias.map((bibliografia) => (
              <div
                key={bibliografia.id}
                className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleBibliografiaToggle(bibliografia.id)}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedBibliografias.includes(bibliografia.id)}
                    onChange={() => handleBibliografiaToggle(bibliografia.id)}
                    disabled={disabled}
                    className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded disabled:cursor-not-allowed"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {bibliografia.recursos_principales}
                    </p>
                    {bibliografia.recursos_secundarios && (
                      <p className="text-sm text-gray-500 truncate">
                        {bibliografia.recursos_secundarios}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">ID: {bibliografia.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBibliografias.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Selecciona las bibliografías que pertenecen a esta materia
        </p>
      )}
    </div>
  );
};

export default BibliografiaSelector;
