import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Switch,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import PeopleSelector, { Person } from '../components/PeopleSelector';

type FormPage = 1 | 2 | 3;
type EventPrivacy = 'public' | 'private' | 'invite-only';
type GuestListVisibility = 'everyone' | 'attendees' | 'hidden';
type RsvpOption = 'three-way' | 'two-way';
type ChatPermission = 'hosts' | 'attendees';
type MediaPermission = 'hosts' | 'attendees' | 'everyone';
type UploadPermission = 'attendees' | 'hosts';
type FeedbackVisibility = 'public' | 'attendees_only' | 'host_only';
type EventCategory = 'networking' | 'party' | 'workshop' | 'conference' | 'social' | 'sports' | 'other';
type TicketType = 'free' | 'paid';

interface AgendaItem {
  id: string;
  time: string;
  title: string;
  icon: string;
}

const AGENDA_ICONS = ['☕', '💬', '💻', '🎤', '🍕', '🎮', '🎵', '📸', '🎉', '⏰'];

const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'networking', label: 'Networking' },
  { value: 'party', label: 'Party' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'social', label: 'Social' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

// Mock data for co-hosts/invites
const MOCK_CONTACTS: Person[] = [
  { id: '1', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: '2', name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '3', name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
  { id: '4', name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: '5', name: 'Jessica Williams', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
];

export default function CreateEventScreen() {
  const router = useRouter();
  
  // Current form page
  const [currentPage, setCurrentPage] = useState<FormPage>(1);
  
  // A. Event Basics
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [galleryForAttendeesOnly, setGalleryForAttendeesOnly] = useState(true);
  
  // B. When & Where
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [address, setAddress] = useState('');
  const [showAddressToInvitees, setShowAddressToInvitees] = useState(true);
  
  // C. Guests & Privacy
  const [eventPrivacy, setEventPrivacy] = useState<EventPrivacy>('public');
  const [coHosts, setCoHosts] = useState<Person[]>([]);
  const [showCoHostModal, setShowCoHostModal] = useState(false);
  const [coHostSearch, setCoHostSearch] = useState('');
  const [invitedPeople, setInvitedPeople] = useState<Person[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [allowInviteOthers, setAllowInviteOthers] = useState(false);
  const [guestListVisibility, setGuestListVisibility] = useState<GuestListVisibility>('attendees');
  const [rsvpRequired, setRsvpRequired] = useState(true);
  const [capacityLimit, setCapacityLimit] = useState('');
  const [rsvpOption, setRsvpOption] = useState<RsvpOption>('three-way');
  const [rsvpDeadline, setRsvpDeadline] = useState('');
  
  // F. Chat & Sharing
  const [chatEnabled, setChatEnabled] = useState(true);
  const [whoCanChat, setWhoCanChat] = useState<ChatPermission>('attendees');
  const [whoCanPostMedia, setWhoCanPostMedia] = useState<MediaPermission>('attendees');
  const [whoCanUpload, setWhoCanUpload] = useState<UploadPermission>('attendees');

  // H. Notifications & Reminders
  const [reminder24h, setReminder24h] = useState(true);
  const [reminder1h, setReminder1h] = useState(true);

  // I. Advanced Settings
  const [category, setCategory] = useState<EventCategory>('social');
  const [hasAgenda, setHasAgenda] = useState(false);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [showAddAgenda, setShowAddAgenda] = useState(false);
  const [newAgendaTime, setNewAgendaTime] = useState('');
  const [newAgendaTitle, setNewAgendaTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('☕');
  const [whatToBring, setWhatToBring] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [accessibilityNotes, setAccessibilityNotes] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('');
  const [ticketType, setTicketType] = useState<TicketType>('free');
  const [ticketPrice, setTicketPrice] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');

  // J. Reviews & Feedback
  const [feedbackEnabled, setFeedbackEnabled] = useState(true);
  const [feedbackVisibility, setFeedbackVisibility] = useState<FeedbackVisibility>('attendees_only');

  const toggleCoHost = (person: Person) => {
    if (coHosts.some(c => c.id === person.id)) {
      setCoHosts(coHosts.filter(c => c.id !== person.id));
    } else {
      setCoHosts([...coHosts, person]);
    }
  };

  const removeCoHost = (id: string) => {
    setCoHosts(coHosts.filter(c => c.id !== id));
  };

  const toggleInvitedPerson = (person: Person) => {
    if (invitedPeople.some(p => p.id === person.id)) {
      setInvitedPeople(invitedPeople.filter(p => p.id !== person.id));
    } else {
      setInvitedPeople([...invitedPeople, person]);
    }
  };

  const removeInvitedPerson = (id: string) => {
    setInvitedPeople(invitedPeople.filter(p => p.id !== id));
  };

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

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage((currentPage + 1) as FormPage);
    } else {
      console.log('Creating event...');
      router.back();
    }
  };

  const renderPageTabs = () => (
    <View style={styles.tabsContainer}>
      <View style={styles.tabsWrapper}>
        <TouchableOpacity
          style={[styles.tab, currentPage === 1 && styles.tabActive]}
          onPress={() => setCurrentPage(1)}
        >
          <Text style={[styles.tabText, currentPage === 1 && styles.tabTextActive]}>
            Basics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentPage === 2 && styles.tabActive]}
          onPress={() => setCurrentPage(2)}
        >
          <Text style={[styles.tabText, currentPage === 2 && styles.tabTextActive]}>
            Guests & Privacy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentPage === 3 && styles.tabActive]}
          onPress={() => setCurrentPage(3)}
        >
          <Text style={[styles.tabText, currentPage === 3 && styles.tabTextActive]}>
            Advanced Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ========== TAB 1: EVENT BASICS + WHEN & WHERE ==========
  const renderPage1 = () => (
    <>
      {/* ========== A. EVENT BASICS ========== */}
      <Text style={styles.sectionHeader}>Event Basics</Text>

      {/* Cover Photo */}
      <TouchableOpacity style={styles.coverPhotoBox}>
        <Text style={styles.coverPhotoIcon}>📷</Text>
        <Text style={styles.coverPhotoText}>Add Cover Photo</Text>
      </TouchableOpacity>

      {/* Event Title */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Event Title <Text style={styles.requiredAsterisk}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Give your event a name"
          placeholderTextColor="#64748b"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Description */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Description <Text style={styles.requiredAsterisk}>*</Text></Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell people about your event"
          placeholderTextColor="#64748b"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* ========== B. WHEN & WHERE ========== */}
      <Text style={styles.sectionHeader}>When & Where</Text>

      {/* Start Date/Time */}
      <View style={styles.dateTimeRow}>
        <View style={styles.dateTimeField}>
          <Text style={styles.inputLabel}>Start Date <Text style={styles.requiredAsterisk}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="#64748b"
            value={startDate}
            onChangeText={setStartDate}
          />
        </View>
        <View style={styles.dateTimeField}>
          <Text style={styles.inputLabel}>Start Time <Text style={styles.requiredAsterisk}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            placeholderTextColor="#64748b"
            value={startTime}
            onChangeText={setStartTime}
          />
        </View>
      </View>

      {/* End Date/Time */}
      <View style={styles.dateTimeRow}>
        <View style={styles.dateTimeField}>
          <Text style={styles.inputLabel}>End Date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="#64748b"
            value={endDate}
            onChangeText={setEndDate}
          />
        </View>
        <View style={styles.dateTimeField}>
          <Text style={styles.inputLabel}>End Time</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            placeholderTextColor="#64748b"
            value={endTime}
            onChangeText={setEndTime}
          />
        </View>
      </View>

      {/* Address */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Where's your event?"
          placeholderTextColor="#64748b"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* Category */}
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Category</Text>
      <View style={styles.categoryPills}>
        {EVENT_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.value}
            style={[styles.categoryPill, category === cat.value && styles.categoryPillActive]}
            onPress={() => setCategory(cat.value)}
          >
            <Text style={[styles.categoryPillText, category === cat.value && styles.categoryPillTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

    {/* Agenda Toggle */}
    <View style={styles.inlineToggle}>
      <View style={styles.toggleInfo}>
          <Text style={styles.toggleLabel}>Add Agenda</Text>
          <Text style={styles.toggleHint}>Create a schedule for your event</Text>
      </View>
      <Switch
        value={hasAgenda}
        onValueChange={setHasAgenda}
        trackColor={{ false: '#334155', true: '#14b8a6' }}
        thumbColor="#fff"
      />
    </View>

    {/* Agenda Items */}
    {hasAgenda && (
      <View style={[styles.agendaSection, styles.indentedSection]}>
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
            <TouchableOpacity style={styles.removeButton} onPress={() => removeAgendaItem(item.id)}>
              <Text style={styles.removeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

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
            <View style={styles.iconPicker}>
              {AGENDA_ICONS.map(icon => (
                <TouchableOpacity
                  key={icon}
                  style={[styles.iconOption, selectedIcon === icon && styles.iconOptionActive]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.agendaFormButtons}>
              <TouchableOpacity
                style={styles.cancelAgendaButton}
                onPress={() => {
                  setShowAddAgenda(false);
                  setNewAgendaTime('');
                  setNewAgendaTitle('');
                }}
              >
                <Text style={styles.cancelAgendaText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addAgendaButton} onPress={addAgendaItem}>
                <Text style={styles.addAgendaText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.addAgendaItemButton} onPress={() => setShowAddAgenda(true)}>
            <Text style={styles.addAgendaItemIcon}>+</Text>
            <Text style={styles.addAgendaItemText}>Add Agenda Item</Text>
          </TouchableOpacity>
        )}
      </View>
    )}

    </>
  );

  // ========== TAB 2: GUESTS & PRIVACY + CHAT & SHARING + NOTIFICATIONS ==========
  const renderPage2 = () => (
    <>
      {/* ========== C. GUESTS & PRIVACY ========== */}
      <Text style={styles.sectionHeader}>Guests & Privacy</Text>

      {/* Co-hosts */}
      <PeopleSelector
        label="Co-Hosts"
        selectedPeople={coHosts}
        onAdd={() => setShowCoHostModal(true)}
        onRemove={removeCoHost}
        addButtonText="Add Co-Host"
        modalVisible={showCoHostModal}
        onModalClose={() => {
          setShowCoHostModal(false);
          setCoHostSearch('');
        }}
        modalTitle="Add Co-Hosts"
        availablePeople={MOCK_CONTACTS}
        onTogglePerson={toggleCoHost}
        searchQuery={coHostSearch}
        onSearchChange={setCoHostSearch}
      />

      {/* Invite People */}
      <PeopleSelector
        label="Invite People"
        selectedPeople={invitedPeople}
        onAdd={() => setShowInviteModal(true)}
        onRemove={removeInvitedPerson}
        addButtonText="Add People"
        modalVisible={showInviteModal}
        onModalClose={() => {
          setShowInviteModal(false);
          setInviteSearch('');
        }}
        modalTitle="Invite People"
        availablePeople={MOCK_CONTACTS}
        onTogglePerson={toggleInvitedPerson}
        searchQuery={inviteSearch}
        onSearchChange={setInviteSearch}
      />

      {/* Event Privacy */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Event Privacy <Text style={styles.requiredAsterisk}>*</Text></Text>
        <View style={styles.privacyOptions}>
          <TouchableOpacity
            style={[styles.privacyOption, eventPrivacy === 'public' && styles.privacyOptionActive]}
            onPress={() => setEventPrivacy('public')}
          >
            <Text style={[styles.privacyOptionTitle, eventPrivacy === 'public' && styles.privacyOptionTitleActive]}>
              Public
            </Text>
            <Text style={styles.privacyOptionHint}>Discoverable by anyone</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.privacyOption, eventPrivacy === 'private' && styles.privacyOptionActive]}
            onPress={() => setEventPrivacy('private')}
          >
            <Text style={[styles.privacyOptionTitle, eventPrivacy === 'private' && styles.privacyOptionTitleActive]}>
              Private (Link)
            </Text>
            <Text style={styles.privacyOptionHint}>Only people with the link</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.privacyOption, eventPrivacy === 'invite-only' && styles.privacyOptionActive]}
            onPress={() => setEventPrivacy('invite-only')}
          >
            <Text style={[styles.privacyOptionTitle, eventPrivacy === 'invite-only' && styles.privacyOptionTitleActive]}>
              Invite Only
            </Text>
            <Text style={styles.privacyOptionHint}>Only invited guests</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Allow Invitees to Invite Others */}
      <View style={styles.inlineToggle}>
        <Text style={styles.toggleLabel}>Allow invitees to invite others</Text>
        <Switch
          value={allowInviteOthers}
          onValueChange={setAllowInviteOthers}
          trackColor={{ false: '#334155', true: '#14b8a6' }}
          thumbColor="#fff"
        />
      </View>

      {/* Guest List Visibility */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Guest List Visibility</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity style={styles.radioOption} onPress={() => setGuestListVisibility('everyone')}>
            <View style={[styles.radioCircle, guestListVisibility === 'everyone' && styles.radioCircleActive]}>
              {guestListVisibility === 'everyone' && <View style={styles.radioCircleInner} />}
            </View>
            <Text style={styles.radioText}>Everyone</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioOption} onPress={() => setGuestListVisibility('attendees')}>
            <View style={[styles.radioCircle, guestListVisibility === 'attendees' && styles.radioCircleActive]}>
              {guestListVisibility === 'attendees' && <View style={styles.radioCircleInner} />}
            </View>
            <Text style={styles.radioText}>Attendees only</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioOption} onPress={() => setGuestListVisibility('hidden')}>
            <View style={[styles.radioCircle, guestListVisibility === 'hidden' && styles.radioCircleActive]}>
              {guestListVisibility === 'hidden' && <View style={styles.radioCircleInner} />}
            </View>
            <Text style={styles.radioText}>Hidden</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RSVP Required */}
      <View style={styles.inlineToggle}>
        <Text style={styles.toggleLabel}>RSVP Required</Text>
        <Switch
          value={rsvpRequired}
          onValueChange={setRsvpRequired}
          trackColor={{ false: '#334155', true: '#14b8a6' }}
          thumbColor="#fff"
        />
      </View>

      {rsvpRequired && (
        <View style={styles.indentedSection}>
          {/* RSVP Options */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>RSVP Options</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity style={styles.radioOption} onPress={() => setRsvpOption('three-way')}>
                <View style={[styles.radioCircle, rsvpOption === 'three-way' && styles.radioCircleActive]}>
                  {rsvpOption === 'three-way' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={styles.radioText}>Going / Maybe / Not Going</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioOption} onPress={() => setRsvpOption('two-way')}>
                <View style={[styles.radioCircle, rsvpOption === 'two-way' && styles.radioCircleActive]}>
                  {rsvpOption === 'two-way' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={styles.radioText}>Going / Not Going</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* RSVP Deadline */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>RSVP Deadline</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#64748b"
              value={rsvpDeadline}
              onChangeText={setRsvpDeadline}
            />
          </View>
        </View>
      )}

      {/* ========== F. CHAT & SHARING ========== */}
      <Text style={styles.sectionHeader}>Chat & Sharing</Text>

      {/* Event Chat Toggle */}
      <View style={styles.inlineToggle}>
        <Text style={styles.toggleLabel}>Event Chat Enabled</Text>
        <Switch
          value={chatEnabled}
          onValueChange={setChatEnabled}
          trackColor={{ false: '#334155', true: '#14b8a6' }}
          thumbColor="#fff"
        />
      </View>

      {chatEnabled && (
        <View style={styles.indentedSection}>
          {/* Who Can Chat */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Who can chat</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity style={styles.radioOption} onPress={() => setWhoCanChat('hosts')}>
                <View style={[styles.radioCircle, whoCanChat === 'hosts' && styles.radioCircleActive]}>
                  {whoCanChat === 'hosts' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={styles.radioText}>Only Hosts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioOption} onPress={() => setWhoCanChat('attendees')}>
                <View style={[styles.radioCircle, whoCanChat === 'attendees' && styles.radioCircleActive]}>
                  {whoCanChat === 'attendees' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={styles.radioText}>Attendees</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Who Can Post Media */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Who can post media</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity style={styles.radioOption} onPress={() => setWhoCanPostMedia('hosts')}>
                <View style={[styles.radioCircle, whoCanPostMedia === 'hosts' && styles.radioCircleActive]}>
                  {whoCanPostMedia === 'hosts' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={styles.radioText}>Hosts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioOption} onPress={() => setWhoCanPostMedia('attendees')}>
                <View style={[styles.radioCircle, whoCanPostMedia === 'attendees' && styles.radioCircleActive]}>
                  {whoCanPostMedia === 'attendees' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={styles.radioText}>Attendees</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioOption} onPress={() => setWhoCanPostMedia('everyone')}>
                <View style={[styles.radioCircle, whoCanPostMedia === 'everyone' && styles.radioCircleActive]}>
                  {whoCanPostMedia === 'everyone' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={styles.radioText}>Everyone</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Who Can Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Who can upload</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity style={styles.radioOption} onPress={() => setWhoCanUpload('attendees')}>
                <View style={[styles.radioCircle, whoCanUpload === 'attendees' && styles.radioCircleActive]}>
                  {whoCanUpload === 'attendees' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={styles.radioText}>Attendees only</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioOption} onPress={() => setWhoCanUpload('hosts')}>
                <View style={[styles.radioCircle, whoCanUpload === 'hosts' && styles.radioCircleActive]}>
                  {whoCanUpload === 'hosts' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={styles.radioText}>Hosts only</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );

  // ========== TAB 3: ADVANCED SETTINGS + REVIEWS & FEEDBACK ==========
  const renderPage3 = () => (
    <>
      {/* ========== I. ADVANCED SETTINGS ========== */}
      <Text style={styles.sectionHeader}>Advanced Settings</Text>

      {/* Cost / Tickets */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cost / Tickets</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity style={styles.radioOption} onPress={() => setTicketType('free')}>
            <View style={[styles.radioCircle, ticketType === 'free' && styles.radioCircleActive]}>
              {ticketType === 'free' && <View style={styles.radioCircleInner} />}
            </View>
            <Text style={styles.radioText}>Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioOption} onPress={() => setTicketType('paid')}>
            <View style={[styles.radioCircle, ticketType === 'paid' && styles.radioCircleActive]}>
              {ticketType === 'paid' && <View style={styles.radioCircleInner} />}
            </View>
            <Text style={styles.radioText}>Paid</Text>
          </TouchableOpacity>
        </View>
        {ticketType === 'paid' && (
          <View style={styles.indentedSection}>
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder="Enter ticket price..."
              placeholderTextColor="#64748b"
              value={ticketPrice}
              onChangeText={setTicketPrice}
              keyboardType="numeric"
            />
          </View>
        )}
      </View>

      {/* Capacity Limit */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Capacity Limit</Text>
        <TextInput
          style={styles.input}
          placeholder="Leave empty for unlimited"
          placeholderTextColor="#64748b"
          value={capacityLimit}
          onChangeText={setCapacityLimit}
          keyboardType="numeric"
        />
      </View>

      {/* Age Restriction */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Age Restriction</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 18+, 21+, All ages..."
          placeholderTextColor="#64748b"
          value={ageRestriction}
          onChangeText={setAgeRestriction}
        />
      </View>

      {/* What to Bring */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>What to Bring</Text>
        <TextInput
          style={styles.input}
          placeholder="Items guests should bring..."
          placeholderTextColor="#64748b"
          value={whatToBring}
          onChangeText={setWhatToBring}
        />
      </View>

      {/* Dress Code */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Dress Code</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Casual, Formal, Costume..."
          placeholderTextColor="#64748b"
          value={dressCode}
          onChangeText={setDressCode}
        />
      </View>

      {/* Accessibility Notes */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Accessibility Notes</Text>
        <TextInput
          style={styles.input}
          placeholder="Wheelchair access, parking info..."
          placeholderTextColor="#64748b"
          value={accessibilityNotes}
          onChangeText={setAccessibilityNotes}
        />
      </View>

      {/* Cancellation Policy */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cancellation Policy</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your cancellation and refund policy..."
          placeholderTextColor="#64748b"
          value={cancellationPolicy}
          onChangeText={setCancellationPolicy}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* ========== H. NOTIFICATIONS & REMINDERS ========== */}
      <Text style={styles.sectionHeader}>Notifications & Reminders</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Reminders</Text>
        <View style={styles.checkboxGroup}>
          <TouchableOpacity style={styles.checkboxOption} onPress={() => setReminder24h(!reminder24h)}>
            <View style={[styles.checkbox, reminder24h && styles.checkboxActive]}>
              {reminder24h && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>24h before</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkboxOption} onPress={() => setReminder1h(!reminder1h)}>
            <View style={[styles.checkbox, reminder1h && styles.checkboxActive]}>
              {reminder1h && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>1h before</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ========== J. REVIEWS & FEEDBACK ========== */}
      <Text style={styles.sectionHeader}>Reviews & Feedback</Text>

      {/* Feedback Enabled Toggle */}
      <View style={styles.inlineToggle}>
        <Text style={styles.toggleLabel}>Feedback Enabled</Text>
        <Switch
          value={feedbackEnabled}
          onValueChange={setFeedbackEnabled}
          trackColor={{ false: '#334155', true: '#14b8a6' }}
          thumbColor="#fff"
        />
      </View>

      {feedbackEnabled && (
        <View style={[styles.inputGroup, styles.indentedSection]}>
          <Text style={styles.inputLabel}>Feedback Visibility</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity style={styles.radioOption} onPress={() => setFeedbackVisibility('public')}>
              <View style={[styles.radioCircle, feedbackVisibility === 'public' && styles.radioCircleActive]}>
                {feedbackVisibility === 'public' && <View style={styles.radioCircleInner} />}
              </View>
              <Text style={styles.radioText}>Public</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioOption} onPress={() => setFeedbackVisibility('attendees_only')}>
              <View style={[styles.radioCircle, feedbackVisibility === 'attendees_only' && styles.radioCircleActive]}>
                {feedbackVisibility === 'attendees_only' && <View style={styles.radioCircleInner} />}
              </View>
              <Text style={styles.radioText}>Attendees Only</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioOption} onPress={() => setFeedbackVisibility('host_only')}>
              <View style={[styles.radioCircle, feedbackVisibility === 'host_only' && styles.radioCircleActive]}>
                {feedbackVisibility === 'host_only' && <View style={styles.radioCircleInner} />}
              </View>
              <Text style={styles.radioText}>Host Only</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>

      {/* Page Tabs */}
      {renderPageTabs()}

      {/* Form Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentPage === 1 && renderPage1()}
        {currentPage === 2 && renderPage2()}
        {currentPage === 3 && renderPage3()}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentPage === 3 ? 'Create Event' : 'Next'}
          </Text>
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
  coverImageArea: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadCoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadCoverIcon: {
    fontSize: 20,
  },
  uploadCoverText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  tabsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 22,
  },
  tabActive: {
    backgroundColor: '#334155',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94a3b8',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  inputGroup: {
    marginBottom: 16,
  },
  indentedSection: {
    marginLeft: 16,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#334155',
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
  coverPhotoBox: {
    height: 100,
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
    fontSize: 24,
    marginBottom: 4,
  },
  coverPhotoText: {
    fontSize: 13,
    color: '#94a3b8',
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
  toggleLabel: {
    fontSize: 14,
    color: '#fff',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateTimeField: {
    flex: 1,
  },
  privacyOptions: {
    gap: 10,
  },
  privacyOption: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  privacyOptionActive: {
    borderColor: '#14b8a6',
    backgroundColor: '#0f2a2a',
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
  radioGroup: {
    gap: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    gap: 10,
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
  radioText: {
    fontSize: 13,
    color: '#fff',
  },
  checkboxGroup: {
    gap: 8,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  checkboxText: {
    fontSize: 13,
    color: '#fff',
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
  agendaSection: {
    marginBottom: 16,
  },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  agendaTimeline: {
    width: 20,
    alignItems: 'center',
    paddingTop: 10,
  },
  agendaDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#14b8a6',
  },
  agendaLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#334155',
    marginTop: 4,
    minHeight: 30,
  },
  agendaIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  agendaIcon: {
    fontSize: 16,
  },
  agendaContent: {
    flex: 1,
    paddingTop: 2,
  },
  agendaTime: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 2,
  },
  agendaTitle: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  removeButton: {
    padding: 6,
  },
  removeIcon: {
    fontSize: 12,
    color: '#64748b',
  },
  addAgendaForm: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    gap: 10,
  },
  agendaFormRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timeInput: {
    flex: 1,
  },
  titleInput: {
    flex: 2,
  },
  iconPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  iconOption: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionActive: {
    backgroundColor: '#14b8a6',
  },
  iconText: {
    fontSize: 16,
  },
  agendaFormButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelAgendaButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  cancelAgendaText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  addAgendaButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#14b8a6',
    alignItems: 'center',
  },
  addAgendaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  addAgendaItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  addAgendaItemIcon: {
    fontSize: 16,
    color: '#14b8a6',
    marginRight: 6,
  },
  addAgendaItemText: {
    fontSize: 13,
    color: '#14b8a6',
    fontWeight: '500',
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
  nextButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
