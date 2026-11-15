package com.migo.service

import com.migo.config.ServicioNoDisponible
import com.migo.config.SolicitudInvalida
import com.migo.models.MensajeChat
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.serialization.json.*
import org.slf4j.LoggerFactory

// MIGO IA: envía la conversación a la API de Google Gemini y devuelve la respuesta.
// La llave se lee de la variable de entorno GEMINI_API_KEY (nunca va en el código).
class IaService {

    private val log = LoggerFactory.getLogger("MIGO-IA")
    private val apiKey = System.getenv("GEMINI_API_KEY") ?: ""
    private val modelo = System.getenv("GEMINI_MODEL") ?: "gemini-2.5-flash"
    private val cliente = HttpClient(CIO)

    // Instrucciones fijas: cómo debe comportarse el asistente
    private val instrucciones = """
        Eres MIGO IA, el asistente de bienestar de la app MIGO para dueños de perros y gatos.
        Responde siempre en español, con un tono amable y claro, en máximo 120 palabras.
        Da solo orientación general sobre el cuidado básico de mascotas
        (alimentación, higiene, paseos, vacunas, comportamiento).
        No diagnostiques enfermedades ni indiques medicamentos o dosis.
        Si hay señales de urgencia (sangrado, dificultad para respirar, convulsiones,
        envenenamiento, vómito o diarrea persistentes) recomienda ir al veterinario de inmediato.
        Si la pregunta no trata sobre mascotas, indica amablemente que solo puedes ayudar
        con el cuidado de mascotas.
    """.trimIndent()

    suspend fun responder(mensajes: List<MensajeChat>): String {
        val pregunta = mensajes.lastOrNull()
        if (pregunta == null || pregunta.rol != "usuario" || pregunta.texto.isBlank())
            throw SolicitudInvalida("Escribe una pregunta.")
        if (pregunta.texto.length > 1000)
            throw SolicitudInvalida("La pregunta es muy larga (máximo 1000 caracteres).")
        if (apiKey.isBlank())
            throw ServicioNoDisponible("MIGO IA no está configurado en el servidor.")

        // Se envían los últimos 10 mensajes para que entienda el contexto.
        // Gemini exige que la conversación empiece con un mensaje del usuario.
        val historial = mensajes.takeLast(10).dropWhile { it.rol != "usuario" }

        // Cuerpo JSON que pide la API de Gemini
        val cuerpo = buildJsonObject {
            putJsonObject("system_instruction") {
                putJsonArray("parts") { addJsonObject { put("text", instrucciones) } }
            }
            putJsonArray("contents") {
                historial.forEach { m ->
                    addJsonObject {
                        put("role", if (m.rol == "usuario") "user" else "model")
                        putJsonArray("parts") { addJsonObject { put("text", m.texto) } }
                    }
                }
            }
        }

        val respuesta = try {
            cliente.post(
                "https://generativelanguage.googleapis.com/v1beta/models/$modelo:generateContent"
            ) {
                header("x-goog-api-key", apiKey)
                contentType(ContentType.Application.Json)
                setBody(cuerpo.toString())
            }
        } catch (e: java.io.IOException) { // sin internet o Gemini no responde
            log.error("No se pudo conectar con Gemini", e)
            throw ServicioNoDisponible("MIGO IA no está disponible. Revisa la conexión a internet.")
        }

        if (!respuesta.status.isSuccess()) {
            log.error("Gemini respondió ${respuesta.status}: ${respuesta.bodyAsText()}")
            throw ServicioNoDisponible("MIGO IA no pudo responder en este momento. Intenta de nuevo.")
        }

        // Se toma el texto de: candidates[0].content.parts[0].text
        val json = Json.parseToJsonElement(respuesta.bodyAsText()).jsonObject
        val texto = json["candidates"]?.jsonArray?.firstOrNull()?.jsonObject
            ?.get("content")?.jsonObject
            ?.get("parts")?.jsonArray?.firstOrNull()?.jsonObject
            ?.get("text")?.jsonPrimitive?.contentOrNull

        return texto?.trim() ?: "No pude generar una respuesta. Intenta escribir tu pregunta de otra forma."
    }
}
