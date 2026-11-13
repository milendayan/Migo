
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { supabase } from '../services/supabaseClient';

export default function LoginScreen({ onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const iniciarSesion = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      const { error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (authError) {
        setError(
          'No se pudo iniciar sesión. Verifica tus datos y confirma tu correo.'
        );
      }
    } catch (e) {
      setError('Error de conexión. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🐾 MIGO</Text>
      <Text style={styles.title}>¡Bienvenido de nuevo!</Text>
      <Text style={styles.subtitle}>
        Inicia sesión para cuidar a tus mascotas
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={iniciarSesion}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToRegister}>
          <Text style={styles.registerText}>
            ¿No tienes una cuenta?{' '}
            <Text style={styles.link}>Regístrate aquí</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FAF8',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0EAE91',
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#253B36',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#70817C',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#253B36',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DCE8E3',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#0EAE91',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#70817C',
  },
  link: {
    color: '#0EAE91',
    fontWeight: 'bold',
  },
  error: {
    color: '#C62828',
    marginBottom: 12,
    textAlign: 'center',
  },
});
