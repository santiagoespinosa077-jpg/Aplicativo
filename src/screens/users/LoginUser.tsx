import { useRef, ComponentRef } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useLogin } from '../../hooks/useLogin';

const C = {
  fondo: '#f1f5f9',
  bannerSuperior: '#064e3b',
  bannerAcento: '#047857',
  tarjeta: '#ffffff',
  superficieInput: '#f8fafc',
  bordeInput: '#cbd5e1',
  acento: '#059669',
  acentoSuave: '#d1fae5',
  textoPrincipal: '#0f172a',
  textoSecundario: '#64748b',
  placeholder: '#94a3b8',
  panelServidorFondo: '#fffbeb',
  panelServidorBorde: '#fcd34d',
  panelServidorTexto: '#b45309',
  errorFondo: '#fef2f2',
  errorBorde: '#fecaca',
  error: '#dc2626'
};

export const LoginUser = () => {
  const {
    state, servidor, error, isLoading,
    setServidor, handleInputChange, handleLogin
  } = useLogin();

  const emailRef = useRef<ComponentRef<typeof TextInput>>(null);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBanner}>
          <View style={styles.decorativeCircleLarge} />
          <View style={styles.decorativeCircleSmall} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>
            Ingresa la IP del servidor y tus credenciales para continuar
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.serverBox}>
            <Text style={styles.serverLabel}>IP del servidor</Text>
            <View style={styles.serverInputWrapper}>
              <TextInput
                style={styles.serverInput}
                value={servidor}
                onChangeText={setServidor}
                placeholder="192.168.1.15"
                placeholderTextColor={C.placeholder}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>
            <Text style={styles.hint}>
              Si no escribes puerto se usa el 3000 (ej. 192.168.1.15:4000)
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={emailRef}
                style={styles.input}
                value={state.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={C.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={passwordRef}
                style={styles.input}
                value={state.password}
                onChangeText={(text) => handleInputChange('password', text)}
                placeholder="••••••••"
                placeholderTextColor={C.placeholder}
                secureTextEntry
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>
          </View>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.error}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginUser;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.fondo,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 58,
    paddingBottom: 40,
  },
  topBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 270,
    backgroundColor: C.bannerSuperior,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  decorativeCircleLarge: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: C.bannerAcento,
    opacity: 0.45,
  },
  decorativeCircleSmall: {
    position: 'absolute',
    bottom: 20,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: C.acento,
    opacity: 0.25,
  },
  header: {
    marginBottom: 26,
    paddingHorizontal: 4,
  },
  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#a7f3d0',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  card: {
    backgroundColor: C.tarjeta,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  serverBox: {
    backgroundColor: C.panelServidorFondo,
    borderWidth: 1,
    borderColor: C.panelServidorBorde,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  serverLabel: {
    color: C.panelServidorTexto,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  serverInputWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.panelServidorBorde,
  },
  serverInput: {
    color: C.textoPrincipal,
    fontSize: 15,
    height: 46,
    paddingHorizontal: 14,
  },
  hint: {
    color: C.panelServidorTexto,
    fontSize: 11,
    marginTop: 6,
    lineHeight: 16,
    opacity: 0.85,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    color: C.textoPrincipal,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: C.superficieInput,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: C.bordeInput,
  },
  input: {
    color: C.textoPrincipal,
    fontSize: 15,
    height: 50,
    paddingHorizontal: 16,
  },
  errorBox: {
    backgroundColor: C.errorFondo,
    borderWidth: 1,
    borderColor: C.errorBorde,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  error: {
    color: C.error,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  button: {
    alignItems: 'center',
    backgroundColor: C.acento,
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: C.acento,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});