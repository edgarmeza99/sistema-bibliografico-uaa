import type { Materia, MaterialDetalle } from "../types";

/**
 * Extrae los IDs de bibliografía del material_detalle de una materia
 */
export const extractBibliografiaIds = (materia: Materia): number[] => {
  if (!materia.material_detalle || !Array.isArray(materia.material_detalle)) {
    return [];
  }
  
  return materia.material_detalle.map(item => item.bibliografia_id);
};

/**
 * Cuenta el número de bibliografías asociadas a una materia
 */
export const countBibliografias = (materia: Materia): number => {
  return materia.material_detalle?.length || 0;
};

/**
 * Obtiene los recursos principales de las bibliografías
 */
export const getBibliografiasTitles = (materia: Materia): string[] => {
  if (!materia.material_detalle || !Array.isArray(materia.material_detalle)) {
    return [];
  }
  
  return materia.material_detalle.map(item => item.recursos_principales);
};

/**
 * Verifica si una materia tiene bibliografías asociadas
 */
export const hasBibliografias = (materia: Materia): boolean => {
  return Boolean(materia.material_detalle && materia.material_detalle.length > 0);
};

/**
 * Formatea la información de créditos (maneja string y number)
 */
export const formatCreditos = (creditos: string | number): number => {
  if (typeof creditos === 'string') {
    return parseInt(creditos) || 0;
  }
  return creditos;
};

/**
 * Formatea la información de facultad_id (maneja string y number)
 */
export const formatFacultadId = (facultadId: string | number | undefined): string => {
  if (facultadId === undefined || facultadId === null) {
    return "";
  }
  return facultadId.toString();
};

/**
 * Obtiene una bibliografía específica por su ID
 */
export const getBibliografiaById = (materia: Materia, bibliografiaId: number): MaterialDetalle | undefined => {
  if (!materia.material_detalle || !Array.isArray(materia.material_detalle)) {
    return undefined;
  }
  
  return materia.material_detalle.find(item => item.bibliografia_id === bibliografiaId);
};

/**
 * Filtra bibliografías por texto en recursos principales
 */
export const filterBibliografiasByText = (materia: Materia, searchText: string): MaterialDetalle[] => {
  if (!materia.material_detalle || !Array.isArray(materia.material_detalle)) {
    return [];
  }
  
  const lowerSearchText = searchText.toLowerCase();
  return materia.material_detalle.filter(item => 
    item.recursos_principales.toLowerCase().includes(lowerSearchText) ||
    (item.recursos_secundarios && item.recursos_secundarios.toLowerCase().includes(lowerSearchText))
  );
};
