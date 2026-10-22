import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';

const MASCOTAS = [
  { id: 1, nombre: 'Max', emoji: '🐶' },
  { id: 2, nombre: 'Luna', emoji: '🐱' },
];

const ACTIVIDADES_INICIALES = [
  // Max
  { id: 1, mascotaId: 1, nombre: 'Thyro Tabs', tipo: 'Medicamento', hora: '7:00 a. m.', completada: true, dia: 'hoy' },
  { id: 2, mascotaId: 1, nombre: 'Desayuno', tipo: 'Alimentación', hora: '8:00 a. m.', completada: true, dia: 'hoy' },
  { id: 3, mascotaId: 1, nombre: 'Cuidado', tipo: 'Medicamento', hora: '12:00 p. m.', completada: true, dia: 'hoy' },
  { id: 4, mascotaId: 1, nombre: 'Almuerzo', tipo: 'Alimentación', hora: '1:00 p. m.', completada: true, dia: 'hoy' },
  { id: 5, mascotaId: 1, nombre: 'Paseo', tipo: 'Actividad física', hora: '4:00 p. m.', completada: false, dia: 'hoy' },
  { id: 6, mascotaId: 1, nombre: 'Thyro Tabs', tipo: 'Medicamento', hora: '7:00 p. m.', completada: false, dia: 'hoy' },
  { id: 7, mascotaId: 1, nombre: 'Medicamento X', tipo: 'Medicamento', hora: '8:30 p. m.', completada: false, dia: 'hoy' },

  // Luna
  { id: 8, mascotaId: 2, nombre: 'Desayuno', tipo: 'Alimentación', hora: '8:00 a. m.', completada: true, dia: 'hoy' },
  { id: 9, mascotaId: 2, nombre: 'Juego', tipo: 'Entrenamiento', hora: '11:00 a. m.', completada: true, dia: 'hoy' },
  { id: 10, mascotaId: 2, nombre: 'Cepillado', tipo: 'Higiene', hora: '5:00 p. m.', completada: false, dia: 'hoy' },
  { id: 11, mascotaId: 2, nombre: 'Cena', tipo: 'Alimentación', hora: '7:00 p. m.', completada: false, dia: 'hoy' },
  { id: 12, mascotaId: 2, nombre: 'Juego nocturno', tipo: 'Entrenamiento', hora: '9:00 p. m.', completada: false, dia: 'hoy' },

  // Ejemplo semana
  { id: 13, mascotaId: 1, nombre: 'Vacuna anual', tipo: 'Salud', hora: '10:00 a. m.', completada: false, dia: 'semana', diaSemana: 'Miércoles' },
  { id: 14, mascotaId: 1, nombre: 'Baño', tipo: 'Higiene', hora: '4:00 p. m.', completada: false, dia: 'semana', diaSemana: 'Sábado' },
  { id: 15, mascotaId: 2, nombre: 'Control veterinario', tipo: 'Salud', hora: '11:00 a. m.', completada: false, dia: 'semana', diaSemana: 'Jueves' },
];

export default function HorarioScreen() {
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(MASCOTAS[0]);
  const [vista, setVista] = useState('hoy');
  const [actividades, setActividades] = useState(ACTIVIDADES_INICIALES);
  const [mostrarSelector, setMostrarSelector] = useState(false);

  // Modal agregar / editar
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [actividadEditando, setActividadEditando] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    hora: '',
    diaSemana: '',
  });
  const [errores, setErrores] = useState({});
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

  const actividadesFiltradas = actividades.filter(
    (a) => a.mascotaId === mascotaSeleccionada.id && a.dia === vista
  );

  const completadas = actividadesFiltradas.filter((a) => a.completada).length;
  const total = actividadesFiltradas.length;
  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);

  const toggleCompletada = (id) => {
    setActividades((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completada: !a.completada } : a))
    );
  };

  const abrirAgregar = () => {
    setModoEdicion(false);
    setActividadEditando(null);
    setForm({ nombre: '', tipo: '', hora: '', diaSemana: '' });
    setErrores({});
    setModalVisible(true);
  };

  const abrirEditar = (actividad) => {
    setModoEdicion(true);
    setActividadEditando(actividad);
    setForm({
      nombre: actividad.nombre,
      tipo: actividad.tipo,
      hora: actividad.hora,
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

    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!form.tipo.trim()) nuevosErrores.tipo = 'El tipo es obligatorio';
    if (!form.hora.trim()) nuevosErrores.hora = 'La hora es obligatoria';
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
                nombre: form.nombre,
                tipo: form.tipo,
                hora: form.hora,
                diaSemana: vista === 'semana' ? form.diaSemana : a.diaSemana,
              }
            : a
        )
      );
    } else {
      const nueva = {
        id: Date.now(),
        mascotaId: mascotaSeleccionada.id,
        nombre: form.nombre,
        tipo: form.tipo,
        hora: form.hora,
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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.titulo}>Horario de cuidado</Text>

        {/* Selector de mascota */}
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
            {MASCOTAS.map((m) => (
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

        {/* Progreso */}
        <View style={styles.progresoContainer}>
          <Text style={styles.progresoTexto}>
            {completadas} de {total} actividades completadas
          </Text>
          <Text style={styles.porcentaje}>{porcentaje}%</Text>
        </View>
        <View style={styles.barraFondo}>
          <View style={[styles.barraProgreso, { width: `${porcentaje}%` }]} />
        </View>

        {/* Tabs */}
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

        {/* Lista de actividades */}
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

      {/* ========== MODAL AGREGAR / EDITAR ========== */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>
                {modoEdicion ? 'Editar actividad' : 'Nueva actividad'}
              </Text>
              <Pressable onPress={cerrarModal}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={[styles.input, errores.nombre && styles.inputError]}
              placeholder="Ej: Paseo, Medicamento..."
              value={form.nombre}
              onChangeText={(t) => {
                setForm({ ...form, nombre: t });
                if (errores.nombre) setErrores({ ...errores, nombre: null });
              }}
            />
            {errores.nombre ? (
              <Text style={styles.errorTexto}>{errores.nombre}</Text>
            ) : null}

            <Text style={styles.label}>Tipo *</Text>
            <TextInput
              style={[styles.input, errores.tipo && styles.inputError]}
              placeholder="Ej: Medicamento, Alimentación, Higiene..."
              value={form.tipo}
              onChangeText={(t) => {
                setForm({ ...form, tipo: t });
                if (errores.tipo) setErrores({ ...errores, tipo: null });
              }}
            />
            {errores.tipo ? (
              <Text style={styles.errorTexto}>{errores.tipo}</Text>
            ) : null}

            <Text style={styles.label}>Hora *</Text>
            <TextInput
              style={[styles.input, errores.hora && styles.inputError]}
              placeholder="Ej: 4:00 p. m."
              value={form.hora}
              onChangeText={(t) => {
                setForm({ ...form, hora: t });
                if (errores.hora) setErrores({ ...errores, hora: null });
              }}
            />
            {errores.hora ? (
              <Text style={styles.errorTexto}>{errores.hora}</Text>
            ) : null}

            {vista === 'semana' && (
              <>
                <Text style={styles.label}>Día de la semana *</Text>
                <TextInput
                  style={[styles.input, errores.diaSemana && styles.inputError]}
                  placeholder="Ej: Lunes, Miércoles..."
                  value={form.diaSemana}
                  onChangeText={(t) => {
                    setForm({ ...form, diaSemana: t });
                    if (errores.diaSemana) setErrores({ ...errores, diaSemana: null });
                  }}
                />
                {errores.diaSemana ? (
                  <Text style={styles.errorTexto}>{errores.diaSemana}</Text>
                ) : null}
              </>
            )}

            <Text style={styles.avisoMascota}>
              Se agregará para: {mascotaSeleccionada.emoji} {mascotaSeleccionada.nombre}
            </Text>

            <View style={styles.botonesForm}>
              <Pressable style={styles.botonCancelar} onPress={cerrarModal}>
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.botonGuardar} onPress={guardarActividad}>
                <Text style={styles.botonGuardarTexto}>
                  {modoEdicion ? 'Guardar' : 'Agregar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========== MODAL CONFIRMAR ELIMINAR ========== */}
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
    padding: 50,
    paddingBottom: 100,
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

  // Modal
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
    marginBottom: 16,
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
  avisoMascota: {
    fontSize: 12,
    color: '#0EAE91',
    marginBottom: 14,
    fontWeight: '600',
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