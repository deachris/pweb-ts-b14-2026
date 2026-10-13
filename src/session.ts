import type { AuthSession } from "./auth.js";

// Key untuk menyimpan sesi di Local Storage
const SESSION_KEY = "authSession";

// Menyimpan sesi pengguna
export function saveSession(session: AuthSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Mengambil dan memvalidasi sesi pengguna
export function getSession(): AuthSession | null {
    try {
        const data = localStorage.getItem(SESSION_KEY);

        if (!data) {
            return null;
        }

        const session: unknown = JSON.parse(data);

        if (
            typeof session !== "object" ||
            session === null ||
            !("token" in session) ||
            !("role" in session) ||
            !("user" in session) ||
            typeof session.token !== "string" ||
            typeof session.role !== "string"
        ) {
            return null;
        }

        // Memastikan role sesuai dengan yang diizinkan
        if (!["admin", "moderator", "user"].includes(session.role as string)) {
            return null;
        }

        return session as AuthSession;
    } catch {
        return null;
    }
}

// Memeriksa apakah pengguna sudah login
export function isLoggedIn(): boolean {
    return getSession() !== null;
}

// Menghapus sesi saat logout
export function clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
}
