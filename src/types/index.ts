// Tipo para Facultad
export interface Facultad {
  id: string;
  descripcion: string;
  // Campos opcionales para mantener compatibilidad si se necesitan más adelante
  nombre?: string;
  fechaCreacion?: Date;
  activo?: boolean;
}

// Tipos para Materia
export type TurnoMateria = "mañana" | "tarde" | "noche";

// Tipo para detalle de material bibliográfico en materia
export interface MaterialDetalle {
  id: number;
  bibliografia_id: number;
  recursos_principales: string;
  recursos_secundarios?: string;
}

export interface Materia {
  id?: number;
  nombre_materia: string;
  material_detalle?: MaterialDetalle[];
  codigo: string;
  descripcion?: string;
  creditos: number;
  turnos: TurnoMateria;
  facultadId?: number;
  facultad_id?: string;
  facultad?: string;
  fechaCreacion: Date;
  activo: boolean;
}

// Tipo para Autor
export interface Autor {
  id: number;
  nombre: string;
  apellido: string;
  biografia?: string;
  fechaNacimiento?: Date;
  nacionalidad?: string;
  fechaCreacion: Date;
  activo: boolean;
}

// Tipo para crear/actualizar autor en la API
export interface AutorApiData {
  nombre: string;
  apellido: string;
  fecha_nacimiento?: Date;
  nacionalidad?: string;
  biografia?: string;
}

// Tipo para Bibliografia
export interface Bibliografia {
  id: number;
  recursos_principales: string;
  recursos_secundarios?: string;
  // Solo un autor por bibliografía
  autor?: Autor;
  // Campos opcionales para mantener compatibilidad si se necesitan más adelante
  titulo?: string;
  isbn?: string;
  editorial?: string;
  fechaPublicacion?: Date;
  descripcion?: string;
  tipo?: TipoBibliografia;
  materiaId?: number;
  materia?: Materia;
  fechaCreacion?: Date;
  activo?: boolean;
}

// Tipo para crear/actualizar bibliografía en la API
export interface BibliografiaApiData {
  recursos_principales: string;
  recursos_secundarios?: string;
  autores_id?: number;
}

// Enum para tipos de bibliografía
export type TipoBibliografia =
  | "LIBRO"
  | "ARTICULO"
  | "REVISTA"
  | "TESIS"
  | "DOCUMENTO_ELECTRONICO";

// Tipos para formularios
export interface FacultadFormData {
  nombre: string;
  descripcion?: string;
}

export interface MateriaFormData {
  nombre: string;
  codigo: string;
  descripcion?: string;
  creditos: number;
  facultadId: number;
  material_detalle?: number[];
}

// Tipo para enviar datos al backend
export interface MateriaCreateData {
  facultad_id: number;
  nombre_materia: string;
  turnos: TurnoMateria;
  creditos: number;
  material_detalle: number[];
  codigo: string;
  descripcion?: string;
}

export interface AutorFormData {
  nombre: string;
  apellido: string;
  email?: string;
  biografia?: string;
  fechaNacimiento?: string;
  nacionalidad?: string;
}

export interface BibliografiaFormData {
  titulo: string;
  isbn?: string;
  editorial: string;
  fechaPublicacion: string;
  descripcion?: string;
  tipo: TipoBibliografia;
  materiaId: number;
  autoresIds: number[];
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para filtros y búsqueda
export interface SearchFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FacultadFilters extends SearchFilters {
  activo?: boolean;
}

export interface MateriaFilters extends SearchFilters {
  facultadId?: number;
  activo?: boolean;
}

export interface AutorFilters extends SearchFilters {
  nacionalidad?: string;
  activo?: boolean;
}

export interface BibliografiaFilters extends SearchFilters {
  tipo?: TipoBibliografia;
  materiaId?: number;
  autorId?: number;
  activo?: boolean;
}
