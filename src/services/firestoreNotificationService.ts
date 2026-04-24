import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../api/firebase";
import type { Notification, NotificationModel } from "../types";

export class FirestoreNotificationService {
  async send(model: NotificationModel) {
    const ref = await addDoc(
      collection(db, "users", model.recipientId, "notifications"),
      {
        ...model,
        date: new Date().toISOString(),
        isRead: false,
      },
    );

    // await setDoc(ref, {
    //   ...model,
    //   date: new Date().toISOString(),
    //   isRead: false,
    // });
  }

  async markAsRead(userId: string | undefined, notificationId: string) {
    if (!userId) return;

    await updateDoc(doc(db, "users", userId, "notifications", notificationId), {
      isRead: true,
    });
  }

  async markAllAsRead(userId: string | undefined) {
    if (!userId) return;
    const ref = collection(db, "users", userId, "notifications");

    const snapshot = await getDocs(ref);
    const updates = snapshot.docs.map((d) =>
      updateDoc(d.ref, { isRead: true }),
    );

    await Promise.all(updates);
  }

  subscribe(userId: string, cb: (n: Notification[]) => void) {
    const q = collection(db, "users", userId, "notifications");
    return onSnapshot(q, (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Notification));
    });
  }
}
