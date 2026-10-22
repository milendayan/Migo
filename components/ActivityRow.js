import { View, Text, StyleSheet } from 'react-native';

export default function ActivityRow({ actividad }) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Text>{actividad.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{actividad.nombre}</Text>
        <Text style={styles.type}>
          {actividad.tipo} • {actividad.mascota}
        </Text>
      </View>
      <Text style={styles.time}>{actividad.hora}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3F2',
  },
  icon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#E8F8F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  info: { flex: 1 },
  name: { fontSize: 13, fontWeight: 'bold', color: '#263D39' },
  type: { fontSize: 10, color: '#8A9996', marginTop: 3 },
  time: { fontSize: 11, fontWeight: 'bold', color: '#526460' },
});