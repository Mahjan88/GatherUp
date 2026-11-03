# GatherUp — Product & Design Brief

> Share this document with AI design tools (v0, Galileo, Figma AI, etc.) to generate UI/UX concepts.

---

## What Is GatherUp?

GatherUp is a **social event platform** — think Meetup meets Telegram. People create and discover in-person events, chat in real-time before/during/after, share photos and videos, and build communities around shared interests.

**One-line pitch:** "Find your people. Plan the moment."

---

## Target Users

- **Hosts** — individuals or community organizers who create events (casual hangouts, sports, workshops, parties, study groups, etc.)
- **Attendees** — people looking for things to do and communities to join
- **Community Managers** — run recurring event series or topic-based communities

---

## Core Features

### 1. Events
- Create an event with title, description, date/time, location, cover photo, max capacity, and visibility (public/private)
- RSVP / join an event
- Leave reviews after attending
- Save events for later
- Invite specific users

### 2. Discovery
- Browse public events nearby
- Filter by category, date, distance
- Explore popular communities and people to follow

### 3. Real-Time Messaging
- **Event group chat** — every event has a built-in group chat for attendees
- **Direct messages (DMs)** — 1:1 private messaging between users
- Message reactions (emoji)
- Media sharing in chats (photos/videos)

### 4. Communities
- Groups organized around a topic or interest (e.g., "NYC Hikers", "Book Club SF")
- Communities host recurring events
- Users can follow communities

### 5. Event Series
- A recurring event template (e.g., "Weekly Wednesday Run")
- Users subscribe to a series to auto-discover each new occurrence

### 6. Social Graph
- Follow other users
- Block users
- Report content

### 7. Notifications
- Bell icon in header (Instagram-style — NOT a tab)
- Alerts for: new event invite, RSVP confirmed, new message, new follower, event reminders

### 8. Media
- Upload photos and videos to events
- Profile photos

---

## Navigation Structure

### Mobile App (5 tabs + header bell)
```
[Home] [Discover] [+ Create] [Messages] [Profile]
                                              🔔 (bell in header)
```

- **Home** — Personal feed: upcoming events I'm attending, series updates, invites from people I follow
- **Discover** — Browse public events, nearby events, popular communities and people
- **+ Create** — Create a new event (center action button)
- **Messages** — Inbox with event group chats and DMs
- **Profile** — My profile, my events, my communities, settings

### Web App (4 tabs + notification bell)
```
[Home] [Discover] [Events] [Messages]        🔔
```

---

## Key Screens & Flows

### Onboarding
1. Sign up / Log in (email or social auth)
2. Set up profile (name, photo, interests)
3. Discover nearby events or communities

### Create Event Flow
1. Tap "+ Create"
2. Add title, description, date/time
3. Set location (map picker)
4. Upload cover photo
5. Set capacity and visibility (public/private)
6. Optionally link to a community or series
7. Publish → event is live, host is auto-added as member

### Join & Chat Flow
1. Discover event on Discover tab
2. View event detail page (cover, host, attendees, location map, description)
3. Tap "Join" → RSVP confirmed
4. Access event group chat
5. Chat with attendees, share media
6. After event ends → leave a review

### DM Flow
1. Tap on a user's profile
2. Tap "Message"
3. Opens private conversation thread

---

## Data Model (Key Entities)

### User
- id, name, avatar, bio
- follower/following counts
- events hosted, events attending

### Event
- id, title, description, cover image
- date/time, location (lat/lng + address)
- host (User), capacity, attendee count
- visibility: public | private
- status: upcoming | ongoing | ended | cancelled
- optional: series_id, community_id
- soft-deletable

### Community
- id, name, description, cover image
- member count, follower count
- created by (User)
- soft-deletable

### Event Series
- id, name, description
- created by (User), linked community (optional)
- subscriber count

### Message (Event Group Chat)
- id, event_id, sender (User), content, timestamp
- reactions (emoji + users)
- media attachments

### Private Message (DM)
- id, sender_id, recipient_id, content, timestamp

### Event Media
- Photos/videos uploaded to an event by attendees

### Notification
- type: invite | rsvp | message | follower | reminder
- target user, reference entity, read/unread

---

## Design Personality & Tone

- **Warm and social** — this is about real human connection, not corporate
- **Energetic but not overwhelming** — events are exciting; the UI should feel alive
- **Mobile-first** — primary usage is on the go
- **Clean and spatial** — cover photos and maps are central; give them room
- **Accessible** — readable typography, sufficient contrast, large tap targets

### Visual Inspiration
- Meetup (event discovery patterns)
- Telegram (messaging patterns)
- Instagram (photo-forward, bell notification pattern)
- Airbnb (card layouts, map/list toggle)

---

## Platform

- **Mobile:** iOS & Android (React Native / Expo)
- **Web:** Browser (Next.js, responsive)
- Both platforms share the same backend API and real-time messaging

---

## Current State (What's Built vs. Planned)

| Feature | Status |
|---|---|
| Auth (web) | ✅ Done |
| Event CRUD | ✅ Done |
| Event messaging | ✅ Done |
| DMs | ✅ Done |
| Media uploads | ✅ Done |
| Communities | ✅ Schema done, API in progress |
| Event Series | ✅ Schema done, API not yet built |
| Notifications | ✅ Schema done, routes in progress |
| Mobile auth | 🚧 Stubbed (placeholder screens) |
| Home/Discover feed | 🚧 Placeholder (API not yet connected) |
| Social graph (follow/block) | ✅ Schema done |
| Reviews | ✅ Schema done |
| Search | 🔜 Not yet started |

---

## Design Opportunities (Open Areas)

1. **Onboarding** — no screens exist yet; first-run experience is needed
2. **Home Feed** — layout not designed; needs card components for events, series updates, invites
3. **Event Detail Page** — rich screen with map, attendees grid, chat preview, media gallery
4. **Community Page** — hub page for a community with upcoming events, members, about
5. **Create Event** — multi-step form; needs good UX for date/time picker and map location
6. **Notifications Panel** — grouped by type, unread badges
7. **Empty States** — for new users with no events, no messages, etc.
8. **Mobile Auth Screens** — login, signup, forgot password
