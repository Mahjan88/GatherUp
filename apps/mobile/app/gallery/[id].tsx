import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChipRow,
  EmptyState,
  IconButton,
  Ionicons,
  ScreenHeader,
} from '../../components/ui';
import { colors, radius, shadows, spacing, GUTTER } from '../../theme';

const { width } = Dimensions.get('window');
const GRID_GAP = 6;
const IMAGE_SIZE = (width - GUTTER * 2 - GRID_GAP) / 2;

type TabType = 'all' | 'photos' | 'videos';

interface MediaItem {
  id: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

// TODO: Replace with real API data
const PHOTOS: MediaItem[] = [];
const VIDEOS: MediaItem[] = [];

const FILTERS: { value: TabType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'photos', label: 'Photos' },
  { value: 'videos', label: 'Videos' },
];

export default function GalleryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const items: { item: MediaItem; type: 'photos' | 'videos' }[] = [
    ...(activeTab !== 'videos'
      ? PHOTOS.map((item) => ({ item, type: 'photos' as const }))
      : []),
    ...(activeTab !== 'photos'
      ? VIDEOS.map((item) => ({ item, type: 'videos' as const }))
      : []),
  ];

  const renderEmptyState = () => (
    <EmptyState
      icon={activeTab === 'videos' ? 'videocam-outline' : 'camera-outline'}
      title={
        activeTab === 'videos'
          ? 'Be the first one to share a video from this event!'
          : 'Be the first one to share a photo from this event!'
      }
    />
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        showBack
        title="Event Photos"
        right={
          // TODO: Implement media search
          <IconButton name="search" onPress={() => {}} />
        }
      >
        <ChipRow options={FILTERS} value={activeTab} onChange={setActiveTab} />
      </ScreenHeader>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.mediaGrid}>
            {items.map(({ item, type }) => (
              <TouchableOpacity
                key={`${type}-${item.id}`}
                style={styles.mediaItem}
                activeOpacity={0.85}
              >
                <Image source={{ uri: item.url }} style={styles.mediaImage} />
                {type === 'videos' && (
                  <View style={styles.playOverlay}>
                    <View style={styles.playCircle}>
                      <Ionicons
                        name="play"
                        size={20}
                        color={colors.textOnImage}
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating add pill */}
      <TouchableOpacity style={styles.addPill} activeOpacity={0.85}>
        <Ionicons name="add" size={20} color={colors.primaryOn} />
        <Text style={styles.addPillText}>
          {activeTab === 'videos' ? 'Add Videos' : 'Add Photos'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  contentInner: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.sm,
    paddingBottom: 110,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  mediaItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.scrim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPill: {
    position: 'absolute',
    bottom: 34,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 48,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    ...shadows.fab,
  },
  addPillText: {
    color: colors.primaryOn,
    fontSize: 15,
    fontWeight: '700',
  },
});
