package com.migo.models

import kotlinx.serialization.Serializable

@Serializable
data class Mascota(
    val id: String = "",
    val usuarioId: String = "",       // dueño de la mascota
    val nombre: String = "",
    val especie: String = "",
    val raza: String = "",
    val sexo: String = "",
    val fechaNacimiento: String = "", // formato AAAA-MM-DD
    val peso: Double? = null,         // en kg
    val color: String = "",
    val microchip: String = "",
    val notas: String = ""
)
