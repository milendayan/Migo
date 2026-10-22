import { View, Text, Pressable, StyleSheet } from 'react-native';

const tabs = [
  { id: 'inicio', icon: '🏠', label: 'Inicio' },
  { id: 'mascotas', icon: '🐾', label: 'Mascotas' },
  { id: 'horario', icon: '📅', label: 'Horario' },
  { id: 'migo', icon: '✨', label: 'MIGO IA' },
  { id: 'perfil', icon: '👤', label: 'Perfil' },
];

export default function BottomTabBar({ pantallaActual, onChange }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          style={styles.item}
          onPress={() => onChange(tab.id)}
        >
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text
            style={[
              styles.text,
              pantallaActual === tab.id && styles.textActive,
            ]}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7EEEC',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 19,
    marginBottom: 3,
  },
  text: {
    fontSize: 9,
    color: '#7F8D8A',
  },
  textActive: {
    color: '#0EAE91',
    fontWeight: 'bold',
  },
});