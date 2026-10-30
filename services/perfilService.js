// Datos simulados del perfil (preparado para futura API Ktor)

const usuarioMock = {
  nombre: 'Paula Martinez',
  email: 'paula@email.com',
  mascotas: 2,
  emoji: '👩🏻',
};

const estadisticasMock = {
  actividadesRealizadas: 127,
  tasaCumplimiento: 94,
  diasSeguimiento: 38,
};

const preferenciasMock = {
  recordatorios: true,
  tiempoRecordatorio: '15',
  notificacionesPush: true,
  modoSilencioso: false,
  horaInicioSilencio: '10:00 p. m.',
  horaFinSilencio: '7:00 a. m.',
};

const notificacionesMock = [
  {
    id: 1,
    icono: '🔔',
    titulo: 'Es hora de Thyro Tabs',
    subtitulo: 'Max • Hace 2 horas',
  },
  {
    id: 2,
    icono: '📅',
    titulo: 'Recordatorio de cita',
    subtitulo: 'Max • Tiene cita mañana a las 10:00 a. m.',
  },
  {
    id: 3,
    icono: '⚖️',
    titulo: 'Control de peso',
    subtitulo: 'Hoy corresponde registrar el peso de Max',
  },
];

export const obtenerPerfil = async () => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          usuario: { ...usuarioMock },
          estadisticas: { ...estadisticasMock },
          preferencias: { ...preferenciasMock },
          notificaciones: notificacionesMock.map((n) => ({ ...n })),
        }),
      250
    );
  });
};