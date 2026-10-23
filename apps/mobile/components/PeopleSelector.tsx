import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SlideUpModal from './SlideUpModal';
import { Avatar, Button, Ionicons, SearchBar } from './ui';
import { colors, radius, spacing, typography } from '../theme';
import { Person } from '../types/event';

export type { Person };

interface PeopleSelectorProps {
  label: string;
  selectedPeople: Person[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  addButtonText: string;
  modalVisible: boolean;
  onModalClose: () => void;
  modalTitle: string;
  availablePeople: Person[];
  onTogglePerson: (person: Person) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
}

function CheckCircle({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.checkbox, checked && styles.checkboxActive]}>
      {checked && (
        <Ionicons name="checkmark" size={15} color={colors.primaryOn} />
      )}
    </View>
  );
}

export default function PeopleSelector({
  label,
  selectedPeople,
  onAdd,
  onRemove,
  addButtonText,
  modalVisible,
  onModalClose,
  modalTitle,
  availablePeople,
  onTogglePerson,
  searchQuery = '',
  onSearchChange,
  showSearch = true,
}: PeopleSelectorProps) {
  const filteredPeople = availablePeople.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Selected People Chips */}
      {selectedPeople.length > 0 && (
        <View style={styles.chipsContainer}>
          {selectedPeople.map((person) => (
            <View key={person.id} style={styles.chip}>
              <Avatar uri={person.avatar} name={person.name} size={24} />
              <Text style={styles.chipName}>{person.name}</Text>
              <TouchableOpacity
                onPress={() => onRemove(person.id)}
                hitSlop={8}
                accessibilityLabel={`Remove ${person.name}`}
              >
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAdd}
        activeOpacity={0.8}
      >
        <Ionicons name="person-add-outline" size={18} color={colors.primary} />
        <Text style={styles.addButtonText}>{addButtonText}</Text>
      </TouchableOpacity>

      {/* Selection Modal */}
      <SlideUpModal
        visible={modalVisible}
        onClose={onModalClose}
        title={modalTitle}
      >
        {showSearch && onSearchChange && (
          <SearchBar
            placeholder="Search people"
            value={searchQuery}
            onChangeText={onSearchChange}
            style={styles.search}
          />
        )}

        <View>
          {filteredPeople.length > 0 ? (
            filteredPeople.map((person) => {
              const checked = selectedPeople.some((p) => p.id === person.id);
              return (
                <TouchableOpacity
                  key={person.id}
                  style={styles.personItem}
                  onPress={() => onTogglePerson(person)}
                  activeOpacity={0.7}
                >
                  <Avatar uri={person.avatar} name={person.name} size={44} />
                  <Text style={styles.personName} numberOfLines={1}>
                    {person.name}
                  </Text>
                  <CheckCircle checked={checked} />
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No people found</Text>
          )}
        </View>

        <Button
          label="Done"
          onPress={onModalClose}
          fullWidth
          style={styles.doneButton}
        />
      </SlideUpModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingLeft: spacing.xs,
    paddingRight: spacing.sm,
    gap: spacing.sm,
  },
  chipName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: colors.primarySoft,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  search: {
    marginBottom: spacing.sm,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  personName: {
    ...typography.body,
    flex: 1,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  emptyText: {
    ...typography.bodySecondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  doneButton: {
    marginTop: spacing.lg,
  },
});
