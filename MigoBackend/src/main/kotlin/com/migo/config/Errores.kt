package com.migo.config

import com.migo.models.Mensaje
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*

// Errores propios del negocio. Cada uno corresponde a un código HTTP.
class SolicitudInvalida(mensaje: String) : Exception(mensaje)    // 400
class NoAutorizado(mensaje: String) : Exception(mensaje)         // 401
class NoEncontrado(mensaje: String) : Exception(mensaje)         // 404
class Conflicto(mensaje: String) : Exception(mensaje)            // 409
class ServicioNoDisponible(mensaje: String) : Exception(mensaje) // 503

// Si en cualquier parte se lanza uno de estos errores,
// Ktor responde con el código y un JSON {"mensaje": "..."}
fun Application.configureErrores() {
    install(StatusPages) {
        exception<SolicitudInvalida> { call, e ->
            call.respond(HttpStatusCode.BadRequest, Mensaje(e.message ?: "Solicitud inválida"))
        }
        exception<NoAutorizado> { call, e ->
            call.respond(HttpStatusCode.Unauthorized, Mensaje(e.message ?: "No autorizado"))
        }
        exception<NoEncontrado> { call, e ->
            call.respond(HttpStatusCode.NotFound, Mensaje(e.message ?: "No encontrado"))
        }
        exception<Conflicto> { call, e ->
            call.respond(HttpStatusCode.Conflict, Mensaje(e.message ?: "Conflicto"))
        }
        exception<ServicioNoDisponible> { call, e ->
            call.respond(HttpStatusCode.ServiceUnavailable, Mensaje(e.message ?: "Servicio no disponible"))
        }
        // JSON mal formado o con campos de tipo incorrecto
        exception<BadRequestException> { call, _ ->
            call.respond(HttpStatusCode.BadRequest, Mensaje("Los datos enviados no tienen el formato correcto"))
        }
        // Cualquier otro error: no se muestra el detalle al usuario
        exception<Throwable> { call, e ->
            call.application.environment.log.error("Error inesperado", e)
            call.respond(HttpStatusCode.InternalServerError, Mensaje("Error interno del servidor"))
        }
    }
}
