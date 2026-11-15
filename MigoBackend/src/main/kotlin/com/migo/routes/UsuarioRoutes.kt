package com.migo.routes

import com.migo.models.LoginRequest
import com.migo.models.RegistroRequest
import com.migo.models.Usuario
import com.migo.service.UsuarioService
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.usuarioRoutes() {
    val service = UsuarioService()

    // POST /api/auth/registro -> crea una cuenta
    post("/auth/registro") {
        val datos = call.receive<RegistroRequest>()
        call.respond(HttpStatusCode.Created, service.registrar(datos))
    }

    // POST /api/auth/login -> inicia sesión
    post("/auth/login") {
        val datos = call.receive<LoginRequest>()
        call.respond(service.login(datos))
    }

    // GET /api/usuarios/{id} -> datos del perfil
    get("/usuarios/{id}") {
        call.respond(service.obtener(call.parametro("id")))
    }

    // PUT /api/usuarios/{id} -> edita perfil y preferencias
    put("/usuarios/{id}") {
        val datos = call.receive<Usuario>()
        call.respond(service.actualizar(call.parametro("id"), datos))
    }
}
