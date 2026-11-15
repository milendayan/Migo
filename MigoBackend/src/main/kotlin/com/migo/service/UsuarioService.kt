package com.migo.service

import com.migo.config.Conflicto
import com.migo.config.NoAutorizado
import com.migo.config.NoEncontrado
import com.migo.config.SolicitudInvalida
import com.migo.models.LoginRequest
import com.migo.models.RegistroRequest
import com.migo.models.Usuario
import com.migo.repository.UsuarioRepository
import java.security.SecureRandom
import java.util.Base64
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec

// Reglas de negocio de los usuarios: registro, login y perfil
class UsuarioService {

    private val repo = UsuarioRepository()
    private val formatoEmail = Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")

    fun registrar(datos: RegistroRequest): Usuario {
        val nombre = datos.nombre.trim()
        val email = datos.email.trim().lowercase()

        if (nombre.isBlank() || email.isBlank() || datos.password.isBlank())
            throw SolicitudInvalida("Todos los campos son obligatorios.")
        if (!formatoEmail.matches(email))
            throw SolicitudInvalida("Ingresa un correo electrónico válido.")
        if (datos.password.length < 8)
            throw SolicitudInvalida("La contraseña debe tener mínimo 8 caracteres.")
        if (repo.buscarPorEmail(email) != null)
            throw Conflicto("Ya existe una cuenta con ese correo.")

        val usuario = Usuario(nombre = nombre, email = email)
        return repo.guardar(usuario, cifrarPassword(datos.password))
    }

    fun login(datos: LoginRequest): Usuario {
        val email = datos.email.trim().lowercase()
        if (email.isBlank() || datos.password.isBlank())
            throw SolicitudInvalida("Completa todos los campos.")

        val usuario = repo.buscarPorEmail(email)
            ?: throw NoAutorizado("Correo o contraseña incorrectos.")

        if (!verificarPassword(datos.password, repo.obtenerPassword(usuario.id)))
            throw NoAutorizado("Correo o contraseña incorrectos.")

        return usuario
    }

    fun obtener(id: String): Usuario =
        repo.buscarPorId(id) ?: throw NoEncontrado("Usuario no encontrado.")

    fun actualizar(id: String, datos: Usuario): Usuario {
        obtener(id) // verifica que exista
        val nombre = datos.nombre.trim()
        val email = datos.email.trim().lowercase()

        if (nombre.isBlank()) throw SolicitudInvalida("El nombre es obligatorio.")
        if (!formatoEmail.matches(email)) throw SolicitudInvalida("Correo no válido.")

        val otro = repo.buscarPorEmail(email)
        if (otro != null && otro.id != id) throw Conflicto("Ese correo ya está en uso.")

        val actualizado = datos.copy(id = id, nombre = nombre, email = email)
        repo.actualizar(id, actualizado)
        return actualizado
    }

    // ---- Contraseñas: nunca se guardan en texto plano ----
    // Se usa PBKDF2 con una "sal" aleatoria. Se guarda como "sal:hash".

    private fun cifrarPassword(password: String): String {
        val sal = ByteArray(16).also { SecureRandom().nextBytes(it) }
        val hash = calcularHash(password, sal)
        val b64 = Base64.getEncoder()
        return b64.encodeToString(sal) + ":" + b64.encodeToString(hash)
    }

    private fun verificarPassword(password: String, guardada: String): Boolean {
        val partes = guardada.split(":")
        if (partes.size != 2) return false
        val sal = Base64.getDecoder().decode(partes[0])
        val hashGuardado = Base64.getDecoder().decode(partes[1])
        return calcularHash(password, sal).contentEquals(hashGuardado)
    }

    private fun calcularHash(password: String, sal: ByteArray): ByteArray {
        val spec = PBEKeySpec(password.toCharArray(), sal, 100_000, 256)
        return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).encoded
    }
}
