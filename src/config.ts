import { LocalStorageApi } from "./api/localStorageApi";
import { FirestoreApi } from "./api/firestoreApi";
import { FirestoreNotificationService } from "./services/firestoreNotificationService";
import { LocalStorageNotificationService } from "./services/localStorageNotificationService";
import type { AppApi } from "./api/api";

export const config = {
  adminEmail: "dgoyman13@gmail.com",
  storage: "firestore" as "localStorage" | "firestore",
};

export const api: AppApi =
  config.storage === "firestore" ? new FirestoreApi() : new LocalStorageApi();

export const notificationService =
  config.storage === "firestore"
    ? new FirestoreNotificationService()
    : new LocalStorageNotificationService();
