import { loginUser } from "./auth.js";
import { saveSession } from "./session.js";
// Mengambil elemen dari HTML
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorMessage = document.getElementById("errorMessage");
// Memastikan elemen HTML ditemukan
if (!loginForm || !usernameInput || !passwordInput || !loginBtn || !errorMessage) {
    throw new Error("Elemen form login tidak ditemukan.");
}
// Pengiriman form
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    // Mengambil nilai input
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
        // Meminta API memverifikasi akun
        const session = await loginUser(username, password);
        // Menyimpan sesi pengguna
        saveSession(session);
        // Mengarahkan pengguna sesuai role
        if (session.role === "admin" || session.role === "moderator") {
            window.location.replace("index.html");
        }
        else if (session.role === "user") {
            window.location.replace("operator.html");
        }
        else {
            errorMessage.textContent = "Role akun tidak dikenali.";
        }
    }
    catch (error) {
        // Menampilkan pesan jika login gagal
        if (error instanceof TypeError) {
            errorMessage.textContent =
                "Tidak dapat terhubung ke server. Periksa koneksi internet.";
        }
        else if (error instanceof Error) {
            errorMessage.textContent = error.message;
        }
        else {
            errorMessage.textContent =
                "Terjadi kesalahan. Silakan coba lagi.";
        }
    }
    finally {
        // Mengembalikan tombol ke kondisi awal
        loginBtn.disabled = false;
        loginBtn.textContent = "Masuk";
    }
});
