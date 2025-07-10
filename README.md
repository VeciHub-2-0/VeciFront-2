# VeciHub - Plataforma de Gestión Vecinal
# VeciHub - Plataforma Vecinal

Una aplicación web para comunidades vecinales que permite a los usuarios interactuar a través de un foro, eventos, encuestas y más.

## Requisitos previos

- Node.js (v16 o superior)
- NPM

## Instalación

```bash
# Instalar dependencias
npm install
```

## Ejecución

Para ejecutar la aplicación completa, necesitas iniciar tanto el servidor API como la aplicación frontend:

```bash
# En una terminal, inicia el servidor API
npm run api

# En otra terminal, inicia el servidor de desarrollo frontend
npm run dev
```

## Características principales

- **Foro comunitario**: Discusiones organizadas por categorías
- **Eventos**: Calendario de eventos vecinales
- **Encuestas**: Votaciones sobre temas de interés comunitario
- **Perfiles de usuario**: Gestión de perfiles personales
- **Panel de administración**: Herramientas para gestionar la comunidad

## Tecnologías utilizadas

- Vue.js 3.5.13 (Composition API)
- Pinia para gestión de estado
- Vue Router para enrutamiento
- PrimeVue como biblioteca de componentes UI
- Axios para peticiones HTTP
- JSON Server para simular API REST

## Estructura del proyecto

El proyecto sigue una arquitectura hexagonal (ports and adapters) en cada módulo:

- **/domain**: Modelos y lógica de negocio
- **/application**: Casos de uso y servicios
- **/infrastructure**: Implementaciones concretas (repositorios, API)
- **/presentation**: Componentes y páginas de la UI

## Licencia

MIT
## Descripción

VeciHub es una plataforma diseñada para facilitar la comunicación y gestión de comunidades vecinales, conectando residentes y administradores en un entorno digital seguro y eficiente.

## Tecnologías

- Vue 3.5.13
- Pinia 3.0.2
- Axios 1.9.0
- Vue Router 4.5.1
- PrimeVue 4.3.4
- Vue i18n 11.1.3
- Vite 6.3.5

## Características

- Gestión de usuarios (residentes y administradores)
- Internacionalización (Español e Inglés)
- Diseño responsivo
- Interfaz intuitiva con PrimeVue

## Paleta de Colores

### Colores Principales

- **#328E6E** = Color principal (branding)
- **#FDFAF6** = Fondo de encabezado
- **#000000** = Texto principal
- **#67AE6E** = Botones
- **#589F61** = Botón hover / activo
- **#90C67C** = Fondo de secciones secundarias
- **#FFFFFF** = Texto sobre botones o fondos oscuros
- **#FAF1E6** = Fondo principal general
- **#D9D9D9** = Fondo de campos de entrada

### Colores de Estado

- **#E74C3C** = Color de error (alertas críticas)
- **#F5B041** = Color de advertencia (precauciones)
- **#28B463** = Color de éxito (acciones confirmadas)
- **#3498DB** = Color informativo (mensajes neutros)

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Servidor de pruebas

Para iniciar el servidor JSON local:

```bash
cd server
./start2.sh
```

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Añadir una característica increíble'`)
4. Empuja a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

[MIT](LICENSE)
