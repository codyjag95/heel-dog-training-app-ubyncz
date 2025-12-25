
# ⚡ Quick Crash Fix Checklist

## 🎯 Goal
Fix the immediate crash on launch and set up proper crash reporting.

---

## ✅ Step 1: Get the Crash Log (5 minutes)

### Fastest Method: Xcode Organizer

1. Open Xcode
2. Press `Cmd + Shift + 9` (or Window → Organizer)
3. Click "Crashes" tab
4. Select HEEL app
5. Find the most recent crash
6. Copy the crash log (first 60 lines)
7. **Paste it in your next message to me**

### Alternative: Console.app

1. Connect iPhone to Mac
2. Open Console.app
3. Select your iPhone
4. Launch HEEL app (it will crash)
5. Search for "HEEL" or "crash"
6. Copy the crash log
7. **Paste it in your next message to me**

---

## ✅ Step 2: Set Up Sentry (10 minutes)

### Why?
- Automatic crash reporting
- No more manual log hunting
- Full stack traces with source maps
- Device info, breadcrumbs, user context

### How?

1. **Create Sentry account**: https://sentry.io (free)
2. **Create project**: Select "React Native", name it "heel-app"
3. **Copy DSN**: Looks like `https://abc123@o123456.ingest.sentry.io/456789`
4. **Update code**:

Open `app/_layout.tsx`, line 10:
```typescript
const SENTRY_DSN = 'https://abc123@o123456.ingest.sentry.io/456789'; // Your actual DSN
```

Open `app.json`, line 48:
```json
[
  "@sentry/react-native/expo",
  {
    "organization": "your-org-slug",  // Your actual org slug
    "project": "heel-app"
  }
]
```

5. **Test it**:
```bash
npm run ios
```
- Go to Settings → Debug section
- Tap "Test Sentry Integration"
- Check Sentry dashboard (should see test error)

6. **Build and deploy**:
```bash
eas build --platform ios --profile preview
```

7. **View crashes**: https://sentry.io → Your Project → Issues

---

## ✅ Step 3: Isolation Testing (If Needed)

### Current Status
- ✅ RevenueCat: **DISABLED** (commented out)
- ✅ OneSignal: **DISABLED** (commented out)
- ✅ AsyncStorage: **Wrapped in try/catch**
- ✅ Haptics: **Wrapped in try/catch**
- ✅ Constants: **Wrapped in try/catch**

### Test 1: Current Build (All SDKs Disabled)

Build and test the current code:
```bash
eas build --platform ios --profile preview
```

**If it launches successfully**: 
- ✅ Crash is caused by RevenueCat or OneSignal
- I'll provide code to re-enable them one at a time

**If it still crashes**: 
- ❌ Crash is caused by something else
- Share the crash log with me

### Test 2: Re-enable SDKs (One at a Time)

If Test 1 succeeds, I'll provide code to:
1. Re-enable RevenueCat only → Build → Test
2. Re-enable OneSignal only → Build → Test

This will identify which SDK is crashing.

---

## ✅ Step 4: Common Fixes

### Fix 1: Missing Environment Variables

If the crash is caused by missing API keys:

1. **Check your EAS secrets**:
```bash
eas secret:list
```

2. **Add missing secrets**:
```bash
# RevenueCat
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value your_key
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value your_key

# OneSignal
eas secret:create --scope project --name EXPO_PUBLIC_ONESIGNAL_APP_ID --value your_app_id

# Sentry
eas secret:create --scope project --name SENTRY_AUTH_TOKEN --value your_token
```

3. **Rebuild**:
```bash
eas build --platform ios --profile preview
```

### Fix 2: SDK Version Incompatibility

If the crash is caused by an outdated SDK:

1. **Update the SDK**:
```bash
# RevenueCat
npm install react-native-purchases@latest

# OneSignal
npm install react-native-onesignal@latest

# Sentry
npm install @sentry/react-native@latest
```

2. **Rebuild**:
```bash
eas build --platform ios --profile preview
```

### Fix 3: Config Plugin Issue

If the crash is caused by a config plugin:

1. **Clean prebuild**:
```bash
npx expo prebuild --clean
```

2. **Rebuild**:
```bash
eas build --platform ios --profile preview
```

---

## 📊 Expected Timeline

| Task | Time | Status |
|------|------|--------|
| Capture crash log | 5 min | ⏳ Waiting |
| Set up Sentry | 10 min | ⏳ Waiting |
| Build with Sentry | 15 min | ⏳ Waiting |
| View crash in Sentry | 2 min | ⏳ Waiting |
| Implement fix | 5 min | ⏳ Waiting |
| Rebuild and test | 15 min | ⏳ Waiting |
| **Total** | **~50 min** | |

---

## 🎯 Deliverable

Once we fix the crash, I'll provide:

1. ✅ **Exact crash exception** (e.g., `NSInvalidArgumentException`)
2. ✅ **Specific file/module** causing it (e.g., `RevenueCat.configure`)
3. ✅ **Root cause** (e.g., missing API key)
4. ✅ **Code/config change** to fix it
5. ✅ **Confirmation** the fixed build launches successfully

---

## 🆘 Stuck?

If you're stuck on any step:

1. **Share what you're seeing** (screenshots help!)
2. **Share any error messages**
3. **Let me know which step you're on**

I'll guide you through it.

---

## 🚀 Let's Fix This!

**Next action**: Capture the crash log and paste it in your next message.

I'll analyze it and provide the exact fix within minutes.
