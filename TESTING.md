# Testing Documentation

| # | Test case | Steps | Expected | Result |
|---|-----------|-------|----------|--------|
| 1 | Empty name | Leave name blank, Save | Error "Event name is required" | |
| 2 | Valid create | Fill all fields, Save | Event appears under Upcoming | |
| 3 | Sorting | Add events in random order | Sorted earliest first | |
| 4 | Past events | Edit an event to a past time | Appears under Past (dimmed) | |
| 5 | Edit | Tap event, change name, Update | List updated | |
| 6 | Delete | Tap bin, Cancel then Delete | Confirm dialog; removed after Delete | |
| 7 | Search name | Type part of a name | Only matches shown | |
| 8 | Search date | Type 2026-11-05 | Events on that date shown | |
| 9 | Reminder | Set event 2 min ahead, reminder "At time" | Notification fires | |
| 10 | Permission denied | Deny notification permission | Event saved, alert shown, no crash | |
| 11 | Empty state | Delete all events | "No events yet" message | |
| 12 | Persistence | Close and reopen app | Events still present | |
| 13 | Back button | Open form, press Android back | Returns to list, app stays open | |

Fill in the Result column (Pass/Fail) after testing on your device.
