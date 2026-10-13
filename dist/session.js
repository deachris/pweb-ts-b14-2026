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
<<<<<<< HEAD
=======
        // Memeriksa struktur sesi
>>>>>>> 1a2cd64dc3b8a1e0e011c9471b35c3e666310c61
        if (typeof session !== "object" ||
            session === null ||
            !("token" in session) ||
            !("role" in session) ||
            !("user" in session) ||
            typeof session.token !== "string" ||
<<<<<<< HEAD
            typeof session.role !== "string") {
            return null;
        }
        // Memastikan role sesuai dengan yang diizinkan
        if (!["admin", "moderator", "user"].includes(session.role)) {
=======
            !session.token.trim() ||
            typeof session.role !== "string" ||
            typeof session.user !== "object" ||
            session.user === null) {
>>>>>>> 1a2cd64dc3b8a1e0e011c9471b35c3e666310c61
            return null;
        }
        // Memastikan role sesuai dengan yang diizinkan
        const role = session.role.toLowerCase();
        if (!["admin", "moderator", "user"].includes(role)) {
            return null;
        }
        // Mengembalikan sesi yang valid
        return {
            ...session,
            role
        };
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
