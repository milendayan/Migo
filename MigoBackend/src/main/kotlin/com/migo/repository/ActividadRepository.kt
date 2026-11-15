package com.migo.repository

import com.google.cloud.firestore.DocumentSnapshot
import com.google.firebase.cloud.FirestoreClient
import com.migo.models.Actividad

// Acceso a la colección "actividades" de Firestore
class ActividadRepository {

    private val coleccion = FirestoreClient.getFirestore().collection("actividades")

    fun listarPorUsuario(usuarioId: String): List<Actividad> {
        val docs = coleccion.whereEqualTo("usuarioId", usuarioId).get().get().documents
        return docs.map { aActividad(it) }
    }

    fun buscarPorId(id: String): Actividad? {
        val doc = coleccion.document(id).get().get()
        return if (doc.exists()) aActividad(doc) else null
    }

    fun guardar(actividad: Actividad): Actividad {
        val doc = coleccion.document() // Firestore genera el id
        doc.set(aMapa(actividad)).get()
        return actividad.copy(id = doc.id)
    }

    fun actualizar(id: String, actividad: Actividad) {
        coleccion.document(id).set(aMapa(actividad)).get()
    }

    fun cambiarCompletada(id: String, completada: Boolean) {
        coleccion.document(id).update("completada", completada).get()
    }

    fun eliminar(id: String) {
        coleccion.document(id).delete().get()
    }

    private fun aMapa(a: Actividad): Map<String, Any> = mapOf(
        "usuarioId" to a.usuarioId,
        "mascotaId" to a.mascotaId,
        "nombre" to a.nombre,
        "tipo" to a.tipo,
        "fecha" to a.fecha,
        "hora" to a.hora,
        "repetir" to a.repetir,
        "recordatorioActivo" to a.recordatorioActivo,
        "minutosAntes" to a.minutosAntes,
        "notas" to a.notas,
        "completada" to a.completada
    )

    private fun aActividad(doc: DocumentSnapshot) = Actividad(
        id = doc.id,
        usuarioId = doc.getString("usuarioId") ?: "",
        mascotaId = doc.getString("mascotaId") ?: "",
        nombre = doc.getString("nombre") ?: "",
        tipo = doc.getString("tipo") ?: "",
        fecha = doc.getString("fecha") ?: "",
        hora = doc.getString("hora") ?: "",
        repetir = doc.getString("repetir") ?: "Una vez",
        recordatorioActivo = doc.getBoolean("recordatorioActivo") ?: true,
        minutosAntes = doc.getLong("minutosAntes")?.toInt() ?: 15,
        notas = doc.getString("notas") ?: "",
        completada = doc.getBoolean("completada") ?: false
    )
}
