
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { supabase } from '../services/supabaseClient';

export default function RegistroScreen({ onGoToLogin }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const registrarUsuario = async () => {
    setError('');
    setMensaje('');

    if (!nombre.trim() || !email.trim() || !password || !confirmar) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: registroError } =
        await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              nombre: nombre.trim(),
            },
          },
        });

      if (registroError) {
        setError(registroError.message);
        return;
      }

      if (data.session) {
        setMensaje('¡Cuenta creada correctamente!');
      } else {
        setMensaje(
          'Revisa tu correo electrónico y confirma tu cuenta. Después podrás iniciar sesión.'
        );
      }
    } catch (e) {
      setError('No se pudo conectar. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.logo}>🐾 MIGO</Text>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>
        Únete a MIGO y comienza a cuidar a tus mascotas
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          value={nombre}
          onChangeText={setNombre}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          value={confirmar}
          onChangeText={setConfirmar}
          secureTextEntry
        />

        {!!error && (
          <Text style={styles.error}>{error}</Text>
        )}

        {!!mensaje && (
          <Text style={styles.success}>{mensaje}</Text>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
          ]}
          onPress={registrarUsuario}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              Crear mi cuenta
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToLogin}>
          <Text style={styles.loginText}>
            ¿Ya tienes cuenta?{' '}
            <Text style={styles.link}>
              Inicia sesión
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FAF8',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 48,
  },
  logo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0EAE91',
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#253B36',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#70817C',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
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
    marginBottom: 18,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
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
  success: {
    color: '#16805D',
    marginBottom: 12,
    textAlign: 'center',
  },
});
