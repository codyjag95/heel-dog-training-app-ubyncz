
# Sentry Setup Instructions for HEEL App

## Quick Start

### 1. Create Sentry Account & Project

1. Go to https://sentry.io and sign up (free tier available)
2. Click "Create Project"
3. Select **React Native** as the platform
4. Name your project: `heel-app`
5. Copy your DSN (it looks like: `https://abc123@o123456.ingest.sentry.io/456789`)

### 2. Configure Sentry in Your App

#### Update app/_layout.tsx

Open `app/_layout.tsx` and replace line 10:

```typescript
// BEFORE:
const SENTRY_DSN = 'https://YOUR_SENTRY_DSN@sentry.io/YOUR_PROJECT_ID';

// AFTER (use your actual DSN):
const SENTRY_DSN = 'https://abc123@o123456.ingest.sentry.io/456789';
```

#### Update app.json

Open `app.json` and update the Sentry plugin configuration (around line 48):

```json
[
  "@sentry/react-native/expo",
  {
    "organization": "your-actual-org-slug",
    "project": "heel-app"
  }
]
```

Replace `your-actual-org-slug` with your Sentry organization slug (found in Sentry Settings → Organization Settings).

### 3. Test Sentry Integration (Development)

Before building for TestFlight, test that Sentry works:

```bash
# Start the development server
npm run ios
```

Then in the app:
1. Navigate to **Settings** tab
2. Scroll to **Debug (Dev/TestFlight)** section
3. Tap **"Test Sentry Integration"**
4. Check your Sentry dashboard at https://sentry.io
5. You should see a test error appear within seconds

### 4. Build for TestFlight/Production

#### Option A: EAS Build (Recommended)

1. **Set up environment variables** in `eas.json` or via EAS Secrets:

```bash
# Add Sentry auth token for source maps
eas secret:create --scope project --name SENTRY_AUTH_TOKEN --value your_auth_token

# Get auth token from: https://sentry.io/settings/account/api/auth-tokens/
```

2. **Build the app**:

```bash
# For iOS TestFlight
eas build --platform ios --profile preview

# For production
eas build --platform ios --profile production
```

#### Option B: Local Build

```bash
# Prebuild
npx expo prebuild

# Build with Xcode
open ios/HEEL.xcworkspace
```

### 5. Reproduce the Crash

1. Install the TestFlight build on your device
2. Launch the app
3. If it crashes, Sentry will automatically capture it
4. Check your Sentry dashboard within 1-2 minutes

### 6. View Crash Reports in Sentry

1. Go to https://sentry.io
2. Select your project (`heel-app`)
3. Click **"Issues"** in the left sidebar
4. You should see the crash listed
5. Click on the crash to see:
   - Full stack trace
   - Breadcrumbs (initialization steps)
   - Device info
   - User context

## Understanding the Crash Report

### Key Information to Look For

#### 1. Exception Type
- **Native Crash** (SIGABRT, SIGSEGV): Usually a native module issue
- **JavaScript Error**: App code issue
- **Unhandled Promise Rejection**: Async operation failed

#### 2. Stack Trace
Look at the **top frame** (first line):
- If it's in `app/_layout.tsx` → Initialization issue
- If it's in a native module → That module is crashing
- If it's in `node_modules` → Third-party library issue

#### 3. Breadcrumbs
Shows the initialization flow:
```
✅ AsyncStorage initialized
✅ Constants initialized
✅ Haptics initialized
⏭️ RevenueCat initialization skipped
⏭️ OneSignal initialization skipped
✅ App initialization complete
```

If breadcrumbs stop before "App initialization complete", the crash happened during init.

#### 4. Tags
- `app_version`: Which version crashed
- `module`: Which module was being initialized
- `phase`: initialization, runtime, etc.

### Example Crash Analysis

**Scenario 1: RevenueCat Crash**
```
Exception: NSInvalidArgumentException
Stack Trace:
  at RCPurchases.configure (RevenueCat.m:123)
  at app/_layout.tsx:85
  
Breadcrumbs:
  ✅ AsyncStorage initialized
  ✅ Constants initialized
  ✅ Haptics initialized
  ❌ RevenueCat initialization failed
```

**Solution**: RevenueCat API key is missing or invalid. Check environment variables.

**Scenario 2: OneSignal Crash**
```
Exception: SIGABRT
Stack Trace:
  at OneSignal.setAppId (OneSignal.m:45)
  at app/_layout.tsx:105
  
Breadcrumbs:
  ✅ AsyncStorage initialized
  ✅ Constants initialized
  ✅ Haptics initialized
  ⏭️ RevenueCat initialization skipped
  ❌ OneSignal initialization failed
```

**Solution**: OneSignal App ID is missing or invalid. Check environment variables.

## Troubleshooting

### Sentry Not Capturing Crashes

1. **Check DSN is configured**:
   - Open `app/_layout.tsx`
   - Verify `SENTRY_DSN` is set to your actual DSN
   - Should NOT contain "YOUR_SENTRY_DSN"

2. **Check console logs**:
   - Look for: `✅ Sentry initialized successfully`
   - If you see: `⚠️ Sentry DSN not configured`, update the DSN

3. **Test in development first**:
   - Use the "Test Sentry Integration" button in Settings
   - Verify test errors appear in Sentry dashboard

4. **Check Sentry project settings**:
   - Ensure project is active
   - Check rate limits (free tier: 5,000 events/month)

### Source Maps Not Working

If stack traces show minified code:

1. **Set up Sentry auth token**:
```bash
eas secret:create --scope project --name SENTRY_AUTH_TOKEN --value your_token
```

2. **Update app.json** hooks section (already configured):
```json
"hooks": {
  "postPublish": [
    {
      "file": "sentry-expo/upload-sourcemaps",
      "config": {
        "organization": "your-org",
        "project": "heel-app"
      }
    }
  ]
}
```

3. **Rebuild the app** with source maps enabled

### Crashes Not Appearing in Sentry

1. **Wait 1-2 minutes**: Sentry has a slight delay
2. **Check internet connection**: Device needs internet to send crash reports
3. **Check Sentry quota**: Free tier has limits
4. **Force crash with test button**: Use "Test Crash (Sentry)" in Settings

## Advanced Configuration

### Custom User Context

To track which user experienced the crash:

```typescript
import { setUser } from '@/utils/sentryHelper';

// After user logs in or creates profile
setUser({
  id: dogProfile.id,
  username: dogProfile.name,
  email: userEmail, // if available
});
```

### Custom Tags

To add custom tags for filtering:

```typescript
import { setTag } from '@/utils/sentryHelper';

setTag('dog_breed', dogProfile.breed);
setTag('premium_status', userProgress.isPremium ? 'premium' : 'free');
```

### Performance Monitoring

To track slow operations:

```typescript
import { startTransaction } from '@/utils/sentryHelper';

const transaction = startTransaction('lesson_load', 'navigation');
// ... do work ...
transaction?.finish();
```

## Support

If you need help:

1. **Share the Sentry issue URL** with your team
2. **Export the crash report** (JSON format) from Sentry
3. **Include**:
   - Full stack trace
   - Breadcrumbs
   - Device info
   - Steps to reproduce

## Next Steps After Diagnosis

Once you identify the crashing module from Sentry:

1. **If it's RevenueCat**: 
   - Verify API keys are set correctly
   - Re-enable initialization in `app/_layout.tsx`
   - Add proper error handling

2. **If it's OneSignal**:
   - Verify App ID is set correctly
   - Re-enable initialization in `app/_layout.tsx`
   - Add proper error handling

3. **If it's app code**:
   - Fix the specific issue identified in stack trace
   - Add try/catch around the failing code
   - Test thoroughly before rebuilding

4. **If it's a third-party library**:
   - Check library documentation
   - Update to latest version
   - Report issue to library maintainers

## Checklist

- [ ] Created Sentry account
- [ ] Created Sentry project
- [ ] Copied DSN
- [ ] Updated `app/_layout.tsx` with DSN
- [ ] Updated `app.json` with org/project
- [ ] Tested Sentry in development
- [ ] Built TestFlight/EAS build
- [ ] Reproduced crash
- [ ] Viewed crash in Sentry dashboard
- [ ] Identified crashing module
- [ ] Implemented fix
- [ ] Tested fix
- [ ] Confirmed app launches successfully
