import axios from "axios";
import { config } from "./config";
import { getUseMockData } from "./demo-mode";
import { http } from "./http";
import type { MembershipTier } from "./membership";
import { getMockBenefits, getMockExperiences } from "./mock-data";
import {
  getMockClubWithRelations,
  getMockNews,
  initMockNotifications,
  createMockAuthResponse,
  getMockProfile,
  setMockProfile,
  getMockOrders,
  getMockNotifications,
  markMockNotificationRead,
  getMockNotificationPrefs,
  setMockNotificationPrefs,
  delay,
} from "./mock-api-data";
import {
  AuthResponseSchema,
  BenefitSchema,
  ClubWithRelationsSchema,
  ClubSquadSchema,
  FanProfileSchema,
  ExperienceReservationSchema,
  ExperienceSchema,
  NewsArticleSchema,
  NewsListSchema,
  NotificationListSchema,
  NotificationPrefsSchema,
  NotificationSchema,
  OrderSchema,
  SeatmapResponseSchema,
  AvailabilityResponseSchema,
  SeatHoldResponseSchema,
  type AuthResponse,
  type Benefit,
  type ClubWithRelations,
  type ClubSquad,
  type FanProfile,
  type AppExperience,
  type ExperienceReservation,
  type NewsArticle,
  type NewsList,
  type NotificationList,
  type NotificationPrefs,
  type AppNotification,
  type Order,
  type SeatmapResponse,
  type AvailabilityResponse,
  type SeatHoldResponse,
} from "./schemas";

// ── Club ────────────────────────────────────────────────────────
export async function fetchClubBySlug(
  slug: string,
): Promise<ClubWithRelations> {
  if (getUseMockData()) {
    await delay(250);
    initMockNotifications(slug);
    return ClubWithRelationsSchema.parse(getMockClubWithRelations(slug));
  }
  const { data } = await http.get(`/public/clubs/${slug}`);
  // Some backends may (incorrectly) return an empty body or plain text.
  if (!data || typeof data !== "object") {
    throw new Error(`Club not found (slug: "${slug}")`);
  }
  return ClubWithRelationsSchema.parse(data);
}

export async function fetchClubNews(
  slug: string,
  params?: {
    category?: NewsArticle["category"];
    limit?: number;
    cursor?: string | number;
    offset?: number;
  },
): Promise<NewsList> {
  if (getUseMockData()) {
    await delay(250);
    const allNews = getMockNews(slug);
    const filtered = params?.category
      ? allNews.filter((item) => item.category === params.category)
      : allNews;
    const offset =
      params?.offset ?? (params?.cursor ? Number(params.cursor) : 0) ?? 0;
    const limit = params?.limit ?? filtered.length;
    const items = filtered.slice(offset, offset + limit);
    const nextCursor =
      offset + limit < filtered.length ? String(offset + limit) : null;
    return NewsListSchema.parse({ items, nextCursor });
  }

  const { data } = await http.get(`/public/clubs/${slug}/news`, { params });
  return NewsListSchema.parse(data);
}

export async function fetchClubNewsArticle(
  slug: string,
  articleId: string,
): Promise<NewsArticle> {
  if (getUseMockData()) {
    await delay(250);
    const article = getMockNews(slug).find((item) => item.id === articleId);
    if (!article) {
      throw new Error("News article not found");
    }
    return NewsArticleSchema.parse(article);
  }

  const { data } = await http.get(`/public/clubs/${slug}/news/${articleId}`);
  return NewsArticleSchema.parse(data);
}

export async function fetchClubSquad(slug: string): Promise<ClubSquad | null> {
  try {
    const { data } = await http.get(`/public/clubs/${slug}/squad`);
    if (data == null) {
      return null;
    }
    return ClubSquadSchema.parse(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchClubBenefits(
  slug: string,
  params?: { category?: string; tier?: string },
): Promise<Benefit[]> {
  if (getUseMockData()) {
    await delay(250);
    const filtered = getMockBenefits(slug).filter((benefit) => {
      if (params?.category && benefit.category !== params.category)
        return false;
      if (params?.tier && benefit.requiredTier !== params.tier) return false;
      return true;
    });
    return filtered.map((benefit) =>
      BenefitSchema.parse({
        ...benefit,
        location: benefit.location ?? null,
        expirationDate: benefit.expirationDate ?? null,
      }),
    );
  }

  const { data } = await http.get(`/public/clubs/${slug}/benefits`, { params });
  return (data as unknown[]).map((item) => BenefitSchema.parse(item));
}

export async function fetchClubBenefit(
  slug: string,
  benefitId: string,
): Promise<Benefit> {
  if (getUseMockData()) {
    await delay(250);
    const benefit = getMockBenefits(slug).find((item) => item.id === benefitId);
    if (!benefit) {
      throw new Error("Benefit not found");
    }
    return BenefitSchema.parse({
      ...benefit,
      location: benefit.location ?? null,
      expirationDate: benefit.expirationDate ?? null,
    });
  }

  const { data } = await http.get(
    `/public/clubs/${slug}/benefits/${benefitId}`,
  );
  return BenefitSchema.parse(data);
}

function normalizeMockExperience(
  experience: ReturnType<typeof getMockExperiences>[number],
) {
  return {
    ...experience,
    date: `${experience.date}T12:00:00.000Z`,
    time: experience.time,
    timeLabel: experience.time,
    image: experience.image,
    visualKey: experience.image,
  };
}

export async function fetchClubExperiences(
  slug: string,
): Promise<AppExperience[]> {
  if (getUseMockData()) {
    await delay(250);
    return getMockExperiences(slug).map((experience) =>
      ExperienceSchema.parse(normalizeMockExperience(experience)),
    );
  }

  const { data } = await http.get(`/public/clubs/${slug}/experiences`);
  return (data as unknown[]).map((item) => ExperienceSchema.parse(item));
}

export async function fetchClubExperience(
  slug: string,
  experienceId: string,
): Promise<AppExperience> {
  if (getUseMockData()) {
    await delay(250);
    const experience = getMockExperiences(slug).find(
      (item) => item.id === experienceId,
    );
    if (!experience) {
      throw new Error("Experience not found");
    }
    return ExperienceSchema.parse(normalizeMockExperience(experience));
  }

  const { data } = await http.get(
    `/public/clubs/${slug}/experiences/${experienceId}`,
  );
  return ExperienceSchema.parse(data);
}

export async function reserveExperience(
  slug: string,
  experienceId: string,
  body: {
    membershipTier: MembershipTier;
    name?: string;
  },
): Promise<ExperienceReservation> {
  if (getUseMockData()) {
    await delay(350);
    const experience = getMockExperiences(slug).find(
      (item) => item.id === experienceId,
    );
    if (!experience) {
      throw new Error("Experience not found");
    }
    if (experience.spotsRemaining <= 0) {
      throw new Error("This experience is sold out");
    }
    return ExperienceReservationSchema.parse({
      reservationId: `mock-res-${experienceId}`,
      status: "CONFIRMED",
      experienceId,
      spotsRemaining: Math.max(experience.spotsRemaining - 1, 0),
    });
  }

  const { data } = await http.post(
    `/public/clubs/${slug}/experiences/${experienceId}/reservations`,
    body,
  );
  return ExperienceReservationSchema.parse(data);
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
    const res = createMockAuthResponse(
      body.email,
      body.firstName,
      body.lastName,
    );
    return AuthResponseSchema.parse(res);
  }
  const { data } = await http.post("/public/fans/register-password", body);
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
  const { data } = await http.post("/public/fans/login-password", body);
  return AuthResponseSchema.parse(data);
}

// ── Profile ─────────────────────────────────────────────────────
export async function fetchProfile(): Promise<FanProfile> {
  if (getUseMockData()) {
    await delay(250);
    return FanProfileSchema.parse(getMockProfile());
  }
  const { data } = await http.get("/public/fans/me");
  return FanProfileSchema.parse(data);
}

export async function updateProfile(
  body: Partial<FanProfile>,
): Promise<FanProfile> {
  if (getUseMockData()) {
    await delay(300);
    setMockProfile(body);
    return FanProfileSchema.parse(getMockProfile());
  }
  const { data } = await http.patch("/public/fans/me", body);
  return FanProfileSchema.parse(data);
}

// ── Orders ──────────────────────────────────────────────────────
export async function fetchOrders(): Promise<Order[]> {
  if (getUseMockData()) {
    await delay(350);
    return getMockOrders(config.clubSlug).map((o) => OrderSchema.parse(o));
  }
  const { data } = await http.get("/public/fans/orders");
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
  const { data } = await http.get("/public/fans/notifications", { params });
  return NotificationListSchema.parse(data);
}

export async function markNotificationRead(
  id: string,
): Promise<AppNotification> {
  if (getUseMockData()) {
    await delay(200);
    const n = markMockNotificationRead(id);
    if (!n) throw new Error("Notification not found");
    return NotificationSchema.parse(n);
  }
  const { data } = await http.patch(`/public/fans/notifications/${id}/read`);
  return NotificationSchema.parse(data);
}

// ── Device tokens ───────────────────────────────────────────────
export async function registerDeviceToken(body: {
  token: string;
  platform: "IOS" | "ANDROID";
}): Promise<void> {
  if (getUseMockData()) return;
  await http.post("/public/fans/device-tokens", body);
}

export async function unregisterDeviceToken(body: {
  token: string;
}): Promise<void> {
  if (getUseMockData()) return;
  await http.delete("/public/fans/device-tokens", { data: body });
}

// ── Notification preferences ────────────────────────────────────
export async function fetchNotificationPrefs(): Promise<NotificationPrefs> {
  if (getUseMockData()) {
    await delay(200);
    return NotificationPrefsSchema.parse(getMockNotificationPrefs());
  }
  const { data } = await http.get("/public/fans/notification-preferences");
  return NotificationPrefsSchema.parse(data);
}

export async function updateNotificationPrefs(
  body: Partial<NotificationPrefs>,
): Promise<NotificationPrefs> {
  if (getUseMockData()) {
    await delay(200);
    setMockNotificationPrefs(body);
    return NotificationPrefsSchema.parse(getMockNotificationPrefs());
  }
  const { data } = await http.patch(
    "/public/fans/notification-preferences",
    body,
  );
  return NotificationPrefsSchema.parse(data);
}

// ── Seatmap & availability ─────────────────────────────────────
export async function getEventSeatMap(
  eventId: string,
): Promise<SeatmapResponse> {
  const { data } = await http.get(`/public/events/${eventId}/seatmap`);
  return SeatmapResponseSchema.parse(data);
}

export async function getEventAvailability(
  eventId: string,
): Promise<AvailabilityResponse> {
  const { data } = await http.get(`/public/events/${eventId}/availability`);
  return AvailabilityResponseSchema.parse(data);
}

// ── Seat holds ──────────────────────────────────────────────────
export async function createSeatHold(
  eventId: string,
  body: { seatIds: string[]; holdToken?: string },
): Promise<SeatHoldResponse> {
  const { data } = await http.post(
    `/public/events/${eventId}/seat-holds`,
    body,
  );
  return SeatHoldResponseSchema.parse(data);
}

export async function refreshSeatHold(
  holdToken: string,
): Promise<SeatHoldResponse> {
  const { data } = await http.post(`/public/seat-holds/${holdToken}/refresh`);
  return SeatHoldResponseSchema.parse(data);
}

export async function releaseSeatHold(holdToken: string): Promise<void> {
  await http.delete(`/public/seat-holds/${holdToken}`);
}

// ── Checkout ─────────────────────────────────────────────────────
export interface CheckoutItem {
  type: "TICKET" | "PRODUCT";
  refId: string;
  quantity: number;
  seatIds?: string[];
  attendeesBySeatId?: Record<
    string,
    { firstName: string; lastName: string; run: string }
  >;
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

export async function checkout(
  body: CheckoutBody,
  idempotencyKey?: string,
): Promise<unknown> {
  const headers = idempotencyKey
    ? { "Idempotency-Key": idempotencyKey }
    : undefined;
  const { data } = await http.post("/public/checkout", body, { headers });
  return data;
}

// ── Ticket QR URL (no API call; use in Image or WebView) ─────────
export function getTicketQrUrl(token: string): string {
  return `${config.apiBaseUrl}/public/ticket-qr?token=${encodeURIComponent(token)}`;
}
