
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import InicioScreen from './screens/InicioScreen';
import MisMascotasScreen from './screens/MisMascotasScreen';
import HorarioScreen from './screens/HorarioScreen';
import MigoIAScreen from './screens/MigoIAScreen';
import PerfilScreen from './screens/PerfilScreen';
import LoginScreen from './screens/LoginScreen';
import RegistroScreen from './screens/RegistroScreen';

import BottomTabBar from './navigation/BottomTabBar';
import { cargarSesion, escucharSesion } from './services/sesionService';

export default function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [pantallaAuth, setPantallaAuth] = useState('login');
  const [session, setSession] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Revisar si ya existe una sesión guardada en el celular.
    cargarSesion()
      .then((usuario) => setSession(usuario))
      .catch((error) => console.warn('Error al recuperar sesión:', error))
      .finally(() => setCargando(false));

    // Detectar cuando alguien inicia o cierra sesión.
    const dejarDeEscuchar = escucharSesion((usuario) => {
      setSession(usuario);
      if (!usuario) {
        setPantalla('inicio');
      }
    });

    return dejarDeEscuchar;
  }, []);

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
        return (
          <MisMascotasScreen
            onVerHorario={() => setPantalla('horario')}
          />
        );

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

  // Mostrar indicador mientras se verifica la sesión.
  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#0EAE91" />
        <StatusBar style="auto" />
      </View>
    );
  }

  // Si no hay sesión, mostrar login o registro.
  if (!session) {
    return (
      <View style={styles.container}>
        {pantallaAuth === 'login' ? (
          <LoginScreen
            onGoToRegister={() => setPantallaAuth('registro')}
          />
        ) : (
          <RegistroScreen
            onGoToLogin={() => setPantallaAuth('login')}
          />
        )}

        <StatusBar style="auto" />
      </View>
    );
  }

  // Si hay sesión, mostrar MIGO normalmente.
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
  cargando: {
    flex: 1,
    backgroundColor: '#F4FCFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
