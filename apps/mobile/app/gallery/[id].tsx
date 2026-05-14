import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../../components/Header';
import BottomTabBar from '../../components/BottomTabBar';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 48) / 3;

type TabType = 'photos' | 'videos';

interface MediaItem {
  id: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

// TODO: Replace with real API data
const PHOTOS: MediaItem[] = [];
const VIDEOS: MediaItem[] = [];

export default function GalleryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('photos');

  const renderEmptyState = (type: 'photos' | 'videos') => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{type === 'photos' ? '📷' : '🎬'}</Text>
      <Text style={styles.emptyTitle}>
        {type === 'photos' 
          ? 'Be the first one to share a photo from this event!'
          : 'Be the first one to share a video from this event!'}
      </Text>
      <TouchableOpacity style={styles.addButtonLarge}>
        <Text style={styles.addButtonLargeText}>+ Add {type === 'photos' ? 'Photo' : 'Video'}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMediaGrid = (items: MediaItem[], type: 'photos' | 'videos') => {
    if (items.length === 0) {
      return renderEmptyState(type);
    }

    return (
      <View style={styles.mediaGrid}>
        {items.map(item => (
          <TouchableOpacity key={item.id} style={styles.mediaItem}>
            <Image source={{ uri: item.url }} style={styles.mediaImage} />
            {type === 'videos' && (
              <View style={styles.playOverlay}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        showBack 
        rightElement={
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        }
      />

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'photos' && styles.tabActive]}
          onPress={() => setActiveTab('photos')}
        >
          <Text style={[styles.tabText, activeTab === 'photos' && styles.tabTextActive]}>
            Photos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'videos' && styles.tabActive]}
          onPress={() => setActiveTab('videos')}
        >
          <Text style={[styles.tabText, activeTab === 'videos' && styles.tabTextActive]}>
            Videos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'photos' 
          ? renderMediaGrid(PHOTOS, 'photos')
          : renderMediaGrid(VIDEOS, 'videos')
        }
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 28, color: '#fff', marginTop: -2 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#06b6d4',
  },
  tabText: { fontSize: 16, color: '#64748b', fontWeight: '500' },
  tabTextActive: { color: '#06b6d4' },
  content: { flex: 1, padding: 16 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: { fontSize: 64, marginBottom: 20 },
  emptyTitle: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  addButtonLarge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
  },
  addButtonLargeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { fontSize: 32, color: '#fff' },
});
