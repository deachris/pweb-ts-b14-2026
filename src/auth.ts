const API_URL = "https://dummyjson.com";

// Struktur data pengguna yang diterima dari API
export interface AuthUser {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

// Struktur respons saat login
export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
}

// Data sesi yang digunakan aplikasi
export interface AuthSession {
    token: string;
    user: AuthUser;
    role: string;
}

// Mengirim username dan password ke API
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

    // Gagal login
    if (!response.ok) {
        if (response.status === 400) {
            throw new Error("Username atau password salah.");
        }
        throw new Error("Login gagal. Silakan coba lagi.");
    }

    const authData: AuthResponse = await response.json();

    // Mengambil informasi pengguna menggunakan token
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

    // Memastikan API memberikan role
    if (!user.role) {
        throw new Error("Role pengguna tidak tersedia dari API.");
    }

    const role = user.role.toLowerCase();

    // Membatasi role yang dikenal aplikasi
    if (!["admin", "moderator", "user"].includes(role)) {
        throw new Error("Role pengguna tidak dikenali.");
    }

    return {
        token: authData.accessToken, user, role
    };
}
