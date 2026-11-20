import { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { BtnTouch } from '../../components/BtnTouch';
import { StackScreenProps } from '@react-navigation/stack';
import { StackUserParams } from '../../navigator/UserStackNavigator';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useLocation } from '../../hooks/useLocation';
import { useUserForm } from '../../hooks/useUserForm';

interface Props extends StackScreenProps<StackUserParams, 'FormUser'> {}

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
  peligro: '#dc2626',
  peligroSuave: '#fef2f2'
};

export const FormUser = ({ route, navigation }: Props) => {
  const { state, handleInputChange, handleSubmit, handleDelete } = useUserForm();
  const { location } = useLocation();
  const { image64, pickImage } = useImagePicker();

  useEffect(() => {
    const user = route.params;
    handleInputChange('id_user', user.id_user);
    handleInputChange('username', user.username);
    handleInputChange('email', user.email);
    handleInputChange('imagen', user.imagen);
    handleInputChange('location', `${location?.coords.altitude},${location?.coords.latitude}`);
  }, []);

  useEffect(() => {
    image64 && handleInputChange('imagen', image64);
  }, [image64]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content"  />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBanner}>
          <View style={styles.decorativeCircleLarge} />
          <View style={styles.decorativeCircleSmall} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>
            {state.id_user === 0 ? 'Crear usuario' : 'Editar usuario'}
          </Text>
          <Text style={styles.subtitle}>
            Completa la información del perfil
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.avatarSection}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => pickImage()}
              style={styles.avatarTouch}
            >
              {state.imagen ? (
                <Image
                  style={styles.avatar}
                  source={{ uri: `data:image/png;base64,${state.imagen}` }}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>Añadir foto</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.changePhotoPill}
              onPress={() => pickImage()}
              activeOpacity={0.7}
            >
              <Text style={styles.changePhotoText}>Cambiar foto de perfil</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nombre de usuario</Text>
              <TextInput
                style={styles.input}
                value={state.username}
                onChangeText={(text) => handleInputChange('username', text)}
                placeholder="Ingresa el nombre"
                placeholderTextColor={C.placeholder}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                value={state.password}
                onChangeText={(text) => handleInputChange('password', text)}
                placeholder="••••••••"
                placeholderTextColor={C.placeholder}
                secureTextEntry={true}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                value={state.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="correo@ejemplo.com"
                placeholderTextColor={C.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.buttonGroup}>
              <BtnTouch
                text={state.id_user === 0 ? 'Guardar' : 'Actualizar'}
                color={C.acento}
                borderColor="transparent"
                borderWidth={0}
                onPress={() => {
                  handleSubmit();
                  navigation.popToTop();
                }}
              />

              {state.id_user !== 0 && (
                <View style={styles.deleteWrapper}>
                  <BtnTouch
                    text="Eliminar"
                    color={C.peligro}
                    borderColor={C.peligro}
                    borderWidth={1}
                    onPress={() => {
                      handleDelete();
                      navigation.popToTop();
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FormUser;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.fondo,
  },
  topBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 240,
    backgroundColor: C.bannerSuperior,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  decorativeCircleLarge: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: C.bannerAcento,
    opacity: 0.45,
  },
  decorativeCircleSmall: {
    position: 'absolute',
    bottom: 20,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: C.acento,
    opacity: 0.25,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#a7f3d0',
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: C.tarjeta,
    borderRadius: 24,
    padding: 22,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarTouch: {
    marginBottom: 10,
    padding: 4,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: '#6ee7b7',
    backgroundColor: '#ffffff',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.superficieInput,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: C.textoSecundario,
    fontSize: 12,
    fontWeight: '600',
  },
  changePhotoPill: {
    backgroundColor: C.acentoSuave,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  changePhotoText: {
    color: C.bannerSuperior,
    fontSize: 12,
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    color: C.textoPrincipal,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: C.superficieInput,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: C.bordeInput,
    color: C.textoPrincipal,
    fontSize: 15,
    height: 50,
    paddingHorizontal: 16,
  },
  buttonGroup: {
    marginTop: 12,
    alignItems: 'center',
  },
  deleteWrapper: {
    marginTop: 12,
  },
});