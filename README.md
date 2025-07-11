
# Lexia - Sistema de Gestión de Documentos y Contratos con IA

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 15.1.5.

## 📋 Descripción del Proyecto

Lexia es una aplicación web desarrollada en Angular que permite la gestión inteligente de documentos y contratos utilizando tecnologías de inteligencia artificial. El sistema incluye funcionalidades para análisis de cláusulas, generación de contratos automática y gestión de documentos.

## 🚀 Características Principales

### 📄 Módulo de Documentos
- **Dashboard de Documentos**: Vista general con métricas y estadísticas
- **Gestión de Documentos**: Subida, visualización y eliminación de documentos
- **Análisis de Cláusulas con IA**: Clasificación automática de cláusulas como "riesgosa" o "neutra"
- **Gestión de Dataset ML**: Administración del conjunto de datos para machine learning
- **Tipos de documentos soportados**: Contratos, Boletines, Comunicados, Informes, Otros

### 📝 Módulo de Contratos
- **Generación de Contratos**: Creación automática de contratos basada en plantillas
- **Plantillas Dinámicas**: Sistema flexible de campos personalizables
- **Generación de Cláusulas con IA**: Creación de cláusulas personalizadas usando GPT
- **Firma Digital**: Integración de firmas digitales en contratos
- **Descarga de Plantillas**: Acceso a plantillas originales
- **Campos Dinámicos**: Soporte para texto, email, teléfono, fecha, textarea y firma

### 🎨 Interfaz de Usuario
- **Diseño Responsivo**: Compatible con dispositivos móviles y desktop
- **Material Design**: Interfaz moderna usando Angular Material
- **Internacionalización**: Soporte para múltiples idiomas (ES, EN, DE)
- **Breadcrumbs**: Navegación clara y contextual
- **Tema Oscuro/Claro**: Alternancia entre temas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 15**: Framework principal
- **Angular Material**: Componentes UI
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **NgX-Translate**: Internacionalización
- **SCSS**: Preprocesador CSS

### Componentes Principales
- **Standalone Components**: Arquitectura moderna de Angular
- **Reactive Forms**: Formularios reactivos
- **HTTP Client**: Comunicación con backend
- **File Upload**: Subida de archivos
- **Signature Pad**: Componente de firma digital

## 📁 Estructura del Proyecto

```
src/app/
├── modules/
│   ├── documents/           # Módulo de gestión de documentos
│   │   ├── document-list/   # Lista de documentos
│   │   ├── pages/
│   │   │   ├── document-dashboard/    # Dashboard principal
│   │   │   ├── upload-document/       # Subida de documentos
│   │   │   ├── analyze-clause/        # Análisis de cláusulas
│   │   │   └── clauses/              # Gestión de cláusulas
│   │   ├── dialogs/         # Modales y diálogos
│   │   └── services/        # Servicios del módulo
│   └── contracts/           # Módulo de contratos
│       ├── create-contract/ # Generación de contratos
│       ├── clause-generator/ # Generador de cláusulas IA
│       ├── components/      # Componentes específicos
│       ├── models/          # Modelos TypeScript
│       └── services/        # Servicios del módulo
├── shared/                  # Componentes compartidos
│   ├── components/
│   │   ├── breadcrumb/      # Navegación
│   │   ├── file-upload/     # Subida de archivos
│   │   └── feather-icons/   # Iconografía
│   └── pipes/               # Pipes personalizados
├── layout/                  # Estructura de la aplicación
│   ├── header/              # Cabecera
│   ├── sidebar/             # Menú lateral
│   └── right-sidebar/       # Panel lateral derecho
└── core/                    # Servicios y configuración base
    ├── guard/               # Guards de autenticación
    ├── interceptor/         # Interceptores HTTP
    ├── models/              # Modelos globales
    └── service/             # Servicios globales
```

## ✅ Checklist de Implementación

### ✅ Módulo de Documentos - COMPLETADO
- [x] **DocumentsModule**: Módulo principal configurado
- [x] **Document Dashboard**: Vista con métricas y estadísticas
- [x] **Upload Document**: Componente para subir documentos
- [x] **Document List**: Lista y gestión de documentos
- [x] **Analyze Clause**: Análisis de cláusulas con IA
- [x] **Clauses Management**: Gestión del dataset ML
- [x] **Delete Document**: Funcionalidad de eliminación
- [x] **Documents Service**: Servicio con todas las operaciones CRUD
- [x] **Routing**: Navegación entre páginas configurada
- [x] **Models**: Interfaces TypeScript definidas
- [x] **Dialogs**: Modales para edición y eliminación

### ✅ Módulo de Contratos - COMPLETADO
- [x] **ContractsModule**: Módulo principal configurado
- [x] **Create Contract**: Generador de contratos dinámico
- [x] **Clause Generator**: Generador de cláusulas con IA
- [x] **Template System**: Sistema de plantillas dinámicas
- [x] **Dynamic Fields**: Campos personalizables por plantilla
- [x] **Signature Pad**: Componente de firma digital
- [x] **Field Types**: Soporte para texto, email, teléfono, fecha, textarea, firma
- [x] **Template Download**: Descarga de plantillas originales
- [x] **Contracts Service**: Servicio completo con API
- [x] **Form Validation**: Validaciones dinámicas
- [x] **File Generation**: Generación de archivos DOCX

