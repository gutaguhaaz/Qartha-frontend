
# Qartha - Sistema de Gestión de Inventario Inteligente con Códigos QR Dinámicos

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 17.3.0.

## 📋 Descripción del Proyecto

Qartha es una aplicación web desarrollada en Angular que permite la gestión inteligente de inventarios utilizando códigos QR dinámicos y gestión de riesgos. El sistema incluye funcionalidades para análisis de documentos, gestión de contratos, dashboard de métricas y mucho más.

## 🚀 Características Principales

### 📊 Dashboard y Análisis
- **Dashboard Principal**: Vista general con métricas y estadísticas en tiempo real
- **Dashboard Secundario**: Análisis de proyectos y estados
- **Visualización de Datos**: Gráficos con Chart.js, ApexCharts, ECharts y NGX-Charts
- **Widgets Interactivos**: Componentes de datos y gráficos personalizables

### 📄 Módulo de Documentos
- **Gestión de Documentos**: Subida, visualización y eliminación de documentos
- **Análisis de Cláusulas con IA**: Clasificación automática de cláusulas como "riesgosa" o "neutra"
- **Dashboard de Documentos**: Vista general con métricas y estadísticas
- **Gestión de Dataset ML**: Administración del conjunto de datos para machine learning
- **Tipos de documentos soportados**: Contratos, Boletines, Comunicados, Informes, Otros

### 📝 Módulo de Contratos
- **Generación de Contratos**: Creación automática de contratos basada en plantillas
- **Plantillas Dinámicas**: Sistema flexible de campos personalizables
- **Generación de Cláusulas con IA**: Creación de cláusulas personalizadas usando GPT
- **Firma Digital**: Integración de firmas digitales en contratos
- **Descarga de Plantillas**: Acceso a plantillas originales
- **Campos Dinámicos**: Soporte para texto, email, teléfono, fecha, textarea y firma

### 👥 Módulo de Usuarios
- **Gestión de Perfiles**: Administración de usuarios y perfiles
- **Autenticación**: Sistema completo de login/registro
- **Control de Acceso**: Guards y interceptores de seguridad

### 📧 Sistema de Comunicación
- **Email**: Bandeja de entrada, composición y lectura de emails
- **Chat**: Sistema de mensajería interna
- **Soporte**: Sistema de tickets de soporte

### 📅 Gestión de Tiempo
- **Calendario**: Gestión completa de eventos con FullCalendar
- **Tareas**: Sistema de gestión de tareas y proyectos
- **Timeline**: Visualización temporal de eventos

### 📊 Tablas y Reportes
- **Tablas Básicas**: Visualización estándar de datos
- **Tablas Avanzadas**: Con filtros, paginación y ordenamiento
- **Material Tables**: Componentes de Angular Material
- **NGX DataTable**: Tablas interactivas avanzadas
- **Exportación**: Soporte para exportar a Excel y otros formatos

### 🎨 Interfaz de Usuario
- **Diseño Responsivo**: Compatible con dispositivos móviles y desktop
- **Material Design**: Interfaz moderna usando Angular Material
- **Internacionalización**: Soporte para múltiples idiomas (ES, EN, DE)
- **Breadcrumbs**: Navegación clara y contextual
- **Tema Oscuro/Claro**: Alternancia entre temas
- **Componentes UI**: Botones, cards, modales, alerts, badges, etc.

### 📍 Mapas y Localización
- **Google Maps**: Integración completa con Google Maps API
- **Marcadores**: Sistema de marcadores personalizables
- **Geolocalización**: Funcionalidades de ubicación

### 🎯 Aplicaciones Adicionales
- **Calculadora**: Aplicación de calculadora integrada
- **Galería de Contactos**: Gestión visual de contactos
- **Drag & Drop**: Funcionalidades de arrastrar y soltar
- **Formularios Avanzados**: Validaciones, wizards, editores de texto

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 17.3.0**: Framework principal
- **Angular Material 17.3.0**: Componentes UI
- **TypeScript 5.2.2**: Lenguaje de programación
- **RxJS 7.8.1**: Programación reactiva
- **NgX-Translate**: Internacionalización
- **SCSS**: Preprocesador CSS

### Gráficos y Visualización
- **Chart.js 4.4.2**: Gráficos básicos
- **ApexCharts 3.47.0**: Gráficos avanzados
- **ECharts 5.5.0**: Visualizaciones complejas
- **NGX-Charts 20.5.0**: Gráficos para Angular
- **NGX-Gauge 9.0.0**: Medidores y gauges

### Componentes Especializados
- **FullCalendar 6.1.11**: Calendario completo
- **CKEditor 41.2.1**: Editor de texto rico
- **Angular DateTime Picker**: Selectores de fecha y hora
- **SweetAlert2 11.10.6**: Alertas y modales elegantes
- **NGX-Mask 17.0.4**: Máscaras de input
- **Moment.js 2.30.1**: Manipulación de fechas

### Arquitectura y Herramientas
- **Standalone Components**: Arquitectura moderna de Angular
- **Lazy Loading**: Carga perezosa de módulos
- **PWA Ready**: Preparado para Progressive Web App
- **Bootstrap 5.3.3**: Framework CSS
- **ESLint**: Linting de código
- **Karma y Jasmine**: Testing

