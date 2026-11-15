package com.migo.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import java.io.File
import java.io.FileInputStream

// Ruta de la llave de Firebase. Se puede cambiar con la variable FIREBASE_CREDENTIALS.
private val rutaCredenciales =
    System.getenv("FIREBASE_CREDENTIALS") ?: "src/main/resources/serviceAccountKey.json"

fun initFirebase() {
    if (FirebaseApp.getApps().isEmpty()) { // evita inicializar dos veces

        val archivo = File(rutaCredenciales)
        if (!archivo.exists()) {
            error("No se encontró la llave de Firebase en '$rutaCredenciales'. Revisa el README.")
        }

        val options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(FileInputStream(archivo)))
            .build()

        FirebaseApp.initializeApp(options)
    }
}
