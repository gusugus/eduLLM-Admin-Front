# eduLLM Admin — Frontend: Índice de Documentación

> Aplicación SPA de administración para la plataforma eduLLM.
> Stack: **React 18 + Vite + Material UI 5 + React Query + Zustand + React Hook Form**

---

## Índice

| # | Documento | Descripción |
|---|-----------|-------------|
| 1 | [Visión General](./01_VISION_GENERAL.md) | Stack, puertos, arquitectura y flujo de datos |
| 2 | [Estructura de Archivos](./02_ESTRUCTURA.md) | Árbol de directorios con estado de cada archivo |
| 3 | [Configuración](./03_CONFIGURACION.md) | Variables de entorno, scripts npm, Docker y providers |
| 4 | [Rutas](./04_RUTAS.md) | Todas las rutas de la aplicación SPA |
| 5 | [Componentes Comunes](./05_COMPONENTES.md) | Layout, DataTable, FormInput, ConfirmDialog, Header, Sidebar, DashboardCards |
| 6 | [Features](./06_FEATURES.md) | Profesores (funcional), Estudiantes y Materias (stub) |
| 7 | [Services y Stores](./07_SERVICES_STORES.md) | API calls, Zustand stores, hooks personalizados |
| 8 | [Dependencias](./08_DEPENDENCIAS.md) | Tabla de paquetes con versión y uso |
| 9 | [Guía para Extender](./09_GUIA_EXTENSION.md) | Paso a paso para agregar nuevas features |

---

## Estado Actual

| Módulo | Estado |
|--------|--------|
| Profesores | CRUD funcional completo (list, create, edit, delete) |
| Estudiantes | UI stub (formulario mínimo, sin backend real) |
| Materias | UI stub (formulario mínimo, sin backend real) |
| Auth | Middleware JWT implementado (`PrivateRoute` + stores), login no implementado |
