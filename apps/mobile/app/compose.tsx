import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Avatar,
  Divider,
  EmptyState,
  ListRow,
  ScreenHeader,
  SearchBar,
} from '../components/ui';
import { colors, radius, spacing, GUTTER } from '../theme';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const CONTACTS: { id: string; name: string; status: string }[] = [];

// Group contacts by first letter
const groupedContacts = CONTACTS.reduce(
  (acc, contact) => {
    const letter = contact.name[0].toUpperCase();
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(contact);
    return acc;
  },
  {} as Record<string, typeof CONTACTS>
);

function ContactRow({
  contact,
}: {
  contact: { id: string; name: string; status: string };
}) {
  return (
    <ListRow
      left={<Avatar name={contact.name} size={44} />}
      title={contact.name}
      subtitle={contact.status}
      onPress={() => {}}
      showChevron={false}
    />
  );
}

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
      if (filteredContacts.length === 0) {
        return (
          <EmptyState
            icon="search-outline"
            title="No contacts found"
            message="Try a different name."
          />
        );
      }
      return filteredContacts.map((contact) => (
        <ContactRow key={contact.id} contact={contact} />
      ));
    }

    const letters = Object.keys(groupedContacts).sort();
    if (letters.length === 0) {
      return (
        <EmptyState
          icon="people-outline"
          title="No contacts yet"
          message="People you follow or meet at events will show up here."
        />
      );
    }

    return letters.map((letter) => (
      <View key={letter}>
        <Text style={styles.sectionHeader}>{letter}</Text>
        {groupedContacts[letter].map((contact) => (
          <ContactRow key={contact.id} contact={contact} />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="New Message"
        leftLabel="Cancel"
        onLeftPress={() => router.back()}
      >
        <SearchBar
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.search}
        />
      </ScreenHeader>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <ListRow icon="people-outline" title="New Group" onPress={() => {}} />
        <Divider style={styles.quickDivider} />
        <ListRow
          icon="person-add-outline"
          title="New Contact"
          onPress={() => {}}
        />
        <Divider style={styles.quickDivider} />
        <ListRow
          icon="megaphone-outline"
          title="New Channel"
          onPress={() => {}}
        />
      </View>

      {/* Contact List */}
      <View style={styles.contactListContainer}>
        <ScrollView
          style={styles.contactList}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {renderContactList()}
        </ScrollView>

        {/* Alphabet Index */}
        <View style={styles.alphabetIndex}>
          {ALPHABET.map((letter) => (
            <TouchableOpacity key={letter} style={styles.alphabetItem}>
              <Text
                style={[
                  styles.alphabetLetter,
                  !!groupedContacts[letter] && styles.alphabetLetterActive,
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
    backgroundColor: colors.background,
  },
  search: {
    marginHorizontal: GUTTER,
  },
  quickActions: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
  },
  quickDivider: {
    marginLeft: GUTTER + 34 + spacing.md,
  },
  contactListContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  contactList: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.4,
    paddingHorizontal: GUTTER,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  alphabetIndex: {
    width: 20,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphabetItem: {
    paddingVertical: 1,
  },
  alphabetLetter: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  alphabetLetterActive: {
    color: colors.primary,
  },
});
