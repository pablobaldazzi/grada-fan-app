# Rojinegro App - Football Club Super App

## Overview
White-label, multi-tenant football club mobile app built with React Native + Expo. Fan-facing "club super app" for digital membership, tickets, merch, benefits, and experiences.

## Current State
MVP with mock data layer. All screens built with dark theme (rojinegro style).

## Architecture
- **Frontend**: React Native + Expo Router (file-based routing)
- **Backend**: Express (port 5000) - serves landing page + future API
- **State**: React Context (CartProvider), mock data in `lib/mock-data.ts`
- **Navigation**: Bottom tabs (5 tabs: Inicio, Socio, Entradas, Tienda, Mas)
- **Theme**: Dark UI with red accent (#E31E24), Inter font

## Key Files
- `lib/mock-data.ts` - All mock data + types (swap for real API)
- `lib/cart-context.tsx` - Cart state management
- `clubs/rangers/club.json` - Club pack config example
- `constants/colors.ts` - Theme colors
- `app/(tabs)/` - Tab screens (index, membership, tickets, store, more)
- `app/match-tickets.tsx` - Seat selection + ticket purchase flow
- `app/product-detail.tsx` - Merch product detail
- `app/benefit-detail.tsx` - Benefit detail
- `app/experience-detail.tsx` - Experience detail + reserve
- `app/cart.tsx` - Combined cart (tickets + merch)
- `app/member-card-full.tsx` - Full screen membership card

## White-Label System
- Club configs in `/clubs/{tenantKey}/club.json`
- Feature flags control tab/route visibility
- Theme colors configurable per club

## Recent Changes
- 2026-02-17: Initial MVP build with all core modules
