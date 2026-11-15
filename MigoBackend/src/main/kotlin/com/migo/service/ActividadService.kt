package com.migo.service

import com.migo.config.NoEncontrado
import com.migo.config.SolicitudInvalida
import com.migo.models.Actividad
import com.migo.repository.ActividadRepository
import com.migo.repository.MascotaRepository

// Reglas de negocio de las actividades del horario
class ActividadService {

    private val repo = ActividadRepository()
    private val mascotaRepo = MascotaRepository()

    private val tipos = listOf("Medicamento", "Alimentación", "Paseo", "Higiene", "Cita veterinaria")
    private val formatoFecha = Regex("^\\d{4}-\\d{2}-\\d{2}$") // AAAA-MM-DD
    private val formatoHora = Regex("^([01]\\d|2[0-3]):[0-5]\\d$") // HH:MM

    // Lista ordenada por fecha y hora, con el nombre de la mascota
    fun listar(usuarioId: String): List<Actividad> {
        val nombres = mascotaRepo.listarPorUsuario(usuarioId).associate { it.id to it.nombre }
        return repo.listarPorUsuario(usuarioId)
            .map { it.copy(mascotaNombre = nombres[it.mascotaId] ?: "") }
            .sortedWith(compareBy({ it.fecha }, { it.hora }))
    }

    fun crear(actividad: Actividad): Actividad {
        val limpia = validar(actividad).copy(completada = false)
        val guardada = repo.guardar(limpia)
        return conNombreMascota(guardada)
    }

    fun actualizar(id: String, actividad: Actividad): Actividad {
        val actual = obtenerDelUsuario(id, actividad.usuarioId)
        val limpia = validar(actividad).copy(id = id, completada = actual.completada)
        repo.actualizar(id, limpia)
        return conNombreMascota(limpia)
    }

    fun cambiarCompletada(id: String, usuarioId: String, completada: Boolean) {
        obtenerDelUsuario(id, usuarioId)
        repo.cambiarCompletada(id, completada)
    }

    fun eliminar(id: String, usuarioId: String) {
        obtenerDelUsuario(id, usuarioId)
        repo.eliminar(id)
    }

    // Solo el dueño puede modificar o eliminar su actividad
    private fun obtenerDelUsuario(id: String, usuarioId: String): Actividad {
        val actividad = repo.buscarPorId(id)
        if (actividad == null || actividad.usuarioId != usuarioId)
            throw NoEncontrado("Actividad no encontrada.")
        return actividad
    }

    private fun validar(a: Actividad): Actividad {
        if (a.usuarioId.isBlank()) throw SolicitudInvalida("Falta el usuario.")

        if (a.mascotaId.isBlank()) throw SolicitudInvalida("Selecciona una mascota.")
        val mascota = mascotaRepo.buscarPorId(a.mascotaId)
        if (mascota == null || mascota.usuarioId != a.usuarioId)
            throw SolicitudInvalida("Selecciona una mascota.")

        if (a.nombre.isBlank()) throw SolicitudInvalida("El nombre de la actividad es obligatorio.")
        if (a.tipo !in tipos) throw SolicitudInvalida("Selecciona un tipo de actividad.")
        if (!formatoFecha.matches(a.fecha)) throw SolicitudInvalida("La fecha ingresada no es válida.")
        if (!formatoHora.matches(a.hora)) throw SolicitudInvalida("La hora ingresada no es válida.")
        if (a.minutosAntes < 0) throw SolicitudInvalida("El recordatorio no es válido.")

        return a.copy(nombre = a.nombre.trim(), notas = a.notas.trim())
    }

    private fun conNombreMascota(a: Actividad) =
        a.copy(mascotaNombre = mascotaRepo.buscarPorId(a.mascotaId)?.nombre ?: "")
}