## 📁 Estructura del Proyecto

```
src/app/
├── modules/                    # Módulos principales
│   ├── documents/             # Gestión de documentos
│   │   ├── pages/
│   │   │   ├── document-dashboard/
│   │   │   ├── upload-document/
│   │   │   ├── analyze-clause/
│   │   │   └── clauses/
│   │   ├── dialogs/           # Modales y diálogos
│   │   └── services/          # Servicios del módulo
│   ├── contracts/             # Gestión de contratos
│   │   ├── create-contract/
│   │   ├── clause-generator/
│   │   ├── components/
│   │   └── services/
│   ├── users/                 # Gestión de usuarios
│   └── dashboard/             # Dashboard principal
├── shared/                    # Componentes compartidos
│   ├── components/
│   │   ├── breadcrumb/
│   │   ├── file-upload/
│   │   └── feather-icons/
│   └── pipes/
├── layout/                    # Estructura de la aplicación
│   ├── header/
│   ├── sidebar/
│   └── right-sidebar/
├── core/                      # Servicios y configuración base
│   ├── guard/
│   ├── interceptor/
│   ├── models/
│   └── service/
├── dashboard/                 # Dashboards
├── email/                     # Sistema de email
├── calendar/                  # Calendario y eventos
├── contacts/                  # Gestión de contactos
├── tasks/                     # Gestión de tareas
├── charts/                    # Gráficos y visualizaciones
├── tables/                    # Componentes de tablas
├── forms/                     # Formularios avanzados
├── ui/                        # Componentes UI
├── maps/                      # Integración de mapas
├── apps/                      # Aplicaciones adicionales
├── authentication/            # Autenticación
├── extra-pages/              # Páginas adicionales
└── widget/                   # Widgets personalizables
```

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 20.x (compatible con Angular 17)
- npm (viene con Node.js)
- Angular CLI: `npm install -g @angular/cli`

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Navegar al directorio
cd qartha

# Instalar dependencias
npm install
```

## 🚀 Desarrollo

```bash
# Servidor de desarrollo
npm start
# La aplicación estará disponible en http://localhost:3000

# Build de producción
npm run build

# Ejecutar tests
npm test

# Linting
npm run lint

# Preview de build
npm run preview
```

## 📦 Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo en puerto 3000
- `npm run build`: Construye la aplicación para producción
- `npm test`: Ejecuta las pruebas unitarias
- `npm run lint`: Ejecuta el linter de código
- `npm run preview`: Sirve la versión de producción localmente

## 🌐 Despliegue en Replit

El proyecto está configurado para desplegarse fácilmente en Replit:

- **Build Command**: `npm run build`
- **Run Command**: `npm start`
- **Public Directory**: `dist/qartha`
- **Port**: 3000 (mapeado a 80 en producción)

## 🔧 Configuración de Entorno

### Variables de Entorno
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000'  // Configurar según tu backend
};
```

### API Keys Necesarias
- **Google Maps API**: Configurada en `src/index.html`
- **OpenAI API**: Para generación de cláusulas IA (configurar en secrets)

## 🎨 Temas y Personalización

El proyecto incluye soporte para múltiples temas:
- Tema Claro (por defecto)
- Tema Oscuro
- Temas de colores: Blue, Green, Orange, Purple, Black, Cyan

## 📱 Características Responsive

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: Compatible con tablets y desktop
- **Touch Friendly**: Interfaz optimizada para touch
- **PWA Ready**: Preparado para ser una Progressive Web App

## 🔒 Seguridad

- **Guards**: Protección de rutas
- **Interceptors**: Manejo de tokens JWT
- **Error Handling**: Captura centralizada de errores
- **Input Validation**: Validaciones client-side y server-side

## 🌍 Internacionalización

Idiomas soportados:
- Español (ES) - Por defecto
- Inglés (EN)
- Alemán (DE)

Archivos de traducción en `src/assets/i18n/`

## 📊 Métricas y Analytics

- **Performance Monitoring**: Optimización de rendimiento
- **Bundle Analysis**: Análisis de tamaño de bundles
- **Lazy Loading**: Carga bajo demanda de módulos
- **Tree Shaking**: Eliminación de código no utilizado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Changelog

### Versión 5.1.0 (Actual)
- ✅ Renombrado de Lexia a Qartha
- ✅ Actualización a Angular 17.3.0
- ✅ Módulo de documentos completamente funcional
- ✅ Módulo de contratos con IA
- ✅ Dashboard interactivo
- ✅ Sistema de usuarios y autenticación
- ✅ Integración completa de gráficos
- ✅ Soporte para múltiples idiomas
- ✅ Configuración para despliegue en Replit

## 🆘 Ayuda y Documentación

Para obtener más ayuda sobre Angular CLI usa `ng help` o consulta la página [Angular CLI Overview and Command Reference](https://angular.io/cli).

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- Crear un issue en el repositorio
- Usar el sistema de soporte integrado en la aplicación
- Revisar la documentación en `/docs`

---

**Versión**: 5.1.0  
**Estado**: ✅ Producción Ready  
**Última Actualización**: Enero 2025  
**Framework**: Angular 17.3.0  
**Node.js**: 20.x  
**Plataforma de Despliegue**: Replit
