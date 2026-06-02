# 4. Rutas de la Aplicación

Todas las rutas se definen en `src/routes/AppRoutes.jsx` y se renderizan dentro de `AuthGate` → `Layout` (que incluye AppBar + Sidebar).

## Tabla de Rutas

| Ruta | Componente | Descripción | Estado |
|------|-----------|-------------|--------|
| `/` | `DashboardCards` | Dashboard con tarjetas de conteo | ✅ |
| `/professors` | `ProfessorList` | Listado de profesores | ✅ |
| `/professors/new` | `ProfessorForm` | Crear nuevo profesor | ✅ |
| `/professors/:id` | `ProfessorForm` | Editar profesor existente | ✅ |
| `/students` | `StudentList` | Listado de estudiantes | ✅ |
| `/students/new` | `StudentForm` | Crear estudiante | ✅ |
| `/students/:id` | `StudentForm` | Editar estudiante | ✅ |
| `/subjects` | `SubjectList` | Listado de materias | ✅ |
| `/subjects/new` | `SubjectForm` | Crear materia | ✅ |
| `/subjects/:id` | `SubjectForm` | Editar materia | ✅ |
| `/assignments` | `AssignmentsPage` | Asignaciones (prof→materia, est→materia) | ✅ |
| `*` | `Navigate to="/"` | Redirect al dashboard | ✅ |

## Código real (`src/routes/AppRoutes.jsx`)

```jsx
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<DashboardCards />} />
    <Route path="/professors" element={<ProfessorList />} />
    <Route path="/professors/new" element={<ProfessorForm />} />
    <Route path="/professors/:id" element={<ProfessorForm />} />
    <Route path="/students" element={<StudentList />} />
    <Route path="/students/new" element={<StudentForm />} />
    <Route path="/students/:id" element={<StudentForm />} />
    <Route path="/subjects" element={<SubjectList />} />
    <Route path="/subjects/new" element={<SubjectForm />} />
    <Route path="/subjects/:id" element={<SubjectForm />} />
    <Route path="/assignments" element={<AssignmentsPage />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);
```

## PrivateRoute (`src/routes/PrivateRoute.jsx`)

Componente guard que redirige a `/login` si no hay sesión:

```jsx
const PrivateRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};
```

> **Nota**: Actualmente `PrivateRoute` **no se usa**. La autenticación se maneja en `AuthGate` (App.jsx) mediante `GET /api/auth/verify`.
