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

## Providers Pipeline (`main.jsx`)

Orden de providers que envuelven la aplicación:

1. **React.StrictMode** — Detección de problemas en desarrollo
2. **QueryClientProvider** — React Query (caché, fetching, mutations)
3. **ThemeProvider** — Tema MUI personalizado (`theme.js`)
4. **CssBaseline** — Reset CSS de MUI
5. **SnackbarProvider** — Notificaciones toast (notistack, máx 3)

### Código real (`src/main.jsx`):
```javascript
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
```

> **Nota**: No hay lógica de redirect en `main.jsx`. La verificación de autenticación se hace en `AuthGate` (App.jsx) mediante `GET /api/auth/verify` con cookies.

## Tema MUI (`src/theme.js`)

```javascript
const theme = createTheme({
  palette: {
    primary:   { main: '#1976d2' },  // Azul
    secondary: { main: '#dc004e' },  // Rojo/Rosa
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
  },
});
```
