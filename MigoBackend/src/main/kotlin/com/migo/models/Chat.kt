package com.migo.models

import kotlinx.serialization.Serializable

// Un mensaje de la conversación. rol = "usuario" o "migo"
@Serializable
data class MensajeChat(
    val rol: String = "usuario",
    val texto: String = ""
)

// La app envía la conversación y el servidor devuelve la respuesta de MIGO IA
@Serializable
data class ChatRequest(val mensajes: List<MensajeChat> = emptyList())

@Serializable
data class ChatResponse(val respuesta: String)
