# 🌊 Blue Ocean ATP — Plataforma Web de Gestión y Promoción Turística

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Estado-En_Desarrollo-brightgreen?style=for-the-badge)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue?style=for-the-badge)

---

## 📌 Ficha Académica del Proyecto de Tesis

| Parámetro | Detalle |
| :--- | :--- |
| **Título del Proyecto** | Sistema Web Integral para la Digitalización, Comercialización y Gestión de Experiencias Turísticas "Blue Ocean ATP" |
| **Grado Académico** | Tesis para optar el Título Profesional de Ingeniero de Sistemas / Software |
| **Institución / Universidad** | Facultad de Ingeniería de Sistemas e Informática |
| **Línea de Investigación** | Desarrollo de Software, Comercio Electrónico y Tecnologías de la Información Aplicadas al Turismo |
| **Autor(es)** | Tesista(s) del Proyecto |
| **Asesor Académico** | Docente Asesor de Tesis |
| **Año** | 2026 |

---

## 📝 Resumen del Proyecto (Abstract)

El proyecto **Blue Ocean ATP** (Agencia de Turismo y Paquetes) es una solución tecnológica moderna orientada a la transformación digital del sector turístico regional (Paracas, Ica, Islas Ballestas y Reserva Nacional). Nace en respuesta a la necesidad de optimizar los procesos de reserva, exposición interactiva de itinerarios de aventura (buggies, sandboarding, paseos náuticos y rutas del desierto) y la gestión dinámica de contenidos en tiempo real.

El sistema se cimenta sobre una arquitectura de renderizado híbrido (**Next.js App Router**) que garantiza altos estándares de **SEO (Search Engine Optimization)**, velocidad de carga óptima (**Core Web Vitals**) y una experiencia de usuario (UX/UI) fluida, inclusiva y responsiva.

---

## 🏗️ Arquitectura de Software y Diagrama de Capas

El ecosistema de la aplicación sigue los principios de **Clean Architecture** estructurados sobre el framework **Next.js**:

```
                              ┌────────────────────────────────────────┐
                              │            Cliente / Usuario           │
                              │      (Browser / Mobile / Desktop)      │
                              └───────────────────┬────────────────────┘
                                                  │
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │       Next.js Middleware & Router      │
                              │    (Seguridad, Cache, Rutado Híbrido)   │
                              └───────────────────┬────────────────────┘
                                                  │
                        ┌─────────────────────────┴─────────────────────────┐
                        ▼                                                   ▼
         ┌──────────────────────────────┐                   ┌──────────────────────────────┐
         │     Server Components (SSR)  │                   │     Client Components (CSR)  │
         │   (Catálogo, SEO, Páginas)   │                   │    (Formularios, Galería,     │
         │                              │                   │      Filtros Dinámicos)      │
         └──────────────┬───────────────┘                   └──────────────┬───────────────┘
                        │                                                  │
                        └─────────────────────────┬────────────────────────┘
                                                  │
                                                  ▼
                              ┌────────────────────────────────────────┐
                              │      Módulos de Servicios y Lógica     │
                              │     (Reservas, Paquetes, Galería)      │
                              └────────────────────────────────────────┘
```

---

## ⚡ Tecnologías y Herramientas

### **Core Framework & Lenguajes**
- **Next.js 15**: Renderizado del lado del servidor (SSR), Server Driven UI y arquitectura App Router.
- **React 19**: Biblioteca UI orientada a componentes altamente reactivos y reutilizables.
- **TypeScript**: Tipado estático para garantizar la mantenibilidad y robustez del código.

### **Estilos & UI / UX**
- **Tailwind CSS**: Framework CSS orientado a utilidades para diseño adaptativo (Mobile First).
- **PostCSS**: Procesamiento optimizado de hojas de estilo.

### **Herramientas de Desarrollo y Calidad**
- **ESLint**: Linter configurable (`eslint.config.mjs`) para garantizar buenas prácticas de código.
- **Next.js Middleware**: Gestión centralizada de sesiones, redirecciones e interceptación de peticiones.

---

## 📁 Estructura del Directorio del Proyecto

```bash
blueocean-atp/
├── public/                     # Archivos estáticos consumidos dinámicamente
│   ├── gallery/                # Catálogo multimedia organizado por destinos
│   │   ├── aventura/           # Experiencias de acantilados, lobos marinos, etc.
│   │   ├── desierto/           # Paseos en Buggy, Dunas, Bici, Catedral
│   │   ├── islas/              # Tours náuticos a Islas Ballestas
│   │   └── reserva/            # Atardeceres y paisajes de la Reserva Nacional
│   ├── logo.png                # Identidad visual corporativa
│   └── maintenance.html        # Plantilla de contingencia para mantenimientos
├── middleware.ts               # Interceptor de seguridad y control de peticiones
├── next.config.ts              # Configuración avanzada de Next.js
├── postcss.config.mjs          # Configuración de PostCSS y autoprefixer
├── eslint.config.mjs           # Reglas de estandarización de código
├── package.json                # Dependencias y scripts del proyecto
└── README.md                   # Documentación oficial del proyecto
```

---

## 🚀 Características Principales del Sistema

1. **Catálogo Interactivo de Experiencias**:
   - Clasificación por categorías: *Aventura, Desierto, Islas Náuticas y Reserva Nacional*.
   - Presentación multimedia optimizada en formatos WebP/PNG/JPEG.
2. **Motor de Reservas y Paquetes Turísticos**:
   - Cotización y consulta dinámica de paquetes individuales y grupales.
   - Interfaz interactiva de selección de fechas y cupos disponibles.
3. **Optimización SEO y Rendimiento Elevado**:
   - Metadatos dinámicos generados desde el servidor.
   - Tiempos de carga minimizados gracias al procesamiento estático e incremental de Next.js.
4. **Diseño Responsivo e Inclusivo (Mobile First)**:
   - Adaptabilidad fluida a dispositivos móviles, tablets y monitores ultra-wide.
5. **Seguridad y Control de Acceso**:
   - Manejo de middleware para protección de rutas administrativas o del cliente.

---

## ⚙️ Instalación y Configuración Local

### **Requisitos Previos**
- **Node.js**: `v18.17.0` o superior (Recomendado `v20.x`)
- **Gestor de Paquetes**: `npm` (v9+) o `yarn` / `pnpm`

### **Pasos para la Ejecución**

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/usuario/blueocean-atp.git
   cd blueocean-atp
   ```

2. **Instalar las dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto basándote en `.env.example`:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=https://api.blueoceanatp.com/v1
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador:**
   Navega a [http://localhost:3000](http://localhost:3000) para visualizar la aplicación.

---

## 📜 Scripts Disponibles

En el archivo `package.json` se definen los siguientes comandos principales:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local con Hot Reload. |
| `npm run build` | Compila la aplicación para producción optimizando bundles. |
| `npm run start` | Inicia el servidor de producción compilado. |
| `npm run lint` | Ejecuta ESLint para analizar la calidad y estilo del código. |

---

## 🧪 Pruebas y Validación de Calidad

Para el marco metodológico de la tesis, el sistema se somete a las siguientes pruebas:

- **Pruebas de Rendimiento (Lighthouse / Core Web Vitals)**: Evaluación de First Contentful Paint (FCP), Largest Contentful Paint (LCP) y Cumulative Layout Shift (CLS).
- **Pruebas de Usabilidad (SUS - System Usability Scale)**: Validación con usuarios finales en la selección de paquetes turísticos.
- **Pruebas de Compatibilidad**: Verificación multiplataforma en navegadores Chrome, Safari, Firefox y Edge.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para obtener más información.

---

<div align="center">
  <sub>Desarrollado como Proyecto de Tesis Profesional • 2026</sub>
</div>
