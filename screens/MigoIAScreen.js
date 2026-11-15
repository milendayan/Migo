import { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
    ActivityIndicator,
} from 'react-native';

import { preguntarMigoIA } from '../services/iaService';

const SALUDO =
    '¡Hola! Soy MIGO IA, tu asistente de bienestar para mascotas. ' +
    'Puedo ayudarte con dudas generales sobre el cuidado de tus animales. ' +
    '¿En qué puedo orientarte hoy?';

export default function MigoIAScreen() {
    // Conversación: [{ rol: 'usuario' | 'migo', texto }]
    const [mensajes, setMensajes] = useState([{ rol: 'migo', texto: SALUDO }]);
    const [pregunta, setPregunta] = useState('');
    const [enviando, setEnviando] = useState(false);
    const scrollRef = useRef(null);

    // POST /api/ia/chat
    const enviar = async () => {
        const texto = pregunta.trim();
        if (!texto || enviando) return;

        const conversacion = [...mensajes, { rol: 'usuario', texto }];
        setMensajes(conversacion);
        setPregunta('');
        setEnviando(true);

        try {
            // El saludo inicial no se envía; solo la conversación real
            const respuesta = await preguntarMigoIA(conversacion.slice(1));
            setMensajes([...conversacion, { rol: 'migo', texto: respuesta }]);
        } catch (e) {
            setMensajes([...conversacion, { rol: 'migo', texto: `⚠ ${e.message}` }]);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <View style={styles.container}>

            {/* Encabezado */}
            <View style={styles.header}>
                <View style={styles.logo}>
                    <Text style={styles.logoText}>✨</Text>
                </View>
                <View>
                    <Text style={styles.title}>MIGO IA</Text>
                    <Text style={styles.status}>● En línea</Text>
                </View>
            </View>

            {/* Aviso */}
            <View style={styles.warning}>
                <Text style={styles.warningText}>
                    ⚠ MIGO IA brinda orientación general y no reemplaza
                    la consulta, diagnóstico ni tratamiento de un veterinario.
                </Text>
            </View>

            {/* Conversación */}
            <ScrollView
                ref={scrollRef}
                style={styles.chat}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
                {mensajes.map((m, index) =>
                    m.rol === 'usuario' ? (
                        <View key={index} style={styles.userMessage}>
                            <Text style={styles.userMessageText}>{m.texto}</Text>
                        </View>
                    ) : (
                        <View key={index} style={styles.messageRow}>
                            <View style={styles.smallLogo}>
                                <Text>✨</Text>
                            </View>
                            <View style={styles.migoMessage}>
                                <Text style={styles.messageText}>{m.texto}</Text>
                            </View>
                        </View>
                    )
                )}

                {enviando && (
                    <View style={styles.messageRow}>
                        <View style={styles.smallLogo}>
                            <Text>✨</Text>
                        </View>
                        <View style={styles.migoMessage}>
                            <ActivityIndicator size="small" color="#0EAE91" />
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Campo de mensaje */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe tu pregunta..."
                    placeholderTextColor="#9AA8A5"
                    value={pregunta}
                    onChangeText={setPregunta}
                    onSubmitEditing={enviar}
                    maxLength={1000}
                    editable={!enviando}
                />
                <Pressable
                    style={[styles.sendButton, (!pregunta.trim() || enviando) && { opacity: 0.5 }]}
                    onPress={enviar}
                    disabled={!pregunta.trim() || enviando}
                >
                    <Text style={styles.sendText}>➤</Text>
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F4FCFA',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 35,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
    },

    logo: {
        width: 48,
        height: 48,
        borderRadius: 13,
        backgroundColor: '#0EAE91',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    logoText: {
        fontSize: 25,
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#173B36',
    },

    status: {
        fontSize: 10,
        color: '#0EAE91',
        marginTop: 2,
    },

    warning: {
        marginHorizontal: 15,
        marginTop: 10,
        padding: 13,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#F2D77C',
        backgroundColor: '#FFF9E6',
    },

    warningText: {
        color: '#8A711A',
        fontSize: 10,
        lineHeight: 15,
        fontWeight: '600',
    },

    chat: {
        flex: 1,
        backgroundColor: '#EAF9F6',
        marginTop: 12,
    },

    chatContent: {
        paddingHorizontal: 20, 
        paddingTop: 50, 
        paddingBottom: 25
    },

    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
    },

    smallLogo: {
        width: 31,
        height: 31,
        borderRadius: 9,
        backgroundColor: '#0EAE91',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 7,
    },

    migoMessage: {
        maxWidth: '78%',
        backgroundColor: '#FFFFFF',
        padding: 13,
        borderRadius: 14,
        borderTopLeftRadius: 4,

        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },

    messageText: {
        fontSize: 12,
        lineHeight: 18,
        color: '#425854',
        marginBottom: 5,
    },

    userMessage: {
        alignSelf: 'flex-end',
        maxWidth: '75%',
        backgroundColor: '#0EAE91',
        padding: 13,
        borderRadius: 14,
        borderBottomRightRadius: 4,
        marginBottom: 15,
    },

    userMessageText: {
        color: '#FFFFFF',
        fontSize: 12,
        lineHeight: 17,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2EBE8',
    },

    input: {
        flex: 1,
        height: 45,
        backgroundColor: '#F2F7F6',
        borderRadius: 23,
        paddingHorizontal: 17,
        color: '#40524F',
        fontSize: 12,
    },

    sendButton: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: '#0EAE91',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },

    sendText: {
        color: '#FFFFFF',
        fontSize: 20,
    },
});