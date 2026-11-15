package com.migo.models

import kotlinx.serialization.Serializable

// Un registro del historial médico de una mascota.
// "categoria" indica qué tipo de registro es: vacuna, cita o peso.
@Serializable
data class RegistroHistorial(
    val id: String = "",
    val mascotaId: String = "",
    val categoria: String = "",
    val nombre: String = "",       // vacuna: nombre de la vacuna / cita: tipo de cita
    val fecha: String = "",        // vacuna y cita
    val estado: String = "",       // vacuna: Al día o Pendiente / cita: Próxima
    val hora: String = "",         // cita
    val veterinario: String = "",  // cita
    val mes: String = "",          // peso
    val valor: Double? = null      // peso en kg
)
