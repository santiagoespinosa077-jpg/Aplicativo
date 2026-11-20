import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MantenimientoResponse } from '../interfaces/pandoraApiResponse';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { StackMantenimientoParams } from '../navigator/MantenimientoStackNavigator';

interface Props {
  mantenimiento: MantenimientoResponse;
}

const CARD_WIDTH = (Dimensions.get('window').width - 46) / 2;

const formatFecha = (fecha: string): string => {
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return '';
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
};

const getPrioridadColor = (prioridad: string) => {
  const p = String(prioridad).toLowerCase();
  if (p.includes('alta')) return { bg: '#FEE2E2', text: '#B91C1C', accent: '#DC2626' };
  if (p.includes('baja')) return { bg: '#DCFCE7', text: '#15803D', accent: '#16A34A' };
  return { bg: '#DBEAFE', text: '#1D4ED8', accent: '#2563EB' };
};

export const MantenimientoCard = ({ mantenimiento }: Props) => {
  const navigation = useNavigation<StackNavigationProp<StackMantenimientoParams>>();
  const prio = getPrioridadColor(String(mantenimiento.prioridad));

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      style={style.cardContainer}
      onPress={() => navigation.navigate('FormMantenimiento', { ...mantenimiento })}
    >
      <View style={[style.topAccent, { backgroundColor: prio.accent }]} />

      <View style={style.cardBody}>
        <View style={style.topRow}>
          <Text style={style.idText}>#{mantenimiento.id_in}</Text>
          <View style={[style.prioBadge, { backgroundColor: prio.bg }]}>
            <Text style={[style.prioText, { color: prio.text }]}>
              {String(mantenimiento.prioridad).toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={style.equipo} numberOfLines={1}>
          {mantenimiento.equipo}
        </Text>

        <Text style={style.solicitante} numberOfLines={1}>
          {mantenimiento.solicitante}
        </Text>

        <View style={style.estadoPill}>
          <Text style={style.estadoText} numberOfLines={1}>
            {String(mantenimiento.estado)}
          </Text>
        </View>

        <View style={style.footer}>
          <Text style={style.dateText} numberOfLines={1}>
            {formatFecha(mantenimiento.fecha)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
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
  },
  cardBody: {
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  prioBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  prioText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  equipo: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  solicitante: {
    color: '#475569',
    fontSize: 12,
    marginBottom: 10,
  },
  estadoPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  estadoText: {
    color: '#1E293B',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  footer: {
    width: '100%',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
});