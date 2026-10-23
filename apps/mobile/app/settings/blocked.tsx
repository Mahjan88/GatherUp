import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import {
  Avatar,
  Button,
  Divider,
  EmptyState,
  ListRow,
} from '../../components/ui';
import { colors, radius, spacing, typography } from '../../theme';

interface BlockedUser {
  blocked_user_id: string;
  display_name: string;
  username: string | null;
  created_at: string;
}

const formatBlockedDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `Blocked ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export default function BlockedUsersScreen() {
  const router = useRouter();

  // TODO: Replace with real API data
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

  const renderBlockedUser = ({
    item,
    index,
  }: {
    item: BlockedUser;
    index: number;
  }) => (
    <ListRow
      left={<Avatar name={item.display_name} size={44} />}
      title={item.display_name}
      subtitle={[
        item.username ? `@${item.username}` : null,
        formatBlockedDate(item.created_at),
      ]
        .filter(Boolean)
        .join(' · ')}
      right={
        <Button
          label="Unblock"
          variant="outline"
          size="sm"
          onPress={() => handleUnblock(item)}
        />
      }
      style={[
        styles.row,
        index === 0 && styles.rowFirst,
        index === blockedUsers.length - 1 && styles.rowLast,
      ]}
    />
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
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="ban-outline"
            title="No blocked users"
            message="You haven't blocked anyone. Blocked users won't be able to see your profile, events, or send you messages."
          />
        </View>
      ) : (
        <FlatList
          data={blockedUsers}
          renderItem={renderBlockedUser}
          keyExtractor={(item) => item.blocked_user_id}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>
              {blockedUsers.length} blocked
            </Text>
          }
          ItemSeparatorComponent={() => (
            <View style={styles.separatorWrap}>
              <Divider style={styles.rowDivider} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  row: {
    paddingHorizontal: spacing.lg,
  },
  rowFirst: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  rowLast: {
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  separatorWrap: {
    backgroundColor: colors.surface,
  },
  rowDivider: {
    marginLeft: 72,
  },
});
