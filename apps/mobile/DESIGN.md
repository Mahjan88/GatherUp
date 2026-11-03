# GatherUp Mobile — Design System

Light, photo-forward UI with one teal accent. Replaces the old dark navy theme
(`#0f172a`, `#1e293b`, `#334155`, `#00FFFF`/`#FF00FF` wordmark). **Never hard-code colors** — import from `theme/`.

## Files

- `theme/index.ts` — `colors`, `spacing`, `radius`, `typography`, `shadows`, `GUTTER` (20px page gutter)
- `components/ui/index.tsx` — UI kit: `Button`, `IconButton`, `Chip`, `ChipRow`, `Avatar`, `AvatarStack`, `SearchBar`, `SectionHeader`, `ScreenHeader`, `UnderlineTabs`, `Card`, `Badge`, `Divider`, `TextField`, `SelectField`, `ListRow`, `EmptyState`, `FAB`, `StepDots`, `MetaRow`, `Ionicons`, type `IconName`
- `components/Header.tsx` — brand bar (no `title`) or large title (`title`) or back + centered title (`showBack`). Props: `title, subtitle, showBack, onBack, showLogo, showNotificationBell, rightIcon, onRightPress, rightElement, children`. Exports `BrandMark`.
- `components/EventCard.tsx` — variants `feature` (big image card), `compact` (170px rail tile), `row` (thumbnail list row w/ status badge + `onMore`), `past`. Exports `formatEventDate`, `formatEventDateShort`.
- Icons: `@expo/vector-icons` Ionicons (outline when idle, filled when active). Do not use emoji or unicode glyphs as icons.

## Visual language

| Element | Spec |
|---|---|
| Background | white `colors.background`; grouped areas `colors.surfaceAlt` (#F4F5F7) |
| Primary | teal `#17C3B2`; text on it white |
| Text | `#111827` primary, `#6B7280` secondary, `#9CA3AF` muted |
| Borders | `#E5E7EB`; card hairline `colors.divider` |
| Radius | buttons/inputs 12, cards 16, chips pill |
| Primary CTA | full-width teal `Button` (52px, radius 12) pinned at bottom of detail/form screens ("Join Event", "Next", "Subscribe to Series") |
| Secondary | outline teal `Button` (e.g. "Follow", "Edit Profile", "Sign In" on photo = white outline) |
| Small action | `Button size="sm"` primary, e.g. "Join" on community cards |
| Filter chips | `ChipRow` — selected teal fill/white text, idle grey `surfaceAlt` |
| Tags | `Chip variant="tag"` outlined (profile interests) |
| Section header | `SectionHeader` bold 18 + teal "See All" link |
| Tab-root header | large 26 bold title left, icon(s) right (search, bell) |
| Pushed screen header | back chevron + centered 17 bold title + optional subtitle ("12 members") + right icon |
| Date line | uppercase, small, bold grey: `SAT, OCT 26 · 8:00 AM` (teal on event detail hero) |
| Status | `Badge` — "You're Going" success, "Interested" outline primary, "Saved" primary soft, "Invited" warning |
| Avatars | round; `AvatarStack` with white ring + "12 going" caption |
| Lists | rows with 56px avatar/thumbnail, title bold, caption grey, right timestamp/chevron; no heavy dividers |
| Unread | small teal dot at row right (notifications) |
| FAB | 56px teal circle bottom-right (`FAB`) for create / compose |
| Photo headers | full-bleed image, glass `IconButton variant="glass"` for back/share/settings |

## Screen patterns (reference mockups)

1. **Splash / Welcome** — full-screen hiking photo with dark gradient bottom, centered teal mountain mark + white "gatherup" wordmark, tagline "Find your people. / Plan the moment.", page dots, teal "Get Started" button, white-outline "Sign In" button.
2. **Explore** — brand bar (logo, location pill "San Jose, CA", bell). SearchBar "Search events, communities, or people". Category ChipRow (All, Hiking, Food & Drink, Sports, …). "For You" section with feature EventCards. "This Weekend" horizontal rail of compact cards. FAB to create.
3. **Event Details** — hero photo (~260px) with glass back/share/bookmark. Teal date line, 22 bold title, host row (avatar, "Hosted by Sarah Kim", community name, outline "Follow"). Meta rows with icon: location (+ teal "Get Directions"), date/time, category · tags. AvatarStack "12 going · 50 spots left". UnderlineTabs About / Chat / Photos / Attendees. Sticky bottom "Join Event".
4. **Event Chat** — header: back, event thumb avatar, title + "12 members", info icon. Pinned message banner (teal pin icon, "Pinned Message", 1-line preview) on light teal. Incoming: avatar, name bold + time grey, grey bubble (`surfaceAlt`, radius 16), reactions row (❤ 4 pill). Outgoing: teal bubble white text right aligned. Composer: + button, rounded input "Message…", emoji, mic.
5. **Communities** — title + search icon. ChipRow For You / Nearby / Popular / New. Cards: banner image, overlapping round avatar, name bold, "24.8K members", small teal "Join", 2-line description.
6. **Create Event (multi-step)** — header "Cancel" (teal left) + "Create Event" centered; StepDots. Section title "Event Basics". Cover photo box with camera "Add Cover Photo" pill. TextField labels bold: Event Title, Description (multiline), SelectField Category. Bottom "Next".
7. **My Events** — title + search. ChipRow Upcoming / Hosting / Saved / Past. EventCard `row` list with status badges & "…" menu. FAB +.
8. **Profile** — cover photo header with glass settings icon; large avatar overlapping with verified badge; name bold, @handle, bio, "Bay Area based"; outline "Edit Profile" at right. Stats row (Events / Following / Followers) number bold + caption. "Interests" outlined tags with icons. UnderlineTabs Photos / Events / Reviews; photo grid.
9. **Notifications** — title + search. ChipRow All / Events / Messages / Social. Rows: avatar (or colored icon circle: green check for RSVP, orange bell for reminder), rich text with bold names, grey time, optional event thumbnail right, teal unread dot.
10. **Event Photos** — back + title + search. ChipRow All / Photos / Videos. 2-col grid, radius 12, gap 6. Floating teal pill "+ Add Photos".
11. **Event Series** — header icon tile (teal soft square w/ icon), title bold, description; host row + outline "Follow"; meta "856 followers · Weekly on Wed". "Upcoming Events" list with thumbnail, date line, title, "32 going", chevron. Bottom "Subscribe to Series".
12. **Messages (Chats tab)** — title + bell. SearchBar "Search messages". Rows: 48 avatar, name bold, last message grey 1-line, time right. Compose FAB (pencil `create-outline`).

## Screens not in the mockups — extrapolate

- Settings pages: `ScreenHeader showBack`, grouped `ListRow`s inside white sections on `surfaceAlt` background, section captions uppercase grey 12.
- Auth forms (phone, email, verify, profile setup, notif prefs): white bg, back chevron, 26 bold title + grey subtitle, `TextField`s, primary full-width CTA at bottom, `StepDots` where it is a sequence.
- Modals / bottom sheets: white sheet, radius 20 top, grabber, title bold 18.
- Destructive actions: `Button variant="danger"` or red text `ListRow destructive`.

## Rules

- Keep all existing behaviour, routes, state and TODOs; this is a visual redesign.
- Remove usages of the deprecated `BottomTabBar` on pushed screens — use a sticky bottom CTA instead where one is needed.
- `paddingTop: 60` status-bar clearance is handled by `Header`/`ScreenHeader`; full-bleed photo headers add their own glass buttons at `top: 56`.
- Leave ~100px bottom padding on scroll views inside tabs, ~110px above sticky CTAs.
