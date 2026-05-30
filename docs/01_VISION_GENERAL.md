# 1. Visión General

Panel de administración frontend SPA que gestiona **Profesores, Estudiantes y Materias** de la plataforma eduLLM. Consume la API REST del backend en `http://localhost:8002/api/v1`.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Componentes | Material UI 5 |
| Estado servidor | TanStack React Query 5 |
| Estado cliente | Zustand 4 |
| Formularios | React Hook Form 7 |
| Validación | Zod 3 + validator.js |
| HTTP Client | Axios 1.6 |
| Notificaciones | notistack 3 |

## Puertos y URLs

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend (dev) | `8001` | `http://localhost:8001` |
| API Backend | `8002` | `http://localhost:8002/api/v1` (via `VITE_API_URL`) |

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
│  BrowserRouter → Layout → AppRoutes             │
├─────────────────────────────────────────────────┤
│                 AppRoutes.jsx                    │
│  Define todas las rutas de la aplicación        │
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
Component → Hook (useXxx) → Service (xxxService) → API (axios) → Backend
                ↕
          React Query Cache
                ↕
          Zustand Store (auth, UI state)
```

1. **Componentes** renderizan UI y llaman a hooks
2. **Hooks** (`useProfessors`, etc.) encapsulan queries y mutaciones de React Query
3. **Services** (`professorService`, etc.) hacen llamadas HTTP con Axios
4. **React Query** cachea respuestas y maneja estado de carga/error
5. **Zustand** maneja estado global del cliente (auth, UI)
