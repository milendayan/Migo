import { Pressable, Text, StyleSheet } from 'react-native';

export default function SecondaryButton({ title, onPress, style }) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#63DDCA',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    color: '#0E9F86',
    fontWeight: 'bold',
    fontSize: 12,
  },
});