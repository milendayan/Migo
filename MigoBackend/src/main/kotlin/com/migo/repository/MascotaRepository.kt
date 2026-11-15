package com.migo.repository

import com.google.cloud.firestore.DocumentSnapshot
import com.google.firebase.cloud.FirestoreClient
import com.migo.models.Mascota

// Acceso a la colección "mascotas" de Firestore
class MascotaRepository {

    private val coleccion = FirestoreClient.getFirestore().collection("mascotas")

    fun listarPorUsuario(usuarioId: String): List<Mascota> {
        val docs = coleccion.whereEqualTo("usuarioId", usuarioId).get().get().documents
        return docs.map { aMascota(it) }
    }

    fun buscarPorId(id: String): Mascota? {
        val doc = coleccion.document(id).get().get()
        return if (doc.exists()) aMascota(doc) else null
    }

    fun guardar(mascota: Mascota): Mascota {
        val doc = coleccion.document() // Firestore genera el id
        doc.set(aMapa(mascota)).get()
        return mascota.copy(id = doc.id)
    }

    fun actualizar(id: String, mascota: Mascota) {
        coleccion.document(id).set(aMapa(mascota)).get()
    }

    private fun aMapa(m: Mascota): Map<String, Any?> = mapOf(
        "usuarioId" to m.usuarioId,
        "nombre" to m.nombre,
        "especie" to m.especie,
        "raza" to m.raza,
        "sexo" to m.sexo,
        "fechaNacimiento" to m.fechaNacimiento,
        "peso" to m.peso,
        "color" to m.color,
        "microchip" to m.microchip,
        "notas" to m.notas
    )

    private fun aMascota(doc: DocumentSnapshot) = Mascota(
        id = doc.id,
        usuarioId = doc.getString("usuarioId") ?: "",
        nombre = doc.getString("nombre") ?: "",
        especie = doc.getString("especie") ?: "",
        raza = doc.getString("raza") ?: "",
        sexo = doc.getString("sexo") ?: "",
        fechaNacimiento = doc.getString("fechaNacimiento") ?: "",
        peso = doc.getDouble("peso"),
        color = doc.getString("color") ?: "",
        microchip = doc.getString("microchip") ?: "",
        notas = doc.getString("notas") ?: ""
    )
}
