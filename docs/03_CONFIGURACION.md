# 3. Configuración

## Variables de Entorno (`.env`)

```env
VITE_API_URL=http://localhost:8085/api/admin/
VITE_LOGIN_URL=http://localhost:8085/login
VITE_GATEWAY_URL=http://localhost:8085
```

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base del backend (no se usa directamente en services) |
| `VITE_LOGIN_URL` | URL externa de login (para redirects fallback) |
| `VITE_GATEWAY_URL` | URL del gateway → se usa como base para `api.js` con sufijo `/api` |

Accesibles en código como `import.meta.env.VITE_*`. Sin prefijo `VITE_` no se exponen al bundle.

## Scripts npm

```bash
npm run dev       # Servidor de desarrollo en puerto 8001 (Vite)
npm run build     # Build de producción en dist/
npm run preview   # Preview del build de producción
```

## Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## TailwindCSS (`tailwind.config.js`)

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: '#root',     // Tailwind gana sobre estilos MUI en conflictos de especificidad
  corePlugins: {
    preflight: false,     // Desactivado: MUI CssBaseline ya provee el reset CSS
  },
  theme: { extend: { /* colores, sombras, fuentes */ } },
  plugins: [],
};
```

**Decisiones de configuración:**
- `important: '#root'` — Envuelve todas las utilidades con el selector `#root`, elevando su especificidad para que ganen a los estilos generados por Emotion (MUI) sin necesidad de `!important`.
- `preflight: false` — MUI ya aplica su propio reset CSS vía `<CssBaseline />`. Activar ambos causaría conflictos visuales.

## PostCSS (`postcss.config.js`)

```javascript
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

## CSS Base (`src/index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    background-color: #f8fafc;
  }
}
```

Importado en `main.jsx` como `import './index.css'` antes de los providers.

## Providers Pipeline (`main.jsx`)

Orden de providers que envuelven la aplicación:

1. **CSS global** — `import './index.css'` (Tailwind directives + body font/bg)
2. **React.StrictMode** — Detección de problemas en desarrollo
3. **QueryClientProvider** — React Query (caché, fetching, mutations)
4. **ThemeProvider** — Tema MUI personalizado (`theme.js`)
5. **CssBaseline** — Reset CSS de MUI
6. **SnackbarProvider** — Notificaciones toast (notistack, máx 3)

> **Nota**: No hay lógica de redirect en `main.jsx`. La verificación de autenticación se hace en `AuthGate` (App.jsx) mediante `GET /api/auth/verify` con cookies.

## Tema MUI (`src/theme.js`)

```javascript
const theme = createTheme({
  palette: {
    primary:   { main: '#1976d2' },  // Azul (usado en componentes MUI internos)
    secondary: { main: '#dc004e' },  // Rojo/Rosa
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
  },
});
```

> El tema MUI sigue vigente para los componentes que usan `sx` prop o el sistema de diseño de MUI (DataTable, FormInput, ConfirmDialog). Los componentes migrados a Tailwind (LoginForm, DashboardCards, Sidebar visual) ya no dependen de este tema para sus colores.
