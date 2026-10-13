import { getSession, clearSession } from "./session.js";

// Role yang diizinkan dalam aplikasi
export type AllowedRole = "admin" | "moderator" | "user";

// Memeriksa login dan hak akses pengguna
export function requireAuth(allowedRoles?: AllowedRole[]): void {
    const session = getSession();

    // Jika belum login, kembali ke halaman login
    if (!session || !session.token) {
        window.location.replace("login.html");
        return;
    }

    // Mengambil role pengguna
    const role = session.role.toLowerCase();

    // Memeriksa apakah role dikenali
    const validRoles: AllowedRole[] = [
        "admin",
        "moderator",
        "user"
    ];

    if (!validRoles.includes(role as AllowedRole)) {
        clearSession();
        window.location.replace("login.html");
        return;
    }

    // Memeriksa hak akses halaman
    if (allowedRoles && !allowedRoles.includes(role as AllowedRole)) {
        alert("Anda tidak memiliki akses ke halaman ini.");
        window.location.replace("login.html");
        return;
    }
}

// Logout dan kembali ke halaman login
export function logout(): void {
    clearSession();
    window.location.replace("login.html");
}