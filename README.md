# Event Planner App

**Name:** Thamilmaruthan  **Index No:** JF/ICT/25/30
**Module:** Mobile Application Development (K72T001M15)

## Description
A React Native (Expo) app to create, organise, search and get reminded of events. Data is stored on-device with AsyncStorage.

## Features
- Create events (name, date, time, description) with input validation
- Upcoming events sorted by date/time; past events shown separately (can be hidden)
- Edit and delete events (delete asks for confirmation)
- Search by name or date (e.g. `2026-11-05`, `Nov`)
- Local notification reminders (at time / 10 min / 1 hour / 1 day before)
- Notification permission requested at runtime (Android 13+ supported)
- Android back button returns from the form to the list
- Empty states and error handling

## Tools / Technologies
React Native, Expo SDK 54, expo-notifications, @react-native-async-storage/async-storage, @react-native-community/datetimepicker, react-native-safe-area-context, JavaScript

## How to run
1. Install Node.js (LTS) and the **Expo Go** app on your phone (or an Android emulator).
2. In this folder run:
   ```
   npm install
   npx expo install --fix
   npx expo start
   ```
3. Scan the QR code with Expo Go (Android) or press `a` for an emulator.
   If reminders don't fire in Expo Go, use a development build: `npx expo run:android`.

## Screenshots
Add 3–5 screenshots in the `screenshots/` folder and link them here:
![List](screenshots/list.png) ![Create](screenshots/create.png) ![Search](screenshots/search.png)

## Project structure
```
App.js                      root + navigation state
src/storage.js              AsyncStorage persistence
src/notifications.js        permissions + scheduling
src/utils.js                formatting + validation
src/screens/                EventListScreen, EventFormScreen
src/components/EventItem.js list row
```
See TESTING.md for the test log.
