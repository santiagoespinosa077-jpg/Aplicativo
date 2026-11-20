import { useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, StatusBar } from 'react-native';
import { MantenimientoResponse, EstadoMantenimiento, Prioridad } from '../../interfaces/pandoraApiResponse';
import { useMantenimientoApi } from '../../hooks/useMantenimientoApi';
import { MantenimientoCard } from '../../components/MantenimientoCard';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { BtnTouch } from '../../components/BtnTouch';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { StackMantenimientoParams } from '../../navigator/MantenimientoStackNavigator';

export const HomeMantenimiento = () => {
  const { isLoading, loadMantenimiento, listMantenimiento } = useMantenimientoApi();
  const focused = useIsFocused();
  const navigation = useNavigation<StackNavigationProp<StackMantenimientoParams>>();

  useEffect(() => {
    (!isLoading) && loadMantenimiento();
  }, [focused]);

  const create: MantenimientoResponse = {
    id_in: 0,
    solicitante: '',
    area: '',
    ubicacion: '',
    tipo_mantenimiento: '',
    equipo: '',
    descripcion: '',
    prioridad: Prioridad.normal,
    fecha: new Date().toISOString(),
    tecnico: '',
    estado: EstadoMantenimiento.pendiente,
    observaciones: '',
    imagen1: '',
    imagen2: '',
    imagen3: '',
    imagen4: '',
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={listMantenimiento}
        keyExtractor={(item) => `#${item.id_in}`}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={(
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.subtitle}>Soporte técnico</Text>
              <Text style={styles.title}>Mantenimiento</Text>
            </View>
            <BtnTouch
              color="#2563EB"
              borderColor="#1D4ED8"
              text="+ Nueva"
              borderWidth={1}
              style={styles.createButton}
              onPress={() => navigation.navigate('FormMantenimiento', { ...create })}
            />
          </View>
        )}
        refreshControl={(
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadMantenimiento}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        )}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        renderItem={({ item }) => (
          <MantenimientoCard mantenimiento={item} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E8F0',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
});