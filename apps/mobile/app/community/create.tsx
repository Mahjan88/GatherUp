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
      <Header
        title="Create Community"
        showBack
        showLogo={false}
        showHamburger={false}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <TouchableOpacity style={styles.coverPhotoBox}>
          <Text style={styles.coverPhotoIcon}>📷</Text>
          <Text style={styles.coverPhotoText}>Add Cover Image</Text>
        </TouchableOpacity>

        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Community Name <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Give your community a name"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={handleNameChange}
          />
        </View>

        {/* Slug */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Slug <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="url-friendly-name"
            placeholderTextColor="#64748b"
            value={slug}
            onChangeText={setSlug}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.hintText}>
            Used in the community URL. Letters, numbers, and hyphens only.
          </Text>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What is this community about?"
            placeholderTextColor="#64748b"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Category <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <View style={styles.categoryPills}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryPill,
                  category === cat.value && styles.categoryPillActive,
                ]}
                onPress={() => setCategory(cat.value)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    category === cat.value && styles.categoryPillTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* City */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., San Francisco, CA"
            placeholderTextColor="#64748b"
            value={city}
            onChangeText={setCity}
          />
        </View>

        {/* Visibility */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Visibility <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <View style={styles.privacyOptions}>
            <TouchableOpacity
              style={[
                styles.privacyOption,
                visibility === 'public' && styles.privacyOptionActive,
              ]}
              onPress={() => setVisibility('public')}
            >
              <View style={styles.radioRow}>
                <View
                  style={[
                    styles.radioCircle,
                    visibility === 'public' && styles.radioCircleActive,
                  ]}
                >
                  {visibility === 'public' && (
                    <View style={styles.radioCircleInner} />
                  )}
                </View>
                <View style={styles.radioContent}>
                  <Text
                    style={[
                      styles.privacyOptionTitle,
                      visibility === 'public' &&
                        styles.privacyOptionTitleActive,
                    ]}
                  >
                    Public
                  </Text>
                  <Text style={styles.privacyOptionHint}>
                    Anyone can see and join this community
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.privacyOption,
                visibility === 'private' && styles.privacyOptionActive,
              ]}
              onPress={() => setVisibility('private')}
            >
              <View style={styles.radioRow}>
                <View
                  style={[
                    styles.radioCircle,
                    visibility === 'private' && styles.radioCircleActive,
                  ]}
                >
                  {visibility === 'private' && (
                    <View style={styles.radioCircleInner} />
                  )}
                </View>
                <View style={styles.radioContent}>
                  <Text
                    style={[
                      styles.privacyOptionTitle,
                      visibility === 'private' &&
                        styles.privacyOptionTitleActive,
                    ]}
                  >
                    Private
                  </Text>
                  <Text style={styles.privacyOptionHint}>
                    Members must be approved to join
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Discoverable Toggle */}
        <View style={styles.inlineToggle}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Discoverable</Text>
            <Text style={styles.toggleHint}>
              Show this community in search and browse results
            </Text>
          </View>
          <Switch
            value={isDiscoverable}
            onValueChange={setIsDiscoverable}
            trackColor={{ false: '#334155', true: '#14b8a6' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Create Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!name.trim()}
        >
          <Text style={styles.createButtonText}>Create Community</Text>
        </TouchableOpacity>
      </View>
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
  coverPhotoBox: {
    height: 140,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  coverPhotoIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  coverPhotoText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  requiredAsterisk: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  hintText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
  },
  categoryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryPillActive: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  categoryPillText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  categoryPillTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  privacyOptions: {
    gap: 10,
  },
  privacyOption: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  privacyOptionActive: {
    borderColor: '#14b8a6',
    backgroundColor: '#0f2a2a',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioContent: {
    flex: 1,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#14b8a6',
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#14b8a6',
  },
  privacyOptionTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  privacyOptionTitleActive: {
    color: '#14b8a6',
  },
  privacyOptionHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  inlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#fff',
  },
  toggleHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 34,
    backgroundColor: '#0f172a',
  },
  createButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
