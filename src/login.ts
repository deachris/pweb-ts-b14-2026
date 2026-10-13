import { loginUser } from "./auth.js";
import { saveSession } from "./session.js";

// Mengambil elemen dari HTML
const loginForm = document.getElementById("loginForm") as HTMLFormElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const errorMessage = document.getElementById("errorMessage") as HTMLParagraphElement;

// Memastikan elemen HTML ditemukan
if (!loginForm || !usernameInput || !passwordInput || !loginBtn || !errorMessage) {
    throw new Error("Elemen form login tidak ditemukan.");
}

// Pengiriman form
loginForm.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    errorMessage.textContent = "";

    // Validasi input
    if (!username || !password) {
        errorMessage.textContent = "Username dan password wajib diisi.";
        return;
    }

    // Indikator loading
    loginBtn.disabled = true;
    loginBtn.textContent = "Memverifikasi...";
    errorMessage.textContent = "Sedang memverifikasi login...";

    try {
        // Memverifikasi akun melalui API
        const session = await loginUser(username, password);

        // Menyimpan sesi pengguna
        saveSession(session);

        // Mengarahkan pengguna sesuai role
        if (session.role === "admin" || session.role === "moderator") {
            window.location.replace("index.html");
        } else if (session.role === "user") {
            window.location.replace("ambil-antrian.html");
        } else {
            errorMessage.textContent = "Role akun tidak dikenali.";
        }
    } catch (error: unknown) {
        // Menangani kesalahan login dan koneksi
        if (error instanceof TypeError) {
            errorMessage.textContent =
                "Tidak dapat terhubung ke server. Periksa koneksi internet.";
        } else if (error instanceof Error) {
            errorMessage.textContent = error.message;
        } else {
            errorMessage.textContent =
                "Terjadi kesalahan. Silakan coba lagi.";
        }
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Masuk";
    }
});
