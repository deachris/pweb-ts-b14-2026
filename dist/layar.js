import { requireAuth, logout } from "./auth-guard.js";
import { getJenisAntrian, getTickets } from "./buat-antrian.js";
// User, admin, dan moderator yang sudah login boleh melihat layar antrean.
requireAuth(["user", "admin", "moderator"]);
const queueCards = document.getElementById("queue-cards");
const calledNumber = document.getElementById("screen-current-number");
const calledService = document.getElementById("screen-current-service");
const fullscreenButton = document.getElementById("fullscreen-toggle");
const logoutButton = document.getElementById("screen-logout");
function getCurrentTickets() {
    return getTickets()
        .filter((ticket) => ticket.status === "dipanggil")
        .sort((a, b) => new Date(b.dibuatPada).getTime() - new Date(a.dibuatPada).getTime());
}
function render() {
    const jenis = getJenisAntrian().filter((item) => item.aktif);
    const tickets = getTickets();
    const current = getCurrentTickets()[0];
    calledNumber.textContent = current?.nomor ?? "—";
    calledService.textContent = current
        ? (jenis.find((item) => item.kode === current.kodeAntrian)?.nama ?? `Layanan ${current.kodeAntrian}`)
        : "Belum ada nomor yang dipanggil.";
    queueCards.replaceChildren();
    if (jenis.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "Belum ada jenis antrean yang aktif.";
        queueCards.append(empty);
        return;
    }
    for (const item of jenis) {
        const active = tickets.find((ticket) => ticket.kodeAntrian === item.kode && ticket.status === "dipanggil");
        const waitingCount = tickets.filter((ticket) => ticket.kodeAntrian === item.kode && ticket.status === "menunggu").length;
        const card = document.createElement("article");
        card.className = "queue-card";
        const title = document.createElement("h3");
        title.textContent = `${item.kode} - ${item.nama}`;
        const number = document.createElement("p");
        number.textContent = `Nomor dipanggil: ${active?.nomor ?? "—"}`;
        const waiting = document.createElement("p");
        waiting.textContent = `Antrean tersisa: ${waitingCount}`;
        card.append(title, number, waiting);
        queueCards.append(card);
    }
}
fullscreenButton.addEventListener("click", async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        }
        else {
            await document.exitFullscreen();
        }
    }
    catch {
        // Tidak melakukan apa pun jika browser tidak mengizinkan fullscreen.
    }
});
document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement ? "Keluar Layar Penuh" : "Layar Penuh";
});
logoutButton.addEventListener("click", logout);
// Polling memperbarui data tanpa memuat ulang halaman.
render();
window.setInterval(render, 2500);
window.addEventListener("storage", (event) => {
    if (["jenisAntrian", "tiketAntrian", "nomorAntrian"].includes(event.key ?? "")) {
        render();
    }
});
