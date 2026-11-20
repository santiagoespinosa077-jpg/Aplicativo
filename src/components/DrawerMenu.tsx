import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerContentComponentProps } from "@react-navigation/drawer";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { BtnTouch } from "./BtnTouch";

interface BtnProps {
  navigate: () => void;
  text: string;
}

const C = {
  fondo: '#f1f5f9',
  bannerSuperior: '#064e3b',
  bannerAcento: '#047857',
  tarjeta: '#ffffff',
  borde: '#e2e8f0',
  acento: '#059669',
  acentoSuave: '#d1fae5',
  textoPrincipal: '#0f172a',
  textoSecundario: '#64748b',
  peligro: '#dc2626',
};

const BtnMenu = ({ navigate, text }: BtnProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={navigate}
      style={style.menuItem}
    >
      <View style={style.menuLeft}>
        <View style={style.dot} />
        <Text style={style.menuText}>{text}</Text>
      </View>
      <View style={style.arrowBadge}>
        <Text style={style.menuArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

export const DrawerMenu = ({ navigation }: DrawerContentComponentProps) => {
  const { authState, logout } = useContext(AuthContext);

  return (
    <DrawerContentScrollView
      style={style.drawerBackground}
      contentContainerStyle={style.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={style.header}>
        <View style={style.decorativeCircleLarge} />
        <View style={style.decorativeCircleSmall} />

        <View style={style.avatarWrapper}>
          <Image
            style={style.avatar}
            source={
              authState.isLoggedIn
                ? { uri: `data:image/png;base64,${authState.avatar}` }
                : { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqMRKTwf-zYsaWB9QU5hXY8PBNLgQo61e5ML_g6P4NWA&s=10' }
            }
          />
          <View
            style={[
              style.statusIndicator,
              { backgroundColor: authState.isLoggedIn ? '#10b981' : '#94a3b8' },
            ]}
          />
        </View>

        <Text style={style.userText} numberOfLines={1}>
          {authState.username || 'Invitado'}
        </Text>

        <View
          style={[
            style.statusPill,
            authState.isLoggedIn ? style.statusPillActive : style.statusPillInactive,
          ]}
        >
          <Text
            style={[
              style.userLabel,
              { color: authState.isLoggedIn ? '#a7f3d0' : '#cbd5e1' },
            ]}
          >
            {authState.isLoggedIn ? 'Sesión iniciada' : 'Sin sesión'}
          </Text>
        </View>
      </View>

      <View style={style.menu}>
        <Text style={style.sectionTitle}>NAVEGACIÓN</Text>
        <BtnMenu navigate={() => navigation.navigate('StackNavigator')} text="Bolitas y palitos" />
        <BtnMenu navigate={() => navigation.navigate('PokemonNavigator')} text="Pokedex" />
        <BtnMenu navigate={() => navigation.navigate('FormScreen')} text="FormScreen" />
        <BtnMenu navigate={() => navigation.navigate('ImagePickerScreen')} text="Seleccionar Image" />
        <BtnMenu navigate={() => navigation.navigate('LocationScreen')} text="Localización" />
        <BtnMenu navigate={() => navigation.navigate('UserStackNavigator')} text="Gestión de Usuarios" />
        <BtnMenu navigate={() => navigation.navigate('TareaStackNavigator')} text="Tareas" />
        <BtnMenu navigate={() => navigation.navigate('MantenimientoStackNavigator')} text="Mantenimiento" />
        <BtnMenu navigate={() => navigation.navigate('DataResponseScreen')} text="Graficos" />
        <BtnMenu navigate={() => navigation.navigate('CalificacionDataScreen')} text="Calificacion Data" />
      </View>

      {authState.isLoggedIn && (
        <View style={style.footer}>
          <BtnTouch
            text="Cerrar sesión"
            color={C.peligro}
            borderColor={C.peligro}
            borderWidth={1}
            onPress={() => logout()}
          />
        </View>
      )}
    </DrawerContentScrollView>
  );
};

export default DrawerMenu;

const style = StyleSheet.create({
  drawerBackground: {
    backgroundColor: C.fondo,
  },
  container: {
    paddingBottom: 28,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 26,
    paddingHorizontal: 18,
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: C.bannerSuperior,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  decorativeCircleLarge: {
    position: 'absolute',
    top: -45,
    right: -35,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: C.bannerAcento,
    opacity: 0.45,
  },
  decorativeCircleSmall: {
    position: 'absolute',
    bottom: -25,
    left: -25,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.acento,
    opacity: 0.25,
  },
  avatarWrapper: {
    position: 'relative',
    padding: 4,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#6ee7b7',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    height: 88,
    width: 88,
    borderRadius: 44,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: C.bannerSuperior,
  },
  userText: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  statusPill: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.22)',
  },
  statusPillInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  userLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: C.textoSecundario,
    letterSpacing: 1.2,
    marginLeft: 4,
    marginBottom: 10,
  },
  menu: {
    marginTop: 20,
    paddingHorizontal: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.tarjeta,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.borde,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.acento,
    marginRight: 12,
  },
  menuText: {
    fontSize: 14,
    color: C.textoPrincipal,
    fontWeight: '700',
  },
  arrowBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: C.acentoSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuArrow: {
    fontSize: 17,
    color: C.bannerSuperior,
    fontWeight: '800',
    lineHeight: 19,
  },
  footer: {
    marginTop: 18,
    paddingTop: 16,
    marginHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: C.borde,
    alignItems: 'center',
  },
});