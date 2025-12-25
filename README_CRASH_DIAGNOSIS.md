
# HEEL App - Crash Diagnosis & Sentry Setup

## Current Status

The app has been updated with comprehensive crash reporting using Sentry. This will help diagnose the immediate crash on launch.

## What Was Done

### 1. Sentry Integration Added
- Installed `@sentry/react-native` package
- Integrated Sentry in `app/_layout.tsx` with comprehensive error tracking
- Added Sentry helper utilities in `utils/sentryHelper.ts`
- Wrapped root component with Sentry error boundary

### 2. Enhanced Error Logging
- Added detailed console logging for each initialization step
- Each native module initialization is wrapped in try/catch
- Breadcrumbs added for tracking initialization flow
- Timestamps and duration tracking for performance monitoring

### 3. Native SDK Isolation
- RevenueCat/Purchases SDK initialization: **DISABLED** (commented out)
- OneSignal/Push Notifications SDK initialization: **DISABLED** (commented out)
- These were identified as potential crash sources in previous builds

### 4. Debug Tools Added
- Settings screen now includes:
  - "Test Sentry Integration" button (sends test error to Sentry)
  - "Test Crash" button (intentionally crashes app to verify crash reporting)
  - Crash reporting status shown in app info

## Next Steps to Diagnose the Crash

### Step 1: Configure Sentry DSN

1. **Create a Sentry account** (if you don't have one):
   - Go to https://sentry.io
   - Sign up for a free account

2. **Create a new project**:
   - Click "Create Project"
   - Select "React Native" as the platform
   - Name it "heel-app" or similar
   - Copy the DSN (looks like: `https://xxxxx@sentry.io/xxxxx`)

3. **Update the DSN in the code**:
   - Open `app/_layout.tsx`
   - Find line 10: `const SENTRY_DSN = 'https://YOUR_SENTRY_DSN@sentry.io/YOUR_PROJECT_ID';`
   - Replace with your actual DSN

4. **Update app.json**:
   - Open `app.json`
   - Find the Sentry plugin configuration (around line 48)
   - Replace `"organization": "your-org"` with your Sentry organization slug
   - Replace `"project": "heel-app"` with your Sentry project name

### Step 2: Build and Test

1. **Build a new TestFlight/EAS build**:
   ```bash
   eas build --platform ios --profile preview
   ```

2. **Install and launch the app**:
   - The app will either:
     - Launch successfully (crash is fixed!)
     - Crash immediately (Sentry will capture it)

3. **Check Sentry Dashboard**:
   - Go to https://sentry.io
   - Navigate to your project
   - Click "Issues" in the left sidebar
   - You should see the crash with full stack trace

### Step 3: Analyze the Crash

When you see the crash in Sentry, look for:

1. **Exception Type**: 
   - Native crash (SIGABRT, SIGSEGV)?
   - JavaScript error?
   - Unhandled promise rejection?

2. **Stack Trace**:
   - Which file/function is at the top?
   - Is it in app code or a native module?

3. **Breadcrumbs**:
   - What was the last successful initialization step?
   - Which module failed to initialize?

4. **Device Info**:
   - iOS version
   - Device model
   - App version

### Step 4: Test Sentry Integration (Before Building)

You can test Sentry in development:

1. **Run the app in development**:
   ```bash
   npm run ios
   ```

2. **Navigate to Settings**:
   - Scroll to "Debug (Dev/TestFlight)" section
   - Tap "Test Sentry Integration"
   - Check your Sentry dashboard for the test error

3. **Test crash reporting**:
   - Tap "Test Crash (Sentry)"
   - App will crash intentionally
   - Relaunch the app
   - Check Sentry dashboard for the crash report

## Common Crash Causes & Solutions

Based on the code analysis, here are the most likely crash causes:

### 1. RevenueCat/Purchases SDK (CURRENTLY DISABLED)
**Symptoms**: Crash on launch before UI appears
**Cause**: Missing API key or invalid configuration
**Solution**: 
- Keep disabled until app launches successfully
- Then re-enable with proper API keys in environment variables

### 2. OneSignal/Push Notifications (CURRENTLY DISABLED)
**Symptoms**: Crash on launch, SIGABRT
**Cause**: Missing App ID or invalid configuration
**Solution**:
- Keep disabled until app launches successfully
- Then re-enable with proper App ID in environment variables

### 3. AsyncStorage
**Symptoms**: Crash when trying to read/write storage
**Cause**: Storage corruption or permission issues
**Solution**: Already wrapped in try/catch, should not crash

### 4. Missing Environment Variables
**Symptoms**: Native module crashes when reading undefined config
**Cause**: Environment variables not set in build
**Solution**: Ensure all required env vars are set in EAS build config

### 5. Expo Config Plugin Issues
**Symptoms**: Crash on launch, native module not found
**Cause**: Config plugin not properly configured
**Solution**: Check app.json plugins array

## Environment Variables Checklist

Make sure these are set in your EAS build (if using these services):

```bash
# RevenueCat (currently disabled)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_key
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_key

# OneSignal (currently disabled)
EXPO_PUBLIC_ONESIGNAL_APP_ID=your_app_id

# Sentry (required for crash reporting)
SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_org_slug
SENTRY_PROJECT=your_project_name
SENTRY_AUTH_TOKEN=your_auth_token
```

## Deliverable Format

Once you have the crash log from Sentry, please provide:

1. **Exact crash exception + stack trace**:
   - Copy the full exception from Sentry
   - Include the top 30-60 lines of the stack trace

2. **The specific file/module causing it**:
   - Which file is at the top of the stack?
   - Which native module is involved?

3. **Breadcrumbs**:
   - What was the last successful initialization step?
   - Copy the breadcrumbs from Sentry

4. **Device/Build Info**:
   - iOS version
   - Device model
   - App version
   - Build number

## Contact

If you need help interpreting the Sentry crash logs, please share:
- Screenshot of the Sentry issue
- Full stack trace
- Breadcrumbs section
- Device info section

This will allow for precise diagnosis and fix implementation.
