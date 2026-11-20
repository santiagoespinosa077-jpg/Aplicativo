import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { UserReponse } from '../interfaces/pandoraApiResponse';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { StackUserParams } from '../navigator/UserStackNavigator';

interface Props {
  user: UserReponse;
}

export const UserCard = ({ user }: Props) => {
  const navigation = useNavigation<StackNavigationProp<StackUserParams>>();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.cardContainer}
      onPress={() => navigation.navigate('FormUser', { ...user })}
    >
      <View style={styles.leftAccentBar} />

      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={{ uri: `data:image/png;base64,${user.imagen}` }}
        />
        <View style={styles.statusDot} />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.username} numberOfLines={1}>
            {user.username}
          </Text>
          <View style={styles.idPill}>
            <Text style={styles.idText}>ID {user.id_user}</Text>
          </View>
        </View>

        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>
              Act. {new Date(user.update).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.actionHint}>Editar ›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  leftAccentBar: {
    position: 'absolute',
    left: 0,
    top: 14,
    bottom: 14,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#059669',
  },
  avatarContainer: {
    position: 'relative',
    marginLeft: 4,
    marginRight: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2.5,
    borderColor: '#ffffff',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  username: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginRight: 8,
  },
  idPill: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  idText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065f46',
    letterSpacing: 0.4,
  },
  email: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateBadge: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  actionHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
});