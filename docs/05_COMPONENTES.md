# 5. Componentes Comunes

## 5.1 Layout (`components/common/Layout.jsx`)

Estructura principal de la aplicación con AppBar fijo + Drawer lateral.

```
┌──────────────────────────────────────┐
│    AppBar slate-900 (Header)         │
├──────────┬───────────────────────────┤
│          │                           │
│ Sidebar  │   Main Content            │
│ slate-900│   fondo slate-50          │
│  240px   │   padding p-6 max-w-xl    │
│          │                           │
└──────────┴───────────────────────────┘
```

**Comportamiento responsive:**
- Mobile (`< sm`): Drawer `temporary`, se abre con botón hamburguesa
- Desktop (`>= sm`): Drawer `permanent`, siempre visible
- Ancho del drawer: `240px`

**Estilo visual:**
- AppBar y Drawer comparten fondo `#0f172a` (slate-900), sin elevación
- Contenido principal: fondo `#f8fafc` (slate-50), padding `p-6`, `max-w-screen-xl`
- El AppBar usa `elevation={0}` con borde inferior sutil (`rgba(255,255,255,0.07)`)

### Props
| Prop | Tipo | Descripción |
|------|------|-------------|
| `children` | `ReactNode` | Contenido principal que se renderiza junto al drawer |

---

## 5.2 DataTable (`components/common/DataTable.jsx`)

Tabla genérica con columnas dinámicas y botones de acción.

### Props
| Prop | Tipo | Descripción |
|------|------|-------------|
| `columns` | `Array` | `[{ field: 'id', headerName: 'ID' }, ...]` — Cada columna puede incluir `render: (row) => <JSX>` para renderizado personalizado |
| `data` | `Array` | Array de objetos a renderizar |
| `onEdit` | `Function` | Callback con la fila completa al hacer clic en editar |
| `onDelete` | `Function` | Callback con el `id` al hacer clic en eliminar |

### Columnas predefinidas en ProfessorList:
```javascript
const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'nombreCompleto', headerName: 'Nombre' },
  { field: 'username', headerName: 'Username' },
  { field: 'estado', headerName: 'Estado' },
];
```

---

## 5.3 FormInput (`components/common/FormInput.jsx`)

Input reutilizable integrado con React Hook Form, con soporte para máscaras y validación.

### Props
| Prop | Tipo | Descripción |
|------|------|-------------|
| `name` | `string` | Nombre del campo (registrado en RHF) |
| `label` | `string` | Label del TextField |
| `register` | `Function` | Función `register()` de React Hook Form |
| `errors` | `Object` | Objeto `errors` de React Hook Form |
| `control` | `Object` | Control de React Hook Form (para `useWatch`) |
| `required` | `boolean` | Si el campo es requerido |
| `type` | `string` | Tipo de input (`text`, `email`, `password`, etc.) |
| `xs` | `number` | Tamaño Grid (12 = full width) |
| `mask` | `string` | Tipo de máscara (`cedula`, `numbers`, `letters`, `lettersNoSpace`, `username`) |
| `maxLength` | `number` | Límite de caracteres |
| `validation` | `Object` | Reglas de validación adicionales |
| `onBlurCustom` | `Function` | Callback adicional al perder foco |
| `helperText` | `string` | Texto de ayuda |

### Máscaras disponibles

| Máscara | Comportamiento |
|---------|---------------|
| `cedula` | Solo dígitos, máximo 10 |
| `numbers` | Solo dígitos |
| `letters` | Solo letras (incluye tildes, ñ, espacios) |
| `lettersNoSpace` | Solo letras (sin espacios) |
| `username` | Solo alfanumérico + guiones y guión bajo |

---

## 5.4 ConfirmDialog (`components/common/ConfirmDialog.jsx`)

Diálogo de confirmación para eliminar registros.

### Props
| Prop | Tipo | Descripción |
|------|------|-------------|
| `open` | `boolean` | Visibilidad del diálogo |
| `title` | `string` | Título del diálogo |
| `message` | `string` | Mensaje descriptivo |
| `onConfirm` | `Function` | Callback al confirmar |
| `onCancel` | `Function` | Callback al cancelar |

---

## 5.5 LoadingScreen (`components/common/LoadingScreen.jsx`)

Pantalla de carga con spinner y mensaje configurable.

### Props
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `message` | `string` | `'Cargando...'` | Mensaje que aparece tras el delay |
| `delay` | `number` | `500` | Milisegundos antes de mostrar el mensaje |

### Uso
```jsx
<LoadingScreen message="🔍 Verificando autenticación..." delay={300} />
```

---

## 5.6 RedirectWithDelay (`components/common/RedirectWithDelay.jsx`)

Componente de redirección con cuenta regresiva. Muestra un mensaje y redirige después de un delay.

### Props
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `to` | `string` | — | URL de destino |
| `message` | `string` | — | Mensaje a mostrar |
| `delay` | `number` | `2000` | Milisegundos antes de redirigir |

---

## 5.7 Header (`components/layout/Header.jsx`)

Barra superior dentro del AppBar. Muestra:
- Ícono SVG de libro + texto "eduLLM **Admin**" (con "Admin" en azul claro)
- Avatar con las **iniciales del usuario** (`user.username.slice(0,2).toUpperCase()`). Fallback: `AD`
- Menú desplegable al hacer clic en el avatar:
  - Info del usuario (username y label "Sesión activa")
  - Botón "Cerrar sesión" en rojo, llama logout + `POST /api/auth/logout`

**Dependencia:** Usa `useAuth().user` para obtener el username activo.

---

## 5.8 Sidebar (`components/layout/Sidebar.jsx`)

Menú de navegación lateral oscuro (slate-900) con `ListItemButton` de MUI.

| Ítem | Icono | Ruta |
|------|-------|------|
| Dashboard | `Dashboard` | `/` |
| Profesores | `People` | `/professors` |
| Estudiantes | `School` | `/students` |
| Materias | `Book` | `/subjects` |
| Grados | `Layers` | `/grados` |
| Asignaciones | `Assignment` | `/assignments` |

**Estado activo:** usa `useLocation()` para detectar la ruta actual.
- Ítem activo: fondo `rgba(59,130,246,0.25)`, texto blanco, icono azul, indicador lateral azul
- Ítem inactivo: texto slate-400, hover con fondo `rgba(255,255,255,0.06)`
- Footer con versión `eduLLM Admin v1.0` separado por borde slate-700

---

## 5.9 DashboardCards (`components/layout/DashboardCards.jsx`)

Grid de 4 tarjetas de resumen con gradientes. Cada tarjeta muestra el conteo total de la entidad.

| Tarjeta | Gradiente | Fuente de datos |
|---------|-----------|----------------|
| Profesores | `blue-500 → blue-600` | `useProfessors()` |
| Estudiantes | `emerald-500 → emerald-600` | `useStudents()` |
| Materias | `amber-500 → orange-500` | `useSubjects()` |
| Grados | `violet-500 → purple-600` | `useGrados()` |

**Layout:** `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5`

Cada tarjeta incluye ícono SVG en área semi-transparente, número grande, label y subtítulo "Total registrados". Efecto hover con elevación de sombra y translación vertical sutil.

---

---

## 5.A Sistema de Diseño Híbrido (MUI + TailwindCSS)

El proyecto usa un enfoque **híbrido** desde la versión con Tailwind v3:

| Tipo de componente | Herramienta | Razón |
|--------------------|-------------|-------|
| Layout contenedores, fondos, espaciado de páginas | **Tailwind** | Utilidades más rápidas y expresivas |
| LoginForm | **Tailwind** | Migrado completamente — no tenía dependencia de MUI |
| DashboardCards | **Tailwind** | Cards visuales sin comportamiento interactivo complejo |
| Sidebar (visual) | **Tailwind + MUI sx** | MUI `ListItemButton` para navegación, Tailwind para el shell y estilos hover/activo vía `sx` |
| Header | **Tailwind + MUI** | MUI `Avatar`, `Menu` para comportamiento; Tailwind para branding |
| DataTable | **MUI** | Tabla compleja con columnas dinámicas |
| FormInput, ConfirmDialog | **MUI** | Componentes interactivos con accesibilidad MUI |
| ProfessorForm, StudentForm, SubjectForm | **MUI** | Formularios con Grid, Paper, Alert, Dialog |

**Regla:** usar Tailwind `className` para layout y visual; MUI `sx` o componentes MUI para comportamiento interactivo.

---

## 5.10 LoginForm (`components/auth/LoginForm.jsx`)

Formulario de login embebido. Llama `POST /api/auth/login` con credenciales y recibe cookie HttpOnly del gateway. **Migrado completamente a TailwindCSS** (sin dependencias de MUI).

### Diseño
- Fondo: gradiente `from-slate-100 to-blue-50`
- Card: `bg-white rounded-2xl shadow-lg border border-slate-100`
- Área de marca: ícono SVG de libro en `bg-blue-600 rounded-2xl` + título + subtítulo
- Inputs: bordes `border-slate-200`, focus ring `ring-2 ring-blue-500`
- Botón: `bg-blue-600`, hover `bg-blue-700`, disabled con `opacity-60`
- Footer: copyright con año dinámico

### Estados
- **Cargando**: botón muestra spinner SVG animado + "Iniciando sesión..."
- **Error**: snackbar con mensaje del servidor (notistack)
- **Éxito**: snackbar de bienvenida + `navigate('/')`

### Props
Sin props (componente autónomo con estado interno).
