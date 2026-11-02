import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { REMINDER_OPTIONS, formatDate, formatTime, validateEvent } from '../utils';

export default function EventFormScreen({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [dateTime, setDateTime] = useState(initial ? new Date(initial.dateTime) : new Date(Date.now() + 3600000));
  const [reminderMinutes, setReminderMinutes] = useState(initial ? initial.reminderMinutes ?? null : 10);
  const [picker, setPicker] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const onPick = (_event, selected) => {
    const mode = picker;
    if (Platform.OS === 'android') setPicker(null);
    if (!selected) return;
    const next = new Date(dateTime);
    if (mode === 'date') next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    else next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    setDateTime(next);
  };

  const submit = async () => {
    if (saving) return;
    const data = { name, description, dateTime: dateTime.toISOString(), reminderMinutes };
    const errs = validateEvent(data);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      await onSave({
        id: initial?.id ?? Date.now().toString(),
        ...data,
        name: name.trim(),
        description: description.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{initial ? 'Edit Event' : 'New Event'}</Text>

        <Text style={styles.label}>Name *</Text>
        <TextInput style={[styles.input, errors.name && styles.inputErr]} value={name} onChangeText={setName} placeholder="e.g. Team meeting" maxLength={60} />
        {errors.name && <Text style={styles.err}>{errors.name}</Text>}

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, { height: 90, textAlignVertical: 'top' }, errors.description && styles.inputErr]} value={description} onChangeText={setDescription} placeholder="Optional details" multiline />
        {errors.description && <Text style={styles.err}>{errors.description}</Text>}

        <Text style={styles.label}>Date & time *</Text>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.input, styles.pick]} onPress={() => setPicker('date')}>
            <Text>📅 {formatDate(dateTime)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.input, styles.pick]} onPress={() => setPicker('time')}>
            <Text>🕒 {formatTime(dateTime)}</Text>
          </TouchableOpacity>
        </View>
        {errors.dateTime && <Text style={styles.err}>{errors.dateTime}</Text>}
        {picker && <DateTimePicker value={dateTime} mode={picker} onChange={onPick} is24Hour={false} />}

        <Text style={styles.label}>Reminder</Text>
        <View style={styles.chips}>
          {REMINDER_OPTIONS.map((o) => (
            <TouchableOpacity key={o.label} style={[styles.chip, reminderMinutes === o.value && styles.chipOn]} onPress={() => setReminderMinutes(o.value)}>
              <Text style={[styles.chipText, reminderMinutes === o.value && { color: '#fff' }]}>{o.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.reminder && <Text style={styles.err}>{errors.reminder}</Text>}

        <TouchableOpacity style={styles.save} onPress={submit} disabled={saving}>
          <Text style={styles.saveText}>{saving ? 'Saving…' : initial ? 'Update Event' : 'Save Event'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancel} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: '#1f2937', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginTop: 14, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  inputErr: { borderColor: '#dc2626' },
  err: { color: '#dc2626', fontSize: 12, marginTop: 4 },
  row: { flexDirection: 'row', gap: 10 },
  pick: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#4f46e5', backgroundColor: '#fff' },
  chipOn: { backgroundColor: '#4f46e5' },
  chipText: { color: '#4f46e5', fontSize: 13 },
  save: { backgroundColor: '#4f46e5', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 26 },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancel: { padding: 14, alignItems: 'center' },
  cancelText: { color: '#6b7280', fontSize: 15 },
});
