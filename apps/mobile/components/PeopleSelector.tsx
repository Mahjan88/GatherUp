import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import SlideUpModal from './SlideUpModal';

export interface Person {
  id: string;
  name: string;
  avatar?: string;
}

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
  const filteredPeople = availablePeople.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* Selected People Chips */}
      {selectedPeople.length > 0 && (
        <View style={styles.chipsContainer}>
          {selectedPeople.map(person => (
            <View key={person.id} style={styles.chip}>
              {person.avatar ? (
                <Image source={{ uri: person.avatar }} style={styles.chipAvatar} />
              ) : (
                <View style={styles.chipAvatarPlaceholder}>
                  <Text style={styles.chipAvatarText}>{person.name.charAt(0)}</Text>
                </View>
              )}
              <Text style={styles.chipName}>{person.name}</Text>
              <TouchableOpacity onPress={() => onRemove(person.id)}>
                <Text style={styles.chipRemove}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Text style={styles.addButtonIcon}>+</Text>
        <Text style={styles.addButtonText}>{addButtonText}</Text>
      </TouchableOpacity>

      {/* Selection Modal */}
      <SlideUpModal
        visible={modalVisible}
        onClose={onModalClose}
        title={modalTitle}
      >
        {showSearch && onSearchChange && (
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        )}
        
        <View style={styles.peopleList}>
          {filteredPeople.length > 0 ? (
            filteredPeople.map(person => (
              <TouchableOpacity
                key={person.id}
                style={styles.personItem}
                onPress={() => onTogglePerson(person)}
              >
                {person.avatar ? (
                  <Image source={{ uri: person.avatar }} style={styles.personAvatar} />
                ) : (
                  <View style={styles.personAvatarPlaceholder}>
                    <Text style={styles.personAvatarText}>{person.name.charAt(0)}</Text>
                  </View>
                )}
                <Text style={styles.personName}>{person.name}</Text>
                <View style={[
                  styles.checkbox,
                  selectedPeople.some(p => p.id === person.id) && styles.checkboxActive
                ]}>
                  {selectedPeople.some(p => p.id === person.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No people found</Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.doneButton} onPress={onModalClose}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </SlideUpModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '500',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 12,
    gap: 8,
  },
  chipAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  chipAvatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipAvatarText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  chipName: {
    color: '#fff',
    fontSize: 13,
  },
  chipRemove: {
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  addButtonIcon: {
    fontSize: 18,
    color: '#14b8a6',
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: '#14b8a6',
    fontWeight: '500',
  },
  searchInput: {
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#fff',
    marginBottom: 16,
  },
  peopleList: {
    gap: 10,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 12,
  },
  personAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  personAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  personAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  personName: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  doneButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
