import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import InicioScreen from './screens/InicioScreen';
import MisMascotasScreen from './screens/MisMascotasScreen';
import HorarioScreen from './screens/HorarioScreen';
import MigoIAScreen from './screens/MigoIAScreen';
import PerfilScreen from './screens/PerfilScreen';
import BottomTabBar from './navigation/BottomTabBar';

export default function App() {
  const [pantalla, setPantalla] = useState('inicio');

  const renderPantalla = () => {
    switch (pantalla) {
      case 'inicio':
  return (
    <InicioScreen
      onVerTodas={() => setPantalla('mascotas')}
      onAgregarActividad={() => setPantalla('horario')}
      onAgregarMascota={() => setPantalla('mascotas')}
    />
  );
      case 'mascotas':
        return <MisMascotasScreen />;
      case 'horario':
        return <HorarioScreen />;
      case 'migo':
        return <MigoIAScreen />;
      case 'perfil':
        return <PerfilScreen />;
      default:
  return (
    <InicioScreen
      onVerTodas={() => setPantalla('mascotas')}
      onAgregarActividad={() => setPantalla('horario')}
      onAgregarMascota={() => setPantalla('mascotas')}
    />
  );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        {renderPantalla()}
      </View>

      <BottomTabBar
        pantallaActual={pantalla}
        onChange={setPantalla}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FCFA',
  },
  screen: {
    flex: 1,
  },
});