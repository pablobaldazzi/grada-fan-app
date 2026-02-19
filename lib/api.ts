import { config } from './config';
import { getUseMockData } from './demo-mode';
import { http } from './http';
import {
  mockClubWithRelations,
  createMockAuthResponse,
  getMockProfile,
  setMockProfile,
  mockOrders,
  getMockNotifications,
  markMockNotificationRead,
  getMockNotificationPrefs,
  setMockNotificationPrefs,
  delay,
} from './mock-api-data';
import {
  AuthResponseSchema,
  ClubWithRelationsSchema,
  FanProfileSchema,
  NotificationListSchema,
  NotificationPrefsSchema,
  NotificationSchema,
  OrderSchema,
  SeatmapResponseSchema,
  AvailabilityResponseSchema,
  SeatHoldResponseSchema,
  type AuthResponse,
  type ClubWithRelations,
  type FanProfile,
  type NotificationList,
  type NotificationPrefs,
  type AppNotification,
  type Order,
  type SeatmapResponse,
  type AvailabilityResponse,
  type SeatHoldResponse,
} from './schemas';

// ── Club ────────────────────────────────────────────────────────
export async function fetchClubBySlug(slug: string): Promise<ClubWithRelations> {
  if (getUseMockData()) {
    await delay(250);
    return ClubWithRelationsSchema.parse(mockClubWithRelations);
  }
  const { data } = await http.get(`/public/clubs/${slug}`);
  // Some backends may (incorrectly) return an empty body or plain text.
  if (!data || typeof data !== 'object') {
    throw new Error(`Club not found (slug: "${slug}")`);
  }
  return ClubWithRelationsSchema.parse(data);
}

// ── Auth ────────────────────────────────────────────────────────
export async function registerPassword(body: {
  clubId: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}): Promise<AuthResponse> {
  if (getUseMockData()) {
    await delay(400);
    const res = createMockAuthResponse(body.email, body.firstName, body.lastName);
    return AuthResponseSchema.parse(res);
  }
  const { data } = await http.post('/public/fans/register-password', body);
  return AuthResponseSchema.parse(data);
}

export async function loginPassword(body: {
  clubId: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  if (getUseMockData()) {
    await delay(400);
    const res = createMockAuthResponse(body.email);
    return AuthResponseSchema.parse(res);
  }
  const { data } = await http.post('/public/fans/login-password', body);
  return AuthResponseSchema.parse(data);
}

// ── Profile ─────────────────────────────────────────────────────
export async function fetchProfile(): Promise<FanProfile> {
  if (getUseMockData()) {
    await delay(250);
    return FanProfileSchema.parse(getMockProfile());
  }
  const { data } = await http.get('/public/fans/me');
  return FanProfileSchema.parse(data);
}

export async function updateProfile(body: Partial<FanProfile>): Promise<FanProfile> {
  if (getUseMockData()) {
    await delay(300);
    setMockProfile(body);
    return FanProfileSchema.parse(getMockProfile());
  }
  const { data } = await http.patch('/public/fans/me', body);
  return FanProfileSchema.parse(data);
}

// ── Orders ──────────────────────────────────────────────────────
export async function fetchOrders(): Promise<Order[]> {
  if (getUseMockData()) {
    await delay(350);
    return mockOrders.map((o) => OrderSchema.parse(o));
  }
  const { data } = await http.get('/public/fans/orders');
  return (data as unknown[]).map((item) => OrderSchema.parse(item));
}

// ── Notifications ───────────────────────────────────────────────
export async function fetchNotifications(params?: {
  take?: number;
  cursor?: string;
}): Promise<NotificationList> {
  if (getUseMockData()) {
    await delay(300);
    const result = getMockNotifications(params?.take ?? 50);
    return NotificationListSchema.parse(result);
  }
  const { data } = await http.get('/public/fans/notifications', { params });
  return NotificationListSchema.parse(data);
}

export async function markNotificationRead(id: string): Promise<AppNotification> {
  if (getUseMockData()) {
    await delay(200);
    const n = markMockNotificationRead(id);
    if (!n) throw new Error('Notification not found');
    return NotificationSchema.parse(n);
  }
  const { data } = await http.patch(`/public/fans/notifications/${id}/read`);
  return NotificationSchema.parse(data);
}

// ── Device tokens ───────────────────────────────────────────────
export async function registerDeviceToken(body: {
  token: string;
  platform: 'IOS' | 'ANDROID';
}): Promise<void> {
  if (getUseMockData()) return;
  await http.post('/public/fans/device-tokens', body);
}

export async function unregisterDeviceToken(body: { token: string }): Promise<void> {
  if (getUseMockData()) return;
  await http.delete('/public/fans/device-tokens', { data: body });
}

// ── Notification preferences ────────────────────────────────────
export async function fetchNotificationPrefs(): Promise<NotificationPrefs> {
  if (getUseMockData()) {
    await delay(200);
    return NotificationPrefsSchema.parse(getMockNotificationPrefs());
  }
  const { data } = await http.get('/public/fans/notification-preferences');
  return NotificationPrefsSchema.parse(data);
}

export async function updateNotificationPrefs(body: Partial<NotificationPrefs>): Promise<NotificationPrefs> {
  if (getUseMockData()) {
    await delay(200);
    setMockNotificationPrefs(body);
    return NotificationPrefsSchema.parse(getMockNotificationPrefs());
  }
  const { data } = await http.patch('/public/fans/notification-preferences', body);
  return NotificationPrefsSchema.parse(data);
}

// ── Seatmap & availability ─────────────────────────────────────
export async function getEventSeatMap(eventId: string): Promise<SeatmapResponse> {
  const { data } = await http.get(`/public/events/${eventId}/seatmap`);
  return SeatmapResponseSchema.parse(data);
}

export async function getEventAvailability(eventId: string): Promise<AvailabilityResponse> {
  const { data } = await http.get(`/public/events/${eventId}/availability`);
  return AvailabilityResponseSchema.parse(data);
}

// ── Seat holds ──────────────────────────────────────────────────
export async function createSeatHold(
  eventId: string,
  body: { seatIds: string[]; holdToken?: string }
): Promise<SeatHoldResponse> {
  const { data } = await http.post(`/public/events/${eventId}/seat-holds`, body);
  return SeatHoldResponseSchema.parse(data);
}

export async function refreshSeatHold(holdToken: string): Promise<SeatHoldResponse> {
  const { data } = await http.post(`/public/seat-holds/${holdToken}/refresh`);
  return SeatHoldResponseSchema.parse(data);
}

export async function releaseSeatHold(holdToken: string): Promise<void> {
  await http.delete(`/public/seat-holds/${holdToken}`);
}

// ── Checkout ─────────────────────────────────────────────────────
export interface CheckoutItem {
  type: 'TICKET' | 'PRODUCT';
  refId: string;
  quantity: number;
  seatIds?: string[];
  attendeesBySeatId?: Record<string, { firstName: string; lastName: string; run: string }>;
  attendees?: { firstName: string; lastName: string; run: string }[];
}

export interface CheckoutBody {
  clubId: string;
  email: string;
  name?: string;
  items: CheckoutItem[];
  buyer?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    nationalId?: string;
    address1?: string;
    address2?: string;
    postalCode?: string;
    city?: string;
    region?: string;
    country?: string;
    marketingOptIn?: boolean;
  };
  holdToken?: string;
  discountCode?: string;
  discountIds?: string[];
}

export async function checkout(body: CheckoutBody, idempotencyKey?: string): Promise<unknown> {
  const headers = idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined;
  const { data } = await http.post('/public/checkout', body, { headers });
  return data;
}

// ── Ticket QR URL (no API call; use in Image or WebView) ─────────
export function getTicketQrUrl(token: string): string {
  return `${config.apiBaseUrl}/public/ticket-qr?token=${encodeURIComponent(token)}`;
}
