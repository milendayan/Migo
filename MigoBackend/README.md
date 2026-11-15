# MIGO – Aplicación móvil de cuidado de mascotas

MIGO es una aplicación móvil para que los dueños de perros y gatos registren a sus mascotas, organicen sus actividades de cuidado (medicamentos, paseos, alimentación, higiene y citas), consulten el historial médico (vacunas, citas y peso) y hagan preguntas al asistente **MIGO IA**.

| Parte | Tecnología |
| :--- | :--- |
| Frontend | React Native + Expo (JavaScript) |
| Backend | Kotlin + Ktor (API REST) |
| Base de datos | Firebase Cloud Firestore |
| Asistente IA | API de Google Gemini (se llama desde Ktor) |

```text
App React Native  ──HTTP/JSON──►  API Ktor (puerto 8080)  ──►  Firestore
                                         └────────────────────►  Google Gemini (MIGO IA)
```

---

## 1. Requisitos previos

| Herramienta | Versión | Para qué |
| :--- | :--- | :--- |
| Node.js y npm | 18 o superior | Frontend |
| Expo Go (celular) o Android Studio (emulador) | Última | Ejecutar la app |
| JDK | 21 | Backend (Gradle lo puede descargar solo) |
| IntelliJ IDEA (opcional) | Cualquiera reciente | Abrir y ejecutar el backend |
| Cuenta de Google | — | Firebase y Gemini |

---

## 2. Configurar la base de datos (Firebase Firestore)

1. Entrar a <https://console.firebase.google.com> y crear un proyecto (por ejemplo `migo-app`).
2. En el menú **Firestore Database** → **Crear base de datos** → elegir **modo de producción** y una ubicación.
   - No hay que crear tablas: las colecciones `usuarios`, `mascotas`, `actividades` e `historial` se crean solas cuando el backend guarda el primer dato. Su estructura está en `BaseDatos_MIGO/estructura_firestore.json`.
   - El modo de producción bloquea el acceso directo desde internet; solo el backend (con la llave de servicio) puede leer y escribir.
3. Ir a **Configuración del proyecto** (⚙) → **Cuentas de servicio** → **Generar nueva clave privada**.
4. Guardar el archivo descargado como:

   ```text
   MigoBackend/src/main/resources/serviceAccountKey.json
   ```

   ⚠ Este archivo es una contraseña: **no se sube a GitHub** (ya está en `.gitignore`).

---

## 3. Configurar MIGO IA (Google Gemini)

1. Entrar a <https://aistudio.google.com/app/apikey> y crear una **API key** (tiene capa gratuita).
2. Guardarla en la variable de entorno `GEMINI_API_KEY` antes de iniciar el backend (ver paso 4).

Si no se configura la llave, todo funciona menos MIGO IA, que responde: *"MIGO IA no está configurado en el servidor."*

---

## 4. Ejecutar el backend (Ktor)

Desde la carpeta `MigoBackend`:

**Windows (PowerShell)**

```powershell
$env:GEMINI_API_KEY="tu_api_key"
.\gradlew.bat run
```

**macOS / Linux**

```bash
export GEMINI_API_KEY="tu_api_key"
./gradlew run
```

**IntelliJ:** abrir la carpeta `MigoBackend`, ejecutar la tarea Gradle `run` y agregar `GEMINI_API_KEY` en *Run Configuration → Environment variables*.

Cuando el servidor está listo aparece `Responding at http://0.0.0.0:8080`.
Para probar los endpoints se puede usar el archivo `MigoBackend/pruebas.http` (IntelliJ) o Postman.

---

## 5. Ejecutar el frontend (React Native)

1. Desde la carpeta del frontend instalar las dependencias:

   ```bash
   npm install
   ```

2. Crear el archivo `.env` (copiando `.env.example`) con la dirección del backend:

   ```text
   EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api
   ```

   | Dónde se ejecuta la app | Valor de `EXPO_PUBLIC_API_URL` |
   | :--- | :--- |
   | Emulador de Android Studio | `http://10.0.2.2:8080/api` |
   | Celular con Expo Go (misma red WiFi) | `http://IP-DEL-COMPUTADOR:8080/api` (ver la IP con `ipconfig`) |
   | Navegador web (tecla `w`) | `http://localhost:8080/api` |

3. Iniciar Expo:

   ```bash
   npx expo start
   ```

   Tecla `a` para el emulador Android o escanear el QR con Expo Go.

---

## 6. Orden de ejecución completo

1. Base de datos: proyecto de Firebase creado y `serviceAccountKey.json` en su lugar.
2. Backend: `gradlew run` (con `GEMINI_API_KEY`).
3. Frontend: `.env` configurado y `npx expo start`.
4. Verificar la conexión: crear una cuenta en la app; el usuario aparece en Firestore, colección `usuarios`.
5. Probar: registrar una mascota, crear una actividad, marcarla como completada, agregar una vacuna y preguntarle algo a MIGO IA.

---

## 7. Endpoints de la API

Todas las rutas empiezan por `http://SERVIDOR:8080/api`. Las respuestas son JSON; los errores llegan como `{"mensaje": "..."}`.

| Código | Endpoint | Método | Descripción |
| :--- | :--- | :--- | :--- |
| API-01 | `/auth/registro` | POST | Crear cuenta (201) |
| API-02 | `/auth/login` | POST | Iniciar sesión (401 si los datos no coinciden) |
| API-03 | `/usuarios/{id}` | GET | Consultar perfil |
| API-04 | `/usuarios/{id}` | PUT | Editar perfil y preferencias |
| API-05 | `/mascotas` | POST | Registrar mascota (201) |
| API-06 | `/mascotas?usuarioId=` | GET | Mascotas del usuario |
| API-07 | `/mascotas/{id}` | GET | Una mascota |
| API-08 | `/mascotas/{id}` | PUT | Editar mascota |
| API-09 | `/mascotas/{id}/historial` | POST | Agregar vacuna, cita o peso (201) |
| API-10 | `/mascotas/{id}/historial` | GET | Historial médico |
| API-11 | `/actividades` | POST | Registrar actividad (201) |
| API-12 | `/actividades?usuarioId=` | GET | Actividades del usuario |
| API-13 | `/actividades/{id}` | PUT | Editar actividad |
| API-14 | `/actividades/{id}/completada?usuarioId=` | PUT | Marcar o desmarcar completada |
| API-15 | `/actividades/{id}?usuarioId=` | DELETE | Eliminar actividad |
| API-16 | `/ia/chat` | POST | Preguntar a MIGO IA |

Códigos HTTP usados: 200, 201, 400 (datos inválidos), 401 (login incorrecto), 404 (no existe), 409 (correo repetido), 500 (error interno) y 503 (MIGO IA no disponible).

---

## 8. Estructura de carpetas

**Frontend (React Native)**

```text
Migo/
├── App.js                  # Punto de entrada: login/registro o pantallas principales
├── screens/                # Una pantalla por archivo (Inicio, Mascotas, Horario, MIGO IA, Perfil, Login, Registro)
├── components/             # Componentes reutilizables (PetCard, ActivityRow, botones, encabezados)
├── navigation/             # Barra de navegación inferior
└── services/               # Comunicación con el backend
    ├── api.js              # URL base y función peticion() (fetch + manejo de errores)
    ├── sesionService.js    # Guarda el usuario que inició sesión (AsyncStorage)
    ├── usuarioService.js   # Registro, login y perfil
    ├── mascotasService.js  # Mascotas e historial médico
    ├── actividadesService.js
    └── iaService.js        # MIGO IA
```

**Backend (Ktor)** – misma organización del ejemplo de la clase

```text
MigoBackend/src/main/kotlin/com/migo/
├── main.kt          # Configuración del servidor (CORS, módulos)
├── config/          # Firebase, serialización JSON y manejo de errores
├── models/          # Clases de datos (Usuario, Mascota, Actividad, RegistroHistorial, Chat)
├── routes/          # Endpoints /api/... (reciben la petición y responden)
├── service/         # Reglas de negocio y validaciones (+ IaService para Gemini)
└── repository/      # Lectura y escritura en Firestore
```

Flujo de una petición: **routes → service → repository → Firestore**.

---

## 9. Seguridad implementada

- Las contraseñas se guardan cifradas con PBKDF2 y una sal aleatoria; nunca se devuelven en las respuestas.
- Validación de datos en la app (campos en rojo) y otra vez en el backend antes de guardar.
- Las llaves (`serviceAccountKey.json` y `GEMINI_API_KEY`) no están en el código ni en el repositorio.
- Los errores inesperados responden "Error interno del servidor", sin mostrar detalles técnicos.
- Cada actividad y mascota solo la puede modificar su dueño (`usuarioId`).
- MIGO IA tiene instrucciones para no diagnosticar ni recetar y recomendar al veterinario en casos urgentes.

**Mejoras futuras:** autenticación con tokens (JWT), HTTPS en un servidor publicado y verificación del correo.
