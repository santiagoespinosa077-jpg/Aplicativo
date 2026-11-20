import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TareaResponse } from '../interfaces/pandoraApiResponse';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { StackTareaParams } from '../navigator/TareaStackNavigator';

interface Props {
  tarea: TareaResponse;
}

const getStatusStyle = (estado: string) => {
  const normalizado = String(estado).toLowerCase();
  if (normalizado.includes('complet') || normalizado.includes('termin')) {
    return {
      bg: '#d1fae5',
      border: '#6ee7b7',
      text: '#065f46',
      accent: '#059669',
    };
  }
  if (normalizado.includes('proceso') || normalizado.includes('progreso')) {
    return {
      bg: '#fef3c7',
      border: '#fcd34d',
      text: '#92400e',
      accent: '#d97706',
    };
  }
  return {
    bg: '#f1f5f9',
    border: '#cbd5e1',
    text: '#334155',
    accent: '#0f766e',
  };
};

export const TareaCard = ({ tarea }: Props) => {
  const navigation = useNavigation<StackNavigationProp<StackTareaParams>>();
  const statusColors = getStatusStyle(String(tarea.estado));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.cardContainer}
      onPress={() => navigation.navigate('FormTarea', { ...tarea })}
    >
      <View style={[styles.leftAccentBar, { backgroundColor: statusColors.accent }]} />

      <View style={styles.cardBody}>
        <View style={styles.topRow}>
          <View style={styles.idPill}>
            <Text style={styles.idText}>TAREA #{tarea.id_tarea}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColors.bg,
                borderColor: statusColors.border,
              },
            ]}
          >
            <View style={[styles.statusDot, { backgroundColor: statusColors.accent }]} />
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {String(tarea.estado).toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {tarea.titulo}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {tarea.descripcion}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Toca para actualizar</Text>
          <Text style={styles.actionHint}>Gestionar ›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  leftAccentBar: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  cardBody: {
    paddingVertical: 16,
    paddingLeft: 18,
    paddingRight: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  idPill: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  idText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  title: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 5,
    letterSpacing: -0.2,
  },
  description: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94a3b8',
  },
  actionHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
});