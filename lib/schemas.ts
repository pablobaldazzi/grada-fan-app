import { z } from 'zod';

// ── Club ────────────────────────────────────────────────────────
export const ClubSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  fullLogoUrl: z.string().nullable().optional(),
  useFullLogo: z.boolean().nullable().optional(),
  primaryColor: z.string().nullable().optional(),
  secondaryColor: z.string().nullable().optional(),
  navBarBackgroundColor: z.string().nullable().optional(),
  navBarTextColor: z.string().nullable().optional(),
  storeBackgroundColor: z.string().nullable().optional(),
  appPrimaryColor: z.string().nullable().optional(),
  appSecondaryColor: z.string().nullable().optional(),
  appBackgroundColor: z.string().nullable().optional(),
  appTextColor: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  font: z.string().nullable().optional(),
});
export type Club = z.infer<typeof ClubSchema>;

// ── Backend Event (from club.events) ──────────────────────────────
export const TicketTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.union([z.number(), z.string()]).transform((v) => (typeof v === 'string' ? parseFloat(v) : v)),
  capacity: z.number().optional(),
  sold: z.number().optional(),
});
export type TicketType = z.infer<typeof TicketTypeSchema>;

export const BackendEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  datetime: z.string(),
  venue: z.string().nullable().optional(),
  ticketTypes: z.array(TicketTypeSchema).optional().default([]),
});
export type BackendEvent = z.infer<typeof BackendEventSchema>;

// ── Backend Product (from club.products) ─────────────────────────
export const BackendProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.union([z.number(), z.string()]).transform((v) => (typeof v === 'string' ? parseFloat(v) : v)),
  imageUrl: z.string().nullable().optional(),
  imageUrls: z.array(z.string()).optional().default([]),
  stock: z.number().optional(),
});
export type BackendProduct = z.infer<typeof BackendProductSchema>;

// ── Club with events and products (GET /public/clubs/:slug) ───────
export const ClubWithRelationsSchema = ClubSchema.extend({
  events: z.array(BackendEventSchema).optional().default([]),
  products: z.array(BackendProductSchema).optional().default([]),
});
export type ClubWithRelations = z.infer<typeof ClubWithRelationsSchema>;

// ── Fan ─────────────────────────────────────────────────────────
export const FanSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  clubId: z.string().optional(),
});
export type Fan = z.infer<typeof FanSchema>;

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  fan: FanSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// ── Fan profile (GET /public/fans/me) ───────────────────────────
export const FanProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  nationalId: z.string().nullable().optional(),
  address1: z.string().nullable().optional(),
  address2: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  marketingOptIn: z.boolean().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type FanProfile = z.infer<typeof FanProfileSchema>;

// ── Ticket / Order ───────────────────────────────────────────────
export const TicketSchema = z.object({
  id: z.string(),
  orderId: z.string().optional(),
  status: z.string().optional(),
  seatLabel: z.string().nullable().optional(),
  sectionName: z.string().nullable().optional(),
  token: z.string().nullable().optional(),
  event: z
    .object({
      id: z.string(),
      name: z.string(),
      datetime: z.string().nullable().optional(),
      venue: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  ticketType: z
    .object({
      id: z.string(),
      name: z.string(),
      price: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
});
export type Ticket = z.infer<typeof TicketSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  status: z.string().optional(),
  totalAmount: z.number().nullable().optional(),
  createdAt: z.string().optional(),
  tickets: z.array(TicketSchema).optional(),
  orderItems: z.array(z.any()).optional(),
});
export type Order = z.infer<typeof OrderSchema>;

// ── Notification ────────────────────────────────────────────────
export const NotificationSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  title: z.string(),
  body: z.string().nullable().optional(),
  data: z.any().nullable().optional(),
  readAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
});
export type AppNotification = z.infer<typeof NotificationSchema>;

export const NotificationListSchema = z.object({
  items: z.array(NotificationSchema),
  unreadCount: z.number(),
});
export type NotificationList = z.infer<typeof NotificationListSchema>;

// ── Notification preferences ────────────────────────────────────
export const NotificationPrefsSchema = z.object({
  matchReminders: z.boolean().optional(),
  promos: z.boolean().optional(),
  newMatches: z.boolean().optional(),
  newBenefits: z.boolean().optional(),
});
export type NotificationPrefs = z.infer<typeof NotificationPrefsSchema>;

// ── Seatmap / availability (for match-tickets) ────────────────────
export const SeatSchema = z.object({
  id: z.string(),
  seatKey: z.string().optional(),
  section: z.string().optional(),
  row: z.string().optional(),
  number: z.string().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  zoneKey: z.string().optional(),
});
export type Seat = z.infer<typeof SeatSchema>;

export const SeatmapResponseSchema = z.object({
  viewBox: z.object({ x: z.number(), y: z.number(), width: z.number(), height: z.number() }).optional(),
  zones: z.array(z.object({ key: z.string(), name: z.string(), color: z.string().optional() })).optional().default([]),
  seats: z.array(SeatSchema),
  zoneTicketTypes: z.array(z.object({
    zoneKey: z.string(),
    ticketTypeId: z.string(),
    ticketType: z.object({ id: z.string(), name: z.string(), description: z.string().nullable().optional(), price: z.number() }),
  })).optional().default([]),
});
export type SeatmapResponse = z.infer<typeof SeatmapResponseSchema>;

export const AvailabilityResponseSchema = z.object({
  takenSeatIds: z.array(z.string()),
  heldSeatIds: z.array(z.string()),
  serverTime: z.string().optional(),
});
export type AvailabilityResponse = z.infer<typeof AvailabilityResponseSchema>;

export const SeatHoldResponseSchema = z.object({
  holdToken: z.string(),
  ttlSeconds: z.number(),
});
export type SeatHoldResponse = z.infer<typeof SeatHoldResponseSchema>;
