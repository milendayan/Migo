import React, { useState } from 'react';
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

export default function MisMascotasScreen() {
    const [mascotas, setMascotas] = useState([
        {
            id: 1,
            nombre: 'Max',
            especie: 'Perro',
            raza: 'Golden Retriever',
            edad: '3 años',
            peso: '28.5 kg',
            actividades: '4/7',
            progreso: 57,
            pendientes: '3 pendientes',
            sexo: 'Macho',
            color: 'Dorado',
            fechaNacimiento: '15/03/2022',
            microchip: '981000123456789',
            notas: 'Le gusta jugar con la pelota y es muy sociable.',
            imagen: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
        },
        {
            id: 2,
            nombre: 'Luna',
            especie: 'Gato',
            raza: 'Criollo',
            edad: '2 años',
            peso: '4.2 kg',
            actividades: '3/5',
            progreso: 60,
            pendientes: '2 pendientes',
            sexo: 'Hembra',
            color: 'Naranja atigrado',
            fechaNacimiento: '10/08/2023',
            microchip: '981000987654321',
            notas: 'Es un poco tímida con extraños pero muy cariñosa en casa.',
            imagen: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800',
        },
    ]);

    // Modal Ver / Editar Perfil
    const [modalPerfilVisible, setModalPerfilVisible] = useState(false);
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [formEditar, setFormEditar] = useState({});
    const [erroresEditar, setErroresEditar] = useState({});

    // Modal Agregar Mascota
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

    const validarCampos = (datos) => {
        const errores = {};
        if (!datos.nombre?.trim()) errores.nombre = 'El nombre es obligatorio';
        if (!datos.especie?.trim()) errores.especie = 'La especie es obligatoria';
        if (!datos.raza?.trim()) errores.raza = 'La raza es obligatoria';
        if (!datos.edad?.trim()) errores.edad = 'La edad es obligatoria';
        if (!datos.peso?.trim()) errores.peso = 'El peso es obligatorio';
        if (!datos.sexo?.trim()) errores.sexo = 'El sexo es obligatorio';
        if (!datos.color?.trim()) errores.color = 'El color es obligatorio';
        if (!datos.fechaNacimiento?.trim()) errores.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
        return errores;
    };

    const guardarEdicion = () => {
        const errores = validarCampos(formEditar);
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
        const errores = validarCampos(nuevaMascota);
        setErroresAgregar(errores);
        if (Object.keys(errores).length > 0) return;

        const mascotaNueva = {
            id: Date.now(),
            nombre: nuevaMascota.nombre,
            especie: nuevaMascota.especie,
            raza: nuevaMascota.raza,
            edad: nuevaMascota.edad,
            peso: nuevaMascota.peso,
            sexo: nuevaMascota.sexo,
            color: nuevaMascota.color,
            fechaNacimiento: nuevaMascota.fechaNacimiento,
            microchip: nuevaMascota.microchip || '—',
            notas: nuevaMascota.notas || '',
            actividades: '0/0',
            progreso: 0,
            pendientes: '0 pendientes',
            imagen: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
        };

        setMascotas([...mascotas, mascotaNueva]);
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

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Mis mascotas</Text>
                    <Text style={styles.subtitle}>
                        {mascotas.length} mascota{mascotas.length !== 1 ? 's' : ''} registrada{mascotas.length !== 1 ? 's' : ''}
                    </Text>
                </View>

                {mascotas.map((mascota) => (
                    <View key={mascota.id} style={styles.mascotaCard}>
                        <View style={styles.photoContainer}>
                            <Image source={{ uri: mascota.imagen }} style={styles.mascotaImagen} />
                            <View style={styles.photoOverlay} />
                            <View style={styles.nombreContainer}>
                                <Text style={styles.nombre}>{mascota.nombre}</Text>
                                <Text style={styles.raza}>{mascota.especie} • {mascota.raza}</Text>
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

            {/* ========== MODAL VER / EDITAR PERFIL ========== */}
            <Modal
                visible={modalPerfilVisible}
                transparent
                animationType="fade"
                onRequestClose={cerrarPerfil}
            >
                <View style={styles.modalOverlay}>
                    <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
                        <View style={styles.modalContent}>
                            {mascotaSeleccionada && (
                                <>
                                    <View style={styles.modalHeader}>
                                        <Image
                                            source={{ uri: mascotaSeleccionada.imagen }}
                                            style={styles.modalFoto}
                                        />
                                        <View style={{ flex: 1 }}>
                                            {modoEdicion ? (
                                                <>
                                                    <TextInput
                                                        style={[styles.inputNombre, erroresEditar.nombre && styles.inputError]}
                                                        value={formEditar.nombre}
                                                        onChangeText={(t) => actualizarCampoEditar('nombre', t)}
                                                        placeholder="Nombre"
                                                    />
                                                    {erroresEditar.nombre ? (
                                                        <Text style={styles.errorTexto}>{erroresEditar.nombre}</Text>
                                                    ) : null}
                                                    <TextInput
                                                        style={[styles.inputRaza, erroresEditar.especie && styles.inputError]}
                                                        value={formEditar.especie || ''}
                                                        onChangeText={(t) => actualizarCampoEditar('especie', t)}
                                                        placeholder="Especie"
                                                    />
                                                    {erroresEditar.especie ? (
                                                        <Text style={styles.errorTexto}>{erroresEditar.especie}</Text>
                                                    ) : null}
                                                </>
                                            ) : (
                                                <>
                                                    <Text style={styles.modalNombre}>{mascotaSeleccionada.nombre}</Text>
                                                    <Text style={styles.modalRaza}>
                                                        {mascotaSeleccionada.especie} • {mascotaSeleccionada.raza}
                                                    </Text>
                                                </>
                                            )}
                                        </View>
                                        <Pressable onPress={cerrarPerfil} style={styles.closeButton}>
                                            <Text style={styles.closeText}>✕</Text>
                                        </Pressable>
                                    </View>

                                    {modoEdicion ? (
                                        <View style={styles.formBox}>
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
                                                placeholder="Número de microchip (opcional)"
                                            />
                                            <Campo
                                                label="Notas"
                                                value={formEditar.notas}
                                                onChange={(t) => actualizarCampoEditar('notas', t)}
                                                placeholder="Notas adicionales (opcional)"
                                                multiline
                                            />
                                        </View>
                                    ) : (
                                        <View style={styles.datosBox}>
                                            <Dato label="Edad" valor={mascotaSeleccionada.edad} />
                                            <Dato label="Peso" valor={mascotaSeleccionada.peso} />
                                            <Dato label="Sexo" valor={mascotaSeleccionada.sexo} />
                                            <Dato label="Color" valor={mascotaSeleccionada.color} />
                                            <Dato label="Nacimiento" valor={mascotaSeleccionada.fechaNacimiento} />
                                            <Dato label="Microchip" valor={mascotaSeleccionada.microchip} />
                                            <Dato label="Actividades" valor={mascotaSeleccionada.actividades} />
                                            <Dato label="Progreso hoy" valor={`${mascotaSeleccionada.progreso}%`} />
                                        </View>
                                    )}

                                    {!modoEdicion && mascotaSeleccionada.notas ? (
                                        <View style={styles.notasBox}>
                                            <Text style={styles.notasTitulo}>Notas</Text>
                                            <Text style={styles.notasTexto}>{mascotaSeleccionada.notas}</Text>
                                        </View>
                                    ) : null}

                                    {modoEdicion ? (
                                        <View style={styles.botonesForm}>
                                            <Pressable style={styles.botonCancelar} onPress={cancelarEdicion}>
                                                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                                            </Pressable>
                                            <Pressable style={styles.botonGuardar} onPress={guardarEdicion}>
                                                <Text style={styles.botonGuardarTexto}>Guardar</Text>
                                            </Pressable>
                                        </View>
                                    ) : (
                                        <View style={styles.botonesForm}>
                                            <Pressable style={styles.botonEditar} onPress={activarEdicion}>
                                                <Text style={styles.botonEditarTexto}>Editar</Text>
                                            </Pressable>
                                            <Pressable style={styles.botonCerrar} onPress={cerrarPerfil}>
                                                <Text style={styles.botonCerrarTexto}>Cerrar</Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* ========== MODAL AGREGAR MASCOTA ========== */}
            <Modal
                visible={modalAgregarVisible}
                transparent
                animationType="slide"
                onRequestClose={cerrarAgregar}
            >
                <View style={styles.modalOverlay}>
                    <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeaderSimple}>
                                <Text style={styles.modalTitulo}>Nueva mascota</Text>
                                <Pressable onPress={cerrarAgregar}>
                                    <Text style={styles.closeText}>✕</Text>
                                </Pressable>
                            </View>

                            <Campo
                                label="Nombre *"
                                value={nuevaMascota.nombre}
                                onChange={(t) => actualizarCampoAgregar('nombre', t)}
                                placeholder="Ej: Max"
                                error={erroresAgregar.nombre}
                            />
                            <Campo
                                label="Especie *"
                                value={nuevaMascota.especie}
                                onChange={(t) => actualizarCampoAgregar('especie', t)}
                                placeholder="Ej: Perro / Gato"
                                error={erroresAgregar.especie}
                            />
                            <Campo
                                label="Raza *"
                                value={nuevaMascota.raza}
                                onChange={(t) => actualizarCampoAgregar('raza', t)}
                                placeholder="Ej: Golden Retriever"
                                error={erroresAgregar.raza}
                            />
                            <Campo
                                label="Edad *"
                                value={nuevaMascota.edad}
                                onChange={(t) => actualizarCampoAgregar('edad', t)}
                                placeholder="Ej: 3 años"
                                error={erroresAgregar.edad}
                            />
                            <Campo
                                label="Peso *"
                                value={nuevaMascota.peso}
                                onChange={(t) => actualizarCampoAgregar('peso', t)}
                                placeholder="Ej: 28.5 kg"
                                error={erroresAgregar.peso}
                            />
                            <Campo
                                label="Sexo *"
                                value={nuevaMascota.sexo}
                                onChange={(t) => actualizarCampoAgregar('sexo', t)}
                                placeholder="Macho / Hembra"
                                error={erroresAgregar.sexo}
                            />
                            <Campo
                                label="Color *"
                                value={nuevaMascota.color}
                                onChange={(t) => actualizarCampoAgregar('color', t)}
                                placeholder="Ej: Dorado"
                                error={erroresAgregar.color}
                            />
                            <Campo
                                label="Nacimiento *"
                                value={nuevaMascota.fechaNacimiento}
                                onChange={(t) => actualizarCampoAgregar('fechaNacimiento', t)}
                                placeholder="DD/MM/AAAA"
                                error={erroresAgregar.fechaNacimiento}
                            />
                            <Campo
                                label="Microchip"
                                value={nuevaMascota.microchip}
                                onChange={(t) => actualizarCampoAgregar('microchip', t)}
                                placeholder="Número de microchip (opcional)"
                            />
                            <Campo
                                label="Notas"
                                value={nuevaMascota.notas}
                                onChange={(t) => actualizarCampoAgregar('notas', t)}
                                placeholder="Notas adicionales (opcional)"
                                multiline
                            />

                            <View style={styles.botonesForm}>
                                <Pressable style={styles.botonCancelar} onPress={cerrarAgregar}>
                                    <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                                </Pressable>
                                <Pressable style={styles.botonGuardar} onPress={guardarMascota}>
                                    <Text style={styles.botonGuardarTexto}>Guardar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

function Dato({ label, valor }) {
    return (
        <View style={styles.datoRow}>
            <Text style={styles.datoLabel}>{label}</Text>
            <Text style={styles.datoValorModal}>{valor || '—'}</Text>
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
    scrollContent: { paddingHorizontal: 50, paddingTop: 16, paddingBottom: 25 },
    header: { marginBottom: 12 },
    title: { fontSize: 18, fontWeight: '700', color: '#173B36', marginBottom: 2 },
    subtitle: { fontSize: 10, color: '#8A9895' },
    mascotaCard: {
        backgroundColor: '#FFFFFF', borderRadius: 9, marginBottom: 9, overflow: 'hidden',
        borderWidth: 1, borderColor: '#E2EEEB',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2,
    },
    photoContainer: { height: 90, position: 'relative' },
    mascotaImagen: { width: '100%', height: '100%' },
    photoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
    nombreContainer: { position: 'absolute', left: 10, bottom: 8 },
    nombre: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    raza: { color: '#E8F5F2', fontSize: 9, marginTop: 1 },
    pendientes: {
        position: 'absolute', right: 7, bottom: 7, backgroundColor: '#FFCB16',
        paddingHorizontal: 7, paddingVertical: 4, borderRadius: 9,
    },
    pendientesText: { color: '#554500', fontSize: 7, fontWeight: '700' },
    datosContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 16, paddingHorizontal: 5 },
    dato: { flex: 1, alignItems: 'center' },
    datoTitulo: { fontSize: 7, color: '#8A9895', marginBottom: 2 },
    datoValor: { fontSize: 8, color: '#344D48', fontWeight: '600' },
    separador: { width: 1, height: 24, backgroundColor: '#E8EFED' },
    progresoContainer: { paddingHorizontal: 8, marginBottom: 7 },
    progresoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
    progresoTexto: { fontSize: 7, color: '#8A9895' },
    porcentaje: { fontSize: 7, color: '#08A98C', fontWeight: '700' },
    barraFondo: { width: '100%', height: 4, backgroundColor: '#DDF3EE', borderRadius: 5, overflow: 'hidden' },
    barraProgreso: { height: '100%', backgroundColor: '#10B795', borderRadius: 5 },
    botonPerfil: {
        marginHorizontal: 7, marginBottom: 7, height: 28, borderWidth: 1, borderColor: '#70DED0',
        borderRadius: 6, alignItems: 'center', justifyContent: 'center',
    },
    botonPerfilTexto: { fontSize: 7, fontWeight: '700', color: '#09A88B' },
    agregarCard: {
        height: 70, borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: '#71DED0',
        alignItems: 'center', justifyContent: 'center', marginTop: 1,
    },
    plus: { fontSize: 19, color: '#0EAE91', fontWeight: '300', lineHeight: 20 },
    agregarTexto: { fontSize: 7, color: '#0EAE91', fontWeight: '700', marginTop: 3 },

    // Modales
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center' },
    modalScroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    modalContent: {
        backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18,
        width: '100%', maxWidth: 380, alignSelf: 'center',
    },
    modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    modalHeaderSimple: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalFoto: { width: 52, height: 52, borderRadius: 12, marginRight: 12 },
    modalNombre: { fontSize: 18, fontWeight: 'bold', color: '#163B37' },
    modalRaza: { fontSize: 12, color: '#71817E', marginTop: 2 },
    modalTitulo: { fontSize: 18, fontWeight: 'bold', color: '#163B37' },
    closeButton: { padding: 6 },
    closeText: { fontSize: 18, color: '#A0A0A0' },
    datosBox: { backgroundColor: '#F4FCFA', borderRadius: 12, padding: 12, marginBottom: 12 },
    formBox: { marginBottom: 8 },
    datoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
    datoLabel: { fontSize: 13, color: '#71817E' },
    datoValorModal: { fontSize: 13, fontWeight: '600', color: '#163B37' },
    notasBox: { marginBottom: 14 },
    notasTitulo: { fontSize: 12, color: '#71817E', fontWeight: 'bold', marginBottom: 4 },
    notasTexto: { fontSize: 13, color: '#526460', lineHeight: 19 },
    label: { fontSize: 12, color: '#526460', marginBottom: 4, fontWeight: '600' },
    input: {
        borderWidth: 1, borderColor: '#D0E5E0', borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10, fontSize: 14,
        backgroundColor: '#FAFFFE', color: '#163B37',
    },
    inputError: {
        borderColor: '#E74C3C',
    },
    errorTexto: {
        color: '#E74C3C',
        fontSize: 11,
        marginTop: 4,
    },
    inputMultiline: { minHeight: 60, textAlignVertical: 'top' },
    inputNombre: {
        fontSize: 17, fontWeight: 'bold', color: '#163B37',
        borderBottomWidth: 1, borderBottomColor: '#D0E5E0', paddingVertical: 2, marginBottom: 4,
    },
    inputRaza: { fontSize: 12, color: '#71817E', paddingVertical: 2, marginBottom: 4 },
    botonesForm: { flexDirection: 'row', gap: 10, marginTop: 6 },
    botonCancelar: {
        flex: 1, borderWidth: 1.5, borderColor: '#63DDCA', borderRadius: 12,
        paddingVertical: 12, alignItems: 'center',
    },
    botonCancelarTexto: { color: '#0E9F86', fontWeight: 'bold', fontSize: 13 },
    botonGuardar: {
        flex: 1, backgroundColor: '#0EAE91', borderRadius: 12,
        paddingVertical: 12, alignItems: 'center',
    },
    botonGuardarTexto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
    botonEditar: {
        flex: 1, borderWidth: 1.5, borderColor: '#0EAE91', borderRadius: 12,
        paddingVertical: 12, alignItems: 'center',
    },
    botonEditarTexto: { color: '#0EAE91', fontWeight: 'bold', fontSize: 13 },
    botonCerrar: {
        flex: 1, backgroundColor: '#0EAE91', borderRadius: 12,
        paddingVertical: 12, alignItems: 'center',
    },
    botonCerrarTexto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
});