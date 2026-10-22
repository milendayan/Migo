import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function SectionHeader({ title, actionText, onActionPress }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionText && (
        <Pressable onPress={onActionPress}>
          <Text style={styles.action}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#50615E',
    letterSpacing: 0.5,
  },
  action: {
    color: '#10AD91',
    fontWeight: 'bold',
    fontSize: 12,
  },
});