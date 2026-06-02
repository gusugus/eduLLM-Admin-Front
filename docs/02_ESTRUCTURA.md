# 2. Estructura de Archivos

```
FRONT/
├── index.html                         # HTML entry point
├── vite.config.js                     # Vite: React plugin, port 8001
├── Dockerfile                         # Multi-stage: Vite build → nginx
├── package.json                       # Dependencias y scripts
├── .env                               # VITE_API_URL, VITE_LOGIN_URL, VITE_GATEWAY_URL
├── .gitignore
├── public/                            # (vacío, assets estáticos)
└── src/
    ├── main.jsx                       # Mount React + Providers (QueryClient, Theme, Snackbar)
    ├── App.jsx                        # BrowserRouter → AuthGate (verify → login o app)
    ├── theme.js                       # MUI theme (primary: #1976d2, secondary: #dc004e)
    │
    ├── routes/
    │   ├── AppRoutes.jsx              # Definición de todas las rutas
    │   └── PrivateRoute.jsx           # Guard: redirige a /login (actualmente no usado)
    │
    ├── components/
    │   ├── common/
    │   │   ├── Layout.jsx             # AppBar + Drawer (permanent/temporary) + Main content
    │   │   ├── DataTable.jsx          # Tabla genérica con columnas dinámicas + acciones editar/eliminar
    │   │   ├── FormInput.jsx          # Input reutilizable con máscaras y validación react-hook-form
    │   │   ├── ConfirmDialog.jsx      # Diálogo de confirmación para eliminar registros
    │   │   ├── LoadingScreen.jsx      # Pantalla de carga con spinner y mensaje opcional
    │   │   └── RedirectWithDelay.jsx  # Redirección con cuenta regresiva
    │   ├── auth/
    │   │   └── LoginForm.jsx          # Formulario de login interno (POST /api/auth/login)
    │   └── layout/
    │       ├── Header.jsx             # Logo "eduLLM Admin" + Avatar con menú Salir
    │       ├── Sidebar.jsx            # Menú navegación (Dashboard, Profesores, Estudiantes, Materias, Asignaciones)
    │       └── DashboardCards.jsx     # Tarjetas con conteo de cada entidad
    │
    ├── features/
    │   ├── professors/                # ✅ CRUD completo
    │   │   ├── ProfessorList.jsx      # Tabla con DataTable + acciones
    │   │   ├── ProfessorForm.jsx      # Formulario crear/editar con validaciones ecuatorianas
    │   │   └── hooks/
    │   │       └── useProfessors.js   # React Query queries + mutations
    │   ├── students/                  # ✅ CRUD completo
    │   │   ├── StudentList.jsx        # Tabla con DataTable + acciones
    │   │   ├── StudentForm.jsx        # Formulario crear/editar con validaciones
    │   │   └── hooks/
    │   │       └── useStudents.js     # React Query queries + mutations
    │   ├── subjects/                  # ✅ CRUD completo
    │   │   ├── SubjectList.jsx        # Tabla con DataTable + acciones
    │   │   ├── SubjectForm.jsx        # Formulario crear/editar
    │   │   └── hooks/
    │   │       └── useSubjects.js     # React Query queries + mutations
    │   └── assignments/               # ✅ Módulo de asignaciones
    │       ├── AssignmentsPage.jsx    # Página con tabs (Profesor→Materia / Estudiantes→Materia)
    │       ├── AssignProfessorSubject.jsx  # Asignar profesor a materia
    │       ├── AssignStudentSubject.jsx    # Asignar estudiantes a materia
    │       └── hooks/
    │           └── useAssignments.js  # React Query para asignaciones
    │
    ├── services/
    │   ├── api.js                     # Axios instance (baseURL: {GATEWAY}/api, withCredentials)
    │   ├── professorService.js        # CRUD completo
    │   ├── studentService.js          # CRUD completo
    │   ├── subjectService.js          # CRUD completo
    │   └── assignmentService.js       # Asignaciones (profesor-materia, estudiante-materia)
    │
    ├── stores/
    │   ├── authStore.js               # Zustand + persist: token, user, login(), setUser(), logout()
    │   └── uiStore.js                 # Zustand: sidebarOpen, toggleSidebar()
    │
    ├── hooks/
    │   ├── useAuth.js                 # Wrapper para authStore + verifyAuth()
    │   └── AuthCallback.jsx           # Página callback para login con token en URL
    │
    └── utils/
        ├── validations.js             # validación cédula ecuatoriana, emails, usernames + reglas RHF
        ├── auth.js                    # decodeToken, getUserRole, getUserId, isTokenValid
        └── logger.js                  # Logger simple (console en dev)
```
