import type { User } from "../types";

export default class UserManager {
    public static GetUser(): User {
        return { id: 0, name: "Adam", surname: "Kowalski" }
    }
}