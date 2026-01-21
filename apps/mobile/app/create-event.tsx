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

const CATEGORIES = ['Music', 'Tech', 'Art', 'Sports', 'Food', 'Networking', 'Other'];

interface AgendaItem {
  id: string;
  time: string;
  title: string;
  icon: string;
}

const AGENDA_ICONS = ['☕', '💬', '🎤', '💻', '🍕', '🎵', '🎨', '⚡'];

export default function CreateEventScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [hasAgenda, setHasAgenda] = useState(false);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [showAddAgenda, setShowAddAgenda] = useState(false);
  const [newAgendaTime, setNewAgendaTime] = useState('');
  const [newAgendaTitle, setNewAgendaTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('☕');

  const addAgendaItem = () => {
    if (!newAgendaTime || !newAgendaTitle) return;
    
    const newItem: AgendaItem = {
      id: Date.now().toString(),
      time: newAgendaTime,
      title: newAgendaTitle,
      icon: selectedIcon,
    };
    
    setAgendaItems([...agendaItems, newItem]);
    setNewAgendaTime('');
    setNewAgendaTitle('');
    setSelectedIcon('☕');
    setShowAddAgenda(false);
  };

  const removeAgendaItem = (id: string) => {
    setAgendaItems(agendaItems.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Event</Text>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <TouchableOpacity style={styles.coverPhotoBox}>
          <Text style={styles.coverPhotoIcon}>📷</Text>
          <Text style={styles.coverPhotoText}>Add Cover Photo</Text>
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Event Title</Text>
          <TextInput
            style={styles.input}
            placeholder="What's your event called?"
            placeholderTextColor="#64748b"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell people about your event..."
            placeholderTextColor="#64748b"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  selectedCategory === cat && styles.categoryPillActive
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[
                  styles.categoryPillText,
                  selectedCategory === cat && styles.categoryPillTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Date & Time</Text>
          <TouchableOpacity style={styles.pickerButton}>
            <Text style={styles.pickerIcon}>📅</Text>
            <Text style={styles.pickerText}>Select Date</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pickerButton, { marginTop: 8 }]}>
            <Text style={styles.pickerIcon}>🕐</Text>
            <Text style={styles.pickerText}>Select Time</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Where's your event?"
            placeholderTextColor="#64748b"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Agenda Toggle */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Add Agenda</Text>
            <Text style={styles.toggleHint}>Create a schedule for your event</Text>
          </View>
          <Switch
            value={hasAgenda}
            onValueChange={setHasAgenda}
            trackColor={{ false: '#334155', true: '#3b82f6' }}
            thumbColor="#fff"
          />
        </View>

        {/* Agenda Section */}
        {hasAgenda && (
          <View style={styles.agendaSection}>
            <Text style={styles.inputLabel}>Event Agenda</Text>
            
            {/* Existing Agenda Items */}
            {agendaItems.map((item, index) => (
              <View key={item.id} style={styles.agendaItem}>
                <View style={styles.agendaTimeline}>
                  <View style={styles.agendaDot} />
                  {index < agendaItems.length - 1 && <View style={styles.agendaLine} />}
                </View>
                <View style={styles.agendaIconBox}>
                  <Text style={styles.agendaIcon}>{item.icon}</Text>
                </View>
                <View style={styles.agendaContent}>
                  <Text style={styles.agendaTime}>{item.time}</Text>
                  <Text style={styles.agendaTitle}>{item.title}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeAgendaItem(item.id)}
                >
                  <Text style={styles.removeIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Agenda Item Form */}
            {showAddAgenda ? (
              <View style={styles.addAgendaForm}>
                <View style={styles.agendaFormRow}>
                  <TextInput
                    style={[styles.input, styles.timeInput]}
                    placeholder="10:00 AM"
                    placeholderTextColor="#64748b"
                    value={newAgendaTime}
                    onChangeText={setNewAgendaTime}
                  />
                  <TextInput
                    style={[styles.input, styles.titleInput]}
                    placeholder="Activity title"
                    placeholderTextColor="#64748b"
                    value={newAgendaTitle}
                    onChangeText={setNewAgendaTitle}
                  />
                </View>
                
                {/* Icon Selection */}
                <Text style={styles.iconLabel}>Select Icon</Text>
                <View style={styles.iconGrid}>
                  {AGENDA_ICONS.map(icon => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconOption,
                        selectedIcon === icon && styles.iconOptionActive
                      ]}
                      onPress={() => setSelectedIcon(icon)}
                    >
                      <Text style={styles.iconText}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.formButtons}>
                  <TouchableOpacity 
                    style={styles.cancelFormButton}
                    onPress={() => setShowAddAgenda(false)}
                  >
                    <Text style={styles.cancelFormText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.addFormButton}
                    onPress={addAgendaItem}
                  >
                    <Text style={styles.addFormText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addAgendaButton}
                onPress={() => setShowAddAgenda(true)}
              >
                <Text style={styles.addAgendaIcon}>+</Text>
                <Text style={styles.addAgendaText}>Add Agenda Item</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Private Toggle */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Private Event</Text>
            <Text style={styles.toggleHint}>Only invited people can see this event</Text>
          </View>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: '#334155', true: '#3b82f6' }}
            thumbColor="#fff"
          />
        </View>

        {/* Invite People */}
        <TouchableOpacity style={styles.inviteButton}>
          <Text style={styles.inviteIcon}>👥</Text>
          <Text style={styles.inviteText}>Invite People</Text>
          <Text style={styles.chevron}>›</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  cancelText: { fontSize: 16, color: '#94a3b8' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#fff' },
  createButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  content: { flex: 1, padding: 20 },
  coverPhotoBox: {
    height: 160,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  coverPhotoIcon: { fontSize: 32, marginBottom: 8 },
  coverPhotoText: { fontSize: 14, color: '#94a3b8' },
  inputGroup: { marginBottom: 24 },
  inputLabel: { fontSize: 14, color: '#94a3b8', marginBottom: 8 },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
  },
  textArea: { height: 100, paddingTop: 14 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryPillActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  categoryPillText: { color: '#94a3b8', fontSize: 14 },
  categoryPillTextActive: { color: '#fff' },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerIcon: { fontSize: 18, marginRight: 12 },
  pickerText: { flex: 1, fontSize: 16, color: '#94a3b8' },
  chevron: { fontSize: 22, color: '#64748b' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  toggleInfo: { flex: 1 },
  toggleLabel: { fontSize: 16, color: '#fff', fontWeight: '500' },
  toggleHint: { fontSize: 13, color: '#64748b', marginTop: 2 },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inviteIcon: { fontSize: 20, marginRight: 12 },
  inviteText: { flex: 1, fontSize: 16, color: '#fff' },
  bottomPadding: { height: 40 },
  // Agenda styles
  agendaSection: { marginBottom: 24 },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  agendaTimeline: { alignItems: 'center', marginRight: 12, width: 20 },
  agendaDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#06b6d4',
  },
  agendaLine: {
    width: 2,
    height: 50,
    backgroundColor: '#334155',
  },
  agendaIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  agendaIcon: { fontSize: 20 },
  agendaContent: { flex: 1 },
  agendaTime: { fontSize: 12, color: '#64748b', marginBottom: 2 },
  agendaTitle: { fontSize: 14, color: '#fff', fontWeight: '500' },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: { color: '#fff', fontSize: 12, fontWeight: '600' },
  addAgendaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addAgendaIcon: { fontSize: 20, color: '#3b82f6', marginRight: 8 },
  addAgendaText: { fontSize: 14, color: '#3b82f6', fontWeight: '500' },
  addAgendaForm: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  agendaFormRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  timeInput: { width: 100 },
  titleInput: { flex: 1 },
  iconLabel: { fontSize: 12, color: '#64748b', marginBottom: 8 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  iconOption: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionActive: { backgroundColor: '#3b82f6' },
  iconText: { fontSize: 20 },
  formButtons: { flexDirection: 'row', gap: 12 },
  cancelFormButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  cancelFormText: { color: '#94a3b8', fontSize: 14, fontWeight: '500' },
  addFormButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  addFormText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
