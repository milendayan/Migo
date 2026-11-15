package com.migo

import com.migo.config.configureErrores
import com.migo.config.configureSerialization
import com.migo.config.initFirebase
import com.migo.routes.configureRoutes
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*

// Punto de entrada: Ktor lee el puerto y el módulo desde application.yaml
fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {

    // Permite que la app (Expo) haga peticiones al servidor
    install(CORS) {
        anyHost()
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowHeader(HttpHeaders.ContentType)
    }

    initFirebase()           // 1. Conexión con Firestore
    configureSerialization() // 2. JSON
    configureErrores()       // 3. Respuestas de error
    configureRoutes()        // 4. Endpoints /api/...
}