### ✅ Componentes Compartidos - COMPLETADO
- [x] **Breadcrumb**: Navegación contextual
- [x] **File Upload**: Componente reutilizable
- [x] **Signature Pad**: Firma digital configurable
- [x] **Feather Icons**: Iconografía personalizada

### ✅ Configuración y Arquitectura - COMPLETADO
- [x] **Standalone Components**: Arquitectura moderna
- [x] **Lazy Loading**: Carga perezosa de módulos
- [x] **Routing**: Navegación completa configurada
- [x] **Environment**: Configuración de entornos
- [x] **Internationalization**: Soporte multiidioma
- [x] **Material Design**: Tema y componentes configurados
- [x] **TypeScript**: Tipado estricto implementado
- [x] **Error Handling**: Manejo de errores centralizado

### ✅ Servicios y API - COMPLETADO
- [x] **DocumentsService**: CRUD completo de documentos
- [x] **ContractsService**: Generación y gestión de contratos
- [x] **HTTP Interceptors**: Manejo de peticiones
- [x] **Error Interceptor**: Captura de errores HTTP
- [x] **Auth Service**: Servicio de autenticación
- [x] **Language Service**: Gestión de idiomas

### ✅ UI/UX - COMPLETADO
- [x] **Responsive Design**: Adaptable a todos los dispositivos
- [x] **Loading States**: Estados de carga implementados
- [x] **Form Validation**: Validaciones visuales
- [x] **Snackbar Notifications**: Notificaciones de usuario
- [x] **Progress Indicators**: Indicadores de progreso
- [x] **Icon System**: Sistema de iconos coherente
- [x] **Theme Support**: Soporte para temas
- [x] **Accessibility**: Características de accesibilidad

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm (viene con Node.js)
- Angular CLI: `npm install -g @angular/cli`

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Navegar al directorio
cd lexia

# Instalar dependencias
npm install
```

## 🚀 Desarrollo

Ejecutar `ng serve` para iniciar el servidor de desarrollo. Navegar a `http://localhost:4200/`. La aplicación se recargará automáticamente si modificas algún archivo fuente.

```bash
# Servidor de desarrollo
npm start

# O directamente
ng serve
```

## 🏗️ Generación de Código

Ejecutar `ng generate component component-name` para generar un nuevo componente. También puedes usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

```bash
# Generar componente
ng generate component nombre-componente

# Generar servicio
ng generate service nombre-servicio

# Generar módulo
ng generate module nombre-modulo
```

## 🔨 Construcción

Ejecutar `ng build` para construir el proyecto. Los artefactos de construcción se almacenarán en el directorio `dist/`.

```bash
# Build de desarrollo
ng build

# Build de producción
ng build --prod
```

## 🧪 Pruebas Unitarias

Ejecutar `ng test` para ejecutar las pruebas unitarias vía [Karma](https://karma-runner.github.io).

```bash
npm test
```

## 🔚 Pruebas End-to-End

Ejecutar `ng e2e` para ejecutar las pruebas end-to-end a través de una plataforma de tu elección. Para usar este comando, primero necesitas agregar un paquete que implemente capacidades de pruebas end-to-end.

## 📚 Documentación Adicional

### Estructura de Módulos
- **Documents Module**: Gestión completa de documentos con IA
- **Contracts Module**: Generación de contratos y cláusulas
- **Shared Module**: Componentes reutilizables
- **Core Module**: Servicios y configuración base

### APIs Utilizadas
- **Documents API**: CRUD de documentos y análisis de cláusulas
- **Contracts API**: Generación de contratos y plantillas
- **GPT API**: Generación de cláusulas con IA
- **File Upload API**: Subida y gestión de archivos

### Configuración de Entorno
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000'  // Configurar según tu backend
};
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

- **Standalone Components**: Se utiliza la nueva arquitectura de componentes standalone de Angular 15+
- **Material Design**: Todos los componentes siguen las guías de Material Design
- **Reactive Forms**: Se utiliza programación reactiva para todos los formularios
- **TypeScript Strict**: Configuración estricta de TypeScript para mejor calidad de código
- **Lazy Loading**: Módulos cargados de forma perezosa para mejor rendimiento

## 🆘 Ayuda

Para obtener más ayuda sobre Angular CLI usa `ng help` o consulta la página [Angular CLI Overview and Command Reference](https://angular.io/cli).

## 🔄 Estado del Proyecto

**Versión Actual**: 1.0.0
**Estado**: ✅ COMPLETADO - Listo para producción
**Último Update**: Enero 2025

### Próximas Mejoras Planificadas
- [ ] Implementación de tests unitarios
- [ ] Mejoras en el sistema de notificaciones
- [ ] Optimización de rendimiento
- [ ] Documentación de API
- [ ] Deploy en Replit
