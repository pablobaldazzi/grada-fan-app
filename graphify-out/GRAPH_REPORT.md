# Graph Report - grada-fan-app  (2026-10-21)

## Corpus Check
- 110 files · ~323,450 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .example 1, .patch 1)

## Summary
- 835 nodes · 1879 edges · 43 communities (34 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `be3b0da0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useClub
- api.ts
- app/_layout.tsx
- dependencies
- mock-data.ts
- (tabs)/index.tsx
- index.ts
- package.json
- react
- scripts
- mock-api-data.ts
- build.js
- notification-preferences.tsx
- build-pwa.js
- more.tsx
- sync-club-assets.ts
- getUseMockData
- devDependencies
- getUseMockData
- react
- ref_fs
- prepare-pwa-assets.js
- theme.ts
- User
- news-detail.tsx
- tsconfig.json
- app.config.ts
- PlantelScreen
- Rojinegro App - Football Club Super App
- write-runtime-config.js
- (tabs)/_layout.tsx
- schema.ts
- eslint.config.js
- checkout-payload.test.ts
- config.test.ts
- drizzle-kit
- MembershipTier
- CLAUDE.md
- sw.js

## God Nodes (most connected - your core abstractions)
1. `useClub()` - 67 edges
2. `react` - 46 edges
3. `getUseMockData()` - 42 edges
4. `react-native` - 40 edges
5. `scripts` - 38 edges
6. `expo-router` - 30 edges
7. `useClerkAuth()` - 25 edges
8. `delay()` - 20 edges
9. `@expo/vector-icons` - 20 edges
10. `react-native-safe-area-context` - 19 edges

## Surprising Connections (you probably didn't know these)
- `NotificationsScreen()` --indirect_call--> `markNotificationRead()`  [INFERRED]
  app/notifications.tsx → lib/api.ts
- `AuthLayout()` --calls--> `useClub()`  [EXTRACTED]
  app/(auth)/_layout.tsx → lib/contexts/ClubContext.tsx
- `LoginScreen()` --calls--> `getUseMockData()`  [EXTRACTED]
  app/(auth)/login.tsx → lib/demo-mode.ts
- `RegisterScreen()` --calls--> `getUseMockData()`  [EXTRACTED]
  app/(auth)/register.tsx → lib/demo-mode.ts
- `ClassicTabLayout()` --calls--> `useClub()`  [EXTRACTED]
  app/(tabs)/_layout.tsx → lib/contexts/ClubContext.tsx

## Import Cycles
- None detected.

## Communities (43 total, 9 thin omitted)

### Community 0 - "useClub"
Cohesion: 0.07
Nodes (44): AuthLayout(), ClerkLoginScreen(), CLUB_LOGOS, DemoLoginScreen(), LoginScreen(), styles, ClerkRegisterScreen(), CLUB_LOGOS (+36 more)

### Community 1 - "api.ts"
Cohesion: 0.06
Nodes (52): CheckoutBody, CheckoutItem, CLUB_SLUGS_LIVE_PAYLOAD_IN_MOCK_MODE, getTicketQrUrl(), markNotificationRead(), markMockNotificationRead(), AppExperience, AuthResponseSchema (+44 more)

### Community 2 - "app/_layout.tsx"
Cohesion: 0.06
Nodes (39): RootLayout(), RootLayoutNav(), SplashGate(), ThemedStatusBar(), styles, ClubListItem, DevClubSwitcher(), styles (+31 more)

### Community 3 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, axios, @clerk/clerk-expo, drizzle-orm, drizzle-zod, expo, expo-auth-session, expo-barcode-generator (+45 more)

### Community 4 - "mock-data.ts"
Cohesion: 0.04
Nodes (45): BENEFIT_CATEGORIES, BENEFITS_BY_CLUB, ClubConfig, Experience, EXPERIENCES_BY_CLUB, Match, MOCK_BENEFITS, MOCK_BENEFITS_CONCEPCION (+37 more)

### Community 5 - "(tabs)/index.tsx"
Cohesion: 0.08
Nodes (50): applyDiscount(), generateSeats(), MatchTicketsScreen(), SeatDot(), SeatState, styles, TIER_DISCOUNT, ProductDetailScreen() (+42 more)

### Community 6 - "index.ts"
Cohesion: 0.17
Nodes (9): express, app, configureExpoAndLanding(), getAppName(), http, IncomingMessage, serveExpoManifest(), serveLandingPage() (+1 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (40): main, name, private, version, axios, @babel/core, babel-plugin-react-compiler, expo-auth-session (+32 more)

### Community 8 - "react"
Cohesion: 0.06
Nodes (63): styles, CartScreen(), styles, ExperienceDetailScreen(), styles, demoProfilePic, displayName(), MemberCardFullScreen() (+55 more)

### Community 9 - "scripts"
Cohesion: 0.05
Nodes (38): scripts, build:concepcion:android, build:concepcion:ios, build:palestino:android, build:palestino:ios, build:puertomontt:android, build:puertomontt:ios, build:pwa (+30 more)

### Community 10 - "mock-api-data.ts"
Cohesion: 0.11
Nodes (21): fetchClubBySlug(), buildMockNotifications(), getClubConfig(), getMockClubWithRelations(), getMockNotifications(), getMockOrders(), initMockNotifications(), MOCK_CLUBS (+13 more)

### Community 11 - "build.js"
Cohesion: 0.15
Nodes (22): checkMetroHealth(), clearMetroCache(), downloadAssets(), downloadBundle(), downloadBundlesAndManifests(), downloadFile(), downloadManifest(), exitWithError() (+14 more)

### Community 12 - "notification-preferences.tsx"
Cohesion: 0.31
Nodes (8): NotificationPreferencesScreen(), PREFS_LABELS, styles, fetchNotificationPrefs(), updateNotificationPrefs(), getMockNotificationPrefs(), setMockNotificationPrefs(), NotificationPrefs

### Community 13 - "build-pwa.js"
Cohesion: 0.27
Nodes (8): { CLUB_CONFIGS, CLUB_SLUG_TO_VARIANT }, fs, loadDotEnv(), main(), path, resolveVariant(), run(), { spawnSync }

### Community 14 - "more.tsx"
Cohesion: 0.13
Nodes (24): BenefitDetailScreen(), findCachedArticle(), NewsDetailScreen(), styles, BenefitCard(), BenefitsSection(), ExperienceCard(), MoreScreen() (+16 more)

### Community 15 - "sync-club-assets.ts"
Cohesion: 0.28
Nodes (5): copyFromDefault(), defaultDir, downloadImage(), main(), outDir

### Community 16 - "getUseMockData"
Cohesion: 0.15
Nodes (27): fetchProfile(), loginPassword(), registerDeviceToken(), registerPassword(), unregisterDeviceToken(), AuthContext, AuthContextValue, AuthProvider() (+19 more)

### Community 17 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @babel/core, babel-plugin-react-compiler, drizzle-kit, eslint, eslint-config-expo, @expo/ngrok, jest (+10 more)

### Community 18 - "getUseMockData"
Cohesion: 0.26
Nodes (11): fetchClubBenefit(), fetchClubBenefits(), fetchClubExperience(), fetchClubExperiences(), normalizeMockExperience(), reserveExperience(), updateProfile(), delay() (+3 more)

### Community 19 - "react"
Cohesion: 0.22
Nodes (10): NotificationItem(), NotificationsScreen(), styles, timeAgo(), BACKEND_TYPE_TO_DISPLAY, getDisplayType(), AppNotification, @testing-library/react-native (+2 more)

### Community 20 - "ref_fs"
Cohesion: 0.29
Nodes (4): sharp, hexToRgb(), main(), outDir

### Community 21 - "prepare-pwa-assets.js"
Cohesion: 0.36
Nodes (7): assertFile(), { CLUB_CONFIGS, CLUB_SLUG_TO_VARIANT }, fs, path, resolveVariant(), sharp, writePwaAssets()

### Community 22 - "theme.ts"
Cohesion: 0.20
Nodes (16): ClubContext, ClubContextValue, ClubProvider(), getDevClubSlugOverride(), Club, ClubWithRelations, buildTheme(), DARK (+8 more)

### Community 23 - "User"
Cohesion: 0.25
Nodes (5): IStorage, MemStorage, storage, InsertUser, User

### Community 24 - "news-detail.tsx"
Cohesion: 0.28
Nodes (7): fetchClubNews(), fetchClubNewsArticle(), http, getMockNews(), mockedGetMockNews, mockedGetUseMockData, mockedHttpGet

### Community 25 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, baseUrl, paths, strict, extends, include, @shared/*

### Community 26 - "app.config.ts"
Cohesion: 0.21
Nodes (5): { CLUB_CONFIGS, CLUB_SLUG_TO_VARIANT }, RELEASE_BUILD_PROFILES, { CLUB_CONFIGS, CLUB_SLUG_TO_VARIANT }, getWebMetadata(), Root()

### Community 27 - "PlantelScreen"
Cohesion: 0.24
Nodes (9): PlantelScreen(), PlayerDot(), POSITION_COLORS, s, fetchClubSquad(), SquadPlayer, FORMATION_ROWS, FormationRow (+1 more)

### Community 28 - "Rojinegro App - Football Club Super App"
Cohesion: 0.25
Nodes (7): Architecture, Current State, Key Files, Overview, Recent Changes, Rojinegro App - Football Club Super App, White-Label System

### Community 29 - "write-runtime-config.js"
Cohesion: 0.25
Nodes (7): config, fallback, faviconSrc, fs, outPath, path, publicDir

### Community 30 - "(tabs)/_layout.tsx"
Cohesion: 0.47
Nodes (5): ClassicTabLayout(), NativeTabLayout(), TabLayout(), expo-blur, expo-glass-effect

### Community 31 - "schema.ts"
Cohesion: 0.33
Nodes (5): drizzle-orm, drizzle-zod, zod, insertUserSchema, users

### Community 32 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, eslint, eslint-config-expo

### Community 38 - "MembershipTier"
Cohesion: 0.67
Nodes (3): MembershipTier, Benefit, Member

## Knowledge Gaps
- **34 isolated node(s):** `@stardazed/streams-text-encoding`, `@ungap/structured-clone`, `expo-auth-session`, `expo-barcode-generator`, `expo-crypto` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 390 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `useClub`, `app/_layout.tsx`, `(tabs)/index.tsx`, `package.json`, `notification-preferences.tsx`, `more.tsx`, `getUseMockData`, `react`, `theme.ts`, `app.config.ts`, `PlantelScreen`, `(tabs)/_layout.tsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **What connects `@stardazed/streams-text-encoding`, `@ungap/structured-clone`, `expo-auth-session` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useClub` be split into smaller, more focused modules?**
  _Cohesion score 0.07188778492109878 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05683060109289618 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Should `app/_layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05844155844155844 - nodes in this community are weakly interconnected._