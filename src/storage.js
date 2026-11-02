import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'EVENT_PLANNER_EVENTS';

export async function loadEvents() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to load events', e);
    return [];
  }
}

export async function saveEvents(events) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('Failed to save events', e);
  }
}
