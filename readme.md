# MIGO – Aplicación móvil de cuidado de mascotas

MIGO es una aplicación móvil multiplataforma (React Native + Expo) que permite a los dueños de mascotas registrar y dar seguimiento a la salud, actividades y cuidados de sus animales de compañía, con recordatorios y una interfaz preparada para un asistente virtual.

> **Nota:** En esta entrega el frontend funciona con **datos locales/simulados**. No se requiere backend ni API (Ktor se integrará en una etapa posterior).

---

## Requisitos previos

Antes de instalar el proyecto, asegúrate de tener instalado:

| Herramienta | Versión recomendada | Cómo verificar |
| :--- | :--- | :--- |
| **Node.js** | 18.x o superior | `node -v` |
| **npm** | Incluido con Node | `npm -v` |
| **Expo Go** (móvil) | Última versión | App Store / Google Play |
| **Git** (opcional) | Cualquiera reciente | `git --version` |

Opcional para emuladores:
- Android Studio (emulador Android)
- Xcode (solo macOS, emulador iOS)

---

## Instalación

1. **Descomprime** el archivo del proyecto (o clona el repositorio).
2. Abre una terminal en la carpeta raíz del proyecto (donde está el archivo `package.json`).
3. Instala las dependencias:

```bash
npm install
```

---

## Ejecución

Desde la carpeta raíz del proyecto:

```bash
npx expo start
```

Se abrirá el menú de Expo en la terminal y, normalmente, una página en el navegador.

### Opciones disponibles

| Comando / Tecla | Descripción |
| :--- | :--- |
| `w` | Abrir en el navegador web |
| `a` | Abrir en emulador Android |
| `i` | Abrir en simulador iOS (solo macOS) |
| **Escanear QR** | Abrir en el celular con la app Expo Go |

También puedes forzar el inicio en web:

```bash
npx expo start --web
```

---

## Estructura del proyecto

```text
MIGO/
├── App.js                 # Punto de entrada y navegación principal
├── package.json           # Dependencias del proyecto
├── app.json               # Configuración de Expo
├── assets/                # Imágenes e iconos
├── screens/               # Pantallas de la aplicación
│   ├── InicioScreen.js
│   ├── MisMascotasScreen.js
│   ├── HorarioScreen.js
│   ├── MigoIAScreen.js
│   └── PerfilScreen.js
├── components/            # Componentes reutilizables
├── navigation/            # Barra de navegación inferior
└── services/              # Datos simulados (preparado para API futura)
```

---

## Pantallas disponibles

| Pantalla | Descripción |
| :--- | :--- |
| **Inicio** | Resumen de mascotas y próximas actividades |
| **Mis Mascotas** | Listado, registro y edición de mascotas (modales) |
| **Horario** | Gestión de actividades por mascota (hoy / semana) |
| **MIGO IA** | Interfaz del asistente virtual (preparada para integración) |
| **Perfil** | Datos del usuario, configuración y notificaciones |

---

## Notas importantes

- Los datos (mascotas, actividades, perfil) se manejan en estado local. Al recargar la app se restablecen los datos iniciales.
- No es necesario configurar variables de entorno ni servidores para esta entrega.
- La navegación entre pantallas funciona mediante la barra inferior y botones internos.
- Los formularios incluyen validaciones visuales en los campos obligatorios.