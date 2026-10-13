// Key untuk menyimpan sesi di Local Storage
const SESSION_KEY = "authSession";
// Menyimpan sesi pengguna
export function saveSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
// Mengambil dan memvalidasi sesi pengguna
export function getSession() {
    try {
        const data = localStorage.getItem(SESSION_KEY);
        if (!data) {
            return null;
        }
        const session = JSON.parse(data);
        if (typeof session !== "object" ||
            session === null ||
            !("token" in session) ||
            !("role" in session) ||
            !("user" in session) ||
            typeof session.token !== "string" ||
            typeof session.role !== "string") {
            return null;
        }
        // Memastikan role sesuai dengan yang diizinkan
        if (!["admin", "moderator", "user"].includes(session.role)) {
            return null;
        }
        return session;
    }
    catch {
        return null;
    }
}
// Memeriksa apakah pengguna sudah login
export function isLoggedIn() {
    return getSession() !== null;
}
// Menghapus sesi saat logout
export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}
