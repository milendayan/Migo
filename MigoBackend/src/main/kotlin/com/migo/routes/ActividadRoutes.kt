package com.migo.routes

import com.migo.models.Actividad
import com.migo.models.CambioCompletada
import com.migo.models.Mensaje
import com.migo.service.ActividadService
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.actividadRoutes() {
    val service = ActividadService()

    route("/actividades") {

        // GET /api/actividades?usuarioId=... -> actividades del usuario
        get {
            call.respond(service.listar(call.query("usuarioId")))
        }

        // POST /api/actividades -> registra una actividad
        post {
            val actividad = call.receive<Actividad>()
            call.respond(HttpStatusCode.Created, service.crear(actividad))
        }

        // PUT /api/actividades/{id} -> edita una actividad
        put("{id}") {
            val actividad = call.receive<Actividad>()
            call.respond(service.actualizar(call.parametro("id"), actividad))
        }

        // PUT /api/actividades/{id}/completada?usuarioId=... -> marca o desmarca
        put("{id}/completada") {
            val cambio = call.receive<CambioCompletada>()
            service.cambiarCompletada(call.parametro("id"), call.query("usuarioId"), cambio.completada)
            call.respond(Mensaje("Actividad actualizada"))
        }

        // DELETE /api/actividades/{id}?usuarioId=... -> elimina
        delete("{id}") {
            service.eliminar(call.parametro("id"), call.query("usuarioId"))
            call.respond(Mensaje("Actividad eliminada"))
        }
    }
}
