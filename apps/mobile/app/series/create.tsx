import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Button,
  Chip,
  IconName,
  Ionicons,
  ScreenHeader,
  SelectField,
  TextField,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';

type SeriesCategory =
  | 'networking'
  | 'party'
  | 'workshop'
  | 'conference'
  | 'social'
  | 'sports'
  | 'other';

type Visibility = 'public' | 'private';
type OrganizerType = 'user' | 'community';
type RecurrenceHint = 'weekly' | 'biweekly' | 'monthly' | 'custom';

const CATEGORIES: { value: SeriesCategory; label: string }[] = [
  { value: 'networking', label: 'Networking' },
  { value: 'party', label: 'Party' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'social', label: 'Social' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

const RECURRENCE_OPTIONS: { value: RecurrenceHint; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
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

export default function CreateSeriesScreen() {
  const router = useRouter();

  // Form state matching event_series table columns
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SeriesCategory>('other');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [organizerType, setOrganizerType] = useState<OrganizerType>('user');
  const [communityId, setCommunityId] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [recurrenceHint, setRecurrenceHint] = useState<RecurrenceHint | null>(
    null
  );

  const handleTitleChange = (text: string) => {
    setTitle(text);
    // Auto-generate slug from title
    const generated = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(generated);
  };

  const handleCreate = () => {
    // TODO: Call API to create event series
    // POST /api/series with body:
    // { title, slug, description, category, cover_image_url, organizer_type, community_id, visibility, recurrence_hint }
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader leftLabel="Cancel" title="Create Series" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Series Basics</Text>

        {/* Cover Image */}
        <TouchableOpacity style={styles.coverBox} activeOpacity={0.85}>
          <Ionicons name="image-outline" size={34} color={colors.textMuted} />
          <View style={styles.coverPill}>
            <Ionicons name="camera-outline" size={16} color={colors.text} />
            <Text style={styles.coverPillText}>Add Cover Photo</Text>
          </View>
        </TouchableOpacity>

        {/* Title */}
        <FieldLabel required>Series Title</FieldLabel>
        <TextField
          placeholder="Give your series a title"
          value={title}
          onChangeText={handleTitleChange}
        />

        {/* Slug */}
        <FieldLabel>Slug</FieldLabel>
        <TextField
          icon="link-outline"
          placeholder="url-friendly-name"
          value={slug}
          onChangeText={setSlug}
          autoCapitalize="none"
          autoCorrect={false}
          hint="Used in the series URL. Letters, numbers, and hyphens only."
        />

        {/* Description */}
        <FieldLabel>Description</FieldLabel>
        <TextField
          placeholder="What is this event series about?"
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

        {/* Organizer Type */}
        <FieldLabel required>Organizer</FieldLabel>
        <View style={styles.optionGroup}>
          <OptionCard
            icon="person-outline"
            title="Myself"
            hint="You are the organizer of this series"
            selected={organizerType === 'user'}
            onPress={() => {
              setOrganizerType('user');
              setCommunityId(null);
            }}
          />
          <OptionCard
            icon="people-outline"
            title="Community"
            hint="Organize this series under a community"
            selected={organizerType === 'community'}
            onPress={() => setOrganizerType('community')}
          />
        </View>

        {/* Community Picker (shown when organizer_type = 'community') */}
        {organizerType === 'community' && (
          <>
            <FieldLabel required>Community</FieldLabel>
            <SelectField
              icon="people-outline"
              value={communityId ? 'Community selected' : null}
              placeholder="Select a community..."
            />
            <Text style={styles.hint}>
              Choose a community you manage to organize this series under.
            </Text>
          </>
        )}

        {/* Visibility */}
        <FieldLabel required>Visibility</FieldLabel>
        <View style={styles.optionGroup}>
          <OptionCard
            icon="globe-outline"
            title="Public"
            hint="Anyone can see and subscribe to this series"
            selected={visibility === 'public'}
            onPress={() => setVisibility('public')}
          />
          <OptionCard
            icon="lock-closed-outline"
            title="Private"
            hint="Only invited users can see this series"
            selected={visibility === 'private'}
            onPress={() => setVisibility('private')}
          />
        </View>

        {/* Recurrence Hint */}
        <FieldLabel>Recurrence</FieldLabel>
        <View style={[styles.chipWrap, { marginBottom: spacing.sm }]}>
          {RECURRENCE_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              icon="repeat-outline"
              selected={recurrenceHint === opt.value}
              onPress={() =>
                setRecurrenceHint(
                  recurrenceHint === opt.value ? null : opt.value
                )
              }
            />
          ))}
        </View>
        <Text style={[styles.hint, { marginTop: 0 }]}>
          How often do events in this series repeat? Leave unset if irregular.
        </Text>
      </ScrollView>

      {/* Create Button */}
      <View style={styles.bottomBar}>
        <Button
          label="Create Series"
          onPress={handleCreate}
          disabled={!title.trim()}
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
  hint: {
    ...typography.caption,
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
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
