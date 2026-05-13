import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

interface BlockedUser {
  blocked_user_id: string;
  display_name: string;
  username: string | null;
  created_at: string;
}

const formatBlockedDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `Blocked ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export default function BlockedUsersScreen() {
  const router = useRouter();

  // TODO: Fetch blocked users from API
  // GET /api/users/me/blocked
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

  const handleUnblock = (user: BlockedUser) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${user.display_name}? They will be able to see your profile and events again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          style: 'destructive',
          onPress: () => {
            // TODO: Call API to unblock user
            // DELETE /api/users/me/blocked/:userId
            setBlockedUsers((prev) =>
              prev.filter((u) => u.blocked_user_id !== user.blocked_user_id)
            );
          },
        },
      ]
    );
  };

  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  const renderBlockedUser = ({ item }: { item: BlockedUser }) => (
    <View style={styles.userRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitial(item.display_name)}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.display_name}</Text>
        {item.username && (
          <Text style={styles.userHandle}>@{item.username}</Text>
        )}
        <Text style={styles.blockedDate}>{formatBlockedDate(item.created_at)}</Text>
      </View>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(item)}
      >
        <Text style={styles.unblockButtonText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Blocked Users"
        showBack
        showLogo={false}
        showHamburger={false}
      />

      {blockedUsers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>&#x1F6AB;</Text>
          <Text style={styles.emptyStateTitle}>No blocked users</Text>
          <Text style={styles.emptyStateText}>
            You haven't blocked anyone. Blocked users won't be able to see your
            profile, events, or send you messages.
          </Text>
        </View>
      ) : (
        <FlatList
          data={blockedUsers}
          renderItem={renderBlockedUser}
          keyExtractor={(item) => item.blocked_user_id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  userRow: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#94a3b8',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  userHandle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 1,
  },
  blockedDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
  },
  unblockButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  unblockButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ef4444',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
