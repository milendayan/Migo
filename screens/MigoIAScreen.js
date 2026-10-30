import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
} from 'react-native';

export default function MigoIAScreen() {

    return (
        <View style={styles.container}>

            {/* Encabezado */}
            <View style={styles.header}>

                <View style={styles.logo}>
                    <Text style={styles.logoText}>
                        ✨
                    </Text>
                </View>

                <View>
                    <Text style={styles.title}>
                        MIGO IA
                    </Text>

                    <Text style={styles.status}>
                        ● En línea
                    </Text>
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
                style={styles.chat}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
            >

                {/* Mensaje MIGO */}
                <View style={styles.messageRow}>

                    <View style={styles.smallLogo}>
                        <Text>✨</Text>
                    </View>

                    <View style={styles.migoMessage}>
                        <Text style={styles.messageText}>
                            ¡Hola! Soy MIGO IA, tu asistente de
                            bienestar para mascotas. Puedo ayudarte
                            con dudas generales sobre el cuidado de
                            tus animales. ¿En qué puedo orientarte hoy?
                        </Text>
                    </View>

                </View>

                {/* Mensaje usuario */}
                <View style={styles.userMessage}>
                    <Text style={styles.userMessageText}>
                        ¿Cada cuánto debo bañar a mi mascota?
                    </Text>
                </View>

                {/* Respuesta MIGO */}
                <View style={styles.messageRow}>

                    <View style={styles.smallLogo}>
                        <Text>✨</Text>
                    </View>

                    <View style={styles.migoMessage}>
                        <Text style={styles.messageText}>
                            Las gatas generalmente se limpian solas 
                            y no necesitan baños frecuentes.
                            En casos normales, solo se recomienda bañarlos
                            si están muy sucios o tienen parásitos.
                            Puedes hacerlos con productos
                            especializados para gatos cada 4-6 semanas
                            si es necesario. ¿Tu gata tiene alguna 
                            condición especial?
                        </Text>

                    </View>

                </View>

            </ScrollView>

            {/* Campo de mensaje */}
            <View style={styles.inputContainer}>

                <TextInput
                    style={styles.input}
                    placeholder="Escribe tu pregunta..."
                    placeholderTextColor="#9AA8A5"
                />

                <Pressable style={styles.sendButton}>
                    <Text style={styles.sendText}>
                        ➤
                    </Text>
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