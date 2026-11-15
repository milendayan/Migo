package com.migo.models

import kotlinx.serialization.Serializable

// Respuesta simple, por ejemplo {"mensaje": "Actividad eliminada"}
@Serializable
data class Mensaje(val mensaje: String)
