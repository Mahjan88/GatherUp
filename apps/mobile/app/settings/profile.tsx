import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import BottomTabBar from '../../components/BottomTabBar';

export default function EditProfileScreen() {
  const router = useRouter();

  // TODO: Replace with real API data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  // Privacy settings (stored in privacy_settings JSONB)
  const [profilePublic, setProfilePublic] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showLocation, setShowLocation] = useState(true);

  const handleSave = () => {
    // TODO: Call API to update user profile
    router.back();
  };

  return (
    <View style={styles.container}>
      <Header showBack title="Edit Profile" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarLarge}>
            <Text style={styles.avatarText}>?</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.changePhotoText}>Change photo</Text>
          </TouchableOpacity>
        </View>

        {/* Basic Info */}
        <Text style={styles.sectionHeader}>Basic info</Text>

        <View style={styles.fieldRow}>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>
              First name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              placeholderTextColor="#64748b"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>Last name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last name"
              placeholderTextColor="#64748b"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="@username"
            placeholderTextColor="#64748b"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Tagline</Text>
          <TextInput
            style={styles.input}
            placeholder="A short intro about you"
            placeholderTextColor="#64748b"
            value={tagline}
            onChangeText={setTagline}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell people about yourself"
            placeholderTextColor="#64748b"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Contact */}
        <Text style={styles.sectionHeader}>Contact</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={email}
            editable={false}
            placeholder="Managed by your account"
            placeholderTextColor="#475569"
          />
          <Text style={styles.fieldHint}>
            Email is linked to your login and cannot be changed here
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="+1 (555) 000-0000"
            placeholderTextColor="#64748b"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Location */}
        <Text style={styles.sectionHeader}>Location</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="San Francisco"
            placeholderTextColor="#64748b"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>State</Text>
            <TextInput
              style={styles.input}
              placeholder="CA"
              placeholderTextColor="#64748b"
              value={state}
              onChangeText={setState}
            />
          </View>
          <View style={styles.fieldHalf}>
            <Text style={styles.fieldLabel}>Country</Text>
            <TextInput
              style={styles.input}
              placeholder="United States"
              placeholderTextColor="#64748b"
              value={country}
              onChangeText={setCountry}
            />
          </View>
        </View>

        {/* Privacy */}
        <Text style={styles.sectionHeader}>Privacy</Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Public profile</Text>
            <Text style={styles.toggleHint}>
              Others can find you in search
            </Text>
          </View>
          <Switch
            value={profilePublic}
            onValueChange={setProfilePublic}
            trackColor={{ false: '#334155', true: '#14b8a6' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Show email</Text>
            <Text style={styles.toggleHint}>
              Visible on your profile
            </Text>
          </View>
          <Switch
            value={showEmail}
            onValueChange={setShowEmail}
            trackColor={{ false: '#334155', true: '#14b8a6' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Show phone</Text>
            <Text style={styles.toggleHint}>
              Visible on your profile
            </Text>
          </View>
          <Switch
            value={showPhone}
            onValueChange={setShowPhone}
            trackColor={{ false: '#334155', true: '#14b8a6' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Show location</Text>
            <Text style={styles.toggleHint}>
              City visible on your profile
            </Text>
          </View>
          <Switch
            value={showLocation}
            onValueChange={setShowLocation}
            trackColor={{ false: '#334155', true: '#14b8a6' }}
            thumbColor="#fff"
          />
        </View>

        {/* Save button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save changes</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { flex: 1, padding: 16 },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { color: '#94a3b8', fontSize: 32, fontWeight: '600' },
  changePhotoText: { fontSize: 14, color: '#14b8a6', fontWeight: '500' },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  fieldGroup: { marginBottom: 16 },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  fieldHalf: { flex: 1 },
  fieldLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 6,
    fontWeight: '500',
  },
  required: { color: '#ef4444' },
  fieldHint: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 14,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  toggleInfo: { flex: 1, marginRight: 12 },
  toggleLabel: { fontSize: 14, color: '#fff', fontWeight: '500' },
  toggleHint: { fontSize: 12, color: '#64748b', marginTop: 2 },
  saveButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
