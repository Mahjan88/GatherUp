import { Children, Fragment, ReactNode, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import {
  Avatar,
  Button,
  Chip,
  Divider,
  IconName,
  Ionicons,
  ListRow,
  TextField,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

const INTEREST_OPTIONS: { label: string; icon: IconName }[] = [
  { label: 'Hiking', icon: 'walk-outline' },
  { label: 'Food & Drink', icon: 'restaurant-outline' },
  { label: 'Sports', icon: 'basketball-outline' },
  { label: 'Music', icon: 'musical-notes-outline' },
  { label: 'Arts', icon: 'color-palette-outline' },
  { label: 'Tech', icon: 'laptop-outline' },
  { label: 'Photography', icon: 'camera-outline' },
  { label: 'Fitness', icon: 'barbell-outline' },
  { label: 'Games', icon: 'game-controller-outline' },
  { label: 'Travel', icon: 'airplane-outline' },
];

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function SettingsGroup({ children }: { children: ReactNode }) {
  const rows = Children.toArray(children);
  return (
    <View style={styles.group}>
      {rows.map((row, i) => (
        <Fragment key={i}>
          {i > 0 && <Divider style={styles.rowDivider} />}
          {row}
        </Fragment>
      ))}
    </View>
  );
}

function SettingSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={colors.surface}
    />
  );
}

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
  // TODO: Persist interests via API
  const [interests, setInterests] = useState<string[]>([]);

  // Privacy settings (stored in privacy_settings JSONB)
  const [profilePublic, setProfilePublic] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showLocation, setShowLocation] = useState(true);

  const toggleInterest = (label: string) => {
    setInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const handleSave = () => {
    // TODO: Call API to update user profile
    router.back();
  };

  const displayName = [firstName, lastName].filter(Boolean).join(' ');

  return (
    <View style={styles.container}>
      <Header showBack title="Edit Profile" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity activeOpacity={0.85} style={styles.avatarWrap}>
            <Avatar name={displayName || '?'} size={96} />
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color={colors.primaryOn} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8}>
            <Text style={styles.changePhotoText}>Change photo</Text>
          </TouchableOpacity>
        </View>

        {/* Basic Info */}
        <FormSection title="Basic info">
          <View style={styles.fieldRow}>
            <TextField
              label="First name *"
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              containerStyle={styles.fieldHalf}
            />
            <TextField
              label="Last name"
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
              containerStyle={styles.fieldHalf}
            />
          </View>
          <TextField
            label="Username"
            placeholder="@username"
            icon="at-outline"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextField
            label="Tagline"
            placeholder="A short intro about you"
            value={tagline}
            onChangeText={setTagline}
          />
          <TextField
            label="Bio"
            placeholder="Tell people about yourself"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />
        </FormSection>

        {/* Interests */}
        <FormSection title="Interests">
          <View style={styles.chips}>
            {INTEREST_OPTIONS.map((opt) => (
              <Chip
                key={opt.label}
                label={opt.label}
                icon={opt.icon}
                variant="tag"
                selected={interests.includes(opt.label)}
                onPress={() => toggleInterest(opt.label)}
              />
            ))}
          </View>
        </FormSection>

        {/* Contact */}
        <FormSection title="Contact">
          <TextField
            label="Email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            editable={false}
            placeholder="Managed by your account"
            hint="Email is linked to your login and cannot be changed here"
          />
          <TextField
            label="Phone"
            icon="call-outline"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </FormSection>

        {/* Location */}
        <FormSection title="Location">
          <TextField
            label="City"
            icon="location-outline"
            placeholder="San Francisco"
            value={city}
            onChangeText={setCity}
          />
          <View style={styles.fieldRow}>
            <TextField
              label="State"
              placeholder="CA"
              value={state}
              onChangeText={setState}
              containerStyle={styles.fieldHalf}
            />
            <TextField
              label="Country"
              placeholder="United States"
              value={country}
              onChangeText={setCountry}
              containerStyle={styles.fieldHalf}
            />
          </View>
        </FormSection>

        {/* Privacy */}
        <FormSection title="Privacy">
          <SettingsGroup>
            <ListRow
              icon="globe-outline"
              title="Public profile"
              subtitle="Others can find you in search"
              style={styles.row}
              right={
                <SettingSwitch
                  value={profilePublic}
                  onValueChange={setProfilePublic}
                />
              }
            />
            <ListRow
              icon="mail-outline"
              title="Show email"
              subtitle="Visible on your profile"
              style={styles.row}
              right={
                <SettingSwitch value={showEmail} onValueChange={setShowEmail} />
              }
            />
            <ListRow
              icon="call-outline"
              title="Show phone"
              subtitle="Visible on your profile"
              style={styles.row}
              right={
                <SettingSwitch value={showPhone} onValueChange={setShowPhone} />
              }
            />
            <ListRow
              icon="location-outline"
              title="Show location"
              subtitle="City visible on your profile"
              style={styles.row}
              right={
                <SettingSwitch
                  value={showLocation}
                  onValueChange={setShowLocation}
                />
              }
            />
          </SettingsGroup>
        </FormSection>
      </ScrollView>

      {/* Sticky save */}
      <View style={styles.bottomBar}>
        <Button label="Save" onPress={handleSave} fullWidth />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  contentInner: { paddingHorizontal: GUTTER, paddingBottom: 110 },
  avatarSection: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  avatarWrap: { position: 'relative' },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoText: { fontSize: 14, fontWeight: '600', color: colors.link },
  formSection: { marginTop: spacing.lg },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.md,
  },
  fieldRow: { flexDirection: 'row', gap: spacing.md },
  fieldHalf: { flex: 1 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  group: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: { paddingHorizontal: spacing.lg },
  rowDivider: { marginLeft: 62 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: GUTTER,
    paddingTop: spacing.md,
    paddingBottom: 34,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
