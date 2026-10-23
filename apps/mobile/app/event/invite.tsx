import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../../components/Header';
import {
  Badge,
  Button,
  EmptyState,
  Ionicons,
  TextField,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

type InviteMethod = 'email' | 'phone' | 'link';

type InvitationStatus =
  | 'sent'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'cancelled';

interface PendingInvitation {
  id: string;
  invited_email: string | null;
  invited_phone: string | null;
  status: InvitationStatus;
  token: string;
  created_at: string;
}

const STATUS_TONES: Record<
  InvitationStatus,
  'primary' | 'success' | 'warning' | 'danger' | 'neutral'
> = {
  sent: 'primary',
  accepted: 'success',
  declined: 'danger',
  expired: 'warning',
  cancelled: 'neutral',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function InviteScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const [activeTab, setActiveTab] = useState<InviteMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // TODO: Replace with real API data
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);

  const handleSendEmail = () => {
    if (!email.trim()) return;
    // TODO: Call API to send email invitation
    // POST /api/events/:eventId/invitations { invited_email: email }
    Alert.alert('Invitation Sent', `Invitation sent to ${email}`);
    setEmail('');
  };

  const handleSendPhone = () => {
    if (!phone.trim()) return;
    // TODO: Call API to send phone invitation
    // POST /api/events/:eventId/invitations { invited_phone: phone }
    Alert.alert('Invitation Sent', `Invitation sent to ${phone}`);
    setPhone('');
  };

  const handleCopyLink = () => {
    // TODO: Generate invite link via API
    // POST /api/events/:eventId/invitations/link -> returns { token, url }
    // Then copy to clipboard using expo-clipboard
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleCancelInvitation = (invitation: PendingInvitation) => {
    const recipient =
      invitation.invited_email || invitation.invited_phone || 'this person';
    Alert.alert('Cancel Invitation', `Cancel the invitation to ${recipient}?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () => {
          // TODO: Call API to cancel invitation
          // PATCH /api/events/:eventId/invitations/:id { status: 'cancelled' }
          setInvitations((prev) =>
            prev.map((inv) =>
              inv.id === invitation.id
                ? { ...inv, status: 'cancelled' as InvitationStatus }
                : inv
            )
          );
        },
      },
    ]);
  };

  const getRecipientLabel = (invitation: PendingInvitation) => {
    return (
      invitation.invited_email || invitation.invited_phone || 'Link invitation'
    );
  };

  const tabs: { key: InviteMethod; label: string }[] = [
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'link', label: 'Link' },
  ];

  const renderInvitation = ({ item }: { item: PendingInvitation }) => (
    <View style={styles.invitationRow}>
      <View style={styles.invitationIcon}>
        <Ionicons
          name={
            item.invited_email
              ? 'mail-outline'
              : item.invited_phone
                ? 'call-outline'
                : 'link-outline'
          }
          size={18}
          color={colors.primary}
        />
      </View>
      <View style={styles.invitationInfo}>
        <Text style={styles.invitationRecipient} numberOfLines={1}>
          {getRecipientLabel(item)}
        </Text>
        <Badge
          label={capitalize(item.status)}
          tone={STATUS_TONES[item.status]}
        />
      </View>
      {item.status === 'sent' && (
        <Button
          label="Cancel"
          variant="danger"
          size="sm"
          onPress={() => handleCancelInvitation(item)}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Invite Friends"
        showBack
        showLogo={false}
        showHamburger={false}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.segmentTab,
                activeTab === tab.key && styles.segmentTabActive,
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.segmentTabText,
                  activeTab === tab.key && styles.segmentTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Invite Input Section */}
        <View style={styles.inviteSection}>
          {activeTab === 'email' && (
            <View style={styles.inputRow}>
              <TextField
                containerStyle={styles.inputField}
                icon="mail-outline"
                placeholder="Enter email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Button
                label="Send"
                size="md"
                onPress={handleSendEmail}
                disabled={!email.trim()}
                style={styles.sendButton}
              />
            </View>
          )}

          {activeTab === 'phone' && (
            <View style={styles.inputRow}>
              <TextField
                containerStyle={styles.inputField}
                icon="call-outline"
                placeholder="Enter phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <Button
                label="Send"
                size="md"
                onPress={handleSendPhone}
                disabled={!phone.trim()}
                style={styles.sendButton}
              />
            </View>
          )}

          {activeTab === 'link' && (
            <Button
              label={linkCopied ? 'Link Copied!' : 'Copy Invite Link'}
              variant={linkCopied ? 'soft' : 'outline'}
              icon={linkCopied ? 'checkmark-circle' : 'link-outline'}
              onPress={handleCopyLink}
              fullWidth
            />
          )}
        </View>

        {/* Pending Invitations */}
        <View style={styles.pendingSection}>
          <Text style={styles.sectionTitle}>Pending Invitations</Text>

          {invitations.length === 0 ? (
            <EmptyState
              icon="mail-outline"
              title="No invitations yet"
              message="Invite friends via email, phone, or a shareable link."
            />
          ) : (
            <FlatList
              data={invitations}
              renderItem={renderInvitation}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.sm,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.xl,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  segmentTabActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  segmentTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentTabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  inviteSection: {
    marginBottom: spacing.xxl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  inputField: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    height: 48,
  },
  pendingSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  invitationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  invitationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invitationInfo: {
    flex: 1,
    gap: 4,
  },
  invitationRecipient: {
    ...typography.label,
  },
  bottomPadding: {
    height: 40,
  },
});
