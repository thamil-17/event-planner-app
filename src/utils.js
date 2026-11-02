export const REMINDER_OPTIONS = [
  { label: 'None', value: null },
  { label: 'At time', value: 0 },
  { label: '10 min before', value: 10 },
  { label: '1 hour before', value: 60 },
  { label: '1 day before', value: 1440 },
];

export const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

export const formatTime = (d) =>
  new Date(d).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

export const isoDate = (d) => {
  const x = new Date(d);
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${x.getFullYear()}-${m}-${day}`;
};

export function validateEvent({ name, description, dateTime, reminderMinutes }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Event name is required.';
  else if (name.trim().length > 60) errors.name = 'Name must be 60 characters or fewer.';
  if (description.length > 300) errors.description = 'Description must be 300 characters or fewer.';
  if (isNaN(new Date(dateTime).getTime())) errors.dateTime = 'Please choose a valid date and time.';
  else if (reminderMinutes !== null) {
    const eventTime = new Date(dateTime).getTime();
    const when = eventTime - reminderMinutes * 60000;
    if (eventTime > Date.now() && when <= Date.now()) {
      errors.reminder = 'Reminder time is already in the past. Pick a later event or a shorter reminder.';
    }
  }
  return errors;
}
