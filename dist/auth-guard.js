import { getSession, clearSession } from "./session.js";
// Memeriksa login dan hak akses pengguna
export function requireAuth(allowedRoles) {
    const session = getSession();
<<<<<<< HEAD
    // Jika belum login, kembali ke halaman login
=======
    // Jika sesi atau token tidak tersedia, kembali ke login
>>>>>>> 1a2cd64dc3b8a1e0e011c9471b35c3e666310c61
    if (!session || !session.token) {
        window.location.replace("login.html");
        return;
    }
    // Mengambil role pengguna
    const role = session.role.toLowerCase();
<<<<<<< HEAD
    // Memeriksa apakah role dikenali
=======
    // Memeriksa role yang diizinkan
>>>>>>> 1a2cd64dc3b8a1e0e011c9471b35c3e666310c61
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
