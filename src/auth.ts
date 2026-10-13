const API_URL = "https://dummyjson.com";

// Struktur data pengguna dari API
export interface AuthUser {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

// Struktur respons login
export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
}

// Struktur sesi pengguna
export interface AuthSession {
    token: string;
    user: AuthUser;
    role: string;
}

// Fungsi login
export async function loginUser(
    username: string,
    password: string
): Promise<AuthSession> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password,
            expiresInMins: 30
        })
    });

    // Memeriksa hasil login
    if (!response.ok) {
        if (response.status === 400) {
            throw new Error("Username atau password salah.");
        }

        throw new Error("Login gagal. Silakan coba lagi.");
    }

    const authData: AuthResponse = await response.json();

    // Mengambil informasi pengguna
    const userResponse = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${authData.accessToken}`
        }
    });

    if (!userResponse.ok) {
        throw new Error("Gagal mengambil data pengguna.");
    }

    const user: AuthUser = await userResponse.json();

    // Memeriksa role pengguna
    const role = user.role?.toLowerCase();

    if (!role || !["admin", "moderator", "user"].includes(role)) {
        throw new Error("Role pengguna tidak dikenali.");
    }

    // Mengembalikan data sesi
    return {
        token: authData.accessToken,
        user,
        role
    };
}