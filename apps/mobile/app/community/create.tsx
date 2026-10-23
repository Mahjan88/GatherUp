import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Button,
  Chip,
  IconName,
  Ionicons,
  ScreenHeader,
  TextField,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

type CommunityCategory =
  | 'networking'
  | 'party'
  | 'workshop'
  | 'conference'
  | 'social'
  | 'sports'
  | 'other';

type Visibility = 'public' | 'private';

const CATEGORIES: { value: CommunityCategory; label: string }[] = [
  { value: 'networking', label: 'Networking' },
  { value: 'party', label: 'Party' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'social', label: 'Social' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

/** Bold field label with optional required marker. */
function FieldLabel({
  children,
  required,
}: {
  children: string;
  required?: boolean;
}) {
  return (
    <Text style={styles.fieldLabel}>
      {children}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
}

/** Selectable card with radio indicator, icon, title and hint. */
function OptionCard({
  icon,
  title,
  hint,
  selected,
  onPress,
}: {
  icon: IconName;
  title: string;
  hint: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.option, selected && styles.optionActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.optionIcon, selected && styles.optionIconActive]}>
        <Ionicons
          name={icon}
          size={18}
          color={selected ? colors.primary : colors.textSecondary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={typography.label}>{title}</Text>
        <Text style={[typography.caption, { marginTop: 2 }]}>{hint}</Text>
      </View>
      <Ionicons
        name={selected ? 'radio-button-on' : 'radio-button-off'}
        size={22}
        color={selected ? colors.primary : colors.textMuted}
      />
    </TouchableOpacity>
  );
}

export default function CreateCommunityScreen() {
  const router = useRouter();

  // Form state matching communities table columns
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CommunityCategory>('social');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [isDiscoverable, setIsDiscoverable] = useState(true);

  const handleNameChange = (text: string) => {
    setName(text);
    // Auto-generate slug from name
    const generated = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(generated);
  };

  const handleCreate = () => {
    // TODO: Call API to create community
    // POST /api/communities with body:
    // { name, slug, description, category, cover_image_url, city, visibility, is_discoverable }
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader leftLabel="Cancel" title="Create Community" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Community Basics</Text>

        {/* Cover Image */}
        <TouchableOpacity style={styles.coverBox} activeOpacity={0.85}>
          <Ionicons name="image-outline" size={34} color={colors.textMuted} />
          <View style={styles.coverPill}>
            <Ionicons name="camera-outline" size={16} color={colors.text} />
            <Text style={styles.coverPillText}>Add Cover Photo</Text>
          </View>
        </TouchableOpacity>

        {/* Name */}
        <FieldLabel required>Community Name</FieldLabel>
        <TextField
          placeholder="Give your community a name"
          value={name}
          onChangeText={handleNameChange}
        />

        {/* Slug */}
        <FieldLabel required>Slug</FieldLabel>
        <TextField
          icon="link-outline"
          placeholder="url-friendly-name"
          value={slug}
          onChangeText={setSlug}
          autoCapitalize="none"
          autoCorrect={false}
          hint="Used in the community URL. Letters, numbers, and hyphens only."
        />

        {/* Description */}
        <FieldLabel>Description</FieldLabel>
        <TextField
          placeholder="What is this community about?"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        {/* Category */}
        <FieldLabel required>Category</FieldLabel>
        <View style={styles.chipWrap}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.value}
              label={cat.label}
              selected={category === cat.value}
              onPress={() => setCategory(cat.value)}
            />
          ))}
        </View>

        {/* City */}
        <FieldLabel>City</FieldLabel>
        <TextField
          icon="location-outline"
          placeholder="e.g., San Francisco, CA"
          value={city}
          onChangeText={setCity}
        />

        {/* Visibility */}
        <FieldLabel required>Visibility</FieldLabel>
        <View style={styles.optionGroup}>
          <OptionCard
            icon="globe-outline"
            title="Public"
            hint="Anyone can see and join this community"
            selected={visibility === 'public'}
            onPress={() => setVisibility('public')}
          />
          <OptionCard
            icon="lock-closed-outline"
            title="Private"
            hint="Members must be approved to join"
            selected={visibility === 'private'}
            onPress={() => setVisibility('private')}
          />
        </View>

        {/* Discoverable Toggle */}
        <View style={styles.toggleRow}>
          <View style={styles.optionIcon}>
            <Ionicons
              name="compass-outline"
              size={18}
              color={colors.textSecondary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={typography.label}>Discoverable</Text>
            <Text style={[typography.caption, { marginTop: 2 }]}>
              Show this community in search and browse results
            </Text>
          </View>
          <Switch
            value={isDiscoverable}
            onValueChange={setIsDiscoverable}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={styles.bottomBar}>
        <Button
          label="Create Community"
          onPress={handleCreate}
          disabled={!name.trim()}
          fullWidth
        />
      </View>
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
    paddingBottom: 120,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.lg,
  },
  coverBox: {
    height: 160,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  coverPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  coverPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  fieldLabel: {
    ...typography.label,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.danger,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  optionGroup: {
    gap: 10,
    marginBottom: spacing.xl,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconActive: {
    backgroundColor: colors.surface,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: GUTTER,
    paddingTop: spacing.md,
    paddingBottom: 34,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
