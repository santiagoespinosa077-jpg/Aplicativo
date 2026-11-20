import { useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, StatusBar } from 'react-native';
import { UserReponse } from '../../interfaces/pandoraApiResponse';
import { useUserApi } from '../../hooks/useUserApi';
import { UserCard } from '../../components/UserCard';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { BtnTouch } from '../../components/BtnTouch';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { StackUserParams } from '../../navigator/UserStackNavigator';

const C = {
  fondo: '#f1f5f9',
  bannerSuperior: '#064e3b',
  bannerAcento: '#047857',
  acento: '#059669',
  acentoSuave: '#d1fae5',
  textoPrincipal: '#0f172a',
  textoSecundario: '#64748b',
};

export const HomeUser = () => {
  const { isLoading, loadUsers, listUser } = useUserApi();
  const focused = useIsFocused();
  const navigation = useNavigation<StackNavigationProp<StackUserParams>>();

  useEffect(() => {
    (!isLoading) && loadUsers();
  }, [focused]);

  const create: UserReponse = {
    id_user: 0,
    username: '',
    password: '',
    email: '',
    imagen: '',
    location: '',
    update: new Date(),
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topBanner}>
        <View style={styles.decorativeCircleLarge} />
        <View style={styles.decorativeCircleSmall} />
      </View>

      <FlatList
        data={listUser}
        keyExtractor={(item) => `#${item.id_user}`}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={(
          <View style={styles.headerContainer}>
            <View>
              <View style={styles.badge}>
                <Text style={styles.subtitle}>DIRECTORIO</Text>
              </View>
              <Text style={styles.title}>Usuarios</Text>
              <Text style={styles.countText}>
                {listUser.length} {listUser.length === 1 ? 'registro activo' : 'registros activos'}
              </Text>
            </View>
            <BtnTouch
              color={C.acento}
              borderColor="#34d399"
              text="+ Nuevo"
              borderWidth={1}
              style={styles.createButton}
              onPress={() => navigation.navigate('FormUser', { ...create })}
            />
          </View>
        )}
        refreshControl={(
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadUsers}
            colors={[C.acento]}
            tintColor="#ffffff"
          />
        )}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        renderItem={({ item }) => (
          <UserCard user={item} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
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
  title: {
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
});