import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// TODO: Replace with real contacts from API
const CONTACTS: { id: string; name: string; status: string }[] = [];

// Group contacts by first letter
const groupedContacts = CONTACTS.reduce((acc, contact) => {
  const letter = contact.name[0].toUpperCase();
  if (!acc[letter]) {
    acc[letter] = [];
  }
  acc[letter].push(contact);
  return acc;
}, {} as Record<string, typeof CONTACTS>);

export default function ComposeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = searchQuery
    ? CONTACTS.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const renderContactList = () => {
    if (filteredContacts) {
      return filteredContacts.map((contact) => (
        <TouchableOpacity key={contact.id} style={styles.contactItem}>
          <View style={styles.contactAvatar}>
            <Text style={styles.contactAvatarText}>{contact.name[0]}</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactStatus}>{contact.status}</Text>
          </View>
        </TouchableOpacity>
      ));
    }

    return Object.keys(groupedContacts)
      .sort()
      .map((letter) => (
        <View key={letter}>
          <Text style={styles.sectionHeader}>{letter}</Text>
          {groupedContacts[letter].map((contact) => (
            <TouchableOpacity key={contact.id} style={styles.contactItem}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactAvatarText}>{contact.name[0]}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactStatus}>{contact.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Message</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#8e8e93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionItem}>
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionEmoji}>👥</Text>
          </View>
          <Text style={styles.quickActionText}>New Group</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.quickActionItem}>
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionEmoji}>➕</Text>
          </View>
          <Text style={styles.quickActionText}>New Contact</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.quickActionItem}>
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionEmoji}>📢</Text>
          </View>
          <Text style={styles.quickActionText}>New Channel</Text>
        </TouchableOpacity>
      </View>

      {/* Contact List */}
      <View style={styles.contactListContainer}>
        <ScrollView style={styles.contactList}>
          {renderContactList()}
        </ScrollView>

        {/* Alphabet Index */}
        <View style={styles.alphabetIndex}>
          {ALPHABET.map((letter) => (
            <TouchableOpacity key={letter} style={styles.alphabetItem}>
              <Text
                style={[
                  styles.alphabetLetter,
                  groupedContacts[letter] && styles.alphabetLetterActive,
                ]}
              >
                {letter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2c2c2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 36,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    marginHorizontal: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  quickActions: {
    backgroundColor: '#1c1c1e',
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quickActionEmoji: {
    fontSize: 18,
  },
  quickActionText: {
    color: '#3b82f6',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#2c2c2e',
    marginLeft: 60,
  },
  contactListContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  contactList: {
    flex: 1,
  },
  sectionHeader: {
    color: '#8e8e93',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#000000',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  contactStatus: {
    color: '#8e8e93',
    fontSize: 14,
    marginTop: 2,
  },
  alphabetIndex: {
    width: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphabetItem: {
    paddingVertical: 1,
  },
  alphabetLetter: {
    color: '#3b82f6',
    fontSize: 11,
    fontWeight: '600',
  },
  alphabetLetterActive: {
    color: '#3b82f6',
  },
});
