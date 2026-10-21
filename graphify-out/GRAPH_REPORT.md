# Graph Report - grada__grada-fan-app  (2026-10-21)

## Corpus Check
- 105 files · ~322,359 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .example 1, .patch 1)

## Summary
- 805 nodes · 1829 edges · 41 communities (32 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b50e97a`
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
- upgrade-membership.tsx
- scripts
- mock-api-data.ts
- build.js
- ClubContext.tsx
- react-native
- more.tsx
- membership.tsx
- useClerkAuth.ts
- devDependencies
- getUseMockData
- react
- AuthContext.tsx
- expo-router
- theme.ts
- User
- news-detail.tsx
- tsconfig.json
- app.config.ts
- PlantelScreen
- Rojinegro App - Football Club Super App
- BenefitDetailScreen
- (tabs)/_layout.tsx
- schema.ts
- eslint.config.js
- checkout-payload.test.ts
- config.test.ts
- drizzle-kit
- CartItem

## God Nodes (most connected - your core abstractions)
1. `useClub()` - 67 edges
2. `react` - 46 edges
3. `getUseMockData()` - 42 edges
4. `react-native` - 38 edges
5. `scripts` - 31 edges
6. `expo-router` - 30 edges
7. `useClerkAuth()` - 25 edges
8. `delay()` - 20 edges
9. `@expo/vector-icons` - 20 edges
10. `react-native-safe-area-context` - 19 edges

## Surprising Connections (you probably didn't know these)
- `NotificationPreferencesScreen()` --indirect_call--> `fetchNotificationPrefs()`  [INFERRED]
  app/notification-preferences.tsx → lib/api.ts
- `NotificationPreferencesScreen()` --indirect_call--> `updateNotificationPrefs()`  [INFERRED]
  app/notification-preferences.tsx → lib/api.ts
- `NotificationsScreen()` --indirect_call--> `markNotificationRead()`  [INFERRED]
  app/notifications.tsx → lib/api.ts
- `AuthLayout()` --calls--> `useClub()`  [EXTRACTED]
  app/(auth)/_layout.tsx → lib/contexts/ClubContext.tsx
- `LoginScreen()` --calls--> `getUseMockData()`  [EXTRACTED]
  app/(auth)/login.tsx → lib/demo-mode.ts

## Import Cycles
- None detected.

## Communities (41 total, 9 thin omitted)

### Community 0 - "useClub"
Cohesion: 0.07
Nodes (44): AuthLayout(), ClerkLoginScreen(), CLUB_LOGOS, DemoLoginScreen(), LoginScreen(), styles, ClerkRegisterScreen(), CLUB_LOGOS (+36 more)

### Community 1 - "api.ts"
Cohesion: 0.06
Nodes (48): CheckoutBody, CheckoutItem, CLUB_SLUGS_LIVE_PAYLOAD_IN_MOCK_MODE, getTicketQrUrl(), AuthResponseSchema, AvailabilityResponse, AvailabilityResponseSchema, BackendEventSchema (+40 more)

### Community 2 - "app/_layout.tsx"
Cohesion: 0.06
Nodes (38): RootLayout(), RootLayoutNav(), SplashGate(), ThemedStatusBar(), ClubListItem, DevClubSwitcher(), styles, ErrorBoundary (+30 more)

### Community 3 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, axios, @clerk/clerk-expo, drizzle-orm, drizzle-zod, expo, expo-auth-session, expo-barcode-generator (+45 more)

### Community 4 - "mock-data.ts"
Cohesion: 0.04
Nodes (47): MembershipTier, Benefit, BENEFITS_BY_CLUB, ClubConfig, Experience, EXPERIENCES_BY_CLUB, Match, Member (+39 more)

### Community 5 - "(tabs)/index.tsx"
Cohesion: 0.10
Nodes (37): applyDiscount(), generateSeats(), MatchTicketsScreen(), SeatDot(), SeatState, styles, TIER_DISCOUNT, HomeScreen() (+29 more)

### Community 6 - "index.ts"
Cohesion: 0.06
Nodes (25): express, sharp, hexToRgb(), main(), outDir, copyFromDefault(), defaultDir, downloadImage() (+17 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (39): main, name, private, version, axios, @babel/core, babel-plugin-react-compiler, expo-auth-session (+31 more)

### Community 8 - "upgrade-membership.tsx"
Cohesion: 0.12
Nodes (28): formatCardNumber(), formatExpiry(), Step, StepDowngradeWarning(), StepPayment(), StepProcessing(), StepSelect(), StepSuccess() (+20 more)

### Community 9 - "scripts"
Cohesion: 0.06
Nodes (31): scripts, build:concepcion:android, build:concepcion:ios, build:palestino:android, build:palestino:ios, build:puertomontt:android, build:puertomontt:ios, build:rangers:android (+23 more)

### Community 10 - "mock-api-data.ts"
Cohesion: 0.08
Nodes (27): TicketsScreen(), fetchOrders(), buildMockNotifications(), getClubConfig(), getMockClubWithRelations(), getMockNotifications(), getMockOrders(), initMockNotifications() (+19 more)

### Community 11 - "build.js"
Cohesion: 0.14
Nodes (22): checkMetroHealth(), clearMetroCache(), downloadAssets(), downloadBundle(), downloadBundlesAndManifests(), downloadFile(), downloadManifest(), exitWithError() (+14 more)

### Community 12 - "ClubContext.tsx"
Cohesion: 0.15
Nodes (13): styles, styles, NotificationPreferencesScreen(), PREFS_LABELS, styles, POSITION_COLORS, s, styles (+5 more)

### Community 13 - "react-native"
Cohesion: 0.21
Nodes (15): CartScreen(), styles, ProductDetailScreen(), styles, PRODUCT_CATEGORIES, ProductCard(), StoreScreen(), styles (+7 more)

### Community 14 - "more.tsx"
Cohesion: 0.16
Nodes (17): ExperienceCard(), MoreScreen(), MoreTab, NewsCard(), NewsSection(), styles, BENEFIT_CATEGORIES, formatDate() (+9 more)

### Community 15 - "membership.tsx"
Cohesion: 0.19
Nodes (15): demoProfilePic, displayName(), MemberCardFullScreen(), styles, demoProfilePic, displayName(), InfoRow(), MemberCard() (+7 more)

### Community 16 - "useClerkAuth.ts"
Cohesion: 0.18
Nodes (16): registerDeviceToken(), unregisterDeviceToken(), ProfileStatus, useClerkAuthDemo(), useClerkAuthReal(), setHttpAuth(), getMockProfile(), MOCK_ACCESS_TOKEN (+8 more)

### Community 17 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @babel/core, babel-plugin-react-compiler, drizzle-kit, eslint, eslint-config-expo, @expo/ngrok, jest (+10 more)

### Community 18 - "getUseMockData"
Cohesion: 0.24
Nodes (16): ExperienceDetailScreen(), deleteAccount(), fetchClubBenefit(), fetchClubBySlug(), fetchClubExperience(), fetchClubExperiences(), fetchNotificationPrefs(), markNotificationRead() (+8 more)

### Community 19 - "react"
Cohesion: 0.21
Nodes (10): NotificationItem(), NotificationsScreen(), styles, timeAgo(), BACKEND_TYPE_TO_DISPLAY, getDisplayType(), react, @testing-library/react-native (+2 more)

### Community 20 - "AuthContext.tsx"
Cohesion: 0.23
Nodes (13): fetchProfile(), loginPassword(), registerPassword(), AuthContext, AuthContextValue, AuthProvider(), autoLoginDemo(), clearToken() (+5 more)

### Community 21 - "expo-router"
Cohesion: 0.18
Nodes (9): styles, demoProfilePic, Field(), formatRut(), isValidRut(), ProfileScreen(), styles, expo-router (+1 more)

### Community 22 - "theme.ts"
Cohesion: 0.23
Nodes (12): ClubContextValue, Club, ClubWithRelations, buildTheme(), DARK, darkenHex(), defaultTheme, LIGHT (+4 more)

### Community 23 - "User"
Cohesion: 0.25
Nodes (5): IStorage, MemStorage, storage, InsertUser, User

### Community 24 - "news-detail.tsx"
Cohesion: 0.24
Nodes (10): findCachedArticle(), NewsDetailScreen(), styles, fetchClubNews(), fetchClubNewsArticle(), getMockNews(), formatFullNewsDate(), mockedGetMockNews (+2 more)

### Community 25 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): expo/tsconfig.base, compilerOptions, baseUrl, paths, strict, extends, include, @shared/*

### Community 27 - "PlantelScreen"
Cohesion: 0.29
Nodes (6): PlantelScreen(), PlayerDot(), fetchClubSquad(), FORMATION_ROWS, FormationRow, getFormationRows()

### Community 28 - "Rojinegro App - Football Club Super App"
Cohesion: 0.25
Nodes (7): Architecture, Current State, Key Files, Overview, Recent Changes, Rojinegro App - Football Club Super App, White-Label System

### Community 29 - "BenefitDetailScreen"
Cohesion: 0.33
Nodes (7): BenefitDetailScreen(), BenefitCard(), BenefitsSection(), fetchClubBenefits(), getBenefitTierColor(), getBenefitTierLabel(), getMockBenefits()

### Community 30 - "(tabs)/_layout.tsx"
Cohesion: 0.47
Nodes (5): ClassicTabLayout(), NativeTabLayout(), TabLayout(), expo-blur, expo-glass-effect

### Community 31 - "schema.ts"
Cohesion: 0.33
Nodes (5): drizzle-orm, drizzle-zod, zod, insertUserSchema, users

### Community 32 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, eslint, eslint-config-expo

## Knowledge Gaps
- **34 isolated node(s):** `@stardazed/streams-text-encoding`, `@ungap/structured-clone`, `expo-auth-session`, `expo-barcode-generator`, `expo-crypto` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 376 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **What connects `@stardazed/streams-text-encoding`, `@ungap/structured-clone`, `expo-auth-session` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useClub` be split into smaller, more focused modules?**
  _Cohesion score 0.07320024198427103 - nodes in this community are weakly interconnected._
- **Why does `express` connect `index.ts` to `package.json`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06015037593984962 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `useClub`, `app/_layout.tsx`, `(tabs)/index.tsx`, `package.json`, `upgrade-membership.tsx`, `ClubContext.tsx`, `react-native`, `more.tsx`, `membership.tsx`, `useClerkAuth.ts`, `AuthContext.tsx`, `expo-router`, `news-detail.tsx`, `(tabs)/_layout.tsx`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Should `app/_layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05878084179970972 - nodes in this community are weakly interconnected._