# Deep Links Setup for Flutter (Home Healers)

This folder hosts the website files required for **Android App Links** and **iOS Universal Links**. When configured correctly, links like `https://home-healers.com/doctor/123` open directly in the mobile app instead of the browser.

---

## Files in this folder

| File | Platform | Served at |
|------|----------|-----------|
| `assetlinks.json` | Android | `https://home-healers.com/.well-known/assetlinks.json` |
| `apple-app-site-association.json` | iOS | `https://home-healers.com/.well-known/apple-app-site-association` |

> **Important (iOS):** Apple expects the file **without** a `.json` extension. Ask the web team to either rename/copy it to `apple-app-site-association` or add a Next.js rewrite so both URLs work.

---

## Current configuration

### Android (`assetlinks.json`)

- **Package name:** `com.home.healers.app`
- **SHA-256 fingerprints:** debug and release signing keys are already listed in the file.

### iOS (`apple-app-site-association.json`)

- **Team ID + Bundle ID:** `PPD9X797M6.com.home.healers.app`
- **Supported paths:**

```
/doctor, /doctor/*
/service, /service/*
/reservation, /reservation/*
/offers, /offers/*
/home, /home/*
```

Only URLs matching these paths will open in the app. Other paths (e.g. `/blog/...`) stay in the browser.

---

## 1. Verify hosting (before Flutter changes)

After the website is deployed, confirm the files are reachable:

```bash
# Android
curl https://home-healers.com/.well-known/assetlinks.json

# iOS (no .json extension)
curl https://home-healers.com/.well-known/apple-app-site-association
```

Both should return **200** with `Content-Type: application/json`.

**Google verification (Android):**

https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://home-healers.com&relation=delegate_permission/common.handle_all_urls

**Apple validation (iOS):**

https://search.developer.apple.com/appsearch-validation-tool/

---

## 2. Flutter dependencies

Recommended package: [`app_links`](https://pub.dev/packages/app_links)

```yaml
# pubspec.yaml
dependencies:
  app_links: ^6.0.0
```

---

## 3. Android setup

### 3.1 `AndroidManifest.xml`

Add an intent filter on the **main activity** (the one with `MAIN` / `LAUNCHER`):

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTop">

    <!-- existing intent filters ... -->

  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data
        android:scheme="https"
        android:host="home-healers.com" />
  </intent-filter>
</activity>
```

Use `singleTop` or `singleTask` so an existing app instance is reused when a link is opened.

### 3.2 Signing certificate

The SHA-256 in `assetlinks.json` must match the keystore used to sign the APK/AAB:

```bash
# Debug keystore
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Release keystore (replace with your path and alias)
keytool -list -v -keystore /path/to/release.keystore -alias your_alias
```

If you add a new signing key (e.g. Play App Signing), send the new SHA-256 to the web team to update `assetlinks.json`.

### 3.3 Test on device

```bash
adb shell am start -a android.intent.action.VIEW \
  -d "https://home-healers.com/doctor/42" \
  com.home.healers.app
```

If App Links are verified, the app opens without a browser chooser.

---

## 4. iOS setup

### 4.1 Xcode — Associated Domains

1. Open the iOS target in Xcode.
2. **Signing & Capabilities** → **+ Capability** → **Associated Domains**.
3. Add:

```
applinks:home-healers.com
```

For staging, add the staging domain too (e.g. `applinks:development.home-healers.com`) and ensure that domain serves the same AASA file.

### 4.2 Handle links in Flutter

Universal Links are delivered through the same `app_links` stream as Android.

### 4.3 Test on device

- Send yourself an iMessage or Notes link: `https://home-healers.com/doctor/42`
- Long-press the link — you should see **Open in Home Healers** (or your app name).
- Tapping should open the app, not Safari.

> Universal Links do **not** work when pasted directly into Safari’s address bar. Always test from Messages, Mail, Notes, or another app.

---

## 5. Flutter code example

### Listen for incoming links

```dart
import 'dart:async';
import 'package:app_links/app_links.dart';
import 'package:flutter/material.dart';

class DeepLinkHandler {
  final AppLinks _appLinks = AppLinks();
  StreamSubscription<Uri>? _subscription;

  void init(void Function(Uri uri) onLink) {
    // App opened from terminated state via link
    _appLinks.getInitialLink().then((uri) {
      if (uri != null) onLink(uri);
    });

    // App already running / in background
    _subscription = _appLinks.uriLinkStream.listen(onLink);
  }

  void dispose() => _subscription?.cancel();
}
```

### Route by path

```dart
void handleDeepLink(Uri uri) {
  final path = uri.path; // e.g. /doctor/42

  if (path.startsWith('/doctor')) {
    final id = uri.pathSegments.length > 1 ? uri.pathSegments[1] : null;
  } else if (path.startsWith('/service')) {
    // navigate to service screen
  } else if (path.startsWith('/reservation')) {
    // navigate to reservation screen
  } else if (path.startsWith('/offers')) {
    // navigate to offers screen
  } else if (path.startsWith('/home')) {
    // navigate to home tab
  }
}
```

### Example with `go_router`

```dart
GoRoute(
  path: '/doctor/:id',
  builder: (context, state) => DoctorScreen(id: state.pathParameters['id']!),
),
```

Map website paths to the same route names your app already uses.

---

## 6. Staging vs production

| Environment | Website URL | Notes |
|-------------|-------------|-------|
| Production | `https://home-healers.com` | Primary domain for App Links |
| Development | `https://development.home-healers.com` | Host the same `.well-known` files here if you test deep links against staging |

Each domain you use in the app must serve its own `assetlinks.json` and `apple-app-site-association` files.

---

## 7. Troubleshooting

| Issue | What to check |
|-------|----------------|
| Link opens in browser (Android) | `android:autoVerify="true"` set; SHA-256 matches signing key; `assetlinks.json` returns 200 |
| Link opens in Safari (iOS) | Associated Domains added; AASA URL has no `.json`; paths match; test from Messages, not Safari URL bar |
| App opens but wrong screen | Path parsing in Flutter; ensure `pathSegments` match website routes |
| Works on debug, not release | Release SHA-256 missing from `assetlinks.json` |
| Chooser shows browser + app | App Link verification failed — re-check Digital Asset Links tool |

### Clear Android App Link state (testing)

```bash
adb shell pm set-app-links --package com.home.healers.app 0 all
adb shell pm verify-app-links --re-verify com.home.healers.app
```

---

## 8. When to contact the web team

Ask for an update to these files when:

- **Android:** you change the package name or add a new signing certificate (new SHA-256).
- **iOS:** you change the bundle ID, Apple Team ID, or need new paths (e.g. `/booking/*`).
- **Domains:** you need deep links on a new host (staging, custom domain, etc.).

Files to edit:

- `public/.well-known/assetlinks.json`
- `public/.well-known/apple-app-site-association.json` (and serve as `apple-app-site-association` without extension)

---

## Quick checklist

- [ ] `assetlinks.json` live at production URL
- [ ] `apple-app-site-association` live **without** `.json` extension
- [ ] Android intent filter with `autoVerify="true"`
- [ ] iOS Associated Domains: `applinks:home-healers.com`
- [ ] Flutter listens to initial link + link stream
- [ ] Paths `/doctor`, `/service`, `/reservation`, `/offers`, `/home` handled in navigation
- [ ] Tested on real devices (not only emulator/simulator)
