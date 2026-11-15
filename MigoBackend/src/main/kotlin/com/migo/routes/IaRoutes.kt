package com.migo.routes

import com.migo.models.ChatRequest
import com.migo.models.ChatResponse
import com.migo.service.IaService
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.iaRoutes() {
    val service = IaService()

    // POST /api/ia/chat -> pregunta a MIGO IA
    post("/ia/chat") {
        val datos = call.receive<ChatRequest>()
        call.respond(ChatResponse(service.responder(datos.mensajes)))
    }
}
