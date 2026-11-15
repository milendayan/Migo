package com.migo.models

import kotlinx.serialization.Serializable

@Serializable
data class Actividad(
    val id: String = "",
    val usuarioId: String = "",
    val mascotaId: String = "",
    val mascotaNombre: String = "",  // lo completa el servidor al consultar
    val nombre: String = "",
    val tipo: String = "",           // Medicamento, Alimentación, Paseo, Higiene, Cita veterinaria
    val fecha: String = "",          // formato AAAA-MM-DD
    val hora: String = "",           // formato HH:MM (24 horas)
    val repetir: String = "Una vez", // Una vez, Diario, Semanal
    val recordatorioActivo: Boolean = true,
    val minutosAntes: Int = 15,
    val notas: String = "",
    val completada: Boolean = false
)

// Cuerpo para marcar o desmarcar una actividad como completada
@Serializable
data class CambioCompletada(val completada: Boolean = false)
