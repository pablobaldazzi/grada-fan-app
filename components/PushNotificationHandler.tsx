import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

/**
 * Handles push notification taps - navigates to the appropriate screen
 * based on the notification data payload.
 */
export function PushNotificationHandler() {
  const subscriptionRef = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    subscriptionRef.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as
        | { kind?: string; eventId?: string; refId?: string }
        | undefined;

      if (!data?.kind) return;

      if (data.kind === "new-match" && data.eventId) {
        router.push({ pathname: "/match-tickets", params: { matchId: data.eventId } });
        return;
      }
      if (data.kind === "new-benefit" && data.refId) {
        router.push({ pathname: "/benefit-detail", params: { benefitId: data.refId } });
        return;
      }
      if (data.kind === "promo") {
        router.push("/(tabs)/store");
      }
    });

    return () => {
      if (subscriptionRef.current) {
        Notifications.removeNotificationSubscription(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, []);

  return null;
}
