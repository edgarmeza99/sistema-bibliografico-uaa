/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PORT: string;
  readonly VITE_NODE_ENV: string;
  // más variables de entorno aquí...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
