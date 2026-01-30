import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import BottomTabBar from '../../components/BottomTabBar';

export default function NotificationsSettingsScreen() {
  const router = useRouter();
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  return (
    <View style={styles.container}>
      <Header showBack />

      <ScrollView style={styles.content}>
        {/* Warning */}
        <View style={styles.warning}>
          <Text style={styles.warningText}>
            WARNING: Push Notifications are disabled. To enable visit:{'\n'}
            iPhone Settings {'>'} Notifications {'>'} GatherUp
          </Text>
        </View>

        {/* Message Notifications */}
        <Text style={styles.sectionLabel}>MESSAGE NOTIFICATIONS</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Show Notifications</Text>
            <Switch
              value={messageNotifications}
              onValueChange={setMessageNotifications}
              trackColor={{ false: '#e5e5ea', true: '#34c759' }}
            />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Sound</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Note</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Group Notifications */}
        <Text style={styles.sectionLabel}>GROUP NOTIFICATIONS</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Show Notifications</Text>
            <Switch
              value={groupNotifications}
              onValueChange={setGroupNotifications}
              trackColor={{ false: '#e5e5ea', true: '#34c759' }}
            />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Sound</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Note</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* In-App Notifications */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>In-App Notifications</Text>
              <Text style={styles.rowSubtitle}>Banners, Sounds, Vibrate</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Show Preview */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Show Preview</Text>
            <Switch
              value={showPreview}
              onValueChange={setShowPreview}
              trackColor={{ false: '#e5e5ea', true: '#34c759' }}
            />
          </View>
        </View>
        <Text style={styles.hint}>
          Preview message text inside new message notifications.
        </Text>

        {/* Reset */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.blueLabel}>Reset Notification Settings</Text>
          </TouchableOpacity>
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
  warning: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  warningText: { fontSize: 13, color: '#856404', textAlign: 'center' },
  sectionLabel: {
    fontSize: 13,
    color: '#8e8e93',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  section: { backgroundColor: '#fff' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: { fontSize: 16, color: '#000' },
  rowSubtitle: { fontSize: 13, color: '#8e8e93', marginTop: 2 },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  rowValue: { fontSize: 16, color: '#8e8e93', marginRight: 4 },
  blueLabel: { fontSize: 16, color: '#007aff' },
  chevron: { fontSize: 22, color: '#c7c7cc' },
  divider: { height: 0.5, backgroundColor: '#e5e5ea', marginLeft: 16 },
  hint: {
    fontSize: 13,
    color: '#8e8e93',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
});
