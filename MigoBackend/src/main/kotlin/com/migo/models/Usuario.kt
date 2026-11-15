package com.migo.models

import kotlinx.serialization.Serializable

// Datos del usuario que se envían a la app (nunca incluye la contraseña)
@Serializable
data class Usuario(
    val id: String = "",
    val nombre: String = "",
    val email: String = "",
    // Preferencias de la pantalla Mi perfil
    val recordatorios: Boolean = true,
    val tiempoRecordatorio: String = "15",
    val notificacionesPush: Boolean = true,
    val modoSilencioso: Boolean = false,
    val horaInicioSilencio: String = "10:00 p. m.",
    val horaFinSilencio: String = "7:00 a. m."
)

// Lo que envía la pantalla de Registro
@Serializable
data class RegistroRequest(
    val nombre: String = "",
    val email: String = "",
    val password: String = ""
)

// Lo que envía la pantalla de Login
@Serializable
data class LoginRequest(
    val email: String = "",
    val password: String = ""
)
