# 4. Rutas de la Aplicación

Todas las rutas se definen en `src/routes/AppRoutes.jsx` y se renderizan dentro de `Layout` (que incluye AppBar + Sidebar).

## Tabla de Rutas

| Ruta | Componente | Descripción | Estado |
|------|-----------|-------------|--------|
| `/` | `DashboardCards` | Dashboard con tarjetas de conteo | ✅ |
| `/professors` | `ProfessorList` | Listado de profesores | ✅ |
| `/professors/new` | `ProfessorForm` | Crear nuevo profesor | ✅ |
| `/professors/:id` | `ProfessorForm` | Editar profesor existente | ✅ |
| `/students` | `StudentList` | Listado de estudiantes | ⚠️ Stub |
| `/students/new` | `StudentForm` | Crear estudiante | ⚠️ Stub |
| `/students/:id` | `StudentForm` | Editar estudiante | ⚠️ Stub |
| `/subjects` | `SubjectList` | Listado de materias | ⚠️ Stub |
| `/subjects/new` | `SubjectForm` | Crear materia | ⚠️ Stub |
| `/subjects/:id` | `SubjectForm` | Editar materia | ⚠️ Stub |
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
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);
```

## PrivateRoute (`src/routes/PrivateRoute.jsx`)

Componente guard que redirige a `/login` si no hay token:

```jsx
const PrivateRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};
```

> **Nota**: Actualmente `PrivateRoute` **no se usa** en `AppRoutes`. Todas las rutas son públicas. El componente está listo para activarse cuando se implemente autenticación.
