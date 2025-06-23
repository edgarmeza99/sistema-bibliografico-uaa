# Sistema de Gestión Bibliográfica

Sistema web para la gestión de bibliografías académicas desarrollado con React, TypeScript y Vite.

## Características

- ✅ Gestión de Facultades
- ✅ Gestión de Materias
- ✅ Gestión de Bibliografías
- ✅ Gestión de Autores
- ✅ Panel administrativo moderno
- ✅ Diseño responsivo con Tailwind CSS

## Configuración del Entorno

### Variables de Entorno

Este proyecto utiliza variables de entorno para la configuración. Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Variables disponibles:

```env
# URL del servidor API
VITE_API_URL=http://localhost:3000/api

# Puerto del servidor de desarrollo (opcional)
VITE_PORT=5173

# Configuración de desarrollo
VITE_NODE_ENV=development
```

## Instalación

1. Clona el repositorio
2. Instala las dependencias:

```bash
# Con npm
npm install

# Con yarn
yarn install
```

3. Configura las variables de entorno (ver arriba)
4. Inicia el servidor de desarrollo:

```bash
# Con npm
npm run dev

# Con yarn
yarn dev
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
