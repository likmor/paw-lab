import { useEffect, useState } from "react";
import { notificationService } from "../services/notificationService";
import type { Notification } from "../types";

export function useNotifications(userId: number) {
  const [notifications, setNotifications] = useState<Notification[]>(
    notificationService.getForUser(userId),
  );

  useEffect(() => {
    const unsub = notificationService.subscribe(
      (
        all, //subscribe -> receive notifications -> filter and set state
      ) => setNotifications(all.filter((n) => n.recipientId === userId)),
    );
    return unsub;
  }, [userId]);

  const unread = notifications.filter((n) => !n.isRead);

  return {
    notifications,
    unread,
    unreadCount: unread.length,
    markAsRead: (id: number) => notificationService.markAsRead(id),
    markAllAsRead: () => notificationService.markAllAsRead(userId),
  };
}
