# 6. Features

## 6.1 Profesores — ✅ Funcional

### ProfessorList.jsx

Listado de profesores con tabla y acciones CRUD.

**Flujo:**
1. Llama a `useProfessors()` hook para obtener datos
2. Extrae `professors` del response (maneja `data.data` o `data` directamente)
3. Renderiza `DataTable` con columnas: ID, Nombre, Username, Estado
4. Botón "Crear Profesor" → navega a `/professors/new`
5. Editar → navega a `/professors/:id`
6. Eliminar → abre `ConfirmDialog` → `deleteProfessor.mutateAsync(id)`

**Columnas visibles:**
```javascript
const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'nombreCompleto', headerName: 'Nombre' },
  { field: 'username', headerName: 'Username' },
  { field: 'estado', headerName: 'Estado' },
];
```

### ProfessorForm.jsx

Formulario avanzado para crear/editar profesores.

**Características:**
- **Detección automática de modo**: `isEdit = !!id` (desde `useParams()`)
- **Carga de datos en edición**: `useProfessorById(id)` → `reset()` del formulario
- **Generación automática de username**: al hacer blur en nombre/apellido, llama a `suggestUsername()`
- **Verificación de username**: debounce de 500ms que consulta `checkUsernameAvailability()`
- **Validaciones ecuatorianas**: cédula con algoritmo de verificación (10 dígitos + dígito verificador)
- **Manejo de errores**: modal de error + snackbar de notistack
- **En submit**: si es crear envía todos los datos; si es editar excluye `username` y `password`

**Campos del formulario:**

| Sección | Campo | Máscara | Validación |
|---------|-------|---------|------------|
| Datos Personales | cedula | `cedula` (10 dígitos) | Algoritmo cédula ecuatoriana |
| | primer_nombre | `letters` | Mínimo 2 caracteres, solo letras |
| | apellido_paterno | `letters` | Mínimo 2 caracteres, solo letras |
| | apellido_materno | `letters` | Solo letras (opcional) |
| | correo | - | Email válido (validator.js) |
| Credenciales (solo crear) | username | `username` | Mínimo 3, alfanumérico + _- |
| | password | - | Mínimo 6 caracteres |

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

**Detalles:**
- `enableList`: flag que controla si se ejecuta la query de listado (útil en ProfessorForm donde solo se necesita getById)
- Todas las mutations invalidan el cache `['professors']` on success
- `useProfessorById` se ejecuta solo si `id` es truthy (`enabled: !!id`)

---

## 6.2 Estudiantes — ⚠️ Stub

### StudentList.jsx
- Columnas: ID, Nombre
- Botón Crear → `navigate('new')`
- Editar/Eliminar con DataTable + ConfirmDialog

### StudentForm.jsx
- Formulario mínimo con un solo campo "Nombre"
- Usa `useStudents()` hook
- No tiene validaciones ni lógica de edición avanzada

### useStudents.js
- Solo query de listado (`getAll`)
- **Sin** `getById` (no se usa en el form actual)
- Mutations: create, update, delete (todas apuntan a backend stub que retorna mock)

---

## 6.3 Materias — ⚠️ Stub

### SubjectList.jsx
- Columnas: ID, Nombre
- Misma estructura que StudentList

### SubjectForm.jsx
- Formulario mínimo con un solo campo "Nombre"
- Usa `useSubjects()` hook
- Misma estructura que StudentForm

### useSubjects.js
- Misma estructura que useStudents (listado + mutations básicas)
