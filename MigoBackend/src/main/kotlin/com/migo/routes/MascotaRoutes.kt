package com.migo.routes

import com.migo.models.Mascota
import com.migo.models.RegistroHistorial
import com.migo.service.HistorialService
import com.migo.service.MascotaService
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.mascotaRoutes() {
    val service = MascotaService()
    val historialService = HistorialService()

    route("/mascotas") {

        // GET /api/mascotas?usuarioId=... -> mascotas del usuario
        get {
            call.respond(service.listar(call.query("usuarioId")))
        }

        // GET /api/mascotas/{id} -> una mascota
        get("{id}") {
            call.respond(service.obtener(call.parametro("id")))
        }

        // POST /api/mascotas -> registra una mascota
        post {
            val mascota = call.receive<Mascota>()
            call.respond(HttpStatusCode.Created, service.crear(mascota))
        }

        // PUT /api/mascotas/{id} -> edita una mascota
        put("{id}") {
            val mascota = call.receive<Mascota>()
            call.respond(service.actualizar(call.parametro("id"), mascota))
        }

        // GET /api/mascotas/{id}/historial -> vacunas, citas y peso
        get("{id}/historial") {
            call.respond(historialService.listar(call.parametro("id")))
        }

        // POST /api/mascotas/{id}/historial -> agrega un registro al historial
        post("{id}/historial") {
            val registro = call.receive<RegistroHistorial>()
            call.respond(HttpStatusCode.Created, historialService.crear(call.parametro("id"), registro))
        }
    }
}
