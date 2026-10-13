import { requireAuth } from "./auth-guard.js";
import { getJenisAntrian, issueTicket } from "./buat-antrian.js";
<<<<<<< HEAD
requireAuth(["user"]);
=======
import { requireAuth } from "./auth-guard.js";
requireAuth(["admin", "moderator", "user"]);
>>>>>>> 1a2cd64dc3b8a1e0e011c9471b35c3e666310c61
const queueSelect = document.getElementById("jenis-pengunjung");
const prioritySelect = document.getElementById("prioritas-pengunjung");
const issueButton = document.getElementById("ambil-tiket");
const message = document.getElementById("pesan-antrian");
const ticketCard = document.getElementById("tiket-hasil");
const ticketNumber = document.getElementById("nomor-hasil");
const ticketService = document.getElementById("layanan-hasil");
const ticketPriority = document.getElementById("prioritas-hasil");
const printButton = document.getElementById("cetak-tiket");
function renderQueueOptions() {
    const currentValue = queueSelect.value;
    const activeTypes = getJenisAntrian().filter((item) => item.aktif);
    queueSelect.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = activeTypes.length ? "Pilih layanan" : "Belum ada layanan aktif";
    queueSelect.append(placeholder);
    for (const item of activeTypes) {
        const option = document.createElement("option");
        option.value = item.kode;
        option.textContent = `${item.nama} (${item.kode})`;
        queueSelect.append(option);
    }
    if (activeTypes.some((item) => item.kode === currentValue)) {
        queueSelect.value = currentValue;
    }
    queueSelect.disabled = activeTypes.length === 0;
    issueButton.disabled = activeTypes.length === 0;
}
issueButton.addEventListener("click", () => {
    const code = queueSelect.value;
    if (!code) {
        message.textContent = "Pilih layanan terlebih dahulu.";
        return;
    }
    try {
        const priority = prioritySelect.value;
        const ticket = issueTicket(code, priority);
        const service = getJenisAntrian().find((item) => item.kode === code);
        if (!service)
            throw new Error("Layanan sudah tidak tersedia. Silakan pilih layanan lain.");
        ticketNumber.textContent = ticket.nomor;
        ticketService.textContent = service.nama;
        ticketPriority.textContent = `Prioritas: ${ticket.prioritas}`;
        ticketCard.hidden = false;
        message.textContent = "Tiket berhasil dibuat. Silakan cetak dan tunggu nomor Anda dipanggil.";
    }
    catch (error) {
        message.textContent = error instanceof Error ? error.message : "Tiket gagal dibuat. Silakan coba lagi.";
    }
});
printButton.addEventListener("click", () => window.print());
window.addEventListener("storage", (event) => {
    if (event.key === "jenisAntrian" || event.key === null)
        renderQueueOptions();
});
renderQueueOptions();
