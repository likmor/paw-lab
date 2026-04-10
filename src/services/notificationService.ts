import type { Notification, NotificationModel } from "../types";

const NOTIFICATIONS_KEY = "notifications";

type Listener = (notifications: Notification[]) => void;

class NotificationService {
  private listeners = new Set<Listener>();

  private load(): Notification[] {
    try {
      return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) ?? "[]");
    } catch {
      return [];
    }
  }

  private save(notifications: Notification[]) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    this.listeners.forEach((l) => l(notifications));
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getForUser(userId: number) {
    return this.load().filter((n) => n.recipientId === userId);
  }

  send(model: NotificationModel): Notification {
    const notifications = this.load();
    const notification: Notification = {
      ...model,
      id: Date.now(),
      date: new Date().toISOString(),
      isRead: false,
    };
    this.save([...notifications, notification]);
    return notification;
  }

  markAsRead(id: number) {
    this.save(
      this.load().map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }

  markAllAsRead(userId: number) {
    this.save(
      this.load().map((n) =>
        n.recipientId === userId ? { ...n, isRead: true } : n,
      ),
    );
  }
}

export const notificationService = new NotificationService();
