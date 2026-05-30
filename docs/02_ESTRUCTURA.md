# 2. Estructura de Archivos

```
FRONT/
├── index.html                         # HTML entry point
├── vite.config.js                     # Vite: React plugin, port 8001
├── Dockerfile                         # Multi-stage: Vite build → nginx
├── package.json                       # Dependencias y scripts
├── .env                               # VITE_API_URL=http://localhost:8002/api/v1
├── .gitignore
├── public/                            # (vacío, assets estáticos)
└── src/
    ├── main.jsx                       # Mount React + Providers (QueryClient, Theme, Snackbar)
    ├── App.jsx                        # BrowserRouter + Layout + AppRoutes
    ├── theme.js                       # MUI theme (primary: #1976d2, secondary: #dc004e)
    │
    ├── routes/
    │   ├── AppRoutes.jsx              # Definición de todas las rutas
    │   └── PrivateRoute.jsx           # Guard: redirige a /login sin token (no usado actualmente)
    │
    ├── components/
    │   ├── common/
    │   │   ├── Layout.jsx             # AppBar + Drawer (permanent/temporary) + Main content
    │   │   ├── DataTable.jsx          # Tabla genérica con columnas dinámicas + acciones editar/eliminar
    │   │   ├── FormInput.jsx          # Input reutilizable con máscaras y validación react-hook-form
    │   │   └── ConfirmDialog.jsx      # Diálogo de confirmación para eliminar registros
    │   └── layout/
    │       ├── Header.jsx             # Logo "eduLLM Admin" + Avatar
    │       ├── Sidebar.jsx            # Menú navegación (Dashboard, Profesores, Estudiantes, Materias)
    │       └── DashboardCards.jsx     # Tarjetas con conteo de cada entidad
    │
    ├── features/
    │   ├── professors/                # ✅ FUNCIONAL - CRUD completo
    │   │   ├── ProfessorList.jsx      # Tabla de profesores
    │   │   ├── ProfessorForm.jsx      # Formulario crear/editar con validaciones
    │   │   └── hooks/
    │   │       └── useProfessors.js   # Hook: React Query queries + mutations
    │   ├── students/                  # ⚠️ STUB - UI mínima
    │   │   ├── StudentList.jsx        # Tabla básica (columnas: id, name)
    │   │   ├── StudentForm.jsx        # Formulario mínimo (solo campo "name")
    │   │   └── hooks/
    │   │       └── useStudents.js     # Hook básico sin getById
    │   └── subjects/                  # ⚠️ STUB - UI mínima
    │       ├── SubjectList.jsx        # Tabla básica (columnas: id, name)
    │       ├── SubjectForm.jsx        # Formulario mínimo (solo campo "name")
    │       └── hooks/
    │           └── useSubjects.js     # Hook básico sin getById
    │
    ├── services/
    │   ├── api.js                     # Axios instance + interceptor JWT
    │   ├── professorService.js        # ✅ CRUD completo (getAll, getById, create, update, delete)
    │   ├── studentService.js          # ⚠️ CRUD conectado pero backend es stub
    │   └── subjectService.js          # ⚠️ CRUD conectado pero backend es stub
    │
    ├── stores/
    │   ├── authStore.js               # Zustand + persist: token, user, login(), logout()
    │   └── uiStore.js                 # Zustand: sidebarOpen, toggleSidebar()
    │
    ├── hooks/
    │   └── useAuth.js                 # Wrapper para authStore con isAuthenticated
    │
    └── utils/
        ├── validations.js             # validación cédula ecuatoriana, emails, usernames + reglas RHF
        └── logger.js                  # Logger simple (console en dev)
```
