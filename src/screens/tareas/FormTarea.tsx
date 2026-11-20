import { useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { BtnTouch } from '../../components/BtnTouch';
import { StackScreenProps } from '@react-navigation/stack';
import { StackTareaParams } from '../../navigator/TareaStackNavigator';
import { useTareaForm } from '../../hooks/useTareaForm';
import { siguienteEstado } from '../../interfaces/pandoraApiResponse';

interface Props extends StackScreenProps<StackTareaParams, 'FormTarea'> {}

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
  estadoSecundario: '#0f172a',
};

export const FormTarea = ({ route, navigation }: Props) => {
  const { state, handleInputChange, handleSubmit, handleDelete, handleUpdate } = useTareaForm();

  useEffect(() => {
    const tarea = route.params;
    handleInputChange('id_tarea', tarea.id_tarea);
    handleInputChange('titulo', tarea.titulo);
    handleInputChange('descripcion', tarea.descripcion);
    handleInputChange('estado', tarea.estado);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

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
          <View style={styles.badge}>
            <Text style={styles.kicker}>GESTIÓN DE TAREAS</Text>
          </View>
          <Text style={styles.title}>
            {state.id_tarea === 0 ? 'Nueva tarea' : 'Editar tarea'}
          </Text>
          <Text style={styles.subtitle}>
            Gestiona el estado y los detalles de tu actividad
          </Text>
        </View>

        <View style={styles.card}>
          {state.id_tarea !== 0 && state.estado && (
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Estado actual</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>
                  {String(state.estado).toUpperCase()}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Título de la tarea</Text>
              <TextInput
                style={styles.input}
                value={state.titulo}
                onChangeText={(text) => handleInputChange('titulo', text)}
                placeholder="Escribe el título"
                placeholderTextColor={C.placeholder}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={state.descripcion}
                onChangeText={(text) => handleInputChange('descripcion', text)}
                placeholder="Escribe una breve descripción..."
                placeholderTextColor={C.placeholder}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonGroup}>
              <BtnTouch
                text={state.id_tarea === 0 ? 'Crear tarea' : 'Actualizar tarea'}
                color={C.acento}
                borderColor="transparent"
                borderWidth={0}
                onPress={async () => {
                  await handleSubmit();
                  navigation.popToTop();
                }}
              />

              {state.id_tarea !== 0 && (
                <>
                  <View style={styles.actionMargin}>
                    <BtnTouch
                      text={`${siguienteEstado(state.estado)}`}
                      color={C.estadoSecundario}
                      borderColor={C.estadoSecundario}
                      borderWidth={1}
                      onPress={async () => {
                        await handleUpdate(siguienteEstado(state.estado));
                        navigation.popToTop();
                      }}
                    />
                  </View>

                  <View style={styles.actionMargin}>
                    <BtnTouch
                      text="Eliminar tarea"
                      color={C.peligro}
                      borderColor={C.peligro}
                      borderWidth={1}
                      onPress={async () => {
                        await handleDelete();
                        navigation.popToTop();
                      }}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FormTarea;

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
    height: 245,
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
    paddingTop: 28,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  kicker: {
    fontSize: 10,
    fontWeight: '800',
    color: '#a7f3d0',
    letterSpacing: 1.4,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#d1fae5',
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textoSecundario,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.acentoSuave,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.acento,
    marginRight: 6,
  },
  statusText: {
    color: C.bannerSuperior,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
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
  textArea: {
    height: 115,
    paddingTop: 14,
    paddingBottom: 14,
  },
  buttonGroup: {
    marginTop: 10,
    alignItems: 'center',
  },
  actionMargin: {
    marginTop: 12,
  },
});