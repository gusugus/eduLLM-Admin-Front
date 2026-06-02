# 6. Features

## 6.1 Profesores — ✅ Funcional

### ProfessorList.jsx

Listado de profesores con tabla y acciones CRUD.

**Flujo:**
1. Llama a `useProfessors()` hook para obtener datos
2. Extrae `professors` del response (maneja `data.data` o `data` directamente)
3. Renderiza `DataTable` con columnas: ID, Nombre (con Avatar + foto si tiene), Username, Estado
4. Botón "Crear Profesor" → navega a `/professors/new`
5. Editar → navega a `/professors/:id`
6. Eliminar → abre `ConfirmDialog` → `deleteProfessor.mutateAsync(id)`

### ProfessorForm.jsx

Formulario avanzado para crear/editar profesores.

**Características:**
- **Detección automática de modo**: `isEdit = !!id` (desde `useParams()`)
- **Carga de datos en edición**: `useProfessorById(id)` → `reset()` del formulario
- **Generación automática de username**: al hacer blur en nombre/apellido, llama a `suggestUsername()`
- **Verificación de username**: debounce de 500ms que consulta `checkUsernameAvailability()`
- **Validaciones ecuatorianas**: cédula con algoritmo de verificación (10 dígitos + dígito verificador)
- **Manejo de errores**: modal de error + snackbar de notistack
- **En submit**: crear envía todos los datos; editar solo envía los campos visibles (excluye `username` y `password` del body)

### useProfessors.js (Hook)

```javascript
useProfessors({ enableList = true } = {})
```

| Retorno | Tipo | Descripción |
|---------|------|-------------|
| `data` | `Array` | Lista de profesores |
| `isLoading` | `boolean` | Estado de carga |
| `error` | `Error\|null` | Error de la query |
| `refetch` | `Function` | Refrescar datos manualmente |
| `useProfessorById(id)` | `Hook` | Query para un profesor por ID |
| `createProfessor` | `Mutation` | `mutateAsync(data)` |
| `updateProfessor` | `Mutation` | `mutateAsync({ id, data })` |
| `deleteProfessor` | `Mutation` | `mutateAsync(id)` |

---

## 6.2 Estudiantes — ✅ Funcional

### StudentList.jsx
- Columnas: ID, Nombre, Cédula, Correo, Estado
- Botón Crear → `navigate('new')`
- Editar/Eliminar con DataTable + ConfirmDialog

### StudentForm.jsx
- Formulario completo con validaciones (cedula, email, username, password)
- Detección automática de modo crear/editar
- Carga de datos en edición vía `useStudentById(id)`

### useStudents.js
- Queries: `getAll`, `getById`
- Mutations: `create`, `update`, `delete` con invalidación de caché

---

## 6.3 Materias — ✅ Funcional

### SubjectList.jsx
- Columnas: ID, Nombre, Descripción, Estado
- Botón Crear → `navigate('new')`

### SubjectForm.jsx
- Formulario con campos: nombre, descripción
- Detección de modo crear/editar
- Carga de datos en edición

### useSubjects.js
- Queries: `getAll`, `getById`
- Mutations: `create`, `update`, `delete`

---

## 6.4 Asignaciones — ✅ Funcional

### AssignmentsPage.jsx
Página con dos tabs:
- **Profesor → Materia**: asigna un profesor a una o varias materias
- **Estudiantes → Materia**: asigna múltiples estudiantes a una materia

### AssignProfessorSubject.jsx
- Select de profesor + multiselect de materias
- Al seleccionar profesor, carga las materias existentes
- Botón "Guardar" envía lote de asignaciones

### AssignStudentSubject.jsx
- Select de materia + multiselect de estudiantes
- Al seleccionar materia, carga los estudiantes existentes
- Botón "Guardar" envía lote de asignaciones

### useAssignments.js
| Función | Descripción |
|---------|-------------|
| `assignProfessorToSubject(data)` | Asigna profesor a materia(s) |
| `listProfessorSubjects()` | Lista asignaciones profesor-materia |
| `removeProfessorSubject(id)` | Elimina una asignación profesor-materia |
| `assignStudentsToSubject(data)` | Asigna estudiantes a una materia |
| `listStudentSubjects()` | Lista asignaciones estudiante-materia |
| `removeStudentSubject(id)` | Elimina una asignación estudiante-materia |
