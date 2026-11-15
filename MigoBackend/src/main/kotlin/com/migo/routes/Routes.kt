package com.migo.routes

import com.migo.config.SolicitudInvalida
import io.ktor.server.application.*
import io.ktor.server.routing.*

// Registra todas las rutas bajo /api
fun Application.configureRoutes() {
    routing {
        route("/api") {
            usuarioRoutes()
            mascotaRoutes()
            actividadRoutes()
            iaRoutes()
        }
    }
}

// Lee un parámetro de la ruta, por ejemplo el {id} de /api/mascotas/{id}
fun ApplicationCall.parametro(nombre: String): String =
    parameters[nombre]?.takeIf { it.isNotBlank() }
        ?: throw SolicitudInvalida("Falta el parámetro '$nombre'.")

// Lee un parámetro de la URL, por ejemplo ?usuarioId=abc
fun ApplicationCall.query(nombre: String): String =
    request.queryParameters[nombre]?.takeIf { it.isNotBlank() }
        ?: throw SolicitudInvalida("Falta el parámetro '$nombre'.")
