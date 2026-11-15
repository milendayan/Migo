import AsyncStorage from '@react-native-async-storage/async-storage';

// Guarda en el celular el usuario que inició sesión,
// para no pedir el login cada vez que se abre la app.
const CLAVE = 'migo_usuario';

let usuarioActual = null;
let oyentes = [];

const avisar = () => oyentes.forEach((funcion) => funcion(usuarioActual));

export const cargarSesion = async () => {
  const texto = await AsyncStorage.getItem(CLAVE);
  usuarioActual = texto ? JSON.parse(texto) : null;
  return usuarioActual;
};

export const guardarSesion = async (usuario) => {
  usuarioActual = usuario;
  await AsyncStorage.setItem(CLAVE, JSON.stringify(usuario));
  avisar();
};

export const cerrarSesion = async () => {
  usuarioActual = null;
  await AsyncStorage.removeItem(CLAVE);
  avisar();
};

export const obtenerUsuarioActual = () => usuarioActual;

// Id del usuario para enviarlo al backend
export const idUsuario = () => {
  if (!usuarioActual) throw new Error('Debes iniciar sesión.');
  return usuarioActual.id;
};

// App.js usa esto para saber cuándo alguien inicia o cierra sesión
export const escucharSesion = (funcion) => {
  oyentes.push(funcion);
  return () => {
    oyentes = oyentes.filter((f) => f !== funcion);
  };
};
