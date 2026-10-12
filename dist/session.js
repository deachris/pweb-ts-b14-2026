// Nama key untuk menyimpan sesi di localStorage
const SESSION_KEY = "authSession";
// Menyimpan sesi pengguna
export function saveSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
// Membaca dan memeriksa format sesi
export function getSession() {
    try {
        const data = localStorage.getItem(SESSION_KEY);
        if (!data) {
            return null;
        }
        const session = JSON.parse(data);
        if (typeof session !== "object" || session === null || !("token" in session) || !("role" in session) ||
            !("user" in session) || typeof session.token !== "string" || typeof session.role !== "string") {
            return null;
        }
        return session;
    }
    catch {
        return null;
    }
}
// Memeriksa apakah sesi tersedia
export function isLoggedIn() {
    return getSession() !== null;
}
// Menghapus sesi pengguna
export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}
