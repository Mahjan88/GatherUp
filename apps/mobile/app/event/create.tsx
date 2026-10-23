import { ReactNode, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import PeopleSelector from '../../components/PeopleSelector';
import {
  Button,
  Chip,
  IconName,
  Ionicons,
  ScreenHeader,
  StepDots,
  TextField,
} from '../../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../../theme';
import {
  Person,
  AgendaItem,
  EventPrivacy,
  GuestListVisibility,
  RsvpOption,
  ChatPermission,
  MediaPermission,
  UploadPermission,
  FeedbackVisibility,
  EventCategory,
  TicketType,
} from '../../types/event';

type FormPage = 1 | 2 | 3;

/** Ionicons names stored on AgendaItem.icon */
const AGENDA_ICONS: IconName[] = [
  'cafe-outline',
  'chatbubbles-outline',
  'laptop-outline',
  'mic-outline',
  'pizza-outline',
  'game-controller-outline',
  'musical-notes-outline',
  'camera-outline',
  'sparkles-outline',
  'alarm-outline',
];

const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'networking', label: 'Networking' },
  { value: 'party', label: 'Party' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'social', label: 'Social' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

const STEPS: { page: FormPage; label: string }[] = [
  { page: 1, label: 'Basics' },
  { page: 2, label: 'Guests & Privacy' },
  { page: 3, label: 'Advanced' },
];

// TODO: Replace with real API data
const AVAILABLE_CONTACTS: Person[] = [];

/* ------------------------------------------------------------------ */
/* Local form helpers                                                  */
/* ------------------------------------------------------------------ */

function FieldLabel({
  children,
  required,
  optional,
}: {
  children: ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <Text style={styles.inputLabel}>
      {children}
      {required && <Text style={styles.requiredAsterisk}> *</Text>}
      {optional && <Text style={styles.optionalText}> (optional)</Text>}
    </Text>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionHeader}>{children}</Text>;
}

function ToggleRow({
  label,
  hint,
  value,
  onValueChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.inlineToggle}>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {!!hint && <Text style={styles.toggleHint}>{hint}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.surface}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.radioGroup}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <TouchableOpacity
            key={o.value}
            style={[styles.radioOption, active && styles.radioOptionActive]}
            onPress={() => onChange(o.value)}
            activeOpacity={0.8}
          >
            <View
              style={[styles.radioCircle, active && styles.radioCircleActive]}
            >
              {active && <View style={styles.radioCircleInner} />}
            </View>
            <Text style={styles.radioText}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function OptionCards<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; title: string; hint: string; icon: IconName }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.privacyOptions}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <TouchableOpacity
            key={o.value}
            style={[styles.privacyOption, active && styles.privacyOptionActive]}
            onPress={() => onChange(o.value)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.privacyIcon,
                active && { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons
                name={o.icon}
                size={18}
                color={active ? colors.primaryOn : colors.textSecondary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.privacyOptionTitle,
                  active && styles.privacyOptionTitleActive,
                ]}
              >
                {o.title}
              </Text>
              <Text style={styles.privacyOptionHint}>{o.hint}</Text>
            </View>
            {active && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function CheckRow({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.checkboxOption}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.checkbox, checked && styles.checkboxActive]}>
        {checked && (
          <Ionicons name="checkmark" size={14} color={colors.primaryOn} />
        )}
      </View>
      <Text style={styles.checkboxText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ------------------------------------------------------------------ */

export default function CreateEventScreen() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<FormPage>(1);

  // A. Event Basics
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [galleryForAttendeesOnly, setGalleryForAttendeesOnly] = useState(true);

  // B. When & Where
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [cityRegion, setCityRegion] = useState('');
  const [showAddressToInvitees, setShowAddressToInvitees] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [virtualLink, setVirtualLink] = useState('');

  // Organizer & Series
  const [organizerType, setOrganizerType] = useState<'user' | 'community'>(
    'user'
  );
  const [communityId, setCommunityId] = useState('');
  const [seriesId, setSeriesId] = useState('');

  // C. Guests & Privacy
  const [eventPrivacy, setEventPrivacy] = useState<EventPrivacy>('public');
  const [coHosts, setCoHosts] = useState<Person[]>([]);
  const [showCoHostModal, setShowCoHostModal] = useState(false);
  const [coHostSearch, setCoHostSearch] = useState('');
  const [invitedPeople, setInvitedPeople] = useState<Person[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [allowInviteOthers, setAllowInviteOthers] = useState(false);
  const [guestListVisibility, setGuestListVisibility] =
    useState<GuestListVisibility>('attendees');
  const [rsvpRequired, setRsvpRequired] = useState(true);
  const [capacityLimit, setCapacityLimit] = useState('');
  const [rsvpOption, setRsvpOption] = useState<RsvpOption>('three-way');
  const [rsvpDeadline, setRsvpDeadline] = useState('');

  // F. Chat & Sharing
  const [chatEnabled, setChatEnabled] = useState(true);
  const [whoCanChat, setWhoCanChat] = useState<ChatPermission>('attendees');
  const [whoCanPostMedia, setWhoCanPostMedia] =
    useState<MediaPermission>('attendees');
  const [whoCanUpload, setWhoCanUpload] =
    useState<UploadPermission>('attendees');

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
  const [selectedIcon, setSelectedIcon] = useState<string>(AGENDA_ICONS[0]);
  const [whatToBring, setWhatToBring] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [accessibilityNotes, setAccessibilityNotes] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('');
  const [ticketType, setTicketType] = useState<TicketType>('free');
  const [ticketPrice, setTicketPrice] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');

  // J. Reviews & Feedback
  const [feedbackEnabled, setFeedbackEnabled] = useState(true);
  const [feedbackVisibility, setFeedbackVisibility] =
    useState<FeedbackVisibility>('attendees_only');

  const toggleCoHost = (person: Person) => {
    if (coHosts.some((c) => c.id === person.id)) {
      setCoHosts(coHosts.filter((c) => c.id !== person.id));
    } else {
      setCoHosts([...coHosts, person]);
    }
  };

  const removeCoHost = (id: string) => {
    setCoHosts(coHosts.filter((c) => c.id !== id));
  };

  const toggleInvitedPerson = (person: Person) => {
    if (invitedPeople.some((p) => p.id === person.id)) {
      setInvitedPeople(invitedPeople.filter((p) => p.id !== person.id));
    } else {
      setInvitedPeople([...invitedPeople, person]);
    }
  };

  const removeInvitedPerson = (id: string) => {
    setInvitedPeople(invitedPeople.filter((p) => p.id !== id));
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
    setSelectedIcon(AGENDA_ICONS[0]);
    setShowAddAgenda(false);
  };

  const removeAgendaItem = (id: string) => {
    setAgendaItems(agendaItems.filter((item) => item.id !== id));
  };

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage((currentPage + 1) as FormPage);
    } else {
      router.back();
    }
  };

  const renderStepper = () => (
    <View style={styles.stepper}>
      <StepDots total={STEPS.length} current={currentPage - 1} />
      <View style={styles.stepLabels}>
        {STEPS.map((step) => (
          <TouchableOpacity
            key={step.page}
            onPress={() => setCurrentPage(step.page)}
            hitSlop={6}
          >
            <Text
              style={[
                styles.stepLabel,
                currentPage === step.page && styles.stepLabelActive,
              ]}
            >
              {step.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPage1 = () => (
    <>
      <SectionTitle>Event Basics</SectionTitle>

      {/* TODO: Hook up image picker to set coverImage */}
      <TouchableOpacity activeOpacity={0.9} style={styles.coverPhotoBox}>
        {coverImage ? (
          <ImageBackground
            source={{ uri: coverImage }}
            style={styles.coverPhotoInner}
            imageStyle={{ borderRadius: radius.lg }}
          >
            <View style={styles.coverPill}>
              <Ionicons
                name="camera-outline"
                size={16}
                color={colors.textOnImage}
              />
              <Text style={styles.coverPillText}>Change Cover Photo</Text>
            </View>
          </ImageBackground>
        ) : (
          <View style={styles.coverPhotoInner}>
            <Ionicons name="image-outline" size={36} color={colors.textMuted} />
            <View style={[styles.coverPill, { marginTop: spacing.md }]}>
              <Ionicons
                name="camera-outline"
                size={16}
                color={colors.textOnImage}
              />
              <Text style={styles.coverPillText}>Add Cover Photo</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      <FieldLabel required>Event Title</FieldLabel>
      <TextField
        placeholder="Give your event a name"
        value={title}
        onChangeText={setTitle}
      />

      <FieldLabel>Tagline</FieldLabel>
      <TextField
        placeholder="A short catchy subtitle"
        value={tagline}
        onChangeText={setTagline}
      />

      <FieldLabel required>Description</FieldLabel>
      <TextField
        placeholder="Tell people about your event"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <SectionTitle>When & Where</SectionTitle>

      <View style={styles.dateTimeRow}>
        <View style={styles.dateTimeField}>
          <FieldLabel required>Start Date</FieldLabel>
          <TextField
            icon="calendar-outline"
            placeholder="MM/DD/YYYY"
            value={startDate}
            onChangeText={setStartDate}
          />
        </View>
        <View style={styles.dateTimeField}>
          <FieldLabel required>Start Time</FieldLabel>
          <TextField
            icon="time-outline"
            placeholder="HH:MM"
            value={startTime}
            onChangeText={setStartTime}
          />
        </View>
      </View>

      <View style={styles.dateTimeRow}>
        <View style={styles.dateTimeField}>
          <FieldLabel>End Date</FieldLabel>
          <TextField
            icon="calendar-outline"
            placeholder="MM/DD/YYYY"
            value={endDate}
            onChangeText={setEndDate}
          />
        </View>
        <View style={styles.dateTimeField}>
          <FieldLabel>End Time</FieldLabel>
          <TextField
            icon="time-outline"
            placeholder="HH:MM"
            value={endTime}
            onChangeText={setEndTime}
          />
        </View>
      </View>

      <FieldLabel>Timezone</FieldLabel>
      <TextField
        icon="globe-outline"
        placeholder="e.g., America/New_York"
        value={timezone}
        onChangeText={setTimezone}
      />

      <ToggleRow
        label="Online Event"
        hint="This event takes place virtually"
        value={isOnline}
        onValueChange={setIsOnline}
      />

      {isOnline && (
        <>
          <FieldLabel>Meeting Link</FieldLabel>
          <TextField
            icon="videocam-outline"
            placeholder="https://zoom.us/j/..."
            value={virtualLink}
            onChangeText={setVirtualLink}
            autoCapitalize="none"
          />
        </>
      )}

      {!isOnline && (
        <>
          <FieldLabel>Venue Name</FieldLabel>
          <TextField
            icon="business-outline"
            placeholder="e.g., Rooftop Lounge, Main Hall"
            value={location}
            onChangeText={setLocation}
          />

          <FieldLabel>Address</FieldLabel>
          <TextField
            icon="location-outline"
            placeholder="Where's your event?"
            value={address}
            onChangeText={setAddress}
          />

          <FieldLabel>City / Region</FieldLabel>
          <TextField
            icon="map-outline"
            placeholder="San Francisco, CA"
            value={cityRegion}
            onChangeText={setCityRegion}
          />
        </>
      )}

      <View style={styles.inputGroup}>
        <FieldLabel>Category</FieldLabel>
        <View style={styles.categoryPills}>
          {EVENT_CATEGORIES.map((cat) => (
            <Chip
              key={cat.value}
              label={cat.label}
              selected={category === cat.value}
              onPress={() => setCategory(cat.value)}
            />
          ))}
        </View>
      </View>

      <ToggleRow
        label="Add Agenda"
        hint="Create a schedule for your event"
        value={hasAgenda}
        onValueChange={setHasAgenda}
      />

      {hasAgenda && (
        <View style={[styles.agendaSection, styles.indentedSection]}>
          {agendaItems.map((item, index) => (
            <View key={item.id} style={styles.agendaItem}>
              <View style={styles.agendaTimeline}>
                <View style={styles.agendaDot} />
                {index < agendaItems.length - 1 && (
                  <View style={styles.agendaLine} />
                )}
              </View>
              <View style={styles.agendaIconBox}>
                <Ionicons
                  name={item.icon as IconName}
                  size={18}
                  color={colors.primary}
                />
              </View>
              <View style={styles.agendaContent}>
                <Text style={styles.agendaTime}>{item.time}</Text>
                <Text style={styles.agendaTitle}>{item.title}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeAgendaItem(item.id)}
                hitSlop={8}
              >
                <Ionicons name="close" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}

          {showAddAgenda ? (
            <View style={styles.addAgendaForm}>
              <View style={styles.agendaFormRow}>
                <TextField
                  containerStyle={[styles.timeInput, styles.noMargin]}
                  placeholder="10:00 AM"
                  value={newAgendaTime}
                  onChangeText={setNewAgendaTime}
                />
                <TextField
                  containerStyle={[styles.titleInput, styles.noMargin]}
                  placeholder="Activity title"
                  value={newAgendaTitle}
                  onChangeText={setNewAgendaTitle}
                />
              </View>
              <View style={styles.iconPicker}>
                {AGENDA_ICONS.map((icon) => {
                  const active = selectedIcon === icon;
                  return (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconOption,
                        active && styles.iconOptionActive,
                      ]}
                      onPress={() => setSelectedIcon(icon)}
                    >
                      <Ionicons
                        name={icon}
                        size={18}
                        color={active ? colors.primaryOn : colors.textSecondary}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.agendaFormButtons}>
                <Button
                  label="Cancel"
                  variant="ghost"
                  size="md"
                  style={{ flex: 1 }}
                  onPress={() => {
                    setShowAddAgenda(false);
                    setNewAgendaTime('');
                    setNewAgendaTitle('');
                  }}
                />
                <Button
                  label="Add Item"
                  size="md"
                  style={{ flex: 1 }}
                  onPress={addAgendaItem}
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addAgendaItemButton}
              onPress={() => setShowAddAgenda(true)}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
              <Text style={styles.addAgendaItemText}>Add Agenda Item</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );

  const renderPage2 = () => (
    <>
      <SectionTitle>Hosting As</SectionTitle>

      <View style={styles.inputGroup}>
        <OptionCards
          value={organizerType}
          onChange={setOrganizerType}
          options={[
            {
              value: 'user',
              title: 'Myself',
              hint: 'Host as your personal profile',
              icon: 'person-outline',
            },
            {
              value: 'community',
              title: 'A Community',
              hint: 'Host on behalf of a community',
              icon: 'people-outline',
            },
          ]}
        />
      </View>

      {organizerType === 'community' && (
        <>
          <FieldLabel>Select Community</FieldLabel>
          <TextField
            icon="people-outline"
            placeholder="Choose a community..."
            value={communityId}
            onChangeText={setCommunityId}
          />
          {/* TODO: Replace with a proper picker from user's communities */}
        </>
      )}

      <FieldLabel optional>Part of a Series</FieldLabel>
      <TextField
        icon="repeat-outline"
        placeholder="Standalone event"
        value={seriesId}
        onChangeText={setSeriesId}
      />
      {/* TODO: Replace with a proper picker from user's series */}

      <SectionTitle>Guests & Privacy</SectionTitle>

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
        availablePeople={AVAILABLE_CONTACTS}
        onTogglePerson={toggleCoHost}
        searchQuery={coHostSearch}
        onSearchChange={setCoHostSearch}
      />

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
        availablePeople={AVAILABLE_CONTACTS}
        onTogglePerson={toggleInvitedPerson}
        searchQuery={inviteSearch}
        onSearchChange={setInviteSearch}
      />

      <View style={styles.inputGroup}>
        <FieldLabel required>Event Privacy</FieldLabel>
        <OptionCards
          value={eventPrivacy}
          onChange={setEventPrivacy}
          options={[
            {
              value: 'public',
              title: 'Public',
              hint: 'Discoverable by anyone',
              icon: 'globe-outline',
            },
            {
              value: 'private',
              title: 'Private (Link)',
              hint: 'Only people with the link',
              icon: 'link-outline',
            },
            {
              value: 'invite-only',
              title: 'Invite Only',
              hint: 'Only invited guests',
              icon: 'lock-closed-outline',
            },
          ]}
        />
      </View>

      <ToggleRow
        label="Allow invitees to invite others"
        value={allowInviteOthers}
        onValueChange={setAllowInviteOthers}
      />

      <View style={styles.inputGroup}>
        <FieldLabel>Guest List Visibility</FieldLabel>
        <RadioGroup
          value={guestListVisibility}
          onChange={setGuestListVisibility}
          options={[
            { value: 'everyone', label: 'Everyone' },
            { value: 'attendees', label: 'Attendees only' },
            { value: 'hidden', label: 'Hidden' },
          ]}
        />
      </View>

      <ToggleRow
        label="RSVP Required"
        value={rsvpRequired}
        onValueChange={setRsvpRequired}
      />

      {rsvpRequired && (
        <View style={styles.indentedSection}>
          <View style={styles.inputGroup}>
            <FieldLabel>RSVP Options</FieldLabel>
            <RadioGroup
              value={rsvpOption}
              onChange={setRsvpOption}
              options={[
                { value: 'three-way', label: 'Going / Maybe / Not Going' },
                { value: 'two-way', label: 'Going / Not Going' },
              ]}
            />
          </View>

          <FieldLabel>RSVP Deadline</FieldLabel>
          <TextField
            icon="calendar-outline"
            placeholder="MM/DD/YYYY"
            value={rsvpDeadline}
            onChangeText={setRsvpDeadline}
          />
        </View>
      )}

      <SectionTitle>Chat & Sharing</SectionTitle>

      <ToggleRow
        label="Event Chat Enabled"
        value={chatEnabled}
        onValueChange={setChatEnabled}
      />

      {chatEnabled && (
        <View style={styles.indentedSection}>
          <View style={styles.inputGroup}>
            <FieldLabel>Who can chat</FieldLabel>
            <RadioGroup
              value={whoCanChat}
              onChange={setWhoCanChat}
              options={[
                { value: 'hosts', label: 'Only Hosts' },
                { value: 'attendees', label: 'Attendees' },
              ]}
            />
          </View>

          <View style={styles.inputGroup}>
            <FieldLabel>Who can post media</FieldLabel>
            <RadioGroup
              value={whoCanPostMedia}
              onChange={setWhoCanPostMedia}
              options={[
                { value: 'hosts', label: 'Hosts' },
                { value: 'attendees', label: 'Attendees' },
                { value: 'everyone', label: 'Everyone' },
              ]}
            />
          </View>

          <View style={styles.inputGroup}>
            <FieldLabel>Who can upload</FieldLabel>
            <RadioGroup
              value={whoCanUpload}
              onChange={setWhoCanUpload}
              options={[
                { value: 'attendees', label: 'Attendees only' },
                { value: 'hosts', label: 'Hosts only' },
              ]}
            />
          </View>
        </View>
      )}
    </>
  );

  const renderPage3 = () => (
    <>
      <SectionTitle>Advanced Settings</SectionTitle>

      <View style={styles.inputGroup}>
        <FieldLabel>Cost / Tickets</FieldLabel>
        <RadioGroup
          value={ticketType}
          onChange={setTicketType}
          options={[
            { value: 'free', label: 'Free' },
            { value: 'paid', label: 'Paid' },
          ]}
        />
        {ticketType === 'paid' && (
          <View style={[styles.indentedSection, { marginTop: spacing.sm }]}>
            <TextField
              containerStyle={styles.noMargin}
              icon="cash-outline"
              placeholder="Enter ticket price..."
              value={ticketPrice}
              onChangeText={setTicketPrice}
              keyboardType="numeric"
            />
          </View>
        )}
      </View>

      <FieldLabel>Capacity Limit</FieldLabel>
      <TextField
        icon="people-outline"
        placeholder="Leave empty for unlimited"
        value={capacityLimit}
        onChangeText={setCapacityLimit}
        keyboardType="numeric"
      />

      <FieldLabel>Age Restriction</FieldLabel>
      <TextField
        placeholder="e.g., 18+, 21+, All ages..."
        value={ageRestriction}
        onChangeText={setAgeRestriction}
      />

      <FieldLabel>What to Bring</FieldLabel>
      <TextField
        placeholder="Items guests should bring..."
        value={whatToBring}
        onChangeText={setWhatToBring}
      />

      <FieldLabel>Dress Code</FieldLabel>
      <TextField
        placeholder="e.g., Casual, Formal, Costume..."
        value={dressCode}
        onChangeText={setDressCode}
      />

      <FieldLabel>Accessibility Notes</FieldLabel>
      <TextField
        placeholder="Wheelchair access, parking info..."
        value={accessibilityNotes}
        onChangeText={setAccessibilityNotes}
      />

      <FieldLabel>Cancellation Policy</FieldLabel>
      <TextField
        placeholder="Describe your cancellation and refund policy..."
        value={cancellationPolicy}
        onChangeText={setCancellationPolicy}
        multiline
        numberOfLines={3}
      />

      <SectionTitle>Notifications & Reminders</SectionTitle>

      <View style={styles.inputGroup}>
        <FieldLabel>Reminders</FieldLabel>
        <View style={styles.checkboxGroup}>
          <CheckRow
            label="24h before"
            checked={reminder24h}
            onPress={() => setReminder24h(!reminder24h)}
          />
          <CheckRow
            label="1h before"
            checked={reminder1h}
            onPress={() => setReminder1h(!reminder1h)}
          />
        </View>
      </View>

      <SectionTitle>Reviews & Feedback</SectionTitle>

      <ToggleRow
        label="Feedback Enabled"
        value={feedbackEnabled}
        onValueChange={setFeedbackEnabled}
      />

      {feedbackEnabled && (
        <View style={[styles.inputGroup, styles.indentedSection]}>
          <FieldLabel>Feedback Visibility</FieldLabel>
          <RadioGroup
            value={feedbackVisibility}
            onChange={setFeedbackVisibility}
            options={[
              { value: 'public', label: 'Public' },
              { value: 'attendees_only', label: 'Attendees Only' },
              { value: 'host_only', label: 'Host Only' },
            ]}
          />
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Create Event"
        leftLabel="Cancel"
        onLeftPress={() => router.back()}
      >
        {renderStepper()}
      </ScreenHeader>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {currentPage === 1 && renderPage1()}
        {currentPage === 2 && renderPage2()}
        {currentPage === 3 && renderPage3()}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          label={currentPage === 3 ? 'Create Event' : 'Next'}
          onPress={handleNext}
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
  stepper: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepLabels: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: GUTTER,
    paddingTop: spacing.sm,
  },
  sectionHeader: {
    ...typography.h2,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  indentedSection: {
    marginLeft: spacing.xs,
    paddingLeft: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.primarySoft,
  },
  inputLabel: {
    ...typography.label,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  requiredAsterisk: {
    color: colors.danger,
  },
  optionalText: {
    color: colors.textMuted,
    fontWeight: '400',
  },
  noMargin: {
    marginBottom: 0,
  },
  coverPhotoBox: {
    height: 180,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  coverPhotoInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.overlay,
  },
  coverPillText: {
    color: colors.textOnImage,
    fontSize: 13,
    fontWeight: '600',
  },
  inlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  toggleLabel: {
    ...typography.label,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleHint: {
    ...typography.caption,
    marginTop: 2,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dateTimeField: {
    flex: 1,
  },
  privacyOptions: {
    gap: spacing.sm,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  privacyOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  privacyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyOptionTitle: {
    ...typography.label,
  },
  privacyOptionTitleActive: {
    color: colors.primaryDark,
  },
  privacyOptionHint: {
    ...typography.caption,
    marginTop: 2,
  },
  radioGroup: {
    gap: spacing.sm,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  radioOptionActive: {
    borderColor: colors.primary,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: colors.primary,
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioText: {
    ...typography.body,
  },
  checkboxGroup: {
    gap: spacing.sm,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxText: {
    ...typography.body,
  },
  categoryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  agendaSection: {
    marginBottom: spacing.lg,
  },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  agendaTimeline: {
    width: 20,
    alignItems: 'center',
    paddingTop: 12,
  },
  agendaDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  agendaLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
    minHeight: 30,
  },
  agendaIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm + 2,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  agendaContent: {
    flex: 1,
    paddingTop: 1,
  },
  agendaTime: {
    ...typography.caption,
    marginBottom: 2,
  },
  agendaTitle: {
    ...typography.label,
  },
  removeButton: {
    padding: 6,
  },
  addAgendaForm: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 14,
    gap: spacing.md,
  },
  agendaFormRow: {
    flexDirection: 'row',
    gap: spacing.sm,
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
    width: 38,
    height: 38,
    borderRadius: radius.sm + 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionActive: {
    backgroundColor: colors.primary,
  },
  agendaFormButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  addAgendaItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addAgendaItemText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 110,
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
