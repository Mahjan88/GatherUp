# Auth & Onboarding Flow — Implementation Guide

This guide walks you through building GatherUp's 6-screen auth/onboarding flow on mobile. Each section maps to one of the reference screens you shared, adapted to GatherUp's dark-theme design system.

---

## Overview: What You're Building

The flow a new user experiences:

```
Splash → Welcome → Phone Sign-In ⇄ Email Sign-In → OTP Verify → Profile Setup → Notification Prefs → Home
```

You'll create **6 new screens** inside `apps/mobile/app/(auth)/` and modify **2 existing files**. The current `login.tsx` and `signup.tsx` will be replaced.

### File Map

| Screen | File to Create | Reference |
|--------|---------------|-----------|
| 1. Welcome | `welcome.tsx` | Splash/CTA screen |
| 2. Phone Sign-In | `phone.tsx` | Phone number + country code |
| 3. Email Sign-In | `email.tsx` | Email + Google/Apple buttons |
| 4. OTP Verification | `verify.tsx` | 6-digit code entry |
| 5. Profile Setup | `profile-setup.tsx` | Name, email, city fields |
| 6. Notification Prefs | `notification-prefs.tsx` | Toggle switches |

| Existing File | What Changes |
|--------------|-------------|
| `(auth)/_layout.tsx` | Register all 6 new screens in the Stack |
| `_layout.tsx` (root) | Change initial auth route from `signup` to `welcome` |

---

## Before You Start: Design System Reference

Every screen should use these values consistently. Keep this section open as a cheat sheet.

**Colors (from your existing screens):**
```
Background:       #0f172a  (dark navy — used on home, messages, etc.)
Card/Surface:     #1e293b
Elevated:         #334155
Accent (teal):    #14b8a6  ← replaces BucketListers' pink for CTAs
Text primary:     #fff
Text muted:       #94a3b8
Text dimmed:      #64748b
Danger/badges:    #ef4444
Input border:     rgba(255, 255, 255, 0.12)  (from your current login.tsx)
Input background: rgba(255, 255, 255, 0.04)  (from your current login.tsx)
```

**Layout constants:**
```
Horizontal padding: 20-28 (your screens use 20 for content, 28 on auth)
Header top padding: 60 (status bar clearance on iOS)
Button border radius: 50 (pill shape) for primary CTAs
Button border radius: 12 for secondary/input fields
Standard gap: 12-16 between form fields
```

**Typography:**
```
Screen title:   26-28px, fontWeight '700', color #fff
Subtitle:       14-15px, color #94a3b8
Input label:    12px, uppercase, color #94a3b8, letterSpacing 0.5
Input text:     16px, color #fff
Button text:    16px, fontWeight '600'
Terms text:     11px, color rgba(255,255,255,0.5)
```

**Existing patterns to reuse:**
- `KeyboardAvoidingView` with `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`
- `SafeAreaView` as the outermost wrapper
- Background orbs (the gradient circles) from current login/signup
- Logo: `require('../../assets/logo.png')` at 80-150px depending on context

---

## Step 1: Update the Auth Layout

**File:** `apps/mobile/app/(auth)/_layout.tsx`

This is the simplest change — you're just registering the new screen names so Expo Router knows about them.

**What to do:** Replace the current two `Stack.Screen` entries with all 6 screens. Order doesn't affect navigation (you navigate with `router.push`), but it's good practice to list them in flow order.

```tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="phone" />
      <Stack.Screen name="email" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="profile-setup" />
      <Stack.Screen name="notification-prefs" />
    </Stack>
  );
}
```

**Why `headerShown: false`?** Every auth screen manages its own header/back button so you have full design control. This is the same pattern used throughout GatherUp (check any screen in `(tabs)/`).

---

## Step 2: Update the Root Layout

**File:** `apps/mobile/app/_layout.tsx`

**What to change:** One line. In the `onSplashFinish` callback, change the route from `/(auth)/signup` to `/(auth)/welcome`:

```tsx
// Before:
router.replace('/(auth)/signup');

// After:
router.replace('/(auth)/welcome');
```

**Understanding the flow:** The root layout has a `SplashScreen` component that plays the animated logo + loading bar for ~3 seconds. When it finishes, `onSplashFinish` fires and navigates to auth. You're just changing the landing page from the old signup screen to your new welcome screen.

**Note for later:** Once you wire up real Supabase auth, you'll replace the hardcoded `isAuthenticated = false` with your auth hook. If the user is already logged in, you'd skip auth entirely and go to `/(tabs)`.

---

## Step 3: Welcome Screen

**File to create:** `apps/mobile/app/(auth)/welcome.tsx`

**What this screen does:** It's the first thing a new user sees after the splash animation. It shows the GatherUp logo, a tagline selling the app, and a prominent CTA button. Think of it as your app's "front door."

**Layout structure (top to bottom):**

1. **Background** — Use `#0f172a` with the same decorative orbs from the current signup.tsx (the `bgEffects` pattern with 3 positioned `View` circles). You already have this code — copy the pattern.

2. **Top section (flex: 1, centered):**
   - GatherUp logo image (150x150, same as current signup)
   - App name: "Gather" in cyan (#00FFFF) + "Up" in magenta (#FF00FF) — matching your SplashScreen branding
   - Tagline text below: something like "Discover events. Meet people. Make memories." in `#94a3b8`, 16px, centered

3. **Bottom section (pinned to bottom with `paddingBottom: 40`):**
   - **Primary CTA button:** "Quick Sign Up" — full-width pill button
     - Background: `#14b8a6` (your teal accent)
     - Text: white, 16px, bold
     - Border radius: 50
     - Padding vertical: 16
     - `onPress` → `router.push('/(auth)/phone')`
   - **Secondary link:** "Already have an account? Log In" — below the button
     - "Already have an account?" in `#94a3b8`
     - "Log In" in `#14b8a6` with fontWeight '600'
     - `onPress` → `router.push('/(auth)/email')` (or phone — your choice for returning users)

**Key decisions:**
- The BucketListers reference has a phone mockup image. You can skip this or use your logo instead — it's purely decorative.
- The "Quick Sign Up" button goes to phone sign-in (Screen 2) because phone-based auth is the primary path.

**Navigation from this screen:**
- "Quick Sign Up" → `/(auth)/phone`
- "Log In" → `/(auth)/email`

---

## Step 4: Phone Sign-In Screen

**File to create:** `apps/mobile/app/(auth)/phone.tsx`

**What this screen does:** Collects the user's phone number with a country code selector, then sends them to OTP verification.

**Layout structure:**

1. **Header area (paddingTop: 60):**
   - Back button (top-left): a `TouchableOpacity` with `‹` text or an arrow icon
     - Style it like the back button on your event detail screen: 40x40, borderRadius 20, `rgba(0,0,0,0.3)` background
     - `onPress` → `router.back()`
   - GatherUp logo (centered, small — 40x40)
   - This creates the "back + logo" header pattern from the reference

2. **Title section (paddingTop: 32):**
   - "Sign in with your phone" — 26px, bold, white
   - Subtitle: "We'll send you a verification code" — 14px, `#94a3b8`

3. **Phone input (marginTop: 32):**
   - This is the most complex UI element on this screen. Build it as a single row:
   - **Country code selector (left side):**
     - Flag emoji (🇺🇸) + country code text (+1) + dropdown arrow (▼)
     - Wrapped in a `TouchableOpacity`
     - For now, hardcode +1. Making the dropdown functional is a separate task.
   - **Divider:** A 1px vertical line (`backgroundColor: '#334155'`)
   - **Phone number input (right side):**
     - Label: "Phone Number" with red asterisk
     - `TextInput` with `keyboardType="phone-pad"`
     - Placeholder: "(555) 123-4567"
   - **Container styling:** Single row with `borderWidth: 1`, `borderColor: '#334155'`, `borderRadius: 12`, `overflow: 'hidden'`
   - You already have this exact pattern in your current `signup.tsx` (the phone verification modal). Reuse the `phoneInputContainer` styles.

4. **Continue button (marginTop: 24):**
   - Full-width pill, `backgroundColor: '#14b8a6'`, white text "Continue"
   - `onPress`: validate phone isn't empty, then `router.push({ pathname: '/(auth)/verify', params: { phone: fullPhoneNumber, method: 'phone' } })`

5. **Divider:** The "OR" divider pattern (line — "OR" text — line). Copy from your current `login.tsx` `divider` styles.

6. **Alternative option:**
   - "Use your email instead" — a text button in `#14b8a6`
   - `onPress` → `router.push('/(auth)/email')`

7. **Terms text (bottom):**
   - Same terms pattern from current signup.tsx: "By pressing Continue, you agree to our Terms of Use and Privacy Policy"

**State you'll need:**
```tsx
const [phoneNumber, setPhoneNumber] = useState('');
const [countryCode, setCountryCode] = useState('+1');
const [loading, setLoading] = useState(false);
```

**Passing data to the next screen:** Use Expo Router's `params`. When the user taps Continue, you pass the phone number so the verify screen knows what to display:
```tsx
router.push({
  pathname: '/(auth)/verify',
  params: { contact: `${countryCode}${phoneNumber}`, method: 'phone' }
});
```

---

## Step 5: Email Sign-In Screen

**File to create:** `apps/mobile/app/(auth)/email.tsx`

**What this screen does:** Alternative to phone sign-in. Also includes Google/Apple social login buttons.

**Layout structure:** Nearly identical to the phone screen, with these differences:

1. **Header:** Same back button + centered logo pattern.

2. **Title:** "Sign in with your email" — 26px, bold, white.

3. **Email input:** A single `TextInput` (much simpler than the phone input):
   - Label: "Email Address"
   - `keyboardType="email-address"`, `autoCapitalize="none"`
   - Same input styling as current login.tsx: border, rounded corners, dark background

4. **Continue button:** Same teal pill. On press, navigate to verify screen:
   ```tsx
   router.push({
     pathname: '/(auth)/verify',
     params: { contact: email, method: 'email' }
   });
   ```

5. **"OR" divider**

6. **Alternative options (stacked):**
   - "Use your phone number instead" — text link in `#14b8a6`
     - `onPress` → `router.push('/(auth)/phone')`
   - "Continue with Google" — full-width button with Google logo
     - White background, dark text (same pattern as current signup social buttons)
   - "Continue with Apple" — full-width button with Apple icon
     - White background, dark text

7. **Terms text**

**Why separate phone and email screens?** The reference design puts each on its own screen to keep the UI clean and focused. The user can toggle between them via the "Use your email/phone instead" links. This also maps cleanly to Supabase Auth, which has separate methods for `signInWithOtp({ phone })` and `signInWithOtp({ email })`.

---

## Step 6: OTP Verification Screen

**File to create:** `apps/mobile/app/(auth)/verify.tsx`

**What this screen does:** Shows 6 individual code input boxes and a countdown timer. This is the most interactive screen in the flow.

**Reading params from the previous screen:**
```tsx
const { contact, method } = useLocalSearchParams<{ contact: string; method: string }>();
```

**Layout structure:**

1. **Header:** Back button + logo (same pattern as phone/email screens).

2. **Title:** "Verify your phone" or "Verify your email" — dynamically based on `method` param.

3. **Subtitle:** "A one-time code was sent to [contact]" — show the phone/email passed via params.

4. **Code input (the 6 boxes):** This is the fun part. There are two ways to build this:

   **Approach A — Individual TextInputs (simpler, recommended):**
   - Create an array of 6 `TextInput` components, each accepting 1 character
   - Use `ref` forwarding so typing a digit auto-focuses the next box
   - State: `const [code, setCode] = useState(['', '', '', '', '', '']);`
   - Each box: 48x56, `borderRadius: 12`, `borderWidth: 1`, `borderColor: '#334155'`, `backgroundColor: '#1e293b'`, centered text at 24px bold, white
   - `keyboardType="number-pad"`, `maxLength={1}`
   - On each character entry, auto-advance focus to the next ref
   - On backspace on an empty box, move focus to the previous ref

   **Approach B — Hidden single TextInput (more elegant):**
   - One hidden `TextInput` with `maxLength={6}` that captures all input
   - 6 `View` boxes that display each character from the state string
   - Tap anywhere on the boxes → focus the hidden input
   - This avoids the complexity of managing 6 refs

   Both approaches are common in production apps. Approach B is cleaner but Approach A gives you more practice with refs.

   **Styling each box:**
   ```
   width: 48, height: 56
   borderRadius: 12
   borderWidth: 2
   borderColor: '#334155' (empty) or '#14b8a6' (filled/active)
   backgroundColor: '#1e293b'
   Text: 24px, bold, white, centered
   ```

5. **Countdown timer:**
   - "Code expires in: 14:54m" — starts at 15:00, counts down every second
   - Use `useEffect` with `setInterval` and a `timeRemaining` state (in seconds)
   - Format as `MM:SS` — `Math.floor(time / 60)` for minutes, `time % 60` for seconds
   - Color: `#94a3b8`

6. **Continue button:** Same teal pill. Disabled until all 6 digits are entered.
   - `onPress`: In the future, this calls Supabase's `verifyOtp()`. For now, navigate forward:
   ```tsx
   router.push('/(auth)/profile-setup');
   ```

7. **Resend link:** "Not getting your code? Re-send it here" — the "Re-send it here" part is tappable in `#14b8a6`.
   - On tap, reset the countdown and (eventually) re-call the OTP send function.

**State you'll need:**
```tsx
const [code, setCode] = useState(['', '', '', '', '', '']);
const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds
const [loading, setLoading] = useState(false);
```

**Auto-focus tip:** Create refs for each input:
```tsx
const inputRefs = useRef<(TextInput | null)[]>([]);
// In each TextInput: ref={el => inputRefs.current[index] = el}
// On change: if (text) inputRefs.current[index + 1]?.focus()
```

---

## Step 7: Profile Setup Screen

**File to create:** `apps/mobile/app/(auth)/profile-setup.tsx`

**What this screen does:** Collects the user's name, email (confirmation), and preferred city. This runs after OTP verification for new accounts.

**Layout structure:**

1. **Title section (paddingTop: 60):**
   - "Welcome to GatherUp!" — 26px, bold, white (adapt BucketListers' "Welcome, Bucket Lister!" with rocket emoji if you like)
   - Subtitle: "Tell us a bit about yourself so we can personalize your experience" — 14px, `#94a3b8`

2. **Form fields (marginTop: 32, gap: 16):**
   Each field follows the same pattern from your current login.tsx:
   - Label (12px, uppercase, `#94a3b8`, letterSpacing 0.5)
   - TextInput (same styles as login: border, rounded, dark bg)

   **Fields:**
   - **Full Name** — `autoCapitalize="words"`
   - **Email Address** — `keyboardType="email-address"`, `autoCapitalize="none"`
     - If the user came through email sign-in, pre-fill this from params
   - **Confirm Email** — same type, validate it matches
   - **Preferred City** — This can be a simple TextInput for now, or a dropdown later
     - Placeholder: "e.g., San Francisco"
     - The reference shows a dropdown, but a text input is fine for v1

3. **Continue button:** Teal pill at the bottom.
   - Validate: name not empty, emails match, city not empty
   - `onPress` → `router.push('/(auth)/notification-prefs')`

4. **Terms text (bottom)**

**Passing data forward:** You have two options:
- **Option A:** Store profile data in a shared auth context/state and submit it all at the end of onboarding
- **Option B:** Make the API call to update the user profile on this screen, then navigate forward

Option A is better UX (the user can go back and edit). You'd create a simple context or Zustand store to hold onboarding data across screens. But for a first pass, Option B works fine.

**State:**
```tsx
const [fullName, setFullName] = useState('');
const [email, setEmail] = useState('');
const [confirmEmail, setConfirmEmail] = useState('');
const [city, setCity] = useState('');
```

---

## Step 8: Notification Preferences Screen

**File to create:** `apps/mobile/app/(auth)/notification-prefs.tsx`

**What this screen does:** The final onboarding step. Lets the user opt in/out of notification channels before entering the app.

**Layout structure:**

1. **Title section (paddingTop: 60):**
   - "Get notified about..." — 26px, bold, white
   - Subtitle: "Choose how you'd like to hear about events, messages, and updates" — 14px, `#94a3b8`

2. **Phone mockup (optional):** The reference shows a phone with sample push notifications. You can skip this or add a simple illustration later. Focus on the functional toggles.

3. **Toggle switches (marginTop: 40):**
   Use React Native's built-in `Switch` component. Each row is:
   - Left: Label text (16px, white) + description below (13px, `#64748b`)
   - Right: `Switch` component

   **Three toggles:**
   - **Email Notifications** — "Event updates, invitations, and weekly digests"
   - **SMS Notifications** — "Time-sensitive alerts like event reminders"
   - **Push Notifications** — "Real-time updates for messages and RSVPs"

   All default to `true` (the reference has them all on by default).

   **Switch styling:**
   ```tsx
   <Switch
     value={pushEnabled}
     onValueChange={setPushEnabled}
     trackColor={{ false: '#334155', true: '#14b8a6' }}
     thumbColor="#fff"
     ios_backgroundColor="#334155"
   />
   ```

   **Row styling:**
   ```
   flexDirection: 'row'
   justifyContent: 'space-between'
   alignItems: 'center'
   paddingVertical: 16
   borderBottomWidth: 1
   borderBottomColor: '#1e293b'
   ```

4. **"All set!" button:** Teal pill at the bottom.
   - On press: save notification preferences (API call in the future), then:
   ```tsx
   router.replace('/(tabs)');
   ```
   - Use `replace` (not `push`) so the user can't swipe back into onboarding from the home screen.

**State:**
```tsx
const [emailEnabled, setEmailEnabled] = useState(true);
const [smsEnabled, setSmsEnabled] = useState(true);
const [pushEnabled, setPushEnabled] = useState(true);
```

**Push notification permission:** When `pushEnabled` is true and the user taps "All set!", you should request push notification permission from the OS. Expo provides `expo-notifications` for this:
```tsx
import * as Notifications from 'expo-notifications';

const { status } = await Notifications.requestPermissionsAsync();
```
This is a future enhancement — get the UI working first, then wire up the permission request.

---

## Step 9: Clean Up Old Files

Once your new flow is working:

1. **Delete** `apps/mobile/app/(auth)/login.tsx` — replaced by `email.tsx`
2. **Delete** `apps/mobile/app/(auth)/signup.tsx` — replaced by `welcome.tsx` + `phone.tsx`

Don't delete them until the new screens are fully functional. You can reference their styles while building.

---

## Connecting to Supabase Auth (The "Real" Logic)

This section is for when you're ready to wire up actual authentication. Build all 6 screens with TODO placeholders first, then come back here.

**Supabase supports two OTP methods:**

```tsx
import { supabase } from '@gatherup/shared'; // or your client setup

// Phone OTP — sends SMS
const { error } = await supabase.auth.signInWithOtp({
  phone: '+15551234567',
});

// Email OTP — sends magic link/code
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
});

// Verify the OTP code
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+15551234567',  // or email
  token: '123456',
  type: 'sms',  // or 'email'
});

// Social auth (Google)
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
});

// Social auth (Apple)
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'apple',
});
```

**After successful auth:**
- `verifyOtp` returns a session with a JWT
- Check if the user is new (no profile data) → route to `profile-setup`
- Check if the user is returning (has profile) → route straight to `/(tabs)`
- Store the session — Supabase's JS client handles this automatically with AsyncStorage on React Native

**In the root layout**, replace the hardcoded `isAuthenticated`:
```tsx
// Replace this:
const [isAuthenticated] = useState(false);

// With something like:
const { session, loading } = useAuth(); // from your auth hook
const isAuthenticated = !!session;
```

---

## Testing Your Flow

After building each screen, test the navigation chain:

1. Kill and restart the Expo dev server (`pnpm --filter @gatherup/mobile dev`)
2. The app should show: Splash → Welcome screen
3. Tap "Quick Sign Up" → Phone screen with back button
4. Tap "Use your email instead" → Email screen
5. Tap "Continue" on either → Verify screen (showing the contact info you entered)
6. Enter 6 digits, tap "Continue" → Profile Setup
7. Fill fields, tap "Continue" → Notification Prefs
8. Tap "All set!" → Home tab screen

**Common issues:**
- Screen not found: Make sure the filename matches exactly what's in `_layout.tsx` (e.g., `profile-setup.tsx` matches `name="profile-setup"`)
- Params not arriving: Check you're using `useLocalSearchParams` (not `useSearchParams`) and that the param names match
- Keyboard covers inputs: Wrap in `KeyboardAvoidingView` with the iOS/Android behavior check

---

## Summary: File Checklist

```
CREATE:
  apps/mobile/app/(auth)/welcome.tsx
  apps/mobile/app/(auth)/phone.tsx
  apps/mobile/app/(auth)/email.tsx
  apps/mobile/app/(auth)/verify.tsx
  apps/mobile/app/(auth)/profile-setup.tsx
  apps/mobile/app/(auth)/notification-prefs.tsx

MODIFY:
  apps/mobile/app/(auth)/_layout.tsx  → register 6 new screens
  apps/mobile/app/_layout.tsx         → change route to /(auth)/welcome

DELETE (after new screens work):
  apps/mobile/app/(auth)/login.tsx
  apps/mobile/app/(auth)/signup.tsx
```

Build them in order (welcome → phone → email → verify → profile-setup → notification-prefs) so you can test the navigation chain as you go. Each screen is independent enough to build and verify before moving to the next.
