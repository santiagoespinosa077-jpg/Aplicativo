import { useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, StatusBar } from 'react-native';
import { TareaResponse, EstadoTarea } from '../../interfaces/pandoraApiResponse';
import { useTareaApi } from '../../hooks/useTareaApi';
import { TareaCard } from '../../components/TareaCard';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { BtnTouch } from '../../components/BtnTouch';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { StackTareaParams } from '../../navigator/TareaStackNavigator';

const C = {
  fondo: '#f1f5f9',
  bannerSuperior: '#064e3b',
  bannerAcento: '#047857',
  acento: '#059669',
};

export const HomeTareas = () => {
  const { isLoading, loadTarea, listTarea } = useTareaApi();
  const focused = useIsFocused();
  const navigation = useNavigation<StackNavigationProp<StackTareaParams>>();

  useEffect(() => {
    (!isLoading) && loadTarea();
  }, [focused]);

  const create: TareaResponse = {
    id_tarea: 0,
    titulo: '',
    descripcion: '',
    estado: EstadoTarea.pendiente,
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content"  />

      <View style={styles.topBanner}>
        <View style={styles.decorativeCircleLarge} />
        <View style={styles.decorativeCircleSmall} />
      </View>

      <FlatList
        data={listTarea}
        keyExtractor={(item) => `#${item.id_tarea}`}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={(
          <View style={styles.headerContainer}>
            <View>
              <View style={styles.badge}>
                <Text style={styles.subtitle}>ACTIVIDADES</Text>
              </View>
              <Text style={styles.headerTitle}>Tareas</Text>
              <Text style={styles.countText}>
                {listTarea.length} {listTarea.length === 1 ? 'tarea registrada' : 'tareas registradas'}
              </Text>
            </View>
            <BtnTouch
              color={C.acento}
              borderColor="#34d399"
              text="+ Nueva"
              borderWidth={1}
              style={styles.createButton}
              onPress={() => navigation.navigate('FormTarea', { ...create })}
            />
          </View>
        )}
        refreshControl={(
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadTarea}
            colors={[C.acento]}
            tintColor="#ffffff"
          />
        )}
        showsVerticalScrollIndicator={false}
        numColumns={1}
        renderItem={({ item }) => (
          <TareaCard tarea={item} />
        )}
      />
    </View>
  );
};

export default HomeTareas;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: C.fondo,
  },
  topBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 195,
    backgroundColor: C.bannerSuperior,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  decorativeCircleLarge: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: C.bannerAcento,
    opacity: 0.45,
  },
  decorativeCircleSmall: {
    position: 'absolute',
    bottom: 15,
    left: -25,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: C.acento,
    opacity: 0.25,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#a7f3d0',
    letterSpacing: 1.4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  countText: {
    fontSize: 13,
    color: '#d1fae5',
    marginTop: 2,
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  separator: {
    height: 12,
  },
});