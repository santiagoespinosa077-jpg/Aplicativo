import { useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TextInputProps, ScrollView, Image,
  StyleSheet, StatusBar, TouchableOpacity, Alert,
} from 'react-native';
import { BtnTouch } from '../../components/BtnTouch';
import { StackScreenProps } from '@react-navigation/stack';
import { StackMantenimientoParams } from '../../navigator/MantenimientoStackNavigator';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useMantenimientoForm, FormMantenimientoData } from '../../hooks/useMantenimientoForm';
import { EstadoMantenimiento, Prioridad } from '../../interfaces/pandoraApiResponse';

interface Props extends StackScreenProps<StackMantenimientoParams, 'FormMantenimiento'> {}

type ImagenKey = 'imagen1' | 'imagen2' | 'imagen3' | 'imagen4';
const IMAGENES: ImagenKey[] = ['imagen1', 'imagen2', 'imagen3', 'imagen4'];

const REQUERIDOS: (keyof FormMantenimientoData)[] = [
  'solicitante', 'area', 'ubicacion', 'tipo_mantenimiento', 'equipo', 'descripcion',
];

const C = {
  fondo: '#E2E8F0',
  tarjeta: '#FFFFFF',
  superficieInput: '#F8FAFC',
  borde: '#CBD5E1',
  acento: '#2563EB',
  acentoBorde: '#1D4ED8',
  textoPrincipal: '#0F172A',
  textoSecundario: '#475569',
  placeholder: '#94A3B8',
  inactivo: '#475569',
  peligro: '#DC2626',
  exito: '#16A34A',
  aviso: '#D97706',
};

const OPCIONES_ESTADO = [
  { valor: EstadoMantenimiento.pendiente, color: C.aviso },
  { valor: EstadoMantenimiento.en_proceso, color: C.acento },
  { valor: EstadoMantenimiento.completado, color: C.exito },
];

const OPCIONES_PRIORIDAD = [
  { valor: Prioridad.baja, color: C.exito },
  { valor: Prioridad.normal, color: C.acento },
  { valor: Prioridad.alta, color: C.peligro },
];

interface SelectorProps<T extends string> {
  label: string;
  opciones: { valor: T; color: string }[];
  seleccionado: T;
  onSelect: (valor: T) => void;
}

const Selector = <T extends string>({ label, opciones, seleccionado, onSelect }: SelectorProps<T>) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.chipsRow}>
      {opciones.map(({ valor, color }) => {
        const activo = valor === seleccionado;
        return (
          <TouchableOpacity
            key={valor}
            activeOpacity={0.8}
            onPress={() => onSelect(valor)}
            style={[styles.chip, activo && { backgroundColor: color, borderColor: color }]}
          >
            <Text style={[styles.chipText, activo && styles.chipTextActive]}>
              {valor}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

export const FormMantenimiento = ({ route, navigation }: Props) => {
  const { state, handleInputChange, handleSubmit, handleDelete } = useMantenimientoForm();
  const { image64, pickImage } = useImagePicker();
  const slotActual = useRef<ImagenKey>('imagen1');

  useEffect(() => {
    const m = route.params;
    handleInputChange('id_in', m.id_in);
    handleInputChange('solicitante', m.solicitante);
    handleInputChange('area', m.area);
    handleInputChange('ubicacion', m.ubicacion);
    handleInputChange('tipo_mantenimiento', m.tipo_mantenimiento);
    handleInputChange('equipo', m.equipo);
    handleInputChange('descripcion', m.descripcion);
    handleInputChange('prioridad', m.prioridad);
    handleInputChange('estado', m.estado);
    handleInputChange('tecnico', m.tecnico ?? '');
    handleInputChange('observaciones', m.observaciones ?? '');
    IMAGENES.forEach((k) => handleInputChange(k, m[k] ?? ''));
  }, []);

  useEffect(() => {
    image64 && handleInputChange(slotActual.current, image64);
  }, [image64]);

  const elegirImagen = (key: ImagenKey) => {
    slotActual.current = key;
    pickImage();
  };

  const esNuevo = state.id_in === 0;

  const guardar = async () => {
    const faltantes = REQUERIDOS.filter((k) => !String(state[k] ?? '').trim());
    if (faltantes.length > 0) {
      Alert.alert('Faltan campos', `Completa: ${faltantes.join(', ')}`);
      return;
    }
    try {
      await handleSubmit();
      navigation.popToTop();
    } catch (e: any) {
      Alert.alert('No se pudo guardar', 'Revisa los datos e inténtalo de nuevo.');
    }
  };

  const eliminar = async () => {
    try {
      await handleDelete();
      navigation.popToTop();
    } catch (e: any) {
      Alert.alert('No se pudo eliminar', 'Inténtalo de nuevo.');
    }
  };

  const campo = (
    label: string,
    field: keyof FormMantenimientoData,
    placeholder: string,
    extra?: TextInputProps,
  ) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, extra?.multiline && styles.textArea]}
        value={String(state[field] ?? '')}
        onChangeText={(text) => handleInputChange(field, text)}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        {...extra}
      />
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content"/>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>Orden de servicio</Text>
          <Text style={styles.title}>
            {esNuevo ? 'Nueva solicitud' : 'Editar solicitud'}
          </Text>
          <Text style={styles.subtitle}>
            {esNuevo
              ? 'Completa la información de la solicitud'
              : 'Edita la información de la solicitud'}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.topAccent} />

          <View style={styles.cardBody}>
            {campo('SOLICITANTE', 'solicitante', 'Nombre del solicitante')}
            {campo('ÁREA', 'area', 'Escribe el área')}
            {campo('UBICACIÓN', 'ubicacion', 'Escribe la ubicación')}
            {campo('TIPO DE MANTENIMIENTO', 'tipo_mantenimiento', 'Preventivo, correctivo...')}
            {campo('EQUIPO', 'equipo', 'Escribe el equipo')}
            {campo('TÉCNICO', 'tecnico', 'Técnico asignado')}
            {campo('DESCRIPCIÓN', 'descripcion', 'Describe el problema...', {
              multiline: true,
              textAlignVertical: 'top',
            })}
            {campo('OBSERVACIONES', 'observaciones', 'Observaciones...', {
              multiline: true,
              textAlignVertical: 'top',
            })}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>IMÁGENES</Text>
              <View style={styles.imagesGrid}>
                {IMAGENES.map((key) => (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.8}
                    onPress={() => elegirImagen(key)}
                    style={styles.imageSlot}
                  >
                    {state[key] ? (
                      <Image
                        style={styles.image}
                        source={{ uri: `data:image/png;base64,${state[key]}` }}
                      />
                    ) : (
                      <Text style={styles.imagePlaceholderText}>+ Foto</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Selector
              label="ESTADO"
              opciones={OPCIONES_ESTADO}
              seleccionado={state.estado}
              onSelect={(valor) => handleInputChange('estado', valor)}
            />
            <Selector
              label="PRIORIDAD"
              opciones={OPCIONES_PRIORIDAD}
              seleccionado={state.prioridad}
              onSelect={(valor) => handleInputChange('prioridad', valor)}
            />

            <View style={styles.buttonGroup}>
              <BtnTouch
                text={esNuevo ? 'Crear solicitud' : 'Actualizar solicitud'}
                color={C.acento}
                borderColor={C.acentoBorde}
                borderWidth={1}
                onPress={guardar}
              />

              {!esNuevo && (
                <View style={styles.actionMargin}>
                  <BtnTouch
                    text="Eliminar solicitud"
                    color={C.peligro}
                    borderColor={C.peligro}
                    borderWidth={1}
                    onPress={eliminar}
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

export default FormMantenimiento;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.fondo,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.borde,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    color: C.acento,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: C.textoPrincipal,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  subtitle: {
    color: C.textoSecundario,
    fontSize: 14,
    marginTop: 2,
  },
  card: {
    backgroundColor: C.tarjeta,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.borde,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  topAccent: {
    height: 5,
    width: '100%',
    backgroundColor: C.acento,
  },
  cardBody: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    color: C.textoSecundario,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: C.superficieInput,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.borde,
    color: C.textoPrincipal,
    fontSize: 15,
    height: 48,
    paddingHorizontal: 14,
  },
  textArea: {
    height: 110,
    paddingTop: 14,
    paddingBottom: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: C.superficieInput,
    borderColor: C.borde,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipText: {
    color: C.inactivo,
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageSlot: {
    width: '47%',
    aspectRatio: 1,
    margin: '1.5%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.borde,
    backgroundColor: C.superficieInput,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholderText: {
    color: C.textoSecundario,
    fontSize: 12,
    fontWeight: '600',
  },
  buttonGroup: {
    marginTop: 10,
    alignItems: 'center',
  },
  actionMargin: {
    marginTop: 12,
  },
});