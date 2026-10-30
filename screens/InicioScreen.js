import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Modal,
    Pressable,
} from 'react-native';

import SectionHeader from '../components/SectionHeader';
import PetCard from '../components/PetCard';
import ActivityRow from '../components/ActivityRow';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

import { obtenerMascotas } from '../services/mascotasService';
import { obtenerActividades } from '../services/actividadesService';

export default function InicioScreen({ onVerTodas, onAgregarActividad, onAgregarMascota }) {
    const [mascotas, setMascotas] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Estado del modal
    const [modalVisible, setModalVisible] = useState(false);
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [mascotasData, actividadesData] = await Promise.all([
                    obtenerMascotas(),
                    obtenerActividades(),
                ]);
                setMascotas(mascotasData);
                setActividades(actividadesData);
            } catch (error) {
                console.log('Error al cargar datos:', error);
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    const abrirDetalle = (mascota) => {
        setMascotaSeleccionada(mascota);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setMascotaSeleccionada(null);
    };

    if (cargando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0EAE91" />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Encabezado */}
                <View style={styles.header}>
                    <Text style={styles.fecha}>Jueves, 3 de septiembre</Text>
                    <Text style={styles.saludo}>Hola, Paula 👋</Text>
                    <Text style={styles.subtitulo}>
                        Así va el cuidado de tus mascotas hoy
                    </Text>
                </View>

                {/* Mis mascotas */}
                <SectionHeader
                    title="MIS MASCOTAS"
                    actionText="Ver todas"
                    onActionPress={onVerTodas}
                />

                {mascotas.map((mascota) => (
                    <PetCard
                        key={mascota.id}
                        mascota={mascota}
                        onPress={() => abrirDetalle(mascota)}
                    />
                ))}

                {/* Próximas actividades */}
                <View style={styles.activityHeader}>
                    <SectionHeader title="PRÓXIMAS ACTIVIDADES" />
                </View>

                <View style={styles.activitiesCard}>
                    {actividades.map((actividad) => (
                        <ActivityRow key={actividad.id} actividad={actividad} />
                    ))}
                </View>

                {/* Botones */}
                <View style={styles.buttonsContainer}>
                    <PrimaryButton
                        title="+ Agregar actividad"
                        onPress={onAgregarActividad}
                    />
                    <SecondaryButton
                        title="+ Agregar mascota"
                        onPress={onAgregarMascota}
                    />
                </View>
            </ScrollView>

            {/* ========== MODAL DE DETALLE ========== */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={cerrarModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {mascotaSeleccionada && (
                            <>
                                {/* Header del modal */}
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalFoto}>
                                        <Text style={styles.modalEmoji}>
                                            {mascotaSeleccionada.emoji}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.modalNombre}>
                                            {mascotaSeleccionada.nombre}
                                        </Text>
                                        <Text style={styles.modalRaza}>
                                            {mascotaSeleccionada.especie} • {mascotaSeleccionada.raza}
                                        </Text>
                                    </View>
                                    <Pressable onPress={cerrarModal} style={styles.closeButton}>
                                        <Text style={styles.closeText}>✕</Text>
                                    </Pressable>
                                </View>

                                {/* Datos */}
                                <View style={styles.datosContainer}>
                                    <Dato label="Peso" valor={mascotaSeleccionada.peso} />
                                    <Dato label="Edad" valor={mascotaSeleccionada.edad} />
                                    <Dato label="Sexo" valor={mascotaSeleccionada.sexo} />
                                    <Dato label="Color" valor={mascotaSeleccionada.color} />
                                    <Dato label="Nacimiento" valor={mascotaSeleccionada.fechaNacimiento} />
                                    <Dato label="Microchip" valor={mascotaSeleccionada.microchip} />
                                </View>

                                {/* Próxima actividad */}
                                <View style={styles.proximaBox}>
                                    <Text style={styles.proximaTitulo}>Próxima actividad</Text>
                                    <Text style={styles.proximaDetalle}>
                                        {mascotaSeleccionada.proximaEmoji}{' '}
                                        {mascotaSeleccionada.proximaActividad} — {mascotaSeleccionada.proximaHora}
                                    </Text>
                                </View>

                                {/* Notas */}
                                {mascotaSeleccionada.notas && (
                                    <View style={styles.notasBox}>
                                        <Text style={styles.notasTitulo}>Notas</Text>
                                        <Text style={styles.notasTexto}>
                                            {mascotaSeleccionada.notas}
                                        </Text>
                                    </View>
                                )}

                                {/* Botón cerrar */}
                                <Pressable style={styles.botonCerrar} onPress={cerrarModal}>
                                    <Text style={styles.botonCerrarTexto}>Cerrar</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Componente auxiliar para mostrar cada dato
function Dato({ label, valor }) {
    return (
        <View style={styles.datoRow}>
            <Text style={styles.datoLabel}>{label}</Text>
            <Text style={styles.datoValor}>{valor}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4FCFA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4FCFA',
    },
    loadingText: {
        marginTop: 10,
        color: '#71817E',
        fontSize: 14,
    },
    scrollContent: {
        paddingHorizontal: 20, 
        paddingTop: 50, 
        paddingBottom: 25
    },
    header: {
        marginBottom: 25,
    },
    fecha: {
        fontSize: 12,
        color: '#8B9896',
        marginBottom: 6,
    },
    saludo: {
        fontSize: 27,
        fontWeight: 'bold',
        color: '#163B37',
    },
    subtitulo: {
        fontSize: 14,
        color: '#71817E',
        marginTop: 5,
    },
    activityHeader: {
        marginTop: 10,
    },
    activitiesCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
    },

    // ===== Estilos del Modal =====
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxWidth: 380,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    modalFoto: {
        width: 55,
        height: 55,
        borderRadius: 14,
        backgroundColor: '#E2F5F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    modalEmoji: {
        fontSize: 30,
    },
    modalNombre: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#163B37',
    },
    modalRaza: {
        fontSize: 13,
        color: '#71817E',
        marginTop: 2,
    },
    closeButton: {
        padding: 6,
    },
    closeText: {
        fontSize: 18,
        color: '#A0A0A0',
    },
    datosContainer: {
        backgroundColor: '#F4FCFA',
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
    },
    datoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    datoLabel: {
        fontSize: 13,
        color: '#71817E',
    },
    datoValor: {
        fontSize: 13,
        fontWeight: '600',
        color: '#163B37',
    },
    proximaBox: {
        backgroundColor: '#E8F8F4',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    proximaTitulo: {
        fontSize: 12,
        color: '#0EAE91',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    proximaDetalle: {
        fontSize: 14,
        color: '#163B37',
        fontWeight: '600',
    },
    notasBox: {
        marginBottom: 16,
    },
    notasTitulo: {
        fontSize: 12,
        color: '#71817E',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    notasTexto: {
        fontSize: 13,
        color: '#526460',
        lineHeight: 19,
    },
    botonCerrar: {
        backgroundColor: '#0EAE91',
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: 'center',
    },
    botonCerrarTexto: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});