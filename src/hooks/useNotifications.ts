import { useEffect, useState } from "react";
import { notificationService } from "../config";
import type { Notification } from "../types";

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;
    const unsub = notificationService.subscribe(userId, (notifications) =>
      setNotifications(notifications),
    );
    return unsub;
  }, [userId]);

  const unread = notifications.filter((n) => !n.isRead);

  return {
    notifications,
    unread,
    unreadCount: unread.length,
    markAsRead: (notificationId: string) => notificationService.markAsRead(userId, notificationId),
    markAllAsRead: () => notificationService.markAllAsRead(userId),
  };
}
