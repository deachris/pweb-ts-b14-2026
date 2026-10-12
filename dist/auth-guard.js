import { getSession, clearSession } from "./session.js";
export function requireAuth(allowedRoles) {
    const session = getSession();
    // Jika belum login, arahkan ke halaman login
    if (!session || !session.token) {
        window.location.replace("login.html");
        return;
    }
    // Periksa role pengguna
    const role = session.role.toLowerCase();
    if (!["admin", "moderator", "user"].includes(role) ||
        (allowedRoles && !allowedRoles.includes(role))) {
        alert("Anda tidak memiliki akses ke halaman ini.");
        window.location.replace("login.html");
    }
}
// Logout dan kembali ke halaman login
export function logout() {
    clearSession();
    window.location.replace("login.html");
}
