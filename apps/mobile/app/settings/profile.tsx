import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import BottomTabBar from '../../components/BottomTabBar';

export default function EditProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header showBack />

      <ScrollView style={styles.content}>
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>?</Text>
          </View>
          <Text style={styles.photoHint}>
            Enter your name and add an optional{'\n'}profile picture
          </Text>
          <TouchableOpacity>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Name Input */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.nameInput}
            placeholder="Your Name"
            placeholderTextColor="#8e8e93"
          />
        </View>

        {/* Phone Number */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionLabel}>PHONE NUMBER</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>Not set</Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <View style={styles.infoRow}>
            <TextInput
              style={styles.aboutInput}
              placeholder="Add About"
              placeholderTextColor="#8e8e93"
            />
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f7f7f7',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c8c8c8',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', width: 100 },
  backIcon: { fontSize: 32, color: '#007aff', marginTop: -4 },
  backText: { fontSize: 17, color: '#007aff' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#000' },
  headerPlaceholder: { width: 100 },
  content: { flex: 1 },
  photoSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 24,
    marginBottom: 20,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '600' },
  photoHint: { fontSize: 14, color: '#8e8e93', textAlign: 'center', marginBottom: 8 },
  editLink: { fontSize: 16, color: '#007aff' },
  inputSection: { backgroundColor: '#fff', marginBottom: 20 },
  nameInput: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5ea',
  },
  infoSection: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 13,
    color: '#8e8e93',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  infoRow: { backgroundColor: '#fff' },
  infoValue: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  aboutInput: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
