import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const CONTACT_INFO = {
  name: 'Martha Craig',
  status: 'online',
  phones: [
    { type: 'main', number: '+1 202 555 0181' },
    { type: 'home', number: '+1 202 555 0113' },
  ],
  bio: 'Design adds value faster, than it adds cost',
  username: '@zack_life',
};

export default function ContactScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Info</Text>
        <TouchableOpacity>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{CONTACT_INFO.name[0]}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{CONTACT_INFO.name}</Text>
            <Text style={styles.profileStatus}>{CONTACT_INFO.status}</Text>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>
        </View>

        {/* Phone Numbers */}
        {CONTACT_INFO.phones.map((phone, index) => (
          <View key={index} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{phone.type}</Text>
            <Text style={styles.infoValue}>{phone.number}</Text>
          </View>
        ))}

        {/* Bio */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>bio</Text>
          <Text style={styles.infoValueDark}>{CONTACT_INFO.bio}</Text>
        </View>

        {/* Username */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>username</Text>
          <Text style={styles.infoValue}>{CONTACT_INFO.username}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionText}>Send Message</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionText}>Share Contact</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionText}>Start Secret Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Shared Media</Text>
            <Text style={styles.settingsArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Notifications</Text>
            <View style={styles.settingsRight}>
              <Text style={styles.settingsValue}>Enabled</Text>
              <Text style={styles.settingsArrow}>›</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Groups In Common</Text>
            <View style={styles.settingsRight}>
              <Text style={styles.settingsValue}>1</Text>
              <Text style={styles.settingsArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Block User */}
        <View style={styles.dangerSection}>
          <TouchableOpacity style={styles.dangerRow}>
            <Text style={styles.dangerText}>Block User</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f7f7f7',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c8c8c8',
  },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backIcon: { fontSize: 32, color: '#007aff', marginTop: -4 },
  backText: { fontSize: 17, color: '#007aff' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#000' },
  editButton: { fontSize: 17, color: '#007aff' },
  content: { flex: 1 },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 20,
  },
  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLargeText: { color: '#fff', fontSize: 28, fontWeight: '600' },
  profileInfo: { flex: 1, marginLeft: 16 },
  profileName: { fontSize: 22, fontWeight: '600', color: '#000' },
  profileStatus: { fontSize: 15, color: '#34c759', marginTop: 2 },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f2f2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIcon: { fontSize: 22 },
  infoRow: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5ea',
  },
  infoLabel: { fontSize: 12, color: '#8e8e93', marginBottom: 4 },
  infoValue: { fontSize: 16, color: '#007aff' },
  infoValueDark: { fontSize: 16, color: '#000' },
  actionsSection: {
    backgroundColor: '#fff',
    marginTop: 20,
  },
  actionRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionText: { fontSize: 16, color: '#007aff' },
  separator: {
    height: 0.5,
    backgroundColor: '#e5e5ea',
    marginLeft: 16,
  },
  settingsSection: {
    backgroundColor: '#fff',
    marginTop: 20,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingsLabel: { fontSize: 16, color: '#000' },
  settingsRight: { flexDirection: 'row', alignItems: 'center' },
  settingsValue: { fontSize: 16, color: '#8e8e93', marginRight: 4 },
  settingsArrow: { fontSize: 20, color: '#c7c7cc' },
  dangerSection: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginBottom: 40,
  },
  dangerRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dangerText: { fontSize: 16, color: '#ff3b30' },
});
