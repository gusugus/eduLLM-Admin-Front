# eduLLM Admin — Frontend (FRONT)

> Aplicación de administración SPA para la plataforma eduLLM.  
> Stack: **React 18 + Vite + Material UI 5 + React Query + Zustand**

---

## 1. Visión General

Panel de administración frontend que gestiona **Profesores, Estudiantes y Materias**. Usa una arquitectura basada en **features** con componentes reutilizables y hooks personalizados.

### Puertos y URLs

| Servicio   | Puerto | URL                         |
|-----------|--------|-----------------------------|
| Frontend  | `8001` | `http://localhost:8001`      |
| API Base  | `8002` | `http://localhost:8002/api/v1` (via `VITE_API_URL`) |

---

## 2. Arquitectura

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

### Flujo de Datos

```
Component → Hook (useXxx) → Service (xxxService) → API (axios) → Backend
                ↕
          React Query Cache
                ↕
          Zustand Store (auth, UI state)
```

---

## 3. Estructura de Archivos

```
FRONT/
├── index.html                         # HTML entry point
├── vite.config.js                     # Vite: React plugin, port 8001
├── Dockerfile                         # Multi-stage: Vite build → nginx
├── package.json                       # Dependencias
├── .env                               # VITE_API_URL
├── .gitignore
├── public/                            # (vacío, assets estáticos)
└── src/
    ├── main.jsx                       # Mount React + Providers
    ├── App.jsx                        # BrowserRouter + Layout + Routes
    ├── theme.js                       # MUI theme (primary, secondary, breakpoints)
    │
    ├── routes/
    │   ├── AppRoutes.jsx              # Definición de todas las rutas
    │   └── PrivateRoute.jsx           # Guard: redirige a /login sin token
    │
    ├── components/
    │   ├── common/
    │   │   ├── Layout.jsx             # Estructura: AppBar + Drawer + Main content
    │   │   ├── DataTable.jsx          # Tabla genérica con columnas dinámicas + acciones
    │   │   ├── FormInput.jsx          # Input reutilizable con máscaras y validación
    │   │   └── ConfirmDialog.jsx      # Dialog de confirmación para eliminar
    │   └── layout/
    │       ├── Header.jsx             # Logo "eduLLM Admin" + Avatar
    │       ├── Sidebar.jsx            # Menú navegación (Dashboard, Profesores, Estudiantes, Materias)
    │       └── DashboardCards.jsx     # Tarjetas con conteo de cada entidad
    │
    ├── features/
    │   ├── professors/                # ✅ FUNCIONAL COMPLETO
    │   │   ├── ProfessorList.jsx      # Tabla de profesores con CRUD
    │   │   ├── ProfessorForm.jsx      # Formulario crear/editar con validaciones
    │   │   └── hooks/
    │   │       └── useProfessors.js   # Hook: React Query + mutations
    │   ├── students/                  # ⚠️ STUB - UI básica, backend no implementado
    │   │   ├── StudentList.jsx        # Tabla básica (columnas: id, name)
    │   │   ├── StudentForm.jsx        # Formulario mínimo (solo campo "name")
    │   │   └── hooks/
    │   │       └── useStudents.js     # Hook básico sin getById
    │   └── subjects/                  # ⚠️ STUB - UI básica, backend no implementado
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
    ├── utils/
    │   ├── validations.js             # Validaciones para formularios de profesor
    │   └── logger.js                  # Logger simple (console en dev)
    │
    └── assets/                        # (vacío, reservado para imágenes/icons)
```

---

## 4. Variables de Entorno (.env)

```env
VITE_API_URL=http://localhost:8002/api/v1
```

Accesible en código como `import.meta.env.VITE_API_URL`.

---

## 5. Rutas de la Aplicación

| Ruta                | Componente        | Descripción                    |
|--------------------|-------------------|--------------------------------|
| `/`                | DashboardCards    | Dashboard con conteo de entidades |
| `/professors`      | ProfessorList     | Listado de profesores          |
| `/professors/new`  | ProfessorForm     | Crear nuevo profesor           |
| `/professors/:id`  | ProfessorForm     | Editar profesor existente      |
| `/students`        | StudentList       | Listado de estudiantes (stub)  |
| `/students/new`    | StudentForm       | Crear estudiante (stub)        |
| `/students/:id`    | StudentForm       | Editar estudiante (stub)       |
| `/subjects`        | SubjectList       | Listado de materias (stub)     |
| `/subjects/new`    | SubjectForm       | Crear materia (stub)           |
| `/subjects/:id`    | SubjectForm       | Editar materia (stub)          |
| `*`                | Navigate `/`      | Redirect al dashboard          |

---

## 6. Providers (main.jsx)

La aplicación envuelve todo en estos providers, en este orden:

1. **React.StrictMode** — Detección de problemas en desarrollo
2. **QueryClientProvider** — React Query para caché y fetching
3. **ThemeProvider** — Tema MUI personalizado
4. **CssBaseline** — Reset CSS de MUI
5. **SnackbarProvider** — Notificaciones toast (notistack, máx 3)

---

## 7. Componentes Comunes (Reutilizables)

### 7.1 Layout (`components/common/Layout.jsx`)

Estructura principal de la app:

```
┌──────────────────────────────────────┐
│           AppBar (Header)            │
├──────────┬───────────────────────────┤
│          │                           │
│ Sidebar  │     Main Content          │
│ (Drawer) │     ({children})          │
│ 240px    │                           │
│          │                           │
└──────────┴───────────────────────────┘
```

- **Responsive**: En mobile, el Drawer es `temporary` (se abre con botón hamburguesa). En desktop es `permanent`.
- Ancho del drawer: `240px`.

### 7.2 DataTable (`components/common/DataTable.jsx`)

Tabla genérica que recibe:

| Prop      | Tipo       | Descripción                         |
|----------|------------|-------------------------------------|
| `columns` | `Array`    | `[{ field: 'id', headerName: 'ID' }]` |
| `data`    | `Array`    | Array de objetos a renderizar       |
| `onEdit`  | `Function` | Callback con la fila completa       |
| `onDelete`| `Function` | Callback con el `id`                |

Cada fila muestra automáticamente botones de **Editar** (✏️) y **Eliminar** (🗑️).

### 7.3 FormInput (`components/common/FormInput.jsx`)

Input reutilizable con soporte para:

| Feature        | Descripción                                |
|---------------|---------------------------------------------|
| **Máscaras**  | `cedula`, `numbers`, `letters`, `lettersNoSpace`, `username` |
| **Validación**| React Hook Form + reglas custom             |
| **maxLength** | Límite de caracteres                        |
| **onBlurCustom** | Callback adicional al perder foco        |
| **Label shrink** | Detecta automáticamente si hay valor para flotar el label |

Integrado con `useWatch` de React Hook Form para sincronizar con `reset()` y `setValue()`.

### 7.4 ConfirmDialog (`components/common/ConfirmDialog.jsx`)

Diálogo de confirmación para eliminar registros:

| Prop       | Tipo       | Descripción          |
|-----------|------------|----------------------|
| `open`    | `boolean`  | Visibilidad          |
| `title`   | `string`   | Título del diálogo   |
| `message` | `string`   | Mensaje descriptivo  |
| `onConfirm`| `Function`| Al confirmar         |
| `onCancel` | `Function`| Al cancelar          |

---

## 8. Feature: Profesor (Referencia Funcional Completa)

### 8.1 ProfessorList.jsx

Flujo:
1. Usa `useProfessors()` hook para obtener datos
2. Extrae `professors` del response (maneja `data.data` o `data` directamente)
3. Renderiza `DataTable` con columnas: id, nombreCompleto, username, estado
4. Botón "Crear Profesor" navega a `/professors/new`
5. Editar navega a `/professors/:id`
6. Eliminar abre `ConfirmDialog` → ejecuta `deleteProfessor.mutateAsync()`

### 8.2 ProfessorForm.jsx

Formulario avanzado con:

- **Detección automática de modo**: `isEdit = !!id` (por parámetro URL)
- **Carga de datos en edición**: `useProfessorById(id)` + `useEffect` para `reset()` del form
- **Generación automática de username**: Al hacer blur en nombre/apellido, llama al backend `/suggest-username`
- **Verificación de username**: Debounce de 500ms que consulta `/check-username`
- **Validaciones ecuatorianas**: Cédula con algoritmo de verificación
- **Manejo de errores**: Modal de error + snackbar
- **Transacción en submit**: Si es crear, envía todos los datos; si es editar, excluye username y password

#### Campos del formulario:

| Sección          | Campo             | Máscara        | Validación                    |
|-----------------|-------------------|----------------|-------------------------------|
| Datos Personales | cedula            | `cedula` (10 dígitos) | Algoritmo cédula ecuatoriana |
|                  | primer_nombre     | `letters`      | Mínimo 2 caracteres, solo letras |
|                  | segundo_nombre    | `letters`      | Solo letras (opcional)        |
|                  | apellido_paterno  | `letters`      | Mínimo 2 caracteres, solo letras |
|                  | apellido_materno  | `letters`      | Solo letras (opcional)        |
|                  | correo            | -              | Email válido (validator.js)   |
| Credenciales (solo crear) | username | `username`     | Mínimo 3, solo alfanumérico + _- |
|                  | password          | -              | Mínimo 6 caracteres           |

### 8.3 useProfessors.js (Hook)

```javascript
useProfessors({ enableList = true } = {})
```

| Retorno          | Tipo         | Descripción                    |
|-----------------|--------------|--------------------------------|
| `data`          | Array        | Lista de profesores            |
| `isLoading`     | boolean      | Estado de carga                |
| `error`         | Error|null   | Error de la query              |
| `refetch`       | Function     | Refrescar datos manualmente    |
| `useProfessorById(id)` | Hook  | Query para un profesor por ID  |
| `createProfessor` | Mutation   | `mutateAsync(data)`            |
| `updateProfessor` | Mutation   | `mutateAsync({ id, data })`    |
| `deleteProfessor` | Mutation   | `mutateAsync(id)`              |

- **`enableList`**: Permite deshabilitar la query de listado (útil en ProfessorForm donde solo se necesita getById).
- Todas las mutations invalidan el cache `['professors']` on success.

---

## 9. Services (Capa de API)

### 9.1 api.js — Instancia Axios Base

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

- **Interceptor**: Agrega token JWT desde `localStorage` a cada request como `Authorization: Bearer <token>`.

### 9.2 professorService.js (Referencia)

```javascript
{
  getAll:    ()            → GET    /professors      → data.data
  getById:   (id)          → GET    /professors/:id  → data.data
  create:    (data)        → POST   /professors      → data.data
  update:    (id, data)    → PUT    /professors/:id  → data.data
  delete:    (id)          → DELETE /professors/:id  → data
}
```

- Todos los métodos tienen `.catch()` que logea el error y retorna `[]` como fallback.
- Extraen `res.data.data` del response del backend.

### 9.3 studentService.js / subjectService.js ⚠️

Misma estructura que professorService pero apuntan a `/students` y `/subjects`. Actualmente retornan datos vacíos porque el backend es stub.

---

## 10. Stores (Estado Global — Zustand)

### authStore.js
```javascript
{
  token: null,          // JWT token
  user: null,           // Objeto usuario
  login(token, user),   // Setea token y user
  logout(),             // Limpia token y user
}
```
- Persistido en `localStorage` con clave `auth-storage`.

### uiStore.js
```javascript
{
  sidebarOpen: true,
  toggleSidebar(),      // Alterna sidebar
}
```

---

## 11. Validaciones (utils/validations.js)

### Funciones de validación:

| Función                      | Descripción                                    |
|-----------------------------|------------------------------------------------|
| `validateEcuadorianId(cedula)` | Algoritmo completo de validación de cédula ecuatoriana |
| `onlyLetters(value)`          | Regex: solo letras y espacios (incluye tildes, ñ) |
| `onlyNumbers(value)`          | Regex: solo dígitos                            |
| `validateEmail(email)`        | Usa `validator.isEmail()`                      |
| `validateUsername(username)`   | Regex: alfanumérico + guiones                  |

### Funciones asíncronas (API calls):

| Función                      | Endpoint                    | Descripción                    |
|-----------------------------|-----------------------------|---------------------------------|
| `checkUsernameAvailability(username, excludeUserId)` | `POST /users/check-username` | Verifica disponibilidad de username |
| `suggestUsername(primerNombre, apellidoPaterno)` | `POST /users/suggest-username` | Sugiere username disponible. Fallback local si API falla. |

### `professorValidationRules` — Objeto de reglas para React Hook Form:

```javascript
{
  cedula:           { required, validate: cédula ecuatoriana },
  primer_nombre:    { required, validate: solo letras, min 2 },
  segundo_nombre:   { validate: solo letras (opcional) },
  apellido_paterno: { required, validate: solo letras, min 2 },
  apellido_materno: { validate: solo letras (opcional) },
  correo:           { required, validate: email },
  password:         { required, minLength: 6 }
}
```

---

## 12. Dependencias Clave

| Paquete              | Versión  | Uso                                  |
|---------------------|----------|--------------------------------------|
| react               | ^18.2.0  | UI Library                           |
| react-dom           | ^18.2.0  | DOM rendering                        |
| react-router-dom    | ^6.21.0  | Routing SPA                          |
| @mui/material       | ^5.15.0  | Componentes UI (Material Design)     |
| @mui/icons-material | ^5.15.0  | Iconos Material                      |
| @emotion/react/styled| ^11.11  | CSS-in-JS para MUI                   |
| axios               | ^1.6.2   | HTTP client                          |
| @tanstack/react-query| ^5.12.2 | Server state management + caching    |
| zustand             | ^4.4.7   | Client state management              |
| react-hook-form     | ^7.48.2  | Formularios con validación           |
| @hookform/resolvers | ^3.3.2   | Integración Zod con RHF              |
| zod                 | ^3.22.4  | Schema validation                    |
| notistack           | ^3.0.1   | Notificaciones toast (snackbar)      |
| validator           | ^13.11.0 | Validaciones de strings (email, etc.)|
| lodash              | ^4.17.21 | Utilidades (debounce)                |
| vite                | ^5.0.10  | Build tool + dev server              |
| @vitejs/plugin-react| ^4.2.1   | Plugin React para Vite               |

---

## 13. Scripts

```bash
npm run dev       # Servidor de desarrollo en puerto 8001
npm run build     # Build de producción (dist/)
npm run preview   # Preview del build de producción
```

---

## 14. Guía para Extender (Agregar Nueva Feature)

Para implementar Students o Subjects con la misma funcionalidad que Professors:

### Paso 1: Service (`src/services/[entity]Service.js`)

Seguir el patrón de `professorService.js`:
```javascript
import api from './api';

export const entityService = {
  getAll:    ()          => api.get('/entities').then(res => res.data.data || []).catch(...),
  getById:   (id)        => api.get(`/entities/${id}`).then(res => res.data.data || []).catch(...),
  create:    (data)      => api.post('/entities', data).then(res => res.data.data || []).catch(...),
  update:    (id, data)  => api.put(`/entities/${id}`, data).then(res => res.data.data || []).catch(...),
  delete:    (id)        => api.delete(`/entities/${id}`).then(res => res.data || []),
};

export default entityService;
```

### Paso 2: Hook (`src/features/[entities]/hooks/use[Entities].js`)

Seguir el patrón de `useProfessors.js`:
- `useQuery` para listar (con `enableList` flag)
- `useQuery` interno para `getById` (con `enabled: !!id`)
- `useMutation` para create, update, delete
- Invalidar query cache en `onSuccess`

### Paso 3: List Component (`src/features/[entities]/[Entity]List.jsx`)

Seguir el patrón de `ProfessorList.jsx`:
- Definir `columns` con los campos a mostrar
- Usar `DataTable` genérico
- `ConfirmDialog` para confirmar eliminación
- Botón de crear que navega a `/entities/new`

### Paso 4: Form Component (`src/features/[entities]/[Entity]Form.jsx`)

Seguir el patrón de `ProfessorForm.jsx`:
- Detectar modo crear/editar con `useParams()`
- `useForm()` con `defaultValues`
- En edición: cargar datos con `use[Entity]ById(id)` → `reset()` del form
- `FormInput` para cada campo con máscaras y validaciones
- Manejar errores con modal + snackbar
- Separar sección de "Datos Personales" y "Credenciales" (solo en crear)

### Paso 5: Validaciones (`src/utils/validations.js`)

Agregar `[entity]ValidationRules` siguiendo el patrón de `professorValidationRules`.

### Paso 6: Las rutas ya están definidas

Las rutas de `/students` y `/subjects` ya están en `AppRoutes.jsx`, el `Sidebar.jsx` ya tiene los enlaces, y el `DashboardCards.jsx` ya consume los hooks. Solo falta la implementación real.

---

## 15. Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

> **Nota**: Requiere un archivo `nginx.conf` para manejar rutas SPA (redirect a index.html). No existe actualmente en el repo.

---

## 16. Tema MUI (`theme.js`)

```javascript
{
  palette: {
    primary:   { main: '#1976d2' },  // Azul MUI
    secondary: { main: '#dc004e' },  // Rojo/Rosa
  },
  breakpoints: {
    xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920
  }
}
```

### Colores del Dashboard Cards:

| Tarjeta       | Color     |
|--------------|-----------|
| Profesores   | `#1976d2` (azul) |
| Estudiantes  | `#2e7d32` (verde) |
| Materias     | `#ed6c02` (naranja) |
