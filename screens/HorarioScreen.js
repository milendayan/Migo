import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import {
  obtenerActividadesHorario,
  TIPOS_ACTIVIDAD,
} from '../services/actividadesService';
import { obtenerMascotas } from '../services/mascotasService';

export default function HorarioScreen() {
  const [mascotasLista, setMascotasLista] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [vista, setVista] = useState('hoy');
  const [actividades, setActividades] = useState([]);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [cargando, setCargando] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [actividadEditando, setActividadEditando] = useState(null);
  const [form, setForm] = useState({
    mascotaId: 1,
    nombre: '',
    tipo: '',
    hora: '',
    fecha: '',
    repeticion: 'Una vez',
    recordatorioOn: true,
    recordatorio: '15 minutos antes',
    notas: '',
    diaSemana: '',
  });
  const [errores, setErrores] = useState({});
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [acts, mascs] = await Promise.all([
          obtenerActividadesHorario(),
          obtenerMascotas(),
        ]);
        setActividades(acts);
        const lista = mascs.map((m) => ({
          id: m.id,
          nombre: m.nombre,
          emoji: m.emoji || '🐾',
        }));
        setMascotasLista(lista);
        if (lista.length > 0) {
          setMascotaSeleccionada(lista[0]);
        }
      } catch (e) {
        console.log('Error al cargar horario:', e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const actividadesFiltradas = mascotaSeleccionada
    ? actividades.filter(
        (a) => a.mascotaId === mascotaSeleccionada.id && a.dia === vista
      )
    : [];

  const completadas = actividadesFiltradas.filter((a) => a.completada).length;
  const total = actividadesFiltradas.length;
  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);

  const toggleCompletada = (id) => {
    setActividades((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completada: !a.completada } : a))
    );
  };

  const formVacio = () => ({
    mascotaId: mascotaSeleccionada?.id || 1,
    nombre: '',
    tipo: '',
    hora: '',
    fecha: '',
    repeticion: 'Una vez',
    recordatorioOn: true,
    recordatorio: '15 minutos antes',
    notas: '',
    diaSemana: '',
  });

  const abrirAgregar = () => {
    setModoEdicion(false);
    setActividadEditando(null);
    setForm(formVacio());
    setErrores({});
    setModalVisible(true);
  };

  const abrirEditar = (actividad) => {
    setModoEdicion(true);
    setActividadEditando(actividad);
    setForm({
      mascotaId: actividad.mascotaId,
      nombre: actividad.nombre,
      tipo: actividad.tipo,
      hora: actividad.hora,
      fecha: actividad.fecha || '',
      repeticion: actividad.repeticion || 'Una vez',
      recordatorioOn: actividad.recordatorioOn !== false,
      recordatorio: actividad.recordatorio || '15 minutos antes',
      notas: actividad.notas || '',
      diaSemana: actividad.diaSemana || '',
    });
    setErrores({});
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setActividadEditando(null);
    setErrores({});
  };

  const guardarActividad = () => {
    const nuevosErrores = {};
    if (!form.mascotaId) nuevosErrores.mascotaId = 'Selecciona una mascota';
    if (!form.tipo.trim()) nuevosErrores.tipo = 'El tipo es obligatorio';
    if (!form.nombre.trim()) nuevosErrores.nombre = 'Escribe el nombre de la actividad';
    if (!form.hora.trim()) nuevosErrores.hora = 'La hora es obligatoria';
    if (!form.fecha.trim()) nuevosErrores.fecha = 'La fecha es obligatoria';
    if (vista === 'semana' && !form.diaSemana.trim()) {
      nuevosErrores.diaSemana = 'El día de la semana es obligatorio';
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    if (modoEdicion && actividadEditando) {
      setActividades((prev) =>
        prev.map((a) =>
          a.id === actividadEditando.id
            ? {
                ...a,
                mascotaId: form.mascotaId,
                nombre: form.nombre,
                tipo: form.tipo,
                hora: form.hora,
                fecha: form.fecha,
                repeticion: form.repeticion,
                recordatorioOn: form.recordatorioOn,
                recordatorio: form.recordatorio,
                notas: form.notas,
                diaSemana: vista === 'semana' ? form.diaSemana : a.diaSemana,
              }
            : a
        )
      );
    } else {
      const nueva = {
        id: Date.now(),
        mascotaId: form.mascotaId,
        nombre: form.nombre,
        tipo: form.tipo,
        hora: form.hora,
        fecha: form.fecha,
        repeticion: form.repeticion,
        recordatorioOn: form.recordatorioOn,
        recordatorio: form.recordatorio,
        notas: form.notas,
        completada: false,
        dia: vista,
        diaSemana: vista === 'semana' ? form.diaSemana : undefined,
      };
      setActividades((prev) => [...prev, nueva]);
    }

    setErrores({});
    cerrarModal();
  };

  const solicitarEliminar = (id) => {
    setConfirmarEliminar(id);
  };

  const confirmarBorrado = () => {
    if (confirmarEliminar) {
      setActividades((prev) => prev.filter((a) => a.id !== confirmarEliminar));
      setConfirmarEliminar(null);
    }
  };

  if (cargando || !mascotaSeleccionada) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F4FCFA',
        }}
      >
        <Text style={{ color: '#71817E' }}>Cargando horario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.titulo}>Horario de cuidado</Text>

        <View style={styles.selectorRow}>
          <Text style={styles.labelSelector}>Horario de:</Text>
          <Pressable
            style={styles.selectorMascota}
            onPress={() => setMostrarSelector(!mostrarSelector)}
          >
            <Text style={styles.emojiMascota}>{mascotaSeleccionada.emoji}</Text>
            <Text style={styles.nombreMascota}>{mascotaSeleccionada.nombre}</Text>
            <Text style={styles.flecha}>▼</Text>
          </Pressable>
        </View>

        {mostrarSelector && (
          <View style={styles.dropdown}>
            {mascotasLista.map((m) => (
              <Pressable
                key={m.id}
                style={[
                  styles.opcionMascota,
                  mascotaSeleccionada.id === m.id && styles.opcionActiva,
                ]}
                onPress={() => {
                  setMascotaSeleccionada(m);
                  setMostrarSelector(false);
                }}
              >
                <Text style={styles.emojiMascota}>{m.emoji}</Text>
                <Text style={styles.nombreOpcion}>{m.nombre}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.progresoContainer}>
          <Text style={styles.progresoTexto}>
            {completadas} de {total} actividades completadas
          </Text>
          <Text style={styles.porcentaje}>{porcentaje}%</Text>
        </View>
        <View style={styles.barraFondo}>
          <View style={[styles.barraProgreso, { width: `${porcentaje}%` }]} />
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, vista === 'hoy' && styles.tabActiva]}
            onPress={() => setVista('hoy')}
          >
            <Text style={[styles.tabTexto, vista === 'hoy' && styles.tabTextoActivo]}>
              HOY
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, vista === 'semana' && styles.tabActiva]}
            onPress={() => setVista('semana')}
          >
            <Text style={[styles.tabTexto, vista === 'semana' && styles.tabTextoActivo]}>
              SEMANA
            </Text>
          </Pressable>
        </View>

        {actividadesFiltradas.length === 0 ? (
          <View style={styles.vacio}>
            <Text style={styles.vacioTexto}>No hay actividades registradas</Text>
          </View>
        ) : (
          actividadesFiltradas.map((act) => (
            <View key={act.id} style={styles.actividadCard}>
              <View style={styles.horaCol}>
                <View
                  style={[
                    styles.punto,
                    act.completada ? styles.puntoCompletado : styles.puntoPendiente,
                  ]}
                />
                <Text style={styles.horaTexto}>{act.hora}</Text>
              </View>

              <View style={styles.contenido}>
                <View style={styles.info}>
                  <Text style={[styles.nombreAct, act.completada && styles.tachado]}>
                    {act.nombre}
                  </Text>
                  <Text style={styles.tipoAct}>
                    {act.tipo}
                    {act.diaSemana ? ` • ${act.diaSemana}` : ''}
                  </Text>
                </View>

                <View style={styles.acciones}>
                  <Pressable style={styles.btnIcono} onPress={() => abrirEditar(act)}>
                    <Text style={styles.iconoAccion}>✏️</Text>
                  </Pressable>
                  <Pressable
                    style={styles.btnIcono}
                    onPress={() => solicitarEliminar(act.id)}
                  >
                    <Text style={styles.iconoAccion}>🗑️</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.checkCircle,
                      act.completada && styles.checkCompletado,
                    ]}
                    onPress={() => toggleCompletada(act.id)}
                  >
                    {act.completada && <Text style={styles.checkMark}>✓</Text>}
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}

        <Pressable style={styles.btnAgregar} onPress={abrirAgregar}>
          <Text style={styles.btnAgregarTexto}>+ Agregar actividad</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={cerrarModal}
      >
        <View style={styles.sheetOverlay}>
          <View style={styles.sheet}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 28 }}
            >
              <View style={styles.sheetHeader}>
                <Pressable onPress={cerrarModal} style={styles.backBtn}>
                  <Text style={styles.backArrow}>←</Text>
                </Pressable>
                <Text style={styles.sheetTitle}>
                  {modoEdicion ? 'Editar actividad' : 'Nueva actividad'}
                </Text>
                <View style={{ width: 32 }} />
              </View>

              <View style={{ paddingHorizontal: 20 }}>
                <Text style={styles.label}>Mascota *</Text>
                <View style={styles.tiposRow}>
                  {mascotasLista.map((m) => (
                    <Pressable
                      key={m.id}
                      style={[
                        styles.chipTipo,
                        form.mascotaId === m.id && styles.chipTipoActivo,
                      ]}
                      onPress={() => {
                        setForm({ ...form, mascotaId: m.id });
                        if (errores.mascotaId) setErrores({ ...errores, mascotaId: null });
                      }}
                    >
                      <Text
                        style={[
                          styles.chipTexto,
                          form.mascotaId === m.id && styles.chipTextoActivo,
                        ]}
                      >
                        {m.nombre}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {errores.mascotaId ? (
                  <Text style={styles.errorTextoWarn}>⚠ {errores.mascotaId}</Text>
                ) : null}

                <Text style={styles.label}>Tipo de actividad *</Text>
                <View style={styles.tiposRow}>
                  {TIPOS_ACTIVIDAD.map((t) => (
                    <Pressable
                      key={t}
                      style={[styles.chipTipo, form.tipo === t && styles.chipTipoActivo]}
                      onPress={() => {
                        setForm({ ...form, tipo: t });
                        if (errores.tipo) setErrores({ ...errores, tipo: null });
                      }}
                    >
                      <Text
                        style={[
                          styles.chipTexto,
                          form.tipo === t && styles.chipTextoActivo,
                        ]}
                      >
                        {t}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {errores.tipo ? (
                  <Text style={styles.errorTextoWarn}>⚠ {errores.tipo}</Text>
                ) : null}

                <Text style={styles.label}>Nombre de la actividad *</Text>
                <TextInput
                  style={[styles.input, errores.nombre && styles.inputError]}
                  value={form.nombre}
                  onChangeText={(t) => {
                    setForm({ ...form, nombre: t });
                    if (errores.nombre) setErrores({ ...errores, nombre: null });
                  }}
                  placeholder="Ej. Thyro Tabs"
                  placeholderTextColor="#A0B0AC"
                />
                {errores.nombre ? (
                  <Text style={styles.errorTextoWarn}>⚠ {errores.nombre}</Text>
                ) : null}

                <View style={styles.filaDos}>
                  <View style={styles.colMitad}>
                    <Text style={styles.label}>Hora *</Text>
                    <TextInput
                      style={[styles.input, errores.hora && styles.inputError]}
                      value={form.hora}
                      onChangeText={(t) => {
                        setForm({ ...form, hora: t });
                        if (errores.hora) setErrores({ ...errores, hora: null });
                      }}
                      placeholder="7:00 p. m."
                      placeholderTextColor="#A0B0AC"
                    />
                    {errores.hora ? (
                      <Text style={styles.errorTextoWarn}>⚠ {errores.hora}</Text>
                    ) : null}
                  </View>
                  <View style={styles.colMitad}>
                    <Text style={styles.label}>Fecha *</Text>
                    <TextInput
                      style={[styles.input, errores.fecha && styles.inputError]}
                      value={form.fecha}
                      onChangeText={(t) => {
                        setForm({ ...form, fecha: t });
                        if (errores.fecha) setErrores({ ...errores, fecha: null });
                      }}
                      placeholder="22/10/2026"
                      placeholderTextColor="#A0B0AC"
                    />
                    {errores.fecha ? (
                      <Text style={styles.errorTextoWarn}>⚠ {errores.fecha}</Text>
                    ) : null}
                  </View>
                </View>

                {vista === 'semana' && (
                  <>
                    <Text style={styles.label}>Día de la semana *</Text>
                    <TextInput
                      style={[styles.input, errores.diaSemana && styles.inputError]}
                      value={form.diaSemana}
                      onChangeText={(t) => {
                        setForm({ ...form, diaSemana: t });
                        if (errores.diaSemana) setErrores({ ...errores, diaSemana: null });
                      }}
                      placeholder="Ej: Lunes, Miércoles"
                      placeholderTextColor="#A0B0AC"
                    />
                    {errores.diaSemana ? (
                      <Text style={styles.errorTextoWarn}>⚠ {errores.diaSemana}</Text>
                    ) : null}
                  </>
                )}

                <Text style={styles.label}>Repetir</Text>
                <View style={styles.tiposRow}>
                  {['Una vez', 'Diario', 'Semanal'].map((r) => (
                    <Pressable
                      key={r}
                      style={[
                        styles.chipTipo,
                        form.repeticion === r && styles.chipTipoActivo,
                      ]}
                      onPress={() => setForm({ ...form, repeticion: r })}
                    >
                      <Text
                        style={[
                          styles.chipTexto,
                          form.repeticion === r && styles.chipTextoActivo,
                        ]}
                      >
                        {r}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.recordatorioCard}>
                  <Text style={styles.recordatorioIcon}>🔔</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recordatorioTitulo}>Recordatorio</Text>
                    <Text style={styles.recordatorioSub}>
                      {form.recordatorioOn ? form.recordatorio : 'Desactivado'}
                    </Text>
                  </View>
                  <Switch
                    value={form.recordatorioOn}
                    onValueChange={(v) => setForm({ ...form, recordatorioOn: v })}
                    trackColor={{ false: '#DDE5E3', true: '#63D6C5' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {form.recordatorioOn && (
                  <View style={styles.tiposRow}>
                    {['5 minutos antes', '15 minutos antes', '30 minutos antes', '1 hora antes'].map(
                      (r) => (
                        <Pressable
                          key={r}
                          style={[
                            styles.chipTipo,
                            form.recordatorio === r && styles.chipTipoActivo,
                          ]}
                          onPress={() => setForm({ ...form, recordatorio: r })}
                        >
                          <Text
                            style={[
                              styles.chipTexto,
                              form.recordatorio === r && styles.chipTextoActivo,
                            ]}
                          >
                            {r}
                          </Text>
                        </Pressable>
                      )
                    )}
                  </View>
                )}

                <Text style={styles.label}>Notas</Text>
                <TextInput
                  style={[styles.input, styles.inputNotas]}
                  value={form.notas}
                  onChangeText={(t) => setForm({ ...form, notas: t })}
                  placeholder="Ej. Dar con la comida"
                  placeholderTextColor="#A0B0AC"
                  multiline
                />

                <Pressable style={styles.btnPrimario} onPress={guardarActividad}>
                  <Text style={styles.btnPrimarioTexto}>
                    {modoEdicion ? 'Guardar cambios' : 'Guardar actividad'}
                  </Text>
                </Pressable>

                <Pressable style={styles.btnSecundario} onPress={cerrarModal}>
                  <Text style={styles.btnSecundarioTexto}>Cancelar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={confirmarEliminar !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmarEliminar(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Eliminar actividad</Text>
            <Text style={styles.textoConfirmar}>
              ¿Estás seguro de que quieres eliminar esta actividad? Esta acción no se puede deshacer.
            </Text>
            <View style={styles.botonesForm}>
              <Pressable
                style={styles.botonCancelar}
                onPress={() => setConfirmarEliminar(null)}
              >
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.botonGuardar, styles.botonEliminar]}
                onPress={confirmarBorrado}
              >
                <Text style={styles.botonGuardarTexto}>Eliminar</Text>
              </Pressable>
            </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 25,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#163B37',
    marginBottom: 16,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelSelector: {
    fontSize: 13,
    color: '#71817E',
    marginRight: 8,
  },
  selectorMascota: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D0E5E0',
  },
  emojiMascota: {
    fontSize: 16,
    marginRight: 6,
  },
  nombreMascota: {
    fontSize: 14,
    fontWeight: '600',
    color: '#163B37',
    marginRight: 6,
  },
  flecha: {
    fontSize: 10,
    color: '#71817E',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2EEEB',
    overflow: 'hidden',
  },
  opcionMascota: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  opcionActiva: {
    backgroundColor: '#E8F8F4',
  },
  nombreOpcion: {
    fontSize: 14,
    color: '#163B37',
  },
  progresoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 8,
  },
  progresoTexto: {
    fontSize: 12,
    color: '#71817E',
  },
  porcentaje: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0EAE91',
  },
  barraFondo: {
    height: 6,
    backgroundColor: '#D9F3ED',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 18,
  },
  barraProgreso: {
    height: 6,
    backgroundColor: '#0EB394',
    borderRadius: 6,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#E8F3F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActiva: {
    backgroundColor: '#FFFFFF',
  },
  tabTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A9996',
  },
  tabTextoActivo: {
    color: '#163B37',
  },
  actividadCard: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  horaCol: {
    width: 60,
    alignItems: 'center',
    paddingTop: 14,
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
  puntoCompletado: {
    backgroundColor: '#0EB394',
  },
  puntoPendiente: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0EB394',
  },
  horaTexto: {
    fontSize: 11,
    color: '#71817E',
    textAlign: 'center',
  },
  contenido: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8EFED',
  },
  info: {
    flex: 1,
  },
  nombreAct: {
    fontSize: 14,
    fontWeight: '600',
    color: '#163B37',
  },
  tachado: {
    textDecorationLine: 'line-through',
    color: '#8A9996',
  },
  tipoAct: {
    fontSize: 11,
    color: '#8A9996',
    marginTop: 2,
  },
  acciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnIcono: {
    padding: 4,
  },
  iconoAccion: {
    fontSize: 14,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#0EB394',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCompletado: {
    backgroundColor: '#0EB394',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  vacio: {
    padding: 30,
    alignItems: 'center',
  },
  vacioTexto: {
    color: '#8A9996',
    fontSize: 14,
  },
  btnAgregar: {
    backgroundColor: '#0EAE91',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  btnAgregarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#F4FCFA',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '94%',
    paddingTop: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: '#173B36',
    fontWeight: '600',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#173B36',
  },
  label: {
    fontSize: 12,
    color: '#526460',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0E5E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    color: '#163B37',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  inputNotas: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  errorTextoWarn: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: -6,
    marginBottom: 10,
  },
  filaDos: {
    flexDirection: 'row',
    gap: 10,
  },
  colMitad: {
    flex: 1,
  },
  tiposRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chipTipo: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0E5E0',
  },
  chipTipoActivo: {
    backgroundColor: '#0EAE91',
    borderColor: '#0EAE91',
  },
  chipTexto: {
    fontSize: 13,
    color: '#526460',
  },
  chipTextoActivo: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  recordatorioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8EFED',
  },
  recordatorioIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  recordatorioTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#163B37',
  },
  recordatorioSub: {
    fontSize: 12,
    color: '#8A9996',
    marginTop: 2,
  },
  btnPrimario: {
    backgroundColor: '#0EAE91',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  btnPrimarioTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  btnSecundario: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#63DDCA',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnSecundarioTexto: {
    color: '#0E9F86',
    fontWeight: '700',
    fontSize: 15,
  },
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
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#163B37',
    marginBottom: 10,
  },
  textoConfirmar: {
    color: '#526460',
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
  },
  botonesForm: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
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
  botonEliminar: {
    backgroundColor: '#E74C3C',
  },
  botonGuardarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});