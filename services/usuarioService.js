import { peticion } from './api';
import { guardarSesion, idUsuario } from './sesionService';

// POST /api/auth/registro
export const registrarUsuario = async (nombre, email, password) => {
  const usuario = await peticion('/auth/registro', 'POST', {
    nombre,
    email,
    password,
  });
  await guardarSesion(usuario); // queda con la sesión iniciada
  return usuario;
};

// POST /api/auth/login
export const iniciarSesionUsuario = async (email, password) => {
  const usuario = await peticion('/auth/login', 'POST', { email, password });
  await guardarSesion(usuario);
  return usuario;
};

// GET /api/usuarios/{id}
export const obtenerPerfil = () => peticion(`/usuarios/${idUsuario()}`);

// PUT /api/usuarios/{id}  (datos y preferencias del perfil)
export const actualizarPerfil = async (datos) => {
  const usuario = await peticion(`/usuarios/${idUsuario()}`, 'PUT', datos);
  await guardarSesion(usuario);
  return usuario;
};
