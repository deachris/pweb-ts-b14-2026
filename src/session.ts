import type { AuthSession } from "./auth.js";

// Nama key untuk menyimpan sesi di localStorage
const SESSION_KEY = "authSession";

// Menyimpan sesi pengguna
export function saveSession(session: AuthSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Membaca dan memeriksa format sesi
export function getSession(): AuthSession | null {
    try {
        const data = localStorage.getItem(SESSION_KEY);

        if (!data) {
            return null;
        }

        const session: unknown = JSON.parse(data);

        if (typeof session !== "object" || session === null || !("token" in session) || !("role" in session) || 
            !("user" in session) || typeof session.token !== "string" || typeof session.role !== "string") {
            return null;
        }
        return session as AuthSession;
    } 
    catch {
        return null;
    }
}

// Memeriksa apakah sesi tersedia
export function isLoggedIn(): boolean {
    return getSession() !== null;
}

// Menghapus sesi pengguna
export function clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
}
