# 8. Dependencias

## Producción

| Paquete | Versión | Uso |
|---------|---------|-----|
| `react` | ^18.2.0 | UI Library |
| `react-dom` | ^18.2.0 | DOM rendering |
| `react-router-dom` | ^6.21.0 | Routing SPA |
| `@mui/material` | ^5.15.0 | Componentes UI (Material Design) |
| `@mui/icons-material` | ^5.15.0 | Iconos Material |
| `@emotion/react` | ^11.11.1 | CSS-in-JS para MUI |
| `@emotion/styled` | ^11.11.0 | Styled components para MUI |
| `axios` | ^1.6.2 | HTTP client |
| `@tanstack/react-query` | ^5.12.2 | Server state management + caching |
| `zustand` | ^4.4.7 | Client state management |
| `react-hook-form` | ^7.48.2 | Formularios con validación |
| `@hookform/resolvers` | ^3.3.2 | Integración Zod con RHF |
| `zod` | ^3.22.4 | Schema validation |
| `notistack` | ^3.0.1 | Notificaciones toast (snackbar) |
| `validator` | ^13.11.0 | Validaciones de strings (email, etc.) |
| `lodash` | ^4.17.21 | Utilidades (debounce) |

## Desarrollo

| Paquete | Versión | Uso |
|---------|---------|-----|
| `vite` | ^5.0.10 | Build tool + dev server |
| `@vitejs/plugin-react` | ^4.2.1 | Plugin React para Vite |
| `tailwindcss` | ^3.x | Framework CSS utilitario (híbrido con MUI) |
| `postcss` | latest | Procesador CSS requerido por Tailwind |
| `autoprefixer` | latest | Añade prefijos de vendor CSS automáticamente |

## Jerarquía de Importaciones

```
main.jsx
  └── App.jsx
        ├── BrowserRouter (react-router-dom)
        ├── Layout
        │     ├── Header
        │     └── Sidebar (MUI List + react-router navigate)
        └── AppRoutes (React Router Routes)
              ├── DashboardCards
              │     ├── useProfessors → professorService → api (axios)
              │     ├── useStudents → studentService → api
              │     └── useSubjects → subjectService → api
              ├── ProfessorList → useProfessors → DataTable + ConfirmDialog
              ├── ProfessorForm → useProfessors + FormInput + validations
              ├── StudentList → useStudents → DataTable + ConfirmDialog
              ├── StudentForm → useStudents
              ├── SubjectList → useSubjects → DataTable + ConfirmDialog
              └── SubjectForm → useSubjects
```

## Scripts npm

```bash
npm run dev       # vite (hot-reload, puerto 8001)
npm run build     # vite build (output en dist/)
npm run preview   # vite preview (previsualizar build)
```
