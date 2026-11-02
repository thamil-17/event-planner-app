import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CHANNEL_ID = 'events';

export async function ensurePermission() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Event reminders',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch (e) {
    console.warn('Permission error', e);
    return false;
  }
}

export async function scheduleReminder(event) {
  const granted = await ensurePermission();
  if (!granted) {
    Alert.alert('Notifications disabled', 'Event saved, but no reminder was set because notification permission was denied.');
    return null;
  }
  const when = new Date(new Date(event.dateTime).getTime() - event.reminderMinutes * 60000);
  if (when.getTime() <= Date.now()) return null;
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: event.name,
        body: event.description || 'Your event is coming up.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: when,
        channelId: CHANNEL_ID,
      },
    });
  } catch (e) {
    console.warn('Schedule failed', e);
    return null;
  }
}

export async function cancelReminder(id) {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    console.warn('Cancel failed', e);
  }
}
