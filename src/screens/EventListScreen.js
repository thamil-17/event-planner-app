import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, SectionList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import EventItem from '../components/EventItem';
import { formatDate, isoDate } from '../utils';

export default function EventListScreen({ events, onAdd, onEdit, onDelete }) {
  const [query, setQuery] = useState('');
  const [showPast, setShowPast] = useState(true);

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = events.filter((e) => {
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        isoDate(e.dateTime).includes(q) ||
        formatDate(e.dateTime).toLowerCase().includes(q)
      );
    });
    const now = Date.now();
    const byTime = (a, b) => new Date(a.dateTime) - new Date(b.dateTime);
    const upcoming = filtered.filter((e) => new Date(e.dateTime).getTime() >= now).sort(byTime);
    const past = filtered.filter((e) => new Date(e.dateTime).getTime() < now).sort((a, b) => byTime(b, a));
    const result = [{ title: 'Upcoming', data: upcoming, past: false }];
    if (showPast) result.push({ title: 'Past', data: past, past: true });
    return result;
  }, [events, query, showPast]);

  const confirmDelete = (event) =>
    Alert.alert('Delete event', `Delete "${event.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(event) },
    ]);

  const noEventsAtAll = events.length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Events</Text>
      <TextInput
        style={styles.search}
        placeholder="Search by name or date (e.g. 2026-11-05)"
        value={query}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
      />
      <TouchableOpacity onPress={() => setShowPast(!showPast)}>
        <Text style={styles.toggle}>{showPast ? 'Hide past events' : 'Show past events'}</Text>
      </TouchableOpacity>

      {noEventsAtAll ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>No events yet.{'\n'}Tap + to create your first one.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(e) => e.id}
          renderItem={({ item, section }) => (
            <EventItem event={item} past={section.past} onPress={() => onEdit(item)} onDelete={() => confirmDelete(item)} />
          )}
          renderSectionHeader={({ section }) => <Text style={styles.header}>{section.title} ({section.data.length})</Text>}
          renderSectionFooter={({ section }) =>
            section.data.length === 0 ? (
              <Text style={styles.none}>{query ? 'No matching events.' : `No ${section.title.toLowerCase()} events.`}</Text>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={onAdd} accessibilityLabel="Add event">
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#1f2937', marginBottom: 12 },
  search: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, borderWidth: 1, borderColor: '#e5e7eb' },
  toggle: { color: '#4f46e5', marginVertical: 8, fontSize: 13, alignSelf: 'flex-end' },
  header: { fontSize: 15, fontWeight: '700', color: '#6b7280', marginTop: 8, marginBottom: 8, textTransform: 'uppercase' },
  none: { color: '#9ca3af', marginBottom: 12, fontStyle: 'italic' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 56 },
  emptyText: { textAlign: 'center', color: '#6b7280', fontSize: 16, marginTop: 8 },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  fabText: { color: '#fff', fontSize: 32, marginTop: -2 },
});
