package com.migo.repository

import com.google.cloud.firestore.DocumentSnapshot
import com.google.firebase.cloud.FirestoreClient
import com.migo.models.RegistroHistorial

// Acceso a la colección "historial" de Firestore (vacunas, citas y peso)
class HistorialRepository {

    private val coleccion = FirestoreClient.getFirestore().collection("historial")

    fun listarPorMascota(mascotaId: String): List<RegistroHistorial> {
        val docs = coleccion.whereEqualTo("mascotaId", mascotaId).get().get().documents
        return docs
            .sortedBy { it.getLong("creadoEn") ?: 0L } // del más antiguo al más reciente
            .map { aRegistro(it) }
    }

    fun guardar(registro: RegistroHistorial): RegistroHistorial {
        val doc = coleccion.document() // Firestore genera el id
        doc.set(aMapa(registro)).get()
        return registro.copy(id = doc.id)
    }

    private fun aMapa(r: RegistroHistorial): Map<String, Any?> = mapOf(
        "mascotaId" to r.mascotaId,
        "categoria" to r.categoria,
        "nombre" to r.nombre,
        "fecha" to r.fecha,
        "estado" to r.estado,
        "hora" to r.hora,
        "veterinario" to r.veterinario,
        "mes" to r.mes,
        "valor" to r.valor,
        "creadoEn" to System.currentTimeMillis() // para mantener el orden
    )

    private fun aRegistro(doc: DocumentSnapshot) = RegistroHistorial(
        id = doc.id,
        mascotaId = doc.getString("mascotaId") ?: "",
        categoria = doc.getString("categoria") ?: "",
        nombre = doc.getString("nombre") ?: "",
        fecha = doc.getString("fecha") ?: "",
        estado = doc.getString("estado") ?: "",
        hora = doc.getString("hora") ?: "",
        veterinario = doc.getString("veterinario") ?: "",
        mes = doc.getString("mes") ?: "",
        valor = doc.getDouble("valor")
    )
}
