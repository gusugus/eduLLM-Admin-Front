# 1. Visión General

Panel de administración frontend SPA que gestiona **Profesores, Estudiantes, Materias y Asignaciones** de la plataforma eduLLM. Consume la API REST del backend a través del gateway en `http://localhost:8085/api`.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Componentes UI | Material UI 5 |
| Estilos utilitarios | TailwindCSS 3 (híbrido con MUI) |
| Estado servidor | TanStack React Query 5 |
| Estado cliente | Zustand 4 (con persist) |
| Formularios | React Hook Form 7 |
| Validación | Zod 3 + validator.js |
| HTTP Client | Axios 1.6 (con `withCredentials`) |
| Notificaciones | notistack 3 |

## Puertos y URLs

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend (dev) | `8001` | `http://localhost:8001` |
| Gateway | `8085` | `http://localhost:8085/api` |
| Backend directo | `8002` | `http://localhost:8002/api/admin` |

## Arquitectura

```
┌─────────────────────────────────────────────────┐
│                   main.jsx                       │
│  (React.StrictMode + Providers globales)        │
├─────────────────────────────────────────────────┤
│  QueryClientProvider → ThemeProvider →           │
│  SnackbarProvider → <App />                      │
├─────────────────────────────────────────────────┤
│                   App.jsx                        │
│  BrowserRouter → [ /forbidden → ForbiddenPage ] │
│               → [ /* → AuthGate ]               │
├─────────────────────────────────────────────────┤
│                 AuthGate (App.jsx)               │
│  1. verifyAuth() → GET /api/auth/verify         │
│  2. Si rol ≠ ROLE_ADMINISTRADOR → /forbidden    │
│     + setForbidden(true) → null (no render)     │
│  3. Si admin → Layout + Suspense(AppRoutes)     │
│     (lazy load: feature chunks bajo demanda)    │
├──────────────┬──────────────┬───────────────────┤
│   Features   │  Components  │    Services       │
│  (por módulo)│  (comunes)   │  (API calls)      │
├──────────────┼──────────────┼───────────────────┤
│   Hooks      │   Stores     │    Utils          │
│  (lógica)    │  (estado)    │  (validación)     │
└──────────────┴──────────────┴───────────────────┘
```

## Flujo de Datos

```
Component → Hook (useXxx) → Service (xxxService) → API (axios) → Gateway → Backend
                ↕
          React Query Cache
                ↕
          Zustand Store (auth, UI state)
```

1. **Componentes** renderizan UI y llaman a hooks
2. **Hooks** (`useProfessors`, etc.) encapsulan queries y mutaciones de React Query
3. **Services** (`professorService`, etc.) hacen llamadas HTTP con Axios (baseURL: `{GATEWAY}/api`)
4. **React Query** cachea respuestas y maneja estado de carga/error
5. **Zustand** maneja estado global del cliente (auth, UI)

## Autenticación

- **Cookie + Bearer**: el Gateway acepta token en cookie `jwtToken` (prioridad) o `Authorization: Bearer`
- **Verify**: al cargar la app, `AuthGate` llama `GET /api/auth/verify` con `withCredentials: true`
- **Role check**: si `rol !== 'ROLE_ADMINISTRADOR'` → `navigate('/forbidden')` + `setForbidden(true)` → el Layout nunca se renderiza (render guard)
- **ForbiddenPage**: al montarse, llama logout para limpiar cookie y store, y muestra link a login
- **Lazy loading**: `AppRoutes` se carga con `React.lazy()` → los chunks de features (profesores, estudiantes, etc.) solo se descargan si el usuario es admin
- **403 en API**: el interceptor de Axios en `api.js` redirige a `/forbidden` si alguna respuesta falla con 403

### Flujo AuthGate

```
AuthGate mount
  │
  ├─ loading=true → LoadingScreen
  │
  ├─ verifyAuth()
  │    └─ GET /api/auth/verify (cookie automática)
  │
  ├─ data.authenticated?
  │    ├─ NO → noSession=true → "No hay sesión" → redirect login
  │    └─ SI → data.rol === 'ROLE_ADMINISTRADOR'?
  │           ├─ NO → setForbidden(true) → navigate('/forbidden')
  │           │        → render guard: return null
  │           │        → ForbiddenPage mount → logout()
  │           └─ SI → snackbar bienvenida → Layout + lazy(AppRoutes)
  │
  └─ loading=false
```
