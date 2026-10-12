import { getSession, clearSession } from "./session.js";

export type AllowedRole = "admin" | "moderator" | "user";

export function requireAuth(allowedRoles?: AllowedRole[]): void {
    const session = getSession();

    // Jika belum login, arahkan ke halaman login
    if (!session || !session.token) {
        window.location.replace("login.html");
        return;
    }

    // Periksa role pengguna
    const role = session.role.toLowerCase();

    if (!["admin", "moderator", "user"].includes(role) ||
        (allowedRoles && !allowedRoles.includes(role as AllowedRole))
    ) {
        alert("Anda tidak memiliki akses ke halaman ini.");
        window.location.replace("login.html");
    }
}

// Logout dan kembali ke halaman login
export function logout(): void {
    clearSession();
    window.location.replace("login.html");
}
