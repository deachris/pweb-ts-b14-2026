const API_URL = "https://dummyjson.com";
// Fungsi login
export async function loginUser(username, password) {
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
    const authData = await response.json();
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
    const user = await userResponse.json();
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
