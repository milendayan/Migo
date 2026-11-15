package com.migo.repository

import com.google.cloud.firestore.DocumentSnapshot
import com.google.firebase.cloud.FirestoreClient
import com.migo.models.Usuario

// Acceso a la colección "usuarios" de Firestore
class UsuarioRepository {

    private val coleccion = FirestoreClient.getFirestore().collection("usuarios")

    fun buscarPorId(id: String): Usuario? {
        val doc = coleccion.document(id).get().get()
        return if (doc.exists()) aUsuario(doc) else null
    }

    fun buscarPorEmail(email: String): Usuario? {
        val docs = coleccion.whereEqualTo("email", email).get().get().documents
        return docs.firstOrNull()?.let { aUsuario(it) }
    }

    // Devuelve la contraseña cifrada guardada (solo se usa para el login)
    fun obtenerPassword(id: String): String {
        return coleccion.document(id).get().get().getString("password") ?: ""
    }

    fun guardar(usuario: Usuario, passwordCifrada: String): Usuario {
        val doc = coleccion.document() // Firestore genera el id
        val datos = aMapa(usuario) + ("password" to passwordCifrada)
        doc.set(datos).get()
        return usuario.copy(id = doc.id)
    }

    // Actualiza datos y preferencias, sin tocar la contraseña
    fun actualizar(id: String, usuario: Usuario) {
        coleccion.document(id).update(aMapa(usuario)).get()
    }

    private fun aMapa(u: Usuario): Map<String, Any> = mapOf(
        "nombre" to u.nombre,
        "email" to u.email,
        "recordatorios" to u.recordatorios,
        "tiempoRecordatorio" to u.tiempoRecordatorio,
        "notificacionesPush" to u.notificacionesPush,
        "modoSilencioso" to u.modoSilencioso,
        "horaInicioSilencio" to u.horaInicioSilencio,
        "horaFinSilencio" to u.horaFinSilencio
    )

    private fun aUsuario(doc: DocumentSnapshot) = Usuario(
        id = doc.id,
        nombre = doc.getString("nombre") ?: "",
        email = doc.getString("email") ?: "",
        recordatorios = doc.getBoolean("recordatorios") ?: true,
        tiempoRecordatorio = doc.getString("tiempoRecordatorio") ?: "15",
        notificacionesPush = doc.getBoolean("notificacionesPush") ?: true,
        modoSilencioso = doc.getBoolean("modoSilencioso") ?: false,
        horaInicioSilencio = doc.getString("horaInicioSilencio") ?: "10:00 p. m.",
        horaFinSilencio = doc.getString("horaFinSilencio") ?: "7:00 a. m."
    )
}
