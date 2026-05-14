import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../../components/Header';

type InviteMethod = 'email' | 'phone' | 'link';

type InvitationStatus = 'sent' | 'accepted' | 'declined' | 'expired' | 'cancelled';

interface PendingInvitation {
  id: string;
  invited_email: string | null;
  invited_phone: string | null;
  status: InvitationStatus;
  token: string;
  created_at: string;
}

const STATUS_COLORS: Record<InvitationStatus, { bg: string; text: string }> = {
  sent: { bg: '#334155', text: '#94a3b8' },
  accepted: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
  declined: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
  expired: { bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308' },
  cancelled: { bg: '#334155', text: '#64748b' },
};

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
    const recipient = invitation.invited_email || invitation.invited_phone || 'this person';
    Alert.alert(
      'Cancel Invitation',
      `Cancel the invitation to ${recipient}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // TODO: Call API to cancel invitation
            // PATCH /api/events/:eventId/invitations/:id { status: 'cancelled' }
            setInvitations((prev) =>
              prev.map((inv) =>
                inv.id === invitation.id ? { ...inv, status: 'cancelled' as InvitationStatus } : inv
              )
            );
          },
        },
      ]
    );
  };

  const getRecipientLabel = (invitation: PendingInvitation) => {
    return invitation.invited_email || invitation.invited_phone || 'Link invitation';
  };

  const tabs: { key: InviteMethod; label: string }[] = [
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'link', label: 'Link' },
  ];

  const renderInvitation = ({ item }: { item: PendingInvitation }) => {
    const colors = STATUS_COLORS[item.status];
    return (
      <View style={styles.invitationRow}>
        <View style={styles.invitationInfo}>
          <Text style={styles.invitationRecipient}>{getRecipientLabel(item)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.statusBadgeText, { color: colors.text }]}>
              {item.status}
            </Text>
          </View>
        </View>
        {item.status === 'sent' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelInvitation(item)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Invite Friends"
        showBack
        showLogo={false}
        showHamburger={false}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[styles.sendButton, !email.trim() && styles.sendButtonDisabled]}
                onPress={handleSendEmail}
                disabled={!email.trim()}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'phone' && (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="#64748b"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TouchableOpacity
                style={[styles.sendButton, !phone.trim() && styles.sendButtonDisabled]}
                onPress={handleSendPhone}
                disabled={!phone.trim()}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'link' && (
            <TouchableOpacity style={styles.copyLinkButton} onPress={handleCopyLink}>
              <Text style={styles.copyLinkIcon}>&#x1F517;</Text>
              <Text style={styles.copyLinkText}>
                {linkCopied ? 'Link Copied!' : 'Copy Invite Link'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Pending Invitations */}
        <View style={styles.pendingSection}>
          <Text style={styles.sectionTitle}>Pending Invitations</Text>

          {invitations.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>&#x2709;</Text>
              <Text style={styles.emptyStateTitle}>No invitations yet</Text>
              <Text style={styles.emptyStateText}>
                Invite friends via email, phone, or a shareable link.
              </Text>
            </View>
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
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentTabActive: {
    backgroundColor: '#14b8a6',
  },
  segmentTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  segmentTabTextActive: {
    color: '#fff',
  },
  inviteSection: {
    marginBottom: 28,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  copyLinkButton: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  copyLinkIcon: {
    fontSize: 20,
  },
  copyLinkText: {
    color: '#14b8a6',
    fontSize: 15,
    fontWeight: '600',
  },
  pendingSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 14,
  },
  invitationRow: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  invitationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  invitationRecipient: {
    fontSize: 14,
    color: '#e2e8f0',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cancelButton: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
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
  bottomPadding: {
    height: 40,
  },
});
