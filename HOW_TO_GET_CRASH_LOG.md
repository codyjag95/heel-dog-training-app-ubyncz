
# 🚨 How to Get the Crash Log - Step by Step

## 🎯 Goal
Capture the crash log so I can diagnose and fix the immediate crash on launch.

---

## ⚡ FASTEST METHOD: Xcode Organizer (5 minutes)

### Prerequisites
- Mac with Xcode installed
- TestFlight build installed on device
- Device has crashed at least once

### Steps

1. **Open Xcode**
   - Launch Xcode on your Mac

2. **Open Organizer**
   - Press `Cmd + Shift + 9`
   - OR: Menu Bar → Window → Organizer

3. **Go to Crashes Tab**
   - Click the **"Crashes"** tab at the top

4. **Select Your App**
   - In the left sidebar, find and select **"HEEL"**

5. **Find the Crash**
   - You should see a list of crashes
   - Look for the most recent one
   - It will show:
     - Date/time
     - iOS version
     - Device model
     - Number of occurrences

6. **View the Crash Log**
   - Click on the crash to select it
   - The crash log will appear in the main panel

7. **Copy the Crash Log**
   - **Option A**: Right-click the crash → "Show in Finder" → Open the `.crash` file in TextEdit
   - **Option B**: Select all text in the crash log panel → Copy

8. **What to Copy**
   - Copy the **first 60-100 lines** (or the entire log if it's short)
   - Make sure to include:
     - Exception Type (e.g., `NSInvalidArgumentException`, `SIGABRT`)
     - Exception Message
     - Thread 0 (Crashed) section
     - Stack trace

9. **Paste in Your Next Message**
   - Paste the crash log in your next message to me
   - I'll analyze it and provide the fix

---

## 📱 ALTERNATIVE METHOD: Console.app (10 minutes)

### When to Use This
- Xcode Organizer doesn't show crashes
- You want to see the crash in real-time
- You're testing a local build

### Steps

1. **Connect iPhone to Mac**
   - Use a USB cable

2. **Open Console.app**
   - Press `Cmd + Space` (Spotlight)
   - Type "Console"
   - Press Enter

3. **Select Your Device**
   - In the left sidebar, under "Devices"
   - Click on your iPhone

4. **Clear the Log** (Optional)
   - Click the trash icon to clear old logs
   - This makes it easier to find the crash

5. **Launch the HEEL App**
   - On your iPhone, tap the HEEL app icon
   - The app will crash

6. **Find the Crash in Console**
   - In Console.app, you'll see a flood of logs
   - In the search box (top right), type: **"HEEL"**
   - OR search for: **"crash"**
   - OR search for: **"exception"**

7. **Identify the Crash Log**
   - Look for lines with:
     - Red text (errors)
     - "Exception"
     - "SIGABRT"
     - "EXC_BAD_ACCESS"
     - Your app name (HEEL)

8. **Copy the Crash Section**
   - Select the crash-related lines
   - Copy them (Cmd + C)

9. **Paste in Your Next Message**
   - Paste the crash log in your next message to me

---

## 🌐 ALTERNATIVE METHOD: App Store Connect (15 minutes)

### When to Use This
- You don't have access to Xcode
- The crash happened on a tester's device
- You want to see aggregated crash data

### Steps

1. **Go to App Store Connect**
   - Open https://appstoreconnect.apple.com
   - Sign in with your Apple ID

2. **Select Your App**
   - Click on **"My Apps"**
   - Select **"HEEL"**

3. **Go to TestFlight**
   - Click the **"TestFlight"** tab

4. **View Crashes**
   - In the left sidebar, click **"Crashes"**
   - OR: Click on a specific build → "Crashes" tab

5. **Find the Crash**
   - You'll see a list of crashes
   - Click on the most recent one

6. **View Crash Details**
   - The crash details will appear
   - You'll see:
     - Exception type
     - Stack trace
     - Device info
     - iOS version

7. **Copy the Crash Log**
   - Select the crash log text
   - Copy it (Cmd + C)

8. **Paste in Your Next Message**
   - Paste the crash log in your next message to me

---

## 🤖 ALTERNATIVE METHOD: Android Logcat (Android Only)

### Prerequisites
- Android device with USB debugging enabled
- ADB (Android Debug Bridge) installed

### Steps

1. **Connect Android Device**
   - Connect via USB
   - Enable USB debugging in Developer Options

2. **Open Terminal**
   - On Mac: Press `Cmd + Space`, type "Terminal"
   - On Windows: Press `Win + R`, type "cmd"

3. **Verify Device Connection**
   ```bash
   adb devices
   ```
   - You should see your device listed

4. **Clear Logcat** (Optional)
   ```bash
   adb logcat -c
   ```

5. **Start Logcat**
   ```bash
   adb logcat > crash.log
   ```

6. **Launch the HEEL App**
   - On your Android device, tap the HEEL app icon
   - The app will crash

7. **Stop Logcat**
   - Press `Ctrl + C` in the terminal

8. **Open the Log File**
   ```bash
   open crash.log
   ```
   - OR: Navigate to the file and open it in a text editor

9. **Find the Crash**
   - Search for: "FATAL EXCEPTION"
   - OR search for: "AndroidRuntime"
   - OR search for: "HEEL"

10. **Copy the Crash Section**
    - Copy the crash-related lines

11. **Paste in Your Next Message**
    - Paste the crash log in your next message to me

---

## 📋 What the Crash Log Should Look Like

### Example iOS Crash Log:

```
Exception Type: NSInvalidArgumentException
Exception Message: -[RCPurchases configure:]: unrecognized selector sent to instance 0x123456789

Thread 0 Crashed:
0   CoreFoundation                0x00000001a1234567 __exceptionPreprocess + 123
1   libobjc.A.dylib               0x00000001a2345678 objc_exception_throw + 56
2   CoreFoundation                0x00000001a3456789 -[NSObject(NSObject) doesNotRecognizeSelector:] + 140
3   RevenueCat                    0x00000001a4567890 -[RCPurchases configure:] + 0
4   HEEL                          0x00000001a5678901 -[AppDelegate application:didFinishLaunchingWithOptions:] + 234
5   UIKitCore                     0x00000001a6789012 -[UIApplication _handleDelegateCallbacksWithOptions:isSuspended:restoreState:] + 456
...
```

### Example Android Crash Log:

```
FATAL EXCEPTION: main
Process: com.heel.app, PID: 12345
java.lang.RuntimeException: Unable to start activity ComponentInfo{com.heel.app/com.heel.app.MainActivity}: java.lang.NullPointerException: Attempt to invoke virtual method 'void com.revenuecat.purchases.Purchases.configure(java.lang.String)' on a null object reference
    at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:3270)
    at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:3409)
    at com.heel.app.MainActivity.onCreate(MainActivity.java:45)
    at com.revenuecat.purchases.Purchases.configure(Purchases.java:123)
...
```

---

## ✅ What I Need from You

Please provide:

1. **The crash log** (first 60-100 lines)
   - Exception type
   - Exception message
   - Stack trace

2. **Platform** (iOS or Android)

3. **Build type** (TestFlight, EAS, local Xcode build)

4. **Device info** (optional but helpful)
   - iOS version (e.g., iOS 17.2)
   - Device model (e.g., iPhone 14 Pro)

---

## 🚀 What Happens Next

Once you provide the crash log:

1. ✅ I'll **analyze the crash log** (2 minutes)
2. ✅ I'll **identify the crashing module** (e.g., RevenueCat, OneSignal)
3. ✅ I'll **determine the root cause** (e.g., missing API key)
4. ✅ I'll **provide the fix** (updated code + config)
5. ✅ You'll **rebuild and test** (15 minutes)
6. ✅ **Confirm it works** ✅

---

## 🆘 Stuck? Can't Find the Crash Log?

If you're having trouble:

1. **Tell me which method you're trying**
   - Xcode Organizer
   - Console.app
   - App Store Connect
   - Android Logcat

2. **Tell me what you're seeing**
   - "I don't see any crashes in Xcode Organizer"
   - "Console.app shows too many logs, I can't find the crash"
   - "App Store Connect doesn't show crashes"

3. **Share a screenshot** (if possible)
   - This helps me guide you better

I'll walk you through it step by step!

---

## 💡 Pro Tip: Set Up Sentry (10 minutes)

After we fix this crash, I **highly recommend** setting up Sentry so you never have to manually capture crash logs again.

### Why Sentry?
- ✅ **Automatic crash reporting** (no manual log hunting)
- ✅ **Full stack traces** with source maps
- ✅ **Breadcrumbs** (see what happened before the crash)
- ✅ **Device info** (iOS version, device model, app version)
- ✅ **Email alerts** when crashes occur
- ✅ **Free tier** (5,000 events/month)

### How to Set Up Sentry (After We Fix the Crash)

1. **Create Sentry account**: https://sentry.io (free)
2. **Create project**: Select "React Native", name it "heel-app"
3. **Copy DSN**: Looks like `https://abc123@o123456.ingest.sentry.io/456789`
4. **Update code**: I'll provide the exact changes
5. **Build and deploy**: Crashes will automatically appear in Sentry

**I'll help you set this up after we fix the immediate crash.**

---

## 📞 Ready to Fix This!

**Next step**: Capture the crash log using one of the methods above and paste it in your next message.

I'll analyze it and provide the exact fix within minutes. 🚀
