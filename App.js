import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ActivityIndicator, View, BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import EventListScreen from './src/screens/EventListScreen';
import EventFormScreen from './src/screens/EventFormScreen';
import { loadEvents, saveEvents } from './src/storage';
import { scheduleReminder, cancelReminder } from './src/notifications';

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('list');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'form') {
        setEditing(null);
        setScreen('list');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [screen]);

  const persist = useCallback(async (next) => {
    setEvents(next);
    await saveEvents(next);
  }, []);

  const handleSave = async (data) => {
    let notificationId = null;
    if (editing) await cancelReminder(editing.notificationId);
    if (data.reminderMinutes !== null) {
      notificationId = await scheduleReminder(data);
    }
    const event = { ...data, notificationId };
    const next = editing
      ? events.map((e) => (e.id === editing.id ? event : e))
      : [...events, event];
    await persist(next);
    setScreen('list');
    setEditing(null);
  };

  const handleDelete = async (event) => {
    await cancelReminder(event.notificationId);
    await persist(events.filter((e) => e.id !== event.id));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        {screen === 'list' ? (
          <EventListScreen
            events={events}
            onAdd={() => { setEditing(null); setScreen('form'); }}
            onEdit={(e) => { setEditing(e); setScreen('form'); }}
            onDelete={handleDelete}
          />
        ) : (
          <EventFormScreen
            initial={editing}
            onSave={handleSave}
            onCancel={() => { setEditing(null); setScreen('list'); }}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f6fa' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
