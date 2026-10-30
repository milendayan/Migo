import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
    Modal,
    TextInput,
} from 'react-native';
import { obtenerMascotas, obtenerHistorial } from '../services/mascotasService';

export default function MisMascotasScreen({ onVerHorario }) {
    const [mascotas, setMascotas] = useState([]);
    const [historial, setHistorial] = useState({});
    const [cargando, setCargando] = useState(true);

const [modalPerfilVisible, setModalPerfilVisible] = useState(false);
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [formEditar, setFormEditar] = useState({});
    const [erroresEditar, setErroresEditar] = useState({});

    const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
    const [nuevaMascota, setNuevaMascota] = useState({
        nombre: '',
        especie: '',
        raza: '',
        edad: '',
        peso: '',
        sexo: '',
        color: '',
        fechaNacimiento: '',
        microchip: '',
        notas: '',
    });
    const [erroresAgregar, setErroresAgregar] = useState({});

    const [modalHistorialVisible, setModalHistorialVisible] = useState(false);
    const [modalAgregarRegistro, setModalAgregarRegistro] = useState(false);
    const [tipoRegistro, setTipoRegistro] = useState('vacuna');
    const [formRegistro, setFormRegistro] = useState({
        nombre: '',
        fecha: '',
        estado: 'Al día',
        tipo: '',
        hora: '',
        veterinario: '',
        valor: '',
        mes: '',
    });

    
    useEffect(() => {
        const cargar = async () => {
            try {
                const [lista, hist] = await Promise.all([
                    obtenerMascotas(),
                    obtenerHistorial(),
                ]);
                setMascotas(lista);
                setHistorial(hist);
            } catch (e) {
                console.log('Error al cargar mascotas:', e);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

const abrirPerfil = (mascota) => {
        setMascotaSeleccionada(mascota);
        setFormEditar({ ...mascota });
        setModoEdicion(false);
        setErroresEditar({});
        setModalPerfilVisible(true);
    };

    const cerrarPerfil = () => {
        setModalPerfilVisible(false);
        setMascotaSeleccionada(null);
        setModoEdicion(false);
        setErroresEditar({});
    };

    const activarEdicion = () => {
        setFormEditar({ ...mascotaSeleccionada });
        setErroresEditar({});
        setModoEdicion(true);
    };

    const cancelarEdicion = () => {
        setFormEditar({ ...mascotaSeleccionada });
        setErroresEditar({});
        setModoEdicion(false);
    };

    const validarCampos = (datos, esAgregar = false) => {
    const errores = {};
    if (!datos.nombre?.trim()) errores.nombre = 'El nombre es obligatorio';
    if (!datos.especie?.trim()) errores.especie = 'La especie es obligatoria';
    if (!datos.fechaNacimiento?.trim()) {
        errores.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    }
    if (!datos.peso?.trim()) {
        errores.peso = 'El peso es obligatorio';
    } else {
        const pesoNum = parseFloat(String(datos.peso).replace(',', '.').replace(/[^\d.]/g, ''));
        if (isNaN(pesoNum) || pesoNum <= 0) {
            errores.peso = 'Ingresa un peso válido. Ejemplo: 28.5';
        }
    }
    // En editar mantenemos más campos obligatorios
    if (!esAgregar) {
        if (!datos.raza?.trim()) errores.raza = 'La raza es obligatoria';
        if (!datos.edad?.trim()) errores.edad = 'La edad es obligatoria';
        if (!datos.sexo?.trim()) errores.sexo = 'El sexo es obligatorio';
        if (!datos.color?.trim()) errores.color = 'El color es obligatorio';
    }
    return errores;
};

    const guardarEdicion = () => {
        const errores = validarCampos(formEditar, false);
        setErroresEditar(errores);
        if (Object.keys(errores).length > 0) return;

        const actualizadas = mascotas.map((m) =>
            m.id === formEditar.id ? { ...formEditar } : m
        );
        setMascotas(actualizadas);
        setMascotaSeleccionada({ ...formEditar });
        setModoEdicion(false);
        setErroresEditar({});
    };

    const abrirAgregar = () => {
        setNuevaMascota({
            nombre: '',
            especie: '',
            raza: '',
            edad: '',
            peso: '',
            sexo: '',
            color: '',
            fechaNacimiento: '',
            microchip: '',
            notas: '',
        });
        setErroresAgregar({});
        setModalAgregarVisible(true);
    };

    const cerrarAgregar = () => {
        setModalAgregarVisible(false);
        setErroresAgregar({});
    };

    const guardarMascota = () => {
        const errores = validarCampos(nuevaMascota, true);
        setErroresAgregar(errores);
        if (Object.keys(errores).length > 0) return;

        const id = Date.now();
        const pesoLimpio = parseFloat(
            String(nuevaMascota.peso).replace(',', '.').replace(/[^\d.]/g, '')
        );
        const mascotaNueva = {
            id,
            nombre: nuevaMascota.nombre,
            especie: nuevaMascota.especie,
            raza: nuevaMascota.raza || '—',
            edad: nuevaMascota.edad || '—',
            peso: `${pesoLimpio} kg`,
            sexo: nuevaMascota.sexo || '—',
            color: nuevaMascota.color || '—',
            fechaNacimiento: nuevaMascota.fechaNacimiento,
            microchip: nuevaMascota.microchip || '—',
            notas: nuevaMascota.notas || '',
            actividades: '0 de 0 actividades',
            progreso: 0,
            pendientes: '0 pendientes',
            proximaActividad: 'Sin actividades',
            imagen: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
        };

        setMascotas([...mascotas, mascotaNueva]);
        setHistorial({
            ...historial,
            [id]: { vacunas: [], citas: [], pesos: [] },
        });
        setModalAgregarVisible(false);
        setErroresAgregar({});
    };

    const actualizarCampoAgregar = (campo, valor) => {
        setNuevaMascota({ ...nuevaMascota, [campo]: valor });
        if (erroresAgregar[campo]) {
            setErroresAgregar({ ...erroresAgregar, [campo]: null });
        }
    };

    const actualizarCampoEditar = (campo, valor) => {
        setFormEditar({ ...formEditar, [campo]: valor });
        if (erroresEditar[campo]) {
            setErroresEditar({ ...erroresEditar, [campo]: null });
        }
    };

    const abrirHistorial = () => {
        setModalHistorialVisible(true);
    };

    const cerrarHistorial = () => {
        setModalHistorialVisible(false);
    };

    const irAHorario = () => {
        setModalPerfilVisible(false);
        if (onVerHorario) {
            onVerHorario();
        }
    };

    const abrirAgregarRegistro = (tipo) => {
        setTipoRegistro(tipo);
        setFormRegistro({
            nombre: '',
            fecha: '',
            estado: 'Al día',
            tipo: '',
            hora: '',
            veterinario: '',
            valor: '',
            mes: '',
        });
        setModalAgregarRegistro(true);
    };

    const guardarRegistro = () => {
        if (!mascotaSeleccionada) return;
        const id = mascotaSeleccionada.id;
        const actual = historial[id] || { vacunas: [], citas: [], pesos: [] };

        if (tipoRegistro === 'vacuna') {
            if (!formRegistro.nombre.trim() || !formRegistro.fecha.trim()) return;
            const estado = formRegistro.estado || 'Al día';
            actual.vacunas = [
                ...actual.vacunas,
                {
                    id: Date.now(),
                    nombre: formRegistro.nombre,
                    fecha: formRegistro.fecha,
                    estado,
                    detalle: estado === 'Pendiente' ? `Próxima: ${formRegistro.fecha}` : `Aplicada: ${formRegistro.fecha}`,
                    icono: '💉',
                },
            ];
        } else if (tipoRegistro === 'cita') {
            if (!formRegistro.tipo.trim() || !formRegistro.fecha.trim()) return;
            actual.citas = [
                ...actual.citas,
                {
                    id: Date.now(),
                    tipo: formRegistro.tipo,
                    fecha: formRegistro.fecha,
                    hora: formRegistro.hora || '',
                    veterinario: formRegistro.veterinario || '—',
                    estado: formRegistro.estadoCita || 'Próxima',
                    icono: '🩺',
                },
            ];
        } else if (tipoRegistro === 'peso') {
            if (!formRegistro.mes.trim() || !formRegistro.valor.trim()) return;
            actual.pesos = [
                ...actual.pesos,
                {
                    mes: formRegistro.mes,
                    valor: parseFloat(formRegistro.valor) || 0,
                },
            ];
        }

        setHistorial({ ...historial, [id]: actual });
        setModalAgregarRegistro(false);
    };

    const datosHistorial = mascotaSeleccionada
        ? historial[mascotaSeleccionada.id] || { vacunas: [], citas: [], pesos: [] }
        : { vacunas: [], citas: [], pesos: [] };

    const maxPeso = datosHistorial.pesos.length
        ? Math.max(...datosHistorial.pesos.map((p) => p.valor))
        : 1;

    if (cargando) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FCFB' }}>
                <Text style={{ color: '#71817E' }}>Cargando mascotas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Mis mascotas</Text>
                    <Text style={styles.subtitle}>
                        {mascotas.length} mascota{mascotas.length !== 1 ? 's' : ''} registrada
                        {mascotas.length !== 1 ? 's' : ''}
                    </Text>
                </View>

                {mascotas.map((mascota) => (
                    <View key={mascota.id} style={styles.mascotaCard}>
                        <View style={styles.photoContainer}>
                            <Image source={{ uri: mascota.imagen }} style={styles.mascotaImagen} />
                            <View style={styles.photoOverlay} />
                            <View style={styles.nombreContainer}>
                                <Text style={styles.nombre}>{mascota.nombre}</Text>
                                <Text style={styles.raza}>
                                    {mascota.especie} • {mascota.raza}
                                </Text>
                            </View>
                            <View style={styles.pendientes}>
                                <Text style={styles.pendientesText}>{mascota.pendientes}</Text>
                            </View>
                        </View>

                        <View style={styles.datosContainer}>
                            <View style={styles.dato}>
                                <Text style={styles.datoTitulo}>Edad</Text>
                                <Text style={styles.datoValor}>{mascota.edad}</Text>
                            </View>
                            <View style={styles.separador} />
                            <View style={styles.dato}>
                                <Text style={styles.datoTitulo}>Peso</Text>
                                <Text style={styles.datoValor}>{mascota.peso}</Text>
                            </View>
                            <View style={styles.separador} />
                            <View style={styles.dato}>
                                <Text style={styles.datoTitulo}>Actividades</Text>
                                <Text style={styles.datoValor}>{mascota.actividades}</Text>
                            </View>
                        </View>

                        <View style={styles.progresoContainer}>
                            <View style={styles.progresoHeader}>
                                <Text style={styles.progresoTexto}>Progreso de hoy</Text>
                                <Text style={styles.porcentaje}>{mascota.progreso}%</Text>
                            </View>
                            <View style={styles.barraFondo}>
                                <View style={[styles.barraProgreso, { width: `${mascota.progreso}%` }]} />
                            </View>
                        </View>

                        <Pressable style={styles.botonPerfil} onPress={() => abrirPerfil(mascota)}>
                            <Text style={styles.botonPerfilTexto}>Ver perfil de {mascota.nombre}</Text>
                        </Pressable>
                    </View>
                ))}

                <Pressable style={styles.agregarCard} onPress={abrirAgregar}>
                    <Text style={styles.plus}>+</Text>
                    <Text style={styles.agregarTexto}>Agregar mascota</Text>
                </Pressable>
            </ScrollView>

            {/* ========== MODAL PERFIL (diseño tipo mockup) ========== */}
            <Modal
                visible={modalPerfilVisible}
                transparent
                animationType="slide"
                onRequestClose={cerrarPerfil}
            >
                <View style={styles.perfilOverlay}>
                    <View style={styles.perfilSheet}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ paddingBottom: 24 }}
                        >
                            {mascotaSeleccionada && (
                                <>
                                    {/* Header con flecha */}
                                    <View style={styles.perfilTopBar}>
                                        <Pressable onPress={cerrarPerfil} style={styles.backBtn}>
                                            <Text style={styles.backArrow}>←</Text>
                                        </Pressable>
                                        <Text style={styles.perfilTopTitle}>
                                            Perfil de {mascotaSeleccionada.nombre}
                                        </Text>
                                        <View style={{ width: 32 }} />
                                    </View>

                                    {modoEdicion ? (
                                        <View style={{ paddingHorizontal: 20 }}>
                                            <Campo
                                                label="Nombre *"
                                                value={formEditar.nombre}
                                                onChange={(t) => actualizarCampoEditar('nombre', t)}
                                                placeholder="Nombre"
                                                error={erroresEditar.nombre}
                                            />
                                            <Campo
                                                label="Especie *"
                                                value={formEditar.especie}
                                                onChange={(t) => actualizarCampoEditar('especie', t)}
                                                placeholder="Perro / Gato"
                                                error={erroresEditar.especie}
                                            />
                                            <Campo
                                                label="Raza *"
                                                value={formEditar.raza}
                                                onChange={(t) => actualizarCampoEditar('raza', t)}
                                                placeholder="Ej: Golden Retriever"
                                                error={erroresEditar.raza}
                                            />
                                            <Campo
                                                label="Edad *"
                                                value={formEditar.edad}
                                                onChange={(t) => actualizarCampoEditar('edad', t)}
                                                placeholder="Ej: 3 años"
                                                error={erroresEditar.edad}
                                            />
                                            <Campo
                                                label="Peso *"
                                                value={formEditar.peso}
                                                onChange={(t) => actualizarCampoEditar('peso', t)}
                                                placeholder="Ej: 28.5 kg"
                                                error={erroresEditar.peso}
                                            />
                                            <Campo
                                                label="Sexo *"
                                                value={formEditar.sexo}
                                                onChange={(t) => actualizarCampoEditar('sexo', t)}
                                                placeholder="Macho / Hembra"
                                                error={erroresEditar.sexo}
                                            />
                                            <Campo
                                                label="Color *"
                                                value={formEditar.color}
                                                onChange={(t) => actualizarCampoEditar('color', t)}
                                                placeholder="Ej: Dorado"
                                                error={erroresEditar.color}
                                            />
                                            <Campo
                                                label="Nacimiento *"
                                                value={formEditar.fechaNacimiento}
                                                onChange={(t) => actualizarCampoEditar('fechaNacimiento', t)}
                                                placeholder="DD/MM/AAAA"
                                                error={erroresEditar.fechaNacimiento}
                                            />
                                            <Campo
                                                label="Microchip"
                                                value={formEditar.microchip}
                                                onChange={(t) => actualizarCampoEditar('microchip', t)}
                                                placeholder="Número de microchip"
                                            />
                                            <Campo
                                                label="Notas"
                                                value={formEditar.notas}
                                                onChange={(t) => actualizarCampoEditar('notas', t)}
                                                placeholder="Notas (opcional)"
                                                multiline
                                            />

                                            <View style={styles.botonesForm}>
                                                <Pressable style={styles.botonCancelar} onPress={cancelarEdicion}>
                                                    <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                                                </Pressable>
                                                <Pressable style={styles.botonGuardar} onPress={guardarEdicion}>
                                                    <Text style={styles.botonGuardarTexto}>Guardar</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={{ paddingHorizontal: 20 }}>
                                            {/* Foto grande */}
                                            <Image
                                                source={{ uri: mascotaSeleccionada.imagen }}
                                                style={styles.perfilFotoGrande}
                                            />

                                            {/* Nombre + badge */}
                                            <View style={styles.perfilNombreRow}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.perfilNombreGrande}>
                                                        {mascotaSeleccionada.nombre}
                                                    </Text>
                                                    <Text style={styles.perfilSub}>
                                                        {mascotaSeleccionada.especie} • {mascotaSeleccionada.raza}
                                                    </Text>
                                                </View>
                                                <View style={styles.badgePendientes}>
                                                    <Text style={styles.badgePendientesTexto}>
                                                        {mascotaSeleccionada.pendientes}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* INFORMACIÓN en 2 columnas */}
                                            <View style={styles.infoCard}>
                                                <Text style={styles.infoTitulo}>INFORMACIÓN</Text>
                                                <View style={styles.infoGrid}>
                                                    <View style={styles.infoCol}>
                                                        <Text style={styles.infoLabel}>Edad</Text>
                                                        <Text style={styles.infoValor}>{mascotaSeleccionada.edad}</Text>
                                                    </View>
                                                    <View style={styles.infoCol}>
                                                        <Text style={styles.infoLabel}>Peso</Text>
                                                        <Text style={styles.infoValor}>{mascotaSeleccionada.peso}</Text>
                                                    </View>
                                                    <View style={styles.infoCol}>
                                                        <Text style={styles.infoLabel}>Sexo</Text>
                                                        <Text style={styles.infoValor}>{mascotaSeleccionada.sexo}</Text>
                                                    </View>
                                                    <View style={styles.infoCol}>
                                                        <Text style={styles.infoLabel}>Color</Text>
                                                        <Text style={styles.infoValor}>{mascotaSeleccionada.color}</Text>
                                                    </View>
                                                    <View style={styles.infoCol}>
                                                        <Text style={styles.infoLabel}>Nacimiento</Text>
                                                        <Text style={styles.infoValor}>
                                                            {mascotaSeleccionada.fechaNacimiento}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.infoCol}>
                                                        <Text style={styles.infoLabel}>Microchip</Text>
                                                        <Text style={styles.infoValor}>
                                                            {mascotaSeleccionada.microchip}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>

                                            {/* Progreso de hoy */}
                                            <View style={styles.progresoCard}>
                                                <View style={styles.progresoHeader}>
                                                    <Text style={styles.progresoCardTitulo}>Progreso de hoy</Text>
                                                    <Text style={styles.progresoCardPct}>
                                                        {mascotaSeleccionada.progreso}%
                                                    </Text>
                                                </View>
                                                <View style={styles.barraFondoPerfil}>
                                                    <View
                                                        style={[
                                                            styles.barraProgresoPerfil,
                                                            { width: `${mascotaSeleccionada.progreso}%` },
                                                        ]}
                                                    />
                                                </View>
                                                <Text style={styles.progresoDetalle}>
                                                    {mascotaSeleccionada.actividades}
                                                    {mascotaSeleccionada.proximaActividad
                                                        ? ` • Próxima: ${mascotaSeleccionada.proximaActividad}`
                                                        : ''}
                                                </Text>
                                            </View>

                                            {/* Botones apilados como en el mockup */}
                                            <Pressable style={styles.btnPrimario} onPress={irAHorario}>
                                                <Text style={styles.btnPrimarioTexto}>
                                                    Ver horario de cuidado
                                                </Text>
                                            </Pressable>

                                            <Pressable style={styles.btnSecundario} onPress={abrirHistorial}>
                                                <Text style={styles.btnSecundarioTexto}>
                                                    Salud e historial médico
                                                </Text>
                                            </Pressable>

                                            <Pressable style={styles.btnSecundario} onPress={activarEdicion}>
                                                <Text style={styles.btnSecundarioTexto}>
                                                    Editar información
                                                </Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ========== MODAL HISTORIAL MÉDICO (mockup Salud de) ========== */}
            <Modal
                visible={modalHistorialVisible}
                transparent
                animationType="slide"
                onRequestClose={cerrarHistorial}
            >
                <View style={styles.perfilOverlay}>
                    <View style={styles.perfilSheet}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 28 }}
                        >
                            <View style={styles.perfilTopBar}>
                                <Pressable onPress={cerrarHistorial} style={styles.backBtn}>
                                    <Text style={styles.backArrow}>←</Text>
                                </Pressable>
                                <Text style={styles.perfilTopTitle}>
                                    Salud de {mascotaSeleccionada?.nombre}
                                </Text>
                                <View style={{ width: 32 }} />
                            </View>

                            <View style={{ paddingHorizontal: 20 }}>
                                {/* VACUNAS */}
                                <Text style={styles.seccionHistorial}>VACUNAS</Text>
                                <View style={styles.bloqueLista}>
                                    {datosHistorial.vacunas.length === 0 ? (
                                        <Text style={styles.vacioTexto}>Sin vacunas registradas</Text>
                                    ) : (
                                        datosHistorial.vacunas.map((v) => (
                                            <View key={v.id} style={styles.itemSalud}>
                                                <View style={styles.iconoSalud}>
                                                    <Text style={{ fontSize: 16 }}>{v.icono || '💉'}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.itemTitulo}>{v.nombre}</Text>
                                                    <Text style={styles.itemSub}>
                                                        {v.detalle || (v.estado === 'Pendiente' ? `Próxima: ${v.fecha}` : `Aplicada: ${v.fecha}`)}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={[
                                                        styles.badgeEstado,
                                                        v.estado === 'Al día' ? styles.badgeAlDia : styles.badgePendiente,
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.badgeTexto,
                                                            v.estado === 'Al día'
                                                                ? styles.badgeTextoAlDia
                                                                : styles.badgeTextoPendiente,
                                                        ]}
                                                    >
                                                        {v.estado}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))
                                    )}
                                </View>

                                {/* CITAS */}
                                <Text style={[styles.seccionHistorial, { marginTop: 14 }]}>
                                    CITAS VETERINARIAS
                                </Text>
                                <View style={styles.bloqueLista}>
                                    {datosHistorial.citas.length === 0 ? (
                                        <Text style={styles.vacioTexto}>Sin citas registradas</Text>
                                    ) : (
                                        datosHistorial.citas.map((c) => {
                                            const estadoCita = c.estado || 'Próxima';
                                            return (
                                                <View key={c.id} style={styles.itemSalud}>
                                                    <View style={styles.iconoSalud}>
                                                        <Text style={{ fontSize: 16 }}>{c.icono || '🩺'}</Text>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.itemTitulo}>{c.tipo}</Text>
                                                        <Text style={styles.itemSub}>
                                                            {c.fecha}
                                                            {c.hora ? ` • ${c.hora}` : ''}
                                                            {c.veterinario ? ` • ${c.veterinario}` : ''}
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={[
                                                            styles.badgeEstado,
                                                            estadoCita === 'Realizada'
                                                                ? styles.badgeRealizada
                                                                : styles.badgeProxima,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.badgeTexto,
                                                                estadoCita === 'Realizada'
                                                                    ? styles.badgeTextoRealizada
                                                                    : styles.badgeTextoProxima,
                                                            ]}
                                                        >
                                                            {estadoCita}
                                                        </Text>
                                                    </View>
                                                </View>
                                            );
                                        })
                                    )}
                                </View>

                                {/* CONTROL DE PESO */}
                                <Text style={[styles.seccionHistorial, { marginTop: 14 }]}>
                                    CONTROL DE PESO
                                </Text>
                                <View style={styles.pesoCard}>
                                    <View style={styles.pesoHeader}>
                                        <Text style={styles.pesoLabel}>Último registro</Text>
                                        <Text style={styles.pesoValor}>
                                            {datosHistorial.pesos.length
                                                ? `${datosHistorial.pesos[datosHistorial.pesos.length - 1].valor} kg`
                                                : '—'}
                                        </Text>
                                    </View>
                                    {datosHistorial.pesos.length === 0 ? (
                                        <Text style={styles.vacioTexto}>Sin registros de peso</Text>
                                    ) : (
                                        <View style={styles.graficaContainer}>
                                            {datosHistorial.pesos.map((p, idx) => (
                                                <View key={idx} style={styles.barraCol}>
                                                    <View style={styles.barraFondoHist}>
                                                        <View
                                                            style={[
                                                                styles.barraValorHist,
                                                                {
                                                                    height: `${Math.max(
                                                                        12,
                                                                        (p.valor / maxPeso) * 90
                                                                    )}%`,
                                                                    opacity: idx === datosHistorial.pesos.length - 1 ? 1 : 0.55 + idx * 0.07,
                                                                },
                                                            ]}
                                                        />
                                                    </View>
                                                    <Text style={styles.barraMes}>{p.mes}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>

                                <Pressable
                                    style={styles.btnPrimario}
                                    onPress={() => abrirAgregarRegistro('vacuna')}
                                >
                                    <Text style={styles.btnPrimarioTexto}>+ Agregar registro</Text>
                                </Pressable>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

{/* ========== MODAL AGREGAR REGISTRO ========== */}
            <Modal
                visible={modalAgregarRegistro}
                transparent
                animationType="fade"
                onRequestClose={() => setModalAgregarRegistro(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeaderSimple}>
                            <Text style={styles.modalTitulo}>
                                {tipoRegistro === 'vacuna'
                                    ? 'Nueva vacuna'
                                    : tipoRegistro === 'cita'
                                    ? 'Nueva cita'
                                    : 'Nuevo peso'}
                            </Text>
                            <Pressable onPress={() => setModalAgregarRegistro(false)}>
                                <Text style={styles.closeText}>✕</Text>
                            </Pressable>
                        </View>

                        {tipoRegistro === 'vacuna' && (
                            <>
                                <Campo
                                    label="Nombre de la vacuna *"
                                    value={formRegistro.nombre}
                                    onChange={(t) => setFormRegistro({ ...formRegistro, nombre: t })}
                                    placeholder="Ej: Rabia"
                                />
                                <Campo
                                    label="Fecha *"
                                    value={formRegistro.fecha}
                                    onChange={(t) => setFormRegistro({ ...formRegistro, fecha: t })}
                                    placeholder="DD/MM/AAAA"
                                />
                                <Text style={styles.label}>Estado</Text>
                                <View style={styles.tiposRow}>
                                    {['Al día', 'Pendiente'].map((e) => (
                                        <Pressable
                                            key={e}
                                            style={[
                                                styles.chipTipo,
                                                formRegistro.estado === e && styles.chipTipoActivo,
                                            ]}
                                            onPress={() => setFormRegistro({ ...formRegistro, estado: e })}
                                        >
                                            <Text
                                                style={[
                                                    styles.chipTexto,
                                                    formRegistro.estado === e && styles.chipTextoActivo,
                                                ]}
                                            >
                                                {e}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </>
                        )}

                        {tipoRegistro === 'cita' && (
                            <>
                                <Campo
                                    label="Tipo de cita *"
                                    value={formRegistro.tipo}
                                    onChange={(t) => setFormRegistro({ ...formRegistro, tipo: t })}
                                    placeholder="Ej: Control general"
                                />
                                <Campo
                                    label="Fecha *"
                                    value={formRegistro.fecha}
                                    onChange={(t) => setFormRegistro({ ...formRegistro, fecha: t })}
                                    placeholder="DD/MM/AAAA"
                                />
                                <Campo
                                    label="Hora"
                                    value={formRegistro.hora}
                                    onChange={(t) => setFormRegistro({ ...formRegistro, hora: t })}
                                    placeholder="Ej: 10:00 a. m."
                                />
                                <Campo
                                    label="Veterinario"
                                    value={formRegistro.veterinario}
                                    onChange={(t) => setFormRegistro({ ...formRegistro, veterinario: t })}
                                    placeholder="Ej: Dra. Gómez"
                                />
                            </>
                        )}

                        {tipoRegistro === 'peso' && (
                            <>
                                <Campo
                                    label="Mes *"
                                    value={formRegistro.mes}
                                    onChange={(t) => setFormRegistro({ ...formRegistro, mes: t })}
                                    placeholder="Ej: Nov"
                                />
                                <Campo
                                    label="Peso (kg) *"
                                    value={formRegistro.valor}
                                    onChange={(t) => setFormRegistro({ ...formRegistro, valor: t })}
                                    placeholder="Ej: 28.5"
                                />
                            </>
                        )}

                        <View style={styles.botonesForm}>
                            <Pressable
                                style={styles.botonCancelar}
                                onPress={() => setModalAgregarRegistro(false)}
                            >
                                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                            </Pressable>
                            <Pressable style={styles.botonGuardar} onPress={guardarRegistro}>
                                <Text style={styles.botonGuardarTexto}>Guardar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ========== MODAL AGREGAR MASCOTA ========== */}
<Modal
    visible={modalAgregarVisible}
    transparent
    animationType="slide"
    onRequestClose={cerrarAgregar}
>
    <View style={styles.perfilOverlay}>
        <View style={styles.perfilSheet}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                {/* Header */}
                <View style={styles.perfilTopBar}>
                    <Pressable onPress={cerrarAgregar} style={styles.backBtn}>
                        <Text style={styles.backArrow}>←</Text>
                    </Pressable>
                    <Text style={styles.perfilTopTitle}>Agregar mascota</Text>
                    <View style={{ width: 32 }} />
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                    {/* Foto */}
                    <View style={{ alignItems: 'center', marginBottom: 16 }}>
                        <Pressable style={styles.fotoPlaceholder}>
                            <Text style={{ fontSize: 28 }}>📷</Text>
                        </Pressable>
                        <Text style={styles.fotoPlaceholderTexto}>Agregar foto</Text>
                    </View>

                    {/* Nombre */}
                    <Text style={styles.label}>Nombre *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            erroresAgregar.nombre && styles.inputError,
                        ]}
                        value={nuevaMascota.nombre}
                        onChangeText={(t) => actualizarCampoAgregar('nombre', t)}
                        placeholder="Ej. Max"
                        placeholderTextColor="#A0B0AC"
                    />
                    {erroresAgregar.nombre ? (
                        <Text style={styles.errorTextoWarn}>⚠ {erroresAgregar.nombre}</Text>
                    ) : null}

                    {/* Especie chips */}
                    <Text style={[styles.label, { marginTop: 8 }]}>Especie *</Text>
                    <View style={styles.tiposRow}>
                        {['Perro', 'Gato', 'Otro'].map((esp) => (
                            <Pressable
                                key={esp}
                                style={[
                                    styles.chipTipo,
                                    nuevaMascota.especie === esp && styles.chipTipoActivo,
                                ]}
                                onPress={() => actualizarCampoAgregar('especie', esp)}
                            >
                                <Text
                                    style={[
                                        styles.chipTexto,
                                        nuevaMascota.especie === esp && styles.chipTextoActivo,
                                    ]}
                                >
                                    {esp}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                    {erroresAgregar.especie ? (
                        <Text style={styles.errorTextoWarn}>⚠ {erroresAgregar.especie}</Text>
                    ) : null}

                    {/* Raza */}
                    <Text style={styles.label}>Raza</Text>
                    <TextInput
                        style={styles.input}
                        value={nuevaMascota.raza}
                        onChangeText={(t) => actualizarCampoAgregar('raza', t)}
                        placeholder="Golden Retriever"
                        placeholderTextColor="#A0B0AC"
                    />

                    {/* Fecha nacimiento */}
                    <Text style={styles.label}>Fecha de nacimiento *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            erroresAgregar.fechaNacimiento && styles.inputError,
                        ]}
                        value={nuevaMascota.fechaNacimiento}
                        onChangeText={(t) => actualizarCampoAgregar('fechaNacimiento', t)}
                        placeholder="12/05/2023"
                        placeholderTextColor="#A0B0AC"
                    />
                    {erroresAgregar.fechaNacimiento ? (
                        <Text style={styles.errorTextoWarn}>
                            ⚠ {erroresAgregar.fechaNacimiento}
                        </Text>
                    ) : null}

                    {/* Peso */}
                    <Text style={styles.label}>Peso (kg) *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            erroresAgregar.peso && styles.inputError,
                        ]}
                        value={nuevaMascota.peso}
                        onChangeText={(t) => actualizarCampoAgregar('peso', t)}
                        placeholder="28.5"
                        placeholderTextColor="#A0B0AC"
                        keyboardType="decimal-pad"
                    />
                    {erroresAgregar.peso ? (
                        <Text style={styles.errorTextoWarn}>⚠ {erroresAgregar.peso}</Text>
                    ) : null}

                    {/* Color */}
                    <Text style={styles.label}>Color</Text>
                    <TextInput
                        style={styles.input}
                        value={nuevaMascota.color}
                        onChangeText={(t) => actualizarCampoAgregar('color', t)}
                        placeholder="Ej. Dorado"
                        placeholderTextColor="#A0B0AC"
                    />

                    <Text style={styles.notaObligatorios}>* Campos obligatorios</Text>

                    <Pressable style={styles.btnPrimario} onPress={guardarMascota}>
                        <Text style={styles.btnPrimarioTexto}>Guardar mascota</Text>
                    </Pressable>

                    <Pressable style={styles.btnSecundario} onPress={cerrarAgregar}>
                        <Text style={styles.btnSecundarioTexto}>Cancelar</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    </View>
</Modal>
        </View>
    );
}

function Campo({ label, value, onChange, placeholder, multiline, error }) {
    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    multiline && styles.inputMultiline,
                    error && styles.inputError,
                ]}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#A0B0AC"
                multiline={multiline}
            />
            {error ? <Text style={styles.errorTexto}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FCFB' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 25 },
    header: { marginBottom: 12 },
    title: { fontSize: 18, fontWeight: '700', color: '#173B36', marginBottom: 2 },
    subtitle: { fontSize: 10, color: '#8A9895' },
    mascotaCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 9,
        marginBottom: 9,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2EEEB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    photoContainer: { height: 90, position: 'relative' },
    mascotaImagen: { width: '100%', height: '100%' },
    photoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
    nombreContainer: { position: 'absolute', left: 10, bottom: 8 },
    nombre: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    raza: { color: '#E8F5F2', fontSize: 9, marginTop: 1 },
    pendientes: {
        position: 'absolute',
        right: 7,
        bottom: 7,
        backgroundColor: '#FFCB16',
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderRadius: 9,
    },
    pendientesText: { color: '#554500', fontSize: 7, fontWeight: '700' },
    datosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 16,
        paddingHorizontal: 5,
    },
    dato: { flex: 1, alignItems: 'center' },
    datoTitulo: { fontSize: 7, color: '#8A9895', marginBottom: 2 },
    datoValor: { fontSize: 8, color: '#344D48', fontWeight: '600' },
    separador: { width: 1, height: 24, backgroundColor: '#E8EFED' },
    progresoContainer: { paddingHorizontal: 8, marginBottom: 7 },
    progresoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3,
    },
    progresoTexto: { fontSize: 7, color: '#8A9895' },
    porcentaje: { fontSize: 7, color: '#08A98C', fontWeight: '700' },
    barraFondo: {
        width: '100%',
        height: 4,
        backgroundColor: '#DDF3EE',
        borderRadius: 5,
        overflow: 'hidden',
    },
    barraProgreso: { height: '100%', backgroundColor: '#10B795', borderRadius: 5 },
    botonPerfil: {
        marginHorizontal: 7,
        marginBottom: 7,
        height: 28,
        borderWidth: 1,
        borderColor: '#70DED0',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonPerfilTexto: { fontSize: 7, fontWeight: '700', color: '#09A88B' },
    agregarCard: {
        height: 70,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#71DED0',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
    },
    plus: { fontSize: 19, color: '#0EAE91', fontWeight: '300', lineHeight: 20 },
    agregarTexto: { fontSize: 7, color: '#0EAE91', fontWeight: '700', marginTop: 3 },

    // Perfil full-screen style
    perfilOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'flex-end',
    },
    perfilSheet: {
        backgroundColor: '#F4FCFA',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        maxHeight: '94%',
        paddingTop: 8,
    },
    perfilTopBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    backBtn: { width: 32, height: 32, justifyContent: 'center' },
    backArrow: { fontSize: 22, color: '#173B36', fontWeight: '600' },
    perfilTopTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#173B36',
    },
    perfilFotoGrande: {
        width: '100%',
        height: 180,
        borderRadius: 18,
        marginBottom: 14,
        backgroundColor: '#D9F3EC',
    },
    perfilNombreRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    perfilNombreGrande: {
        fontSize: 24,
        fontWeight: '800',
        color: '#173B36',
    },
    perfilSub: {
        fontSize: 13,
        color: '#71817E',
        marginTop: 2,
    },
    badgePendientes: {
        backgroundColor: '#FFCB16',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 14,
        marginLeft: 8,
        marginTop: 4,
    },
    badgePendientesTexto: {
        color: '#554500',
        fontSize: 11,
        fontWeight: '700',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
    },
    infoTitulo: {
        fontSize: 11,
        fontWeight: '700',
        color: '#8A9895',
        letterSpacing: 0.6,
        marginBottom: 10,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    infoCol: {
        width: '50%',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 11,
        color: '#8A9895',
        marginBottom: 2,
    },
    infoValor: {
        fontSize: 15,
        fontWeight: '700',
        color: '#173B36',
    },
    progresoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
    },
    progresoCardTitulo: {
        fontSize: 13,
        fontWeight: '600',
        color: '#173B36',
    },
    progresoCardPct: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0EAE91',
    },
    barraFondoPerfil: {
        height: 8,
        backgroundColor: '#DDF3EE',
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 8,
    },
    barraProgresoPerfil: {
        height: '100%',
        backgroundColor: '#0EB394',
        borderRadius: 8,
    },
    progresoDetalle: {
        fontSize: 12,
        color: '#71817E',
    },
    btnPrimario: {
        backgroundColor: '#0EAE91',
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: 'center',
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

    // Modales genéricos
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        padding: 16,
    },
    modalScroll: { flexGrow: 1, justifyContent: 'center', padding: 8 },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    modalHeaderSimple: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitulo: { fontSize: 18, fontWeight: 'bold', color: '#163B37' },
    closeText: { fontSize: 18, color: '#A0A0A0' },
    label: { fontSize: 12, color: '#526460', marginBottom: 4, fontWeight: '600' },
    input: {
        borderWidth: 1,
        borderColor: '#D0E5E0',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: '#FAFFFE',
        color: '#163B37',
    },
    inputError: { borderColor: '#E74C3C' },
    errorTexto: { color: '#E74C3C', fontSize: 11, marginTop: 4 },
    inputMultiline: { minHeight: 60, textAlignVertical: 'top' },
    botonesForm: { flexDirection: 'row', gap: 10, marginTop: 6 },
    botonCancelar: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#63DDCA',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    botonCancelarTexto: { color: '#0E9F86', fontWeight: 'bold', fontSize: 13 },
    botonGuardar: {
        flex: 1,
        backgroundColor: '#0EAE91',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    botonGuardarTexto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
    botonCerrar: {
        backgroundColor: '#0EAE91',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    botonCerrarTexto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },

    seccionHistorial: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#71817D',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    itemHistorial: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4FCFA',
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
    },
    itemTitulo: { fontSize: 13, fontWeight: '600', color: '#163B37' },
    itemSub: { fontSize: 11, color: '#71817E', marginTop: 2 },
    badgeEstado: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeAlDia: { backgroundColor: '#E8F8F4' },
    badgePendiente: { backgroundColor: '#FFF3E0' },
    badgeTexto: { fontSize: 11, fontWeight: 'bold' },
    badgeTextoAlDia: { color: '#0EAE91' },
    badgeTextoPendiente: { color: '#E67E22' },
    btnAgregarRegistro: {
        borderWidth: 1,
        borderColor: '#63DDCA',
        borderStyle: 'dashed',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 4,
    },
    btnAgregarRegistroTexto: { color: '#0E9F86', fontWeight: 'bold', fontSize: 12 },
    vacioTexto: { fontSize: 12, color: '#8A9996', marginBottom: 8 },
    graficaContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: 110,
        paddingTop: 4,
    },
    barraCol: { alignItems: 'center', flex: 1 },
    barraValor: { fontSize: 9, color: '#0EAE91', fontWeight: '600', marginBottom: 4 },
    barraFondoHist: {
        width: 22,
        height: 90,
        backgroundColor: 'transparent',
        borderRadius: 8,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barraValorHist: { width: '100%', backgroundColor: '#0EB394', borderRadius: 8 },
    barraMes: { fontSize: 10, color: '#71817E', marginTop: 6 },
    tiposRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    chipTipo: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F0F5F4',
        borderWidth: 1,
        borderColor: '#D0E5E0',
    },
    chipTipoActivo: { backgroundColor: '#E8F8F4', borderColor: '#0EAE91' },
    chipTexto: { fontSize: 12, color: '#526460' },
    chipTextoActivo: { color: '#0EAE91', fontWeight: 'bold' },
    fotoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F8F4',
    borderRadius: 60,
    width: 96,
    height: 96,
    alignSelf: 'center',
    marginBottom: 8,
    marginTop: 4,
},
fotoPlaceholderTexto: {
    fontSize: 12,
    color: '#0EAE91',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 16,
    textAlign: 'center',
    alignSelf: 'center',
},
errorTextoWarn: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: -6,
    marginBottom: 10,
},
notaObligatorios: {
    fontSize: 12,
    color: '#8A9895',
    marginBottom: 16,
    marginTop: 4,
},

    itemSalud: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEF5F3',
    },
    iconoSalud: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E8F8F4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    bloqueLista: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 12,
        marginBottom: 4,
    },
    badgeProxima: { backgroundColor: '#FFF3E0' },
    badgeRealizada: { backgroundColor: '#EEF2F1' },
    badgeTextoProxima: { color: '#E67E22' },
    badgeTextoRealizada: { color: '#7A8A87' },
    pesoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
    },
    pesoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    pesoLabel: { fontSize: 13, color: '#71817E' },
    pesoValor: { fontSize: 18, fontWeight: '800', color: '#0EAE91' },

});