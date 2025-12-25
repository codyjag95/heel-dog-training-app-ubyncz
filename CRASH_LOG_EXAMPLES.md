
# 📋 Crash Log Examples - What to Look For

This guide shows you what different types of crash logs look like and what information to copy.

---

## 🎯 What I Need

When you capture the crash log, I need:

1. **Exception Type** (e.g., `NSInvalidArgumentException`, `SIGABRT`, `EXC_BAD_ACCESS`)
2. **Exception Message** (describes what went wrong)
3. **Stack Trace** (shows which functions were called)
4. **Thread Information** (which thread crashed, usually Thread 0)

---

## 📱 iOS Crash Log Examples

### Example 1: RevenueCat Crash (Missing API Key)

```
Incident Identifier: 1234ABCD-5678-EFGH-9012-IJKLMNOPQRST
CrashReporter Key:   abcdef1234567890abcdef1234567890abcdef12
Hardware Model:      iPhone14,2
Process:             HEEL [12345]
Path:                /private/var/containers/Bundle/Application/HEEL.app/HEEL
Identifier:          com.heel.app
Version:             1.0.0 (1)
Code Type:           ARM-64 (Native)
Role:                Foreground
Parent Process:      launchd [1]
Coalition:           com.heel.app [6789]

Date/Time:           2024-01-15 10:30:45.123 -0800
Launch Time:         2024-01-15 10:30:44.000 -0800
OS Version:          iPhone OS 17.2.1 (21C66)
Release Type:        User
Baseband Version:    1.23.45
Report Version:      104

Exception Type:  EXC_CRASH (SIGABRT)
Exception Codes: 0x0000000000000000, 0x0000000000000000
Exception Note:  EXC_CORPSE_NOTIFY
Triggered by Thread:  0

Application Specific Information:
*** Terminating app due to uncaught exception 'NSInvalidArgumentException', reason: '-[RCPurchases configure:]: unrecognized selector sent to instance 0x123456789'

Last Exception Backtrace:
0   CoreFoundation                0x00000001a1234567 __exceptionPreprocess + 123
1   libobjc.A.dylib               0x00000001a2345678 objc_exception_throw + 56
2   CoreFoundation                0x00000001a3456789 -[NSObject(NSObject) doesNotRecognizeSelector:] + 140
3   CoreFoundation                0x00000001a4567890 ___forwarding___ + 1234
4   CoreFoundation                0x00000001a5678901 _CF_forwarding_prep_0 + 96
5   RevenueCat                    0x00000001a6789012 -[RCPurchases configure:] + 0
6   HEEL                          0x00000001a7890123 -[AppDelegate application:didFinishLaunchingWithOptions:] + 234
7   UIKitCore                     0x00000001a8901234 -[UIApplication _handleDelegateCallbacksWithOptions:isSuspended:restoreState:] + 456
8   UIKitCore                     0x00000001a9012345 -[UIApplication _callInitializationDelegatesWithActions:forCanvas:payload:fromOriginatingProcess:] + 3456
9   UIKitCore                     0x00000001a0123456 -[UIApplication _runWithMainScene:transitionContext:completion:] + 1234
10  UIKitCore                     0x00000001a1234567 -[_UISceneLifecycleMultiplexer completeApplicationLaunchWithFBSScene:transitionContext:] + 123
...

Thread 0 name:  Dispatch queue: com.apple.main-thread
Thread 0 Crashed:
0   libsystem_kernel.dylib        0x00000001a2345678 __pthread_kill + 8
1   libsystem_pthread.dylib       0x00000001a3456789 pthread_kill + 268
2   libsystem_c.dylib             0x00000001a4567890 abort + 180
3   libc++abi.dylib               0x00000001a5678901 __cxa_bad_cast + 0
4   libc++abi.dylib               0x00000001a6789012 demangling_unexpected_handler() + 0
5   libobjc.A.dylib               0x00000001a7890123 _objc_terminate() + 124
6   libc++abi.dylib               0x00000001a8901234 std::__terminate(void (*)()) + 16
7   libc++abi.dylib               0x00000001a9012345 __cxa_throw + 140
8   libobjc.A.dylib               0x00000001a0123456 objc_exception_throw + 356
9   CoreFoundation                0x00000001a1234567 -[NSObject(NSObject) doesNotRecognizeSelector:] + 140
10  CoreFoundation                0x00000001a2345678 ___forwarding___ + 1234
11  CoreFoundation                0x00000001a3456789 _CF_forwarding_prep_0 + 96
12  RevenueCat                    0x00000001a4567890 -[RCPurchases configure:] + 0
13  HEEL                          0x00000001a5678901 -[AppDelegate application:didFinishLaunchingWithOptions:] + 234
...
```

**🔍 What this tells me:**
- **Exception**: `NSInvalidArgumentException` - Invalid method call
- **Reason**: `-[RCPurchases configure:]: unrecognized selector` - RevenueCat method doesn't exist
- **Cause**: RevenueCat SDK not properly initialized or wrong version
- **Fix**: Update RevenueCat SDK, verify API key, add error handling

---

### Example 2: OneSignal Crash (Missing App ID)

```
Exception Type:  EXC_CRASH (SIGABRT)
Exception Codes: 0x0000000000000000, 0x0000000000000000
Triggered by Thread:  0

Application Specific Information:
*** Terminating app due to uncaught exception 'NSInternalInconsistencyException', reason: 'OneSignal App ID is required'

Last Exception Backtrace:
0   CoreFoundation                0x00000001a1234567 __exceptionPreprocess + 123
1   libobjc.A.dylib               0x00000001a2345678 objc_exception_throw + 56
2   OneSignal                     0x00000001a3456789 -[OneSignal setAppId:] + 234
3   HEEL                          0x00000001a4567890 -[AppDelegate application:didFinishLaunchingWithOptions:] + 456
4   UIKitCore                     0x00000001a5678901 -[UIApplication _handleDelegateCallbacksWithOptions:isSuspended:restoreState:] + 789
...

Thread 0 Crashed:
0   libsystem_kernel.dylib        0x00000001a2345678 __pthread_kill + 8
1   libsystem_pthread.dylib       0x00000001a3456789 pthread_kill + 268
2   libsystem_c.dylib             0x00000001a4567890 abort + 180
3   OneSignal                     0x00000001a5678901 -[OneSignal setAppId:] + 234
4   HEEL                          0x00000001a6789012 -[AppDelegate application:didFinishLaunchingWithOptions:] + 456
...
```

**🔍 What this tells me:**
- **Exception**: `NSInternalInconsistencyException` - Internal state error
- **Reason**: `OneSignal App ID is required` - Missing App ID
- **Cause**: OneSignal App ID not set in environment variables
- **Fix**: Add OneSignal App ID to environment variables, add error handling

---

### Example 3: AsyncStorage Crash (Storage Corruption)

```
Exception Type:  EXC_CRASH (SIGABRT)
Exception Codes: 0x0000000000000000, 0x0000000000000000
Triggered by Thread:  0

Application Specific Information:
*** Terminating app due to uncaught exception 'NSInternalInconsistencyException', reason: 'Unable to read from storage'

Last Exception Backtrace:
0   CoreFoundation                0x00000001a1234567 __exceptionPreprocess + 123
1   libobjc.A.dylib               0x00000001a2345678 objc_exception_throw + 56
2   RNCAsyncStorage               0x00000001a3456789 -[RNCAsyncStorage getItem:callback:] + 234
3   HEEL                          0x00000001a4567890 __48-[AppContext loadUserProgress]_block_invoke + 123
...
```

**🔍 What this tells me:**
- **Exception**: `NSInternalInconsistencyException` - Internal state error
- **Reason**: `Unable to read from storage` - Storage corruption
- **Cause**: AsyncStorage data corrupted or permission issue
- **Fix**: Clear app data, add error handling, use safe wrappers

---

### Example 4: JavaScript Error (App Code Issue)

```
Exception Type:  EXC_CRASH (SIGABRT)
Exception Codes: 0x0000000000000000, 0x0000000000000000
Triggered by Thread:  0

Application Specific Information:
*** Terminating app due to uncaught exception 'RCTFatalException: Unhandled JS Exception: TypeError: Cannot read property 'name' of undefined'

Last Exception Backtrace:
0   CoreFoundation                0x00000001a1234567 __exceptionPreprocess + 123
1   libobjc.A.dylib               0x00000001a2345678 objc_exception_throw + 56
2   HEEL                          0x00000001a3456789 RCTFormatError + 234
3   HEEL                          0x00000001a4567890 -[RCTExceptionsManager reportFatal:stack:exceptionId:suppressRedBox:] + 456
4   HEEL                          0x00000001a5678901 __80-[RCTCxxBridge handleError:]_block_invoke + 123
...

JavaScript Stack:
  at HomeScreen (app/(tabs)/(home)/index.tsx:45:12)
  at renderWithHooks (react-dom.development.js:14985:18)
  at mountIndeterminateComponent (react-dom.development.js:17811:13)
  at beginWork (react-dom.development.js:19049:16)
  at HTMLUnknownElement.callCallback (react-dom.development.js:3945:14)
```

**🔍 What this tells me:**
- **Exception**: `RCTFatalException` - JavaScript error
- **Reason**: `TypeError: Cannot read property 'name' of undefined` - Accessing undefined object
- **Cause**: App code trying to access `name` property on undefined object
- **Location**: `app/(tabs)/(home)/index.tsx:45:12`
- **Fix**: Add null check before accessing `name` property

---

## 🤖 Android Crash Log Examples

### Example 1: RevenueCat Crash (Android)

```
FATAL EXCEPTION: main
Process: com.heel.app, PID: 12345
java.lang.RuntimeException: Unable to start activity ComponentInfo{com.heel.app/com.heel.app.MainActivity}: java.lang.NullPointerException: Attempt to invoke virtual method 'void com.revenuecat.purchases.Purchases.configure(java.lang.String)' on a null object reference
    at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:3270)
    at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:3409)
    at android.app.servertransaction.LaunchActivityItem.execute(LaunchActivityItem.java:83)
    at android.app.servertransaction.TransactionExecutor.executeCallbacks(TransactionExecutor.java:135)
    at android.app.servertransaction.TransactionExecutor.execute(TransactionExecutor.java:95)
    at android.app.ActivityThread$H.handleMessage(ActivityThread.java:2016)
    at android.os.Handler.dispatchMessage(Handler.java:107)
    at android.os.Looper.loop(Looper.java:214)
    at android.app.ActivityThread.main(ActivityThread.java:7356)
    at java.lang.reflect.Method.invoke(Native Method)
    at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:492)
    at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:930)
Caused by: java.lang.NullPointerException: Attempt to invoke virtual method 'void com.revenuecat.purchases.Purchases.configure(java.lang.String)' on a null object reference
    at com.heel.app.MainActivity.onCreate(MainActivity.java:45)
    at com.revenuecat.purchases.Purchases.configure(Purchases.java:123)
    at android.app.Activity.performCreate(Activity.java:7802)
    at android.app.Activity.performCreate(Activity.java:7791)
    at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1299)
    at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:3245)
    ... 11 more
```

**🔍 What this tells me:**
- **Exception**: `NullPointerException` - Null object access
- **Reason**: `Attempt to invoke virtual method 'void com.revenuecat.purchases.Purchases.configure(java.lang.String)' on a null object reference`
- **Cause**: RevenueCat not initialized or API key is null
- **Location**: `MainActivity.java:45`
- **Fix**: Verify API key is set, add null check, add error handling

---

## ✅ What to Copy and Send Me

### Minimum Required:
1. **Exception Type** (e.g., `NSInvalidArgumentException`, `SIGABRT`, `NullPointerException`)
2. **Exception Message/Reason** (e.g., `OneSignal App ID is required`)
3. **Stack Trace** (first 20-30 lines showing which functions were called)

### Helpful Additional Info:
4. **Device Info** (iOS version, device model)
5. **App Version** (e.g., 1.0.0)
6. **Build Number** (e.g., 2)
7. **When it crashes** (immediately on launch, after splash screen, etc.)

---

## 📋 Copy Template

When you paste the crash log, use this format:

```
**Platform**: iOS / Android
**Build Type**: TestFlight / EAS / Local Xcode
**Device**: iPhone 14 Pro / Pixel 7
**OS Version**: iOS 17.2.1 / Android 13
**App Version**: 1.0.0 (2)
**When it crashes**: Immediately on launch / After splash screen

**Crash Log**:
[Paste the crash log here - first 60-100 lines]
```

---

## 🆘 Can't Find These Details?

If your crash log looks different or you can't find these details:

1. **Just paste the entire crash log** (or as much as you can)
2. **Tell me which method you used** (Xcode Organizer, Console.app, etc.)
3. **I'll help you interpret it**

Even a partial crash log is better than no crash log!

---

## 🚀 Ready?

Capture the crash log using one of these methods:
- Xcode Organizer (fastest)
- Console.app (real-time)
- App Store Connect (web-based)
- Android Logcat (Android only)

Then paste it in your next message using the template above.

I'll analyze it and provide the exact fix! 💪
