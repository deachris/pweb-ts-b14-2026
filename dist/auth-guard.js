import { getSession, clearSession } from "./session.js";
// Memeriksa login dan hak akses pengguna
export function requireAuth(allowedRoles) {
    const session = getSession();
    // Jika belum login, kembali ke halaman login
    if (!session || !session.token) {
        window.location.replace("login.html");
        return;
    }
    // Mengambil role pengguna
    const role = session.role.toLowerCase();
    // Memeriksa apakah role dikenali
    const validRoles = [
        "admin",
        "moderator",
        "user"
    ];
    if (!validRoles.includes(role)) {
        clearSession();
        window.location.replace("login.html");
        return;
    }
    // Memeriksa hak akses halaman
    if (allowedRoles && !allowedRoles.includes(role)) {
        alert("Anda tidak memiliki akses ke halaman ini.");
        window.location.replace("login.html");
        return;
    }
}
// Logout dan kembali ke halaman login
export function logout() {
    clearSession();
    window.location.replace("login.html");
}
