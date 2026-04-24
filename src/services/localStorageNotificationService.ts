import type { Notification, NotificationModel } from "../types";

const NOTIFICATIONS_KEY = "notifications";


export class LocalStorageNotificationService {
  private listeners = new Map<string,(notifications: Notification[]) => void>();

  private load(): Notification[] {
    try {
      return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) ?? "[]");
    } catch {
      return [];
    }
  }

  private save(notifications: Notification[]) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    this.listeners.forEach((cb, user) => cb(notifications.filter((n) => n.recipientId === user)));
  }

  subscribe(userId: string, listener: (notifications: Notification[]) => void) {
    this.listeners.set(userId, listener);
    this.save([...this.load()]);
    return () => {
      this.listeners.delete(userId);
    };
  }

  public send(model: NotificationModel): Notification {
    const notifications = this.load();
    const notification: Notification = {
      ...model,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isRead: false,
    };
    this.save([...notifications, notification]);
    return notification;
  }

  markAsRead(userId: string | undefined, notificationId: string) {
    if (!userId) return;
    this.save(
      this.load().map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    );
  }

  markAllAsRead(userId: string | undefined) {
    if (!userId) return;
    this.save(
      this.load().map((n) =>
        n.recipientId === userId ? { ...n, isRead: true } : n,
      ),
    );
  }
}
