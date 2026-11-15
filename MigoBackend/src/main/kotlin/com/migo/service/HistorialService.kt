package com.migo.service

import com.migo.config.NoEncontrado
import com.migo.config.SolicitudInvalida
import com.migo.models.RegistroHistorial
import com.migo.repository.HistorialRepository
import com.migo.repository.MascotaRepository

// Reglas de negocio del historial médico (vacunas, citas y peso)
class HistorialService {

    private val repo = HistorialRepository()
    private val mascotaRepo = MascotaRepository()

    fun listar(mascotaId: String): List<RegistroHistorial> {
        verificarMascota(mascotaId)
        return repo.listarPorMascota(mascotaId)
    }

    fun crear(mascotaId: String, registro: RegistroHistorial): RegistroHistorial {
        verificarMascota(mascotaId)

        // Cada categoría tiene sus campos obligatorios
        when (registro.categoria) {
            "vacuna" -> if (registro.nombre.isBlank() || registro.fecha.isBlank())
                throw SolicitudInvalida("El nombre y la fecha de la vacuna son obligatorios.")
            "cita" -> if (registro.nombre.isBlank() || registro.fecha.isBlank())
                throw SolicitudInvalida("El tipo y la fecha de la cita son obligatorios.")
            "peso" -> if (registro.mes.isBlank() || registro.valor == null || registro.valor <= 0)
                throw SolicitudInvalida("Ingresa el mes y un peso válido.")
            else -> throw SolicitudInvalida("La categoría debe ser vacuna, cita o peso.")
        }

        return repo.guardar(registro.copy(mascotaId = mascotaId))
    }

    private fun verificarMascota(mascotaId: String) {
        if (mascotaRepo.buscarPorId(mascotaId) == null)
            throw NoEncontrado("Mascota no encontrada.")
    }
}
