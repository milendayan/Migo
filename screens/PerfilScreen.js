import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { obtenerPerfil } from '../services/perfilService';

export default function PerfilScreen() {
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    mascotas: 0,
    emoji: '👤',
  });
  const [estadisticas, setEstadisticas] = useState({
    actividadesRealizadas: 0,
    tasaCumplimiento: 0,
    diasSeguimiento: 0,
  });
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [recordatorios, setRecordatorios] = useState(true);
  const [tiempoRecordatorio, setTiempoRecordatorio] = useState('15');
  const [notificacionesPush, setNotificacionesPush] = useState(true);
  const [modoSilencioso, setModoSilencioso] = useState(false);
  const [horaInicioSilencio, setHoraInicioSilencio] = useState('10:00 p. m.');
  const [horaFinSilencio, setHoraFinSilencio] = useState('7:00 a. m.');

  const [modalEditar, setModalEditar] = useState(false);
  const [modalRecordatorio, setModalRecordatorio] = useState(false);
  const [modalSilencio, setModalSilencio] = useState(false);
  const [modalPrivacidad, setModalPrivacidad] = useState(false);
  const [modalAyuda, setModalAyuda] = useState(false);

  const [formPerfil, setFormPerfil] = useState({ nombre: '', email: '' });
  const [erroresPerfil, setErroresPerfil] = useState({});
  const [formSilencio, setFormSilencio] = useState({
    inicio: '10:00 p. m.',
    fin: '7:00 a. m.',
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerPerfil();
        setUsuario(data.usuario);
        setEstadisticas(data.estadisticas);
        setNotificaciones(data.notificaciones);
        setRecordatorios(data.preferencias.recordatorios);
        setTiempoRecordatorio(data.preferencias.tiempoRecordatorio);
        setNotificacionesPush(data.preferencias.notificacionesPush);
        setModoSilencioso(data.preferencias.modoSilencioso);
        setHoraInicioSilencio(data.preferencias.horaInicioSilencio);
        setHoraFinSilencio(data.preferencias.horaFinSilencio);
      } catch (e) {
        console.log('Error al cargar perfil:', e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const abrirEditar = () => {
    setFormPerfil({ nombre: usuario.nombre, email: usuario.email });
    setErroresPerfil({});
    setModalEditar(true);
  };

  const guardarPerfil = () => {
    const errores = {};
    if (!formPerfil.nombre.trim()) errores.nombre = 'El nombre es obligatorio';
    if (!formPerfil.email.trim()) errores.email = 'El correo es obligatorio';
    else if (!formPerfil.email.includes('@')) errores.email = 'Correo no válido';

    setErroresPerfil(errores);
    if (Object.keys(errores).length > 0) return;

    setUsuario({ ...usuario, nombre: formPerfil.nombre, email: formPerfil.email });
    setModalEditar(false);
  };

  const guardarSilencio = () => {
    setHoraInicioSilencio(formSilencio.inicio);
    setHoraFinSilencio(formSilencio.fin);
    setModalSilencio(false);
  };

  if (cargando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F4FCFA',
        }}
      >
        <Text style={{ color: '#71817E' }}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Mi perfil</Text>

        {/* Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.profileImage}>
            <Text style={styles.profileEmoji}>{usuario.emoji || '👤'}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{usuario.nombre}</Text>
            <Text style={styles.email}>{usuario.email}</Text>
            <Text style={styles.petsRegistered}>
              {usuario.mascotas} mascotas registradas
            </Text>
          </View>

          <Pressable style={styles.editButton} onPress={abrirEditar}>
            <Text style={styles.editText}>Editar</Text>
          </Pressable>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {estadisticas.actividadesRealizadas}
            </Text>
            <Text style={styles.statLabel}>
              Actividades{'\n'}realizadas
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{estadisticas.tasaCumplimiento}%</Text>
            <Text style={styles.statLabel}>
              Tasa de{'\n'}cumplimiento
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{estadisticas.diasSeguimiento}</Text>
            <Text style={styles.statLabel}>
              Días de{'\n'}seguimiento
            </Text>
          </View>
        </View>

        {/* Configuración */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONFIGURACIÓN</Text>

          {/* Recordatorios */}
          <View style={styles.settingRow}>
            <Pressable
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                if (recordatorios) setModalRecordatorio(true);
              }}
            >
              <Text style={styles.settingIcon}>🔔</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Recordatorios</Text>
                <Text style={styles.settingSubtitle}>
                  {recordatorios
                    ? `Activados • ${tiempoRecordatorio} min antes`
                    : 'Desactivados'}
                </Text>
              </View>
            </Pressable>
            <Switch
              value={recordatorios}
              onValueChange={(valor) => {
                setRecordatorios(valor);
                if (valor) {
                  setModalRecordatorio(true);
                }
              }}
              trackColor={{ false: '#DDE5E3', true: '#63D6C5' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.separator} />

          {/* Notificaciones push */}
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>📱</Text>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notificaciones push</Text>
              <Text style={styles.settingSubtitle}>Todas las mascotas</Text>
            </View>
            <Switch
              value={notificacionesPush}
              onValueChange={setNotificacionesPush}
              trackColor={{ false: '#DDE5E3', true: '#63D6C5' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.separator} />

          {/* Modo silencioso */}
          <View style={styles.settingRow}>
            <Pressable
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                if (modoSilencioso) {
                  setFormSilencio({
                    inicio: horaInicioSilencio,
                    fin: horaFinSilencio,
                  });
                  setModalSilencio(true);
                }
              }}
            >
              <Text style={styles.settingIcon}>🌙</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Modo silencioso</Text>
                <Text style={styles.settingSubtitle}>
                  {modoSilencioso
                    ? `${horaInicioSilencio} - ${horaFinSilencio}`
                    : 'Desactivado'}
                </Text>
              </View>
            </Pressable>
            <Switch
              value={modoSilencioso}
              onValueChange={(valor) => {
                setModoSilencioso(valor);
                if (valor) {
                  setFormSilencio({
                    inicio: horaInicioSilencio,
                    fin: horaFinSilencio,
                  });
                  setModalSilencio(true);
                }
              }}
              trackColor={{ false: '#DDE5E3', true: '#63D6C5' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.separator} />

          {/* Privacidad */}
          <Pressable
            style={styles.settingRow}
            onPress={() => setModalPrivacidad(true)}
          >
            <Text style={styles.settingIcon}>🔒</Text>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Privacidad</Text>
              <Text style={styles.settingSubtitle}>Gestionar datos</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <View style={styles.separator} />

          {/* Ayuda */}
          <Pressable
            style={styles.settingRow}
            onPress={() => setModalAyuda(true)}
          >
            <Text style={styles.settingIcon}>❓</Text>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Ayuda y soporte</Text>
              <Text style={styles.settingSubtitle}>Centro de ayuda</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>

        {/* Últimas notificaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ÚLTIMAS NOTIFICACIONES</Text>

          {notificaciones.map((n, index) => (
            <View key={n.id}>
              {index > 0 && <View style={styles.separator} />}
              <View style={styles.notificationRow}>
                <View style={styles.notificationIcon}>
                  <Text>{n.icono}</Text>
                </View>
                <View>
                  <Text style={styles.notificationTitle}>{n.titulo}</Text>
                  <Text style={styles.notificationSubtitle}>{n.subtitulo}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ========== MODAL EDITAR PERFIL ========== */}
      <Modal visible={modalEditar} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Editar perfil</Text>
              <Pressable onPress={() => setModalEditar(false)}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={[styles.input, erroresPerfil.nombre && styles.inputError]}
              value={formPerfil.nombre}
              onChangeText={(t) => {
                setFormPerfil({ ...formPerfil, nombre: t });
                if (erroresPerfil.nombre)
                  setErroresPerfil({ ...erroresPerfil, nombre: null });
              }}
              placeholder="Tu nombre"
            />
            {erroresPerfil.nombre ? (
              <Text style={styles.errorTexto}>{erroresPerfil.nombre}</Text>
            ) : null}

            <Text style={styles.label}>Correo electrónico *</Text>
            <TextInput
              style={[styles.input, erroresPerfil.email && styles.inputError]}
              value={formPerfil.email}
              onChangeText={(t) => {
                setFormPerfil({ ...formPerfil, email: t });
                if (erroresPerfil.email)
                  setErroresPerfil({ ...erroresPerfil, email: null });
              }}
              placeholder="correo@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {erroresPerfil.email ? (
              <Text style={styles.errorTexto}>{erroresPerfil.email}</Text>
            ) : null}

            <View style={styles.botonesForm}>
              <Pressable
                style={styles.botonCancelar}
                onPress={() => setModalEditar(false)}
              >
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.botonGuardar} onPress={guardarPerfil}>
                <Text style={styles.botonGuardarTexto}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========== MODAL RECORDATORIO ========== */}
      <Modal visible={modalRecordatorio} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Tiempo de recordatorio</Text>
              <Pressable onPress={() => setModalRecordatorio(false)}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.modalDesc}>
              ¿Con cuánta anticipación quieres recibir el aviso?
            </Text>

            {['5', '10', '15', '30'].map((min) => (
              <Pressable
                key={min}
                style={[
                  styles.opcionTiempo,
                  tiempoRecordatorio === min && styles.opcionTiempoActiva,
                ]}
                onPress={() => {
                  setTiempoRecordatorio(min);
                  setModalRecordatorio(false);
                }}
              >
                <Text
                  style={[
                    styles.opcionTiempoTexto,
                    tiempoRecordatorio === min && styles.opcionTiempoTextoActiva,
                  ]}
                >
                  {min} minutos antes
                </Text>
                {tiempoRecordatorio === min && (
                  <Text style={styles.check}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {/* ========== MODAL MODO SILENCIOSO ========== */}
      <Modal visible={modalSilencio} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Modo silencioso</Text>
              <Pressable onPress={() => setModalSilencio(false)}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.modalDesc}>
              Configura el horario en el que no quieres recibir notificaciones.
            </Text>

            <Text style={styles.label}>Hora de inicio</Text>
            <TextInput
              style={styles.input}
              value={formSilencio.inicio}
              onChangeText={(t) =>
                setFormSilencio({ ...formSilencio, inicio: t })
              }
              placeholder="Ej: 10:00 p. m."
            />

            <Text style={styles.label}>Hora de fin</Text>
            <TextInput
              style={styles.input}
              value={formSilencio.fin}
              onChangeText={(t) =>
                setFormSilencio({ ...formSilencio, fin: t })
              }
              placeholder="Ej: 7:00 a. m."
            />

            <View style={styles.botonesForm}>
              <Pressable
                style={styles.botonCancelar}
                onPress={() => setModalSilencio(false)}
              >
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.botonGuardar} onPress={guardarSilencio}>
                <Text style={styles.botonGuardarTexto}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========== MODAL PRIVACIDAD ========== */}
      <Modal visible={modalPrivacidad} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Privacidad</Text>
              <Pressable onPress={() => setModalPrivacidad(false)}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.modalDesc}>Gestiona tus datos personales.</Text>

            <Pressable style={styles.opcionLista}>
              <Text style={styles.opcionListaTexto}>Descargar mis datos</Text>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
            <Pressable style={styles.opcionLista}>
              <Text style={styles.opcionListaTexto}>Eliminar cuenta</Text>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
            <Pressable style={styles.opcionLista}>
              <Text style={styles.opcionListaTexto}>Política de privacidad</Text>
              <Text style={styles.arrow}>›</Text>
            </Pressable>

            <Pressable
              style={styles.botonCerrarSolo}
              onPress={() => setModalPrivacidad(false)}
            >
              <Text style={styles.botonGuardarTexto}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ========== MODAL AYUDA ========== */}
      <Modal visible={modalAyuda} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Ayuda y soporte</Text>
              <Pressable onPress={() => setModalAyuda(false)}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <Pressable style={styles.opcionLista}>
              <Text style={styles.opcionListaTexto}>❓ Preguntas frecuentes</Text>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
            <Pressable style={styles.opcionLista}>
              <Text style={styles.opcionListaTexto}>📧 Contactar soporte</Text>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
            <Pressable style={styles.opcionLista}>
              <Text style={styles.opcionListaTexto}>📖 Guía de uso</Text>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
            <Pressable style={styles.opcionLista}>
              <Text style={styles.opcionListaTexto}>🐛 Reportar un problema</Text>
              <Text style={styles.arrow}>›</Text>
            </Pressable>

            <Pressable
              style={styles.botonCerrarSolo}
              onPress={() => setModalAyuda(false)}
            >
              <Text style={styles.botonGuardarTexto}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FCFA',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#173B36',
    marginBottom: 18,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  profileImage: {
    width: 53,
    height: 53,
    borderRadius: 13,
    backgroundColor: '#D9F3EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileEmoji: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#24433E',
  },
  email: {
    fontSize: 10,
    color: '#8B9996',
    marginTop: 2,
  },
  petsRegistered: {
    fontSize: 9,
    color: '#0EAE91',
    marginTop: 3,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#F0F5F4',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  editText: {
    fontSize: 10,
    color: '#72817E',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0EAE91',
  },
  statLabel: {
    textAlign: 'center',
    fontSize: 9,
    color: '#84938F',
    marginTop: 3,
    lineHeight: 12,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#71817D',
    letterSpacing: 0.5,
    paddingTop: 14,
    paddingBottom: 5,
  },
  settingRow: {
    minHeight: 53,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 30,
    fontSize: 17,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#344A46',
  },
  settingSubtitle: {
    fontSize: 9,
    color: '#99A5A2',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#EDF2F1',
  },
  arrow: {
    fontSize: 24,
    color: '#A2AFAC',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 58,
  },
  notificationIcon: {
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor: '#EDF8F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  notificationTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#344A46',
  },
  notificationSubtitle: {
    fontSize: 9,
    color: '#929F9C',
    marginTop: 3,
  },

  // Modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#163B37',
  },
  closeText: {
    fontSize: 18,
    color: '#A0A0A0',
  },
  modalDesc: {
    fontSize: 13,
    color: '#71817E',
    marginBottom: 16,
    lineHeight: 19,
  },
  label: {
    fontSize: 12,
    color: '#526460',
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0E5E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#FAFFFE',
    color: '#163B37',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorTexto: {
    color: '#E74C3C',
    fontSize: 11,
    marginTop: -8,
    marginBottom: 10,
  },
  botonesForm: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  botonCancelar: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#63DDCA',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botonCancelarTexto: {
    color: '#0E9F86',
    fontWeight: 'bold',
    fontSize: 13,
  },
  botonGuardar: {
    flex: 1,
    backgroundColor: '#0EAE91',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botonGuardarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  botonCerrarSolo: {
    backgroundColor: '#0EAE91',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  opcionTiempo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F4FCFA',
  },
  opcionTiempoActiva: {
    backgroundColor: '#E8F8F4',
    borderWidth: 1.5,
    borderColor: '#0EAE91',
  },
  opcionTiempoTexto: {
    fontSize: 14,
    color: '#163B37',
  },
  opcionTiempoTextoActiva: {
    fontWeight: 'bold',
    color: '#0EAE91',
  },
  check: {
    color: '#0EAE91',
    fontWeight: 'bold',
    fontSize: 16,
  },
  opcionLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F3',
  },
  opcionListaTexto: {
    fontSize: 14,
    color: '#163B37',
  },
});