# Home Healers — Flutter Deep Links Integration Guide

**Domain:** `https://home-healers.com`  
**App package (Android):** `com.home.healers.app`  
**App bundle (iOS):** `com.home.healers.app`  
**Apple Team ID:** `PPD9X797M6`  
**Custom URL scheme:** `homehealers://`

This document describes what the **website already provides** and what the **Flutter team must implement** to complete deep linking end-to-end.

---

## Table of contents

1. [Architecture overview](#1-architecture-overview)
2. [What the website already handles](#2-what-the-website-already-handles)
3. [Supported link formats](#3-supported-link-formats)
4. [Flutter checklist](#4-flutter-checklist)
5. [Android setup](#5-android-setup)
6. [iOS setup](#6-ios-setup)
7. [Custom scheme handler (required)](#7-custom-scheme-handler-required)
8. [Flutter code — full implementation](#8-flutter-code--full-implementation)
9. [Testing](#9-testing)
10. [Troubleshooting](#10-troubleshooting)
11. [When to contact the web team](#11-when-to-contact-the-web-team)

---

## 1. Architecture overview

```
User taps shared link
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│  https://home-healers.com/doctor?doctorId=123             │
└───────────────────────────────────────────────────────────┘
        │
        ├── App installed + OS verifies domain
        │       └──► App opens directly (App Links / Universal Links)
        │            Flutter receives https://home-healers.com/...
        │
        ├── App installed + in-app browser (Facebook / Instagram)
        │       └──► Website tries homehealers://open?target_url=...
        │            Flutter receives custom scheme + target_url
        │
        ├── App NOT installed (mobile)
        │       └──► Website redirects to Play Store / App Store
        │
        └── Desktop / laptop
                └──► Website shows download landing page
```

**Your job in Flutter:** handle **both** incoming link types:

| Type | Example | When |
|------|---------|------|
| HTTPS (App Links / Universal Links) | `https://home-healers.com/doctor?doctorId=123` | App installed, normal browser / OS handoff |
| Custom scheme (fallback) | `homehealers://open?target_url=https%3A%2F%2Fhome-healers.com%2Fdoctor%3FdoctorId%3D123` | In-app browsers, website fallback |

---

## 2. What the website already handles

### ✅ Domain verification files

| File | URL | Status |
|------|-----|--------|
| Android Digital Asset Links | `https://home-healers.com/.well-known/assetlinks.json` | Live — **200** + valid JSON |
| iOS AASA (no `.json` extension) | `https://home-healers.com/.well-known/apple-app-site-association` | Live — rewrite + static file, **200** |

Verify after each deploy:

```bash
curl -I https://home-healers.com/.well-known/assetlinks.json
curl -I https://home-healers.com/.well-known/apple-app-site-association
curl -sS https://home-healers.com/.well-known/apple-app-site-association | python3 -m json.tool
```

### ✅ Web fallback routes

These pages exist and return **200** (no more 404):

| Screen | Share URL (preferred) | Alternate |
|--------|----------------------|-----------|
| Doctor | `https://home-healers.com/doctor?doctorId=123` | `/doctor/123` |
| Service | `https://home-healers.com/service?categoryId=5` | `/service/5` |
| Reservation | `https://home-healers.com/reservation?reservationId=99` | `/reservation/99` |
| Offers | `https://home-healers.com/offers` | `/offers/...` |
| Home | `https://home-healers.com/home` | `/home/...` |

### ✅ Mobile web behavior (no Flutter code needed on web)

| Context | Behavior |
|---------|----------|
| **Chrome / Safari (normal)** | Landing page only — no auto-redirect, no store timeout |
| **"Open in App" button** | Android: HTTPS Intent URL (no Play Store fallback). iOS/desktop: same HTTPS link |
| **"Download the App" button** | Manual store link only — never automatic |
| **Facebook / Instagram in-app browser** | Auto `homehealers://open?target_url=...` on page load |
| **Desktop** | Landing page with Play Store + App Store buttons |

**Always use `https://home-healers.com/...` links when sharing** — never share `homehealers://` directly.

---

## 3. Supported link formats

### Query parameters (preferred for sharing)

```
https://home-healers.com/doctor?doctorId=123
https://home-healers.com/service?categoryId=5
https://home-healers.com/reservation?reservationId=99
https://home-healers.com/offers
https://home-healers.com/home
```

### Path segments (also supported)

```
https://home-healers.com/doctor/123
https://home-healers.com/service/5
https://home-healers.com/reservation/99
```

### Custom scheme (from website fallback)

```
homehealers://open?target_url=<url-encoded-https-link>
```

**Example:**

```
homehealers://open?target_url=https%3A%2F%2Fhome-healers.com%2Fdoctor%3FdoctorId%3D123
```

Flutter must:

1. Detect `homehealers://open`
2. Read `target_url` query parameter
3. Parse the decoded HTTPS URL the same way as a direct App Link

### iOS AASA registered paths

```
/doctor, /doctor/*
/service, /service/*
/reservation, /reservation/*
/offers, /offers/*
/home, /home/*
```

Paths outside this list (e.g. `/blog/...`) will **not** open the app via Universal Links.

---

## 4. Flutter checklist

### Website (done)

- [x] `assetlinks.json` on production
- [x] `apple-app-site-association` without `.json` returns 200
- [x] Web routes for all 5 deep link paths
- [x] Mobile redirect to app / store
- [x] Desktop landing page

### Flutter (your tasks)

- [ ] Add `app_links` package
- [ ] Android: HTTPS intent-filter with `android:autoVerify="true"`
- [ ] Android: custom scheme intent-filter for `homehealers://`
- [ ] iOS: Associated Domains `applinks:home-healers.com`
- [ ] iOS: URL scheme `homehealers` in `Info.plist`
- [ ] Handle **initial link** (app was closed)
- [ ] Handle **link stream** (app was open / background)
- [ ] Parse `homehealers://open?target_url=...` and unwrap to HTTPS
- [ ] Navigate to correct screen for all 5 routes
- [ ] Test on **real devices** (debug + release builds)
- [ ] Confirm release SHA-256 is in `assetlinks.json`

---

## 5. Android setup

### 5.1 HTTPS App Links (`AndroidManifest.xml`)

Add on your **main activity** (`singleTop` or `singleTask`):

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTop">

    <!-- existing MAIN/LAUNCHER intent-filter -->

    <!-- App Links: https://home-healers.com/... -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="https"
            android:host="home-healers.com" />
    </intent-filter>

    <!-- Custom scheme: homehealers://open?target_url=... -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="homehealers"
            android:host="open" />
    </intent-filter>
</activity>
```

### 5.2 Signing certificate

`assetlinks.json` already includes two SHA-256 fingerprints. Your release key **must** match one of them.

```bash
# Debug
keytool -list -v -keystore ~/.android/debug.keystore \
  -alias androiddebugkey -storepass android -keypass android

# Release
keytool -list -v -keystore /path/to/release.keystore -alias YOUR_ALIAS
```

If Play App Signing uses a different key, send the **App signing key certificate** SHA-256 to the web team.

### 5.3 Verify App Links

https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://home-healers.com&relation=delegate_permission/common.handle_all_urls

```bash
adb shell pm verify-app-links --re-verify com.home.healers.app
adb shell am start -a android.intent.action.VIEW \
  -d "https://home-healers.com/doctor?doctorId=42" \
  com.home.healers.app
```

---

## 6. iOS setup

### 6.1 Associated Domains (Xcode)

**Signing & Capabilities → Associated Domains:**

```
applinks:home-healers.com
```

### 6.2 Custom URL scheme (`ios/Runner/Info.plist`)

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>homehealers</string>
    </array>
    <key>CFBundleURLName</key>
    <string>com.home.healers.app</string>
  </dict>
</array>
```

### 6.3 Validate AASA

https://search.developer.apple.com/appsearch-validation-tool/

### 6.4 Test Universal Links

- Send link in **iMessage** or **Notes**: `https://home-healers.com/doctor?doctorId=42`
- Long-press → should show **Open in Home Healers**
- Do **not** test by pasting into Safari address bar (Universal Links won't fire)

---

## 7. Custom scheme handler (required)

The website calls this when opening the app from mobile browsers:

```
homehealers://open?target_url=<encoded https url>
```

**Flutter must implement this.** Without it, Facebook/Instagram links and the website fallback will not open the app.

**Parsing steps:**

1. Receive URI: `homehealers://open?target_url=...`
2. If `scheme == homehealers` and `host == open`:
3. Read `target_url` query param
4. `Uri.parse(Uri.decodeComponent(targetUrl))`
5. Pass result to the same router used for HTTPS links

---

## 8. Flutter code — full implementation

### 8.1 Dependency

```yaml
# pubspec.yaml
dependencies:
  app_links: ^6.0.0
```

### 8.2 Deep link service

```dart
import 'dart:async';
import 'package:app_links/app_links.dart';

enum DeepLinkDestination {
  doctor,
  service,
  reservation,
  offers,
  home,
  unknown,
}

class ParsedDeepLink {
  const ParsedDeepLink({
    required this.destination,
    this.doctorId,
    this.categoryId,
    this.reservationId,
  });

  final DeepLinkDestination destination;
  final String? doctorId;
  final String? categoryId;
  final String? reservationId;
}

class DeepLinkService {
  DeepLinkService(this._appLinks);

  final AppLinks _appLinks;
  StreamSubscription<Uri>? _subscription;

  Future<void> init(void Function(ParsedDeepLink link) onLink) async {
    final initial = await _appLinks.getInitialLink();
    if (initial != null) {
      onLink(parseDeepLink(initial));
    }

    _subscription = _appLinks.uriLinkStream.listen((uri) {
      onLink(parseDeepLink(uri));
    });
  }

  void dispose() => _subscription?.cancel();

  /// Unwrap homehealers://open?target_url=... then parse the https URL.
  static ParsedDeepLink parseDeepLink(Uri uri) {
    final effective = _unwrapCustomScheme(uri);
    return _parseHttpsLink(effective);
  }

  static Uri _unwrapCustomScheme(Uri uri) {
    if (uri.scheme == 'homehealers' && uri.host == 'open') {
      final target = uri.queryParameters['target_url'];
      if (target != null && target.isNotEmpty) {
        return Uri.parse(Uri.decodeComponent(target));
      }
    }
    return uri;
  }

  static ParsedDeepLink _parseHttpsLink(Uri uri) {
    final segments = uri.pathSegments;
    final first = segments.isNotEmpty ? segments.first : '';

    switch (first) {
      case 'doctor':
        return ParsedDeepLink(
          destination: DeepLinkDestination.doctor,
          doctorId: uri.queryParameters['doctorId'] ??
              (segments.length > 1 ? segments[1] : null),
        );
      case 'service':
        return ParsedDeepLink(
          destination: DeepLinkDestination.service,
          categoryId: uri.queryParameters['categoryId'] ??
              (segments.length > 1 ? segments[1] : null),
        );
      case 'reservation':
        return ParsedDeepLink(
          destination: DeepLinkDestination.reservation,
          reservationId: uri.queryParameters['reservationId'] ??
              (segments.length > 1 ? segments[1] : null),
        );
      case 'offers':
        return const ParsedDeepLink(destination: DeepLinkDestination.offers);
      case 'home':
        return const ParsedDeepLink(destination: DeepLinkDestination.home);
      default:
        return const ParsedDeepLink(destination: DeepLinkDestination.unknown);
    }
  }
}
```

### 8.3 Wire up in `main.dart`

```dart
class _MyAppState extends State<MyApp> {
  final _deepLinks = DeepLinkService(AppLinks());
  final _router = GoRouter(/* your routes */);

  @override
  void initState() {
    super.initState();
    _deepLinks.init(_navigateFromDeepLink);
  }

  void _navigateFromDeepLink(ParsedDeepLink link) {
    switch (link.destination) {
      case DeepLinkDestination.doctor:
        if (link.doctorId != null) {
          _router.go('/doctor/${link.doctorId}');
        }
        break;
      case DeepLinkDestination.service:
        if (link.categoryId != null) {
          _router.go('/service/${link.categoryId}');
        }
        break;
      case DeepLinkDestination.reservation:
        if (link.reservationId != null) {
          _router.go('/reservation/${link.reservationId}');
        }
        break;
      case DeepLinkDestination.offers:
        _router.go('/offers');
        break;
      case DeepLinkDestination.home:
        _router.go('/home');
        break;
      case DeepLinkDestination.unknown:
        break;
    }
  }

  @override
  void dispose() {
    _deepLinks.dispose();
    super.dispose();
  }
}
```

### 8.4 Unit tests (recommended)

```dart
void main() {
  test('unwraps custom scheme', () {
    final uri = Uri.parse(
      'homehealers://open?target_url='
      '${Uri.encodeComponent('https://home-healers.com/doctor?doctorId=7')}',
    );
    final parsed = DeepLinkService.parseDeepLink(uri);
    expect(parsed.destination, DeepLinkDestination.doctor);
    expect(parsed.doctorId, '7');
  });

  test('parses path segment', () {
    final uri = Uri.parse('https://home-healers.com/doctor/42');
    final parsed = DeepLinkService.parseDeepLink(uri);
    expect(parsed.doctorId, '42');
  });

  test('parses query param', () {
    final uri = Uri.parse('https://home-healers.com/service?categoryId=5');
    final parsed = DeepLinkService.parseDeepLink(uri);
    expect(parsed.categoryId, '5');
  });
}
```

---

## 9. Testing

### 9.1 Verification script

After website deploy, run (if you have the repo script):

```bash
./scripts/verify_deep_link_domain.sh home-healers.com
```

### 9.2 Manual test matrix

| # | Scenario | Link | Expected |
|---|----------|------|----------|
| 1 | Android, app installed | `https://home-healers.com/doctor?doctorId=1` | App opens → doctor screen |
| 2 | Android, app not installed | same link in Chrome | Play Store opens |
| 3 | iOS, app installed | same link in iMessage | App opens → doctor screen |
| 4 | iOS, app not installed | same link in iMessage | App Store opens |
| 5 | Facebook in-app browser | same link | App opens (via custom scheme) |
| 6 | Desktop Chrome | same link | Website landing page |
| 7 | Custom scheme direct | `homehealers://open?target_url=...` | App opens → correct screen |
| 8 | Service link | `?categoryId=5` | Service screen with id 5 |
| 9 | Reservation link | `?reservationId=99` | Reservation screen with id 99 |
| 10 | Offers / Home | `/offers`, `/home` | Correct tab/screen |

### 9.3 Android debug commands

```bash
# HTTPS App Link
adb shell am start -a android.intent.action.VIEW \
  -d "https://home-healers.com/doctor?doctorId=123" \
  com.home.healers.app

# Custom scheme
adb shell am start -a android.intent.action.VIEW \
  -d "homehealers://open?target_url=https%3A%2F%2Fhome-healers.com%2Fdoctor%3FdoctorId%3D123" \
  com.home.healers.app

# Reset link verification state
adb shell pm set-app-links --package com.home.healers.app 0 all
adb shell pm verify-app-links --re-verify com.home.healers.app
```

---

## 10. Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| Link opens browser on Android | App Links not verified | Check SHA-256 in `assetlinks.json`; `autoVerify="true"` |
| Link opens Safari on iOS | AASA not loaded or paths mismatch | Verify AASA URL returns 200 without `.json` |
| Facebook link doesn't open app | Custom scheme not handled | Implement `homehealers://open?target_url=` parser |
| App opens, wrong screen | Parser bug | Support both `?doctorId=` and `/doctor/123` |
| Works in debug, not release | Release cert missing from assetlinks | Add release SHA-256 to web team |
| Chooser shows browser + app | Verification failed | Re-run Digital Asset Links tool |
| iOS works in debug only | Associated Domains on wrong target | Check Xcode capability on Runner target |

---

## 11. When to contact the web team

Request an update when you change:

| Change | File to update |
|--------|----------------|
| Android package name | `public/.well-known/assetlinks.json` |
| New signing certificate (SHA-256) | `assetlinks.json` |
| iOS bundle ID or Team ID | `apple-app-site-association` |
| New deep link path (e.g. `/booking/*`) | AASA + new Next.js route |
| New staging domain | Host same `.well-known` files on that domain |

**Do not change** the custom scheme (`homehealers`) or `target_url` parameter name without coordinating — the live website already uses them.

---

## Quick reference

```
Share links:     https://home-healers.com/{route}?{idParam}={value}
Custom scheme:   homehealers://open?target_url=<encoded https url>
Android package: com.home.healers.app
iOS app ID:      PPD9X797M6.com.home.healers.app
Play Store:      https://play.google.com/store/apps/details?id=com.home.healers.app
```

**Priority for Flutter:** implement the custom scheme handler + HTTPS parser, then test all 10 scenarios in the matrix above on real devices.
