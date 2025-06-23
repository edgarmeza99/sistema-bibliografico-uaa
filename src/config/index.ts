// Configuración centralizada de la aplicación
export const config = {
  // URL de la API
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",

  // Puerto del servidor
  port: import.meta.env.VITE_PORT || "5173",

  // Entorno de desarrollo
  isDevelopment: import.meta.env.VITE_NODE_ENV === "development",

  // Configuración de la API
  api: {
    timeout: 10000,
    retries: 3,
  },

  // Configuración de la UI
  ui: {
    itemsPerPage: 10,
    debounceTime: 300,
  },
};

// Función para validar que todas las variables requeridas estén definidas
export const validateConfig = () => {
  const requiredEnvVars = ["VITE_API_URL"];

  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      console.warn(`Variable de entorno faltante: ${envVar}`);
    }
  }
};

// Validar configuración al cargar
validateConfig();
