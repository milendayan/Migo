package com.migo.service

import com.migo.config.NoEncontrado
import com.migo.config.SolicitudInvalida
import com.migo.models.Mascota
import com.migo.repository.MascotaRepository

// Reglas de negocio de las mascotas
class MascotaService {

    private val repo = MascotaRepository()
    private val formatoFecha = Regex("^\\d{4}-\\d{2}-\\d{2}$") // AAAA-MM-DD

    fun listar(usuarioId: String): List<Mascota> =
        repo.listarPorUsuario(usuarioId).sortedBy { it.nombre }

    fun obtener(id: String): Mascota =
        repo.buscarPorId(id) ?: throw NoEncontrado("Mascota no encontrada.")

    fun crear(mascota: Mascota): Mascota {
        val limpia = validar(mascota)
        return repo.guardar(limpia)
    }

    fun actualizar(id: String, mascota: Mascota): Mascota {
        val actual = obtener(id)
        if (actual.usuarioId != mascota.usuarioId)
            throw NoEncontrado("Mascota no encontrada.") // no es del usuario
        val limpia = validar(mascota).copy(id = id)
        repo.actualizar(id, limpia)
        return limpia
    }

    private fun validar(m: Mascota): Mascota {
        if (m.usuarioId.isBlank()) throw SolicitudInvalida("Falta el usuario.")
        if (m.nombre.isBlank()) throw SolicitudInvalida("El nombre es obligatorio.")
        if (m.especie.isBlank()) throw SolicitudInvalida("La especie es obligatoria.")
        if (m.fechaNacimiento.isNotBlank() && !formatoFecha.matches(m.fechaNacimiento))
            throw SolicitudInvalida("La fecha de nacimiento no es válida.")
        if (m.peso != null && m.peso <= 0)
            throw SolicitudInvalida("Ingresa un peso válido. Ejemplo: 28.5")

        return m.copy(
            nombre = m.nombre.trim(),
            especie = m.especie.trim(),
            raza = m.raza.trim(),
            color = m.color.trim(),
            microchip = m.microchip.trim(),
            notas = m.notas.trim()
        )
    }
}
