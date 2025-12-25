
# 🚨 HEEL App - Crash Diagnosis Guide

## ⚠️ IMPORTANT: You Need to Provide the Crash Log

Since I cannot directly access your TestFlight builds, Xcode Organizer, or device logs, **you need to capture and share the crash log with me**. This guide will show you exactly how to do that.

---

## 📋 Step 1: Capture the Crash Log

### Option A: TestFlight Build (iOS)

#### Method 1: Xcode Organizer (Recommended)

1. **Open Xcode**
2. **Go to Window → Organizer** (or press `Cmd + Shift + 9`)
3. **Click the "Crashes" tab**
4. **Select your app** (HEEL)
5. **Find the most recent crash**
6. **Right-click the crash → "Show in Finder"**
7. **Open the `.crash` file** in a text editor
8. **Copy the ENTIRE contents** (especially the first 60 lines)

#### Method 2: App Store Connect

1. **Go to** https://appstoreconnect.apple.com
2. **Select your app** (HEEL)
3. **Go to TestFlight → Crashes**
4. **Click on the most recent crash**
5. **Copy the crash log** (especially the exception name and stack trace)

#### Method 3: Device Logs (iOS Console)

1. **Connect your iPhone to your Mac**
2. **Open Console.app** (search in Spotlight)
3. **Select your iPhone** in the left sidebar
4. **Launch the HEEL app** (it will crash)
5. **Search for "HEEL" or "crash"** in the Console
6. **Copy the crash log** that appears

### Option B: EAS Build

#### For iOS:

1. **Connect device to Mac**
2. **Open Console.app**
3. **Launch the app** (it will crash)
4. **Filter by "HEEL"**
5. **Copy the crash log**

#### For Android:

1. **Connect device via USB**
2. **Run**: `adb logcat -d > crash.log`
3. **Open `crash.log`** and find the crash
4. **Copy the relevant section**

---

## 📤 Step 2: Share the Crash Log with Me

Once you have the crash log, **paste it in your next message**. I need:

### ✅ What to Include:

1. **Exception Name** (e.g., `NSInvalidArgumentException`, `SIGABRT`, `EXC_BAD_ACCESS`)
2. **Stack Trace** (first 30-60 lines showing which functions were called)
3. **Thread Information** (which thread crashed)
4. **Any error messages** in the log

### 📝 Example Format:

```
Exception Type: NSInvalidArgumentException
Exception Message: -[RCPurchases configure:]: unrecognized selector sent to instance 0x...

Thread 0 Crashed:
0   CoreFoundation    0x00000001a1234567 __exceptionPreprocess + 123
1   libobjc.A.dylib   0x00000001a2345678 objc_exception_throw + 56
2   RevenueCat        0x00000001a3456789 -[RCPurchases configure:] + 0
3   HEEL              0x00000001a4567890 -[AppDelegate application:didFinishLaunchingWithOptions:] + 234
...
```

---

## 🔧 Step 3: Enable Sentry for Automatic Crash Reporting

To avoid this manual process in the future, let's set up Sentry:

### 1. Create Sentry Account

1. Go to https://sentry.io
2. Sign up (free tier available)
3. Create a new project
4. Select **"React Native"** as the platform
5. Name it **"heel-app"**
6. **Copy your DSN** (looks like: `https://abc123@o123456.ingest.sentry.io/456789`)

### 2. Configure Sentry in Your App

Open `app/_layout.tsx` and replace line 10:

```typescript
// BEFORE:
const SENTRY_DSN = 'https://YOUR_SENTRY_DSN@sentry.io/YOUR_PROJECT_ID';

// AFTER (use your actual DSN):
const SENTRY_DSN = 'https://abc123@o123456.ingest.sentry.io/456789';
```

### 3. Update app.json

Open `app.json` and update the Sentry plugin (around line 48):

```json
[
  "@sentry/react-native/expo",
  {
    "organization": "your-actual-org-slug",
    "project": "heel-app"
  }
]
```

### 4. Test Sentry (Before Building)

```bash
npm run ios
```

Then in the app:
1. Go to **Settings** tab
2. Scroll to **"Debug (Dev/TestFlight)"** section
3. Tap **"Test Sentry Integration"**
4. Check your Sentry dashboard at https://sentry.io
5. You should see a test error within seconds

### 5. Build and Deploy

```bash
# For TestFlight
eas build --platform ios --profile preview

# For production
eas build --platform ios --profile production
```

### 6. View Crashes Automatically

After Sentry is configured:
1. Launch the app (it will crash)
2. Wait 1-2 minutes
3. Go to https://sentry.io → Your Project → Issues
4. You'll see the crash with full stack trace, breadcrumbs, and device info

---

## 🔍 Step 4: What I'll Do Once You Share the Log

Once you provide the crash log, I will:

1. ✅ **Identify the exact exception** (e.g., `NSInvalidArgumentException`, `SIGABRT`)
2. ✅ **Pinpoint the crashing module** (e.g., RevenueCat, OneSignal, AsyncStorage)
3. ✅ **Determine the root cause** (e.g., missing API key, invalid config)
4. ✅ **Implement the fix** (update code, add error handling, fix config)
5. ✅ **Provide updated code** for you to rebuild
6. ✅ **Confirm the fix** works

---

## 🧪 Step 5: Isolation Testing (If Needed)

If the crash log isn't clear, I may ask you to test specific builds:

### Test 1: Disable All Native SDKs (Already Done)

The current code has **RevenueCat** and **OneSignal** disabled. Build and test:

```bash
eas build --platform ios --profile preview
```

**If the app launches successfully**: The crash is caused by RevenueCat or OneSignal.

**If the app still crashes**: The crash is caused by something else (AsyncStorage, Haptics, Constants, or app code).

### Test 2: Re-enable One SDK at a Time

If Test 1 succeeds, I'll provide code to re-enable one SDK at a time:

1. **Re-enable RevenueCat only** → Build → Test
2. **Re-enable OneSignal only** → Build → Test

This will identify which SDK is crashing.

---

## 📊 Common Crash Patterns

Based on the code, here are the most likely crash causes:

### 1. RevenueCat Crash (CURRENTLY DISABLED)

**Symptoms**: 
- Crash on launch before UI appears
- Exception: `NSInvalidArgumentException` or `SIGABRT`
- Stack trace shows `RCPurchases.configure`

**Cause**: 
- Missing or invalid RevenueCat API key
- RevenueCat SDK version incompatibility

**Fix**: 
- Verify API keys are set in environment variables
- Update RevenueCat SDK version
- Add proper error handling

### 2. OneSignal Crash (CURRENTLY DISABLED)

**Symptoms**: 
- Crash on launch before UI appears
- Exception: `SIGABRT` or `NSInvalidArgumentException`
- Stack trace shows `OneSignal.setAppId`

**Cause**: 
- Missing or invalid OneSignal App ID
- OneSignal SDK version incompatibility

**Fix**: 
- Verify App ID is set in environment variables
- Update OneSignal SDK version
- Add proper error handling

### 3. AsyncStorage Crash

**Symptoms**: 
- Crash when trying to read/write storage
- Exception: `NSInternalInconsistencyException`

**Cause**: 
- Storage corruption
- Permission issues

**Fix**: 
- Already wrapped in try/catch (should not crash)
- Clear app data and reinstall

### 4. Expo Config Plugin Issue

**Symptoms**: 
- Crash on launch
- Exception: `Module not found` or `undefined is not an object`

**Cause**: 
- Config plugin not properly configured
- Native module not linked

**Fix**: 
- Run `npx expo prebuild --clean`
- Rebuild the app

---

## 🎯 What I Need from You

To diagnose and fix the crash, please provide:

### Required:
- [ ] **Crash log** (exception name + stack trace, first 30-60 lines)
- [ ] **Platform** (iOS or Android)
- [ ] **Build type** (TestFlight, EAS, local Xcode build)

### Helpful:
- [ ] **iOS version** (e.g., iOS 17.2)
- [ ] **Device model** (e.g., iPhone 14 Pro)
- [ ] **When it crashes** (immediately on launch, after splash screen, etc.)
- [ ] **Any error messages** in Xcode console or device logs

---

## 📞 Next Steps

1. **Capture the crash log** using one of the methods above
2. **Paste the crash log** in your next message
3. **I'll analyze it** and provide the exact fix
4. **You'll rebuild** with the fix
5. **Confirm it works** ✅

---

## 💡 Pro Tip: Use Sentry

Once Sentry is configured, you'll never need to manually capture crash logs again. Sentry will:

- ✅ Automatically capture all crashes
- ✅ Provide full stack traces with source maps
- ✅ Show breadcrumbs (what happened before the crash)
- ✅ Include device info, OS version, app version
- ✅ Alert you via email when crashes occur
- ✅ Group similar crashes together

**It takes 5 minutes to set up and will save you hours of debugging.**

---

## 🆘 Need Help?

If you're stuck capturing the crash log, let me know:

- Which method you're trying (Xcode Organizer, Console.app, etc.)
- What you're seeing (or not seeing)
- Any error messages

I'll guide you through it step by step.

---

**Ready to fix this! Just share the crash log and I'll provide the exact solution.** 🚀
