# 1. Visión General

Panel de administración frontend SPA que gestiona **Profesores, Estudiantes, Materias y Asignaciones** de la plataforma eduLLM. Consume la API REST del backend a través del gateway en `http://localhost:8085/api`.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Componentes | Material UI 5 |
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
│  BrowserRouter → AuthGate → Layout → AppRoutes  │
├─────────────────────────────────────────────────┤
│                 AuthGate (App.jsx)               │
│  1. Llama /api/auth/verify con cookie            │
│  2. Si autenticado → Layout + AppRoutes          │
│  3. Si no → snackbar + LoginForm                │
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

- **Cookie-based**: el gateway envía una cookie HttpOnly al hacer login en `/api/auth/login`
- **Verify**: al cargar la app, `AuthGate` (en App.jsx) llama `GET /api/auth/verify` con `withCredentials: true`
- La respuesta del verify se guarda globalmente en `authStore.user` vía `useAuth().verifyAuth()`
- Si el usuario no está autenticado, se muestra `LoginForm` integrado en el frontend
