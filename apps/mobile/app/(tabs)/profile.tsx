import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

// Import icons (512px for high-DPI quality)
const AccountIcon = require('../../assets/Icons/account_icon.png');
const NotificationIcon = require('../../assets/Icons/notification_icon.png');
const SecurityIcon = require('../../assets/Icons/security_icon.png');
const DataIcon = require('../../assets/Icons/data_icon.png');
const HelpIcon = require('../../assets/Icons/help_icon.png');
const AboutIcon = require('../../assets/Icons/about_icon.png');
const EditIcon = require('../../assets/Icons/edit_icon.png');

interface SettingsItem {
  id: string;
  icon: ImageSourcePropType;
  label: string;
  route?: string;
}

export default function ProfileScreen() {
  const router = useRouter();

  const SETTINGS_ITEMS: SettingsItem[] = [
    { id: 'account', icon: AccountIcon, label: 'Account', route: '/settings/account' },
    { id: 'notifications', icon: NotificationIcon, label: 'Notifications', route: '/settings/notifications' },
    { id: 'privacy', icon: SecurityIcon, label: 'Privacy & Security' },
    { id: 'storage', icon: DataIcon, label: 'Data & Storage', route: '/settings/data-storage' },
    { id: 'help', icon: HelpIcon, label: 'Help & Support' },
    { id: 'about', icon: AboutIcon, label: 'About GatherUp' },
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="Profile"/>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>U</Text>
          </View>
          <Text style={styles.userName}>User Name</Text>
          <Text style={styles.userHandle}>@username</Text>
          <Text style={styles.userBio}>Event enthusiast | Love meeting new people</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Attended</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <View style={styles.settingsCard}>
            {SETTINGS_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.settingsItem,
                  index < SETTINGS_ITEMS.length - 1 && styles.settingsItemBorder,
                ]}
                onPress={() => item.route && router.push(item.route as any)}
              >
                <Image 
                  source={item.icon} 
                  style={styles.settingsIcon} 
                  resizeMode="contain"
                />
                <Text style={styles.settingsLabel}>{item.label}</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { fontSize: 32, fontWeight: '700', color: '#fff' },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  editIcon: { 
    width: 28, 
    height: 28,
  },
  scrollView: { flex: 1 },
  profileCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarLargeText: { color: '#fff', fontSize: 32, fontWeight: '600' },
  userName: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  userHandle: { fontSize: 14, color: '#64748b', marginBottom: 8 },
  userBio: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 20 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: '#334155' },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    paddingHorizontal: 20,
    marginBottom: 12,
    letterSpacing: 1,
  },
  settingsCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingsIcon: { 
    width: 35,
    height: 35,
    marginRight: 14,
  },
  settingsLabel: { flex: 1, fontSize: 16, color: '#fff' },
  chevron: { fontSize: 22, color: '#475569' },
  signOutButton: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  signOutText: { color: '#ef4444', fontSize: 16, fontWeight: '600' },
  bottomPadding: { height: 100 },
});
