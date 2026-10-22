import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function PetCard({ mascota, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.foto}>
        <Text style={styles.emoji}>{mascota.emoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.nombre}>{mascota.nombre}</Text>
        <Text style={styles.raza}>
          {mascota.especie} • {mascota.raza}
        </Text>
        <Text style={styles.actividades}>{mascota.actividades}</Text>
        <Text style={styles.porcentaje}>{mascota.progreso}</Text>

        <View style={styles.progressBg}>
          <View style={[styles.progress, { width: mascota.progreso }]} />
        </View>

        <View style={styles.proxima}>
          <Text style={styles.proximaTexto}>
            Próx. {mascota.proximaEmoji}{' '}
          </Text>
          <Text style={styles.proximaActividad}>
            {mascota.proximaActividad}
          </Text>
          <Text style={styles.proximaTexto}>
            {' '} - {mascota.proximaHora}
          </Text>
        </View>
      </View>

      <Text style={styles.flecha}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  foto: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E2F5F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: { fontSize: 32 },
  info: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: 'bold', color: '#173B36' },
  raza: { fontSize: 11, color: '#899793', marginTop: 2 },
  actividades: { fontSize: 11, color: '#60716D', marginTop: 8, marginBottom: 3 },
  porcentaje: { fontSize: 10, fontWeight: 'bold', color: '#0EAE91', marginBottom: 3 },
  progressBg: {
    height: 5,
    borderRadius: 5,
    backgroundColor: '#D9F3ED',
    overflow: 'hidden',
  },
  progress: { height: 5, backgroundColor: '#0EB394', borderRadius: 5 },
  proxima: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  proximaTexto: { fontSize: 10, color: '#7E8D89' },
  proximaActividad: { fontSize: 10, color: '#526460', fontWeight: 'bold' },
  flecha: { fontSize: 25, color: '#A6B3B0', marginLeft: 5 },
});