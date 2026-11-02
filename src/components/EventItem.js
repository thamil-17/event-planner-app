import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDate, formatTime } from '../utils';

export default function EventItem({ event, past, onPress, onDelete }) {
  return (
    <TouchableOpacity style={[styles.card, past && styles.past]} onPress={onPress} activeOpacity={0.7}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{event.name}</Text>
        <Text style={styles.when}>{formatDate(event.dateTime)} · {formatTime(event.dateTime)}</Text>
        {!!event.description && <Text style={styles.desc} numberOfLines={2}>{event.description}</Text>}
        {event.notificationId && !past && <Text style={styles.bell}>🔔 Reminder set</Text>}
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.del} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.delText}>🗑</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  past: { opacity: 0.55 },
  name: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  when: { fontSize: 13, color: '#4f46e5', marginTop: 2 },
  desc: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  bell: { fontSize: 12, color: '#059669', marginTop: 4 },
  del: { paddingLeft: 12 },
  delText: { fontSize: 20 },
});
