import { requireAuth } from "./auth-guard.js";
import { getJenisAntrian, issueTicket } from "./buat-antrian.js";
import type { Prioritas } from "./types.js";

requireAuth(["user"]);
const queueSelect = document.getElementById("jenis-pengunjung") as HTMLSelectElement;
const prioritySelect = document.getElementById("prioritas-pengunjung") as HTMLSelectElement;
const issueButton = document.getElementById("ambil-tiket") as HTMLButtonElement;
const message = document.getElementById("pesan-antrian") as HTMLParagraphElement;
const ticketCard = document.getElementById("tiket-hasil") as HTMLElement;
const ticketNumber = document.getElementById("nomor-hasil") as HTMLElement;
const ticketService = document.getElementById("layanan-hasil") as HTMLParagraphElement;
const ticketPriority = document.getElementById("prioritas-hasil") as HTMLParagraphElement;
const printButton = document.getElementById("cetak-tiket") as HTMLButtonElement;

function renderQueueOptions(): void {
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
        const priority = prioritySelect.value as Prioritas;
        const ticket = issueTicket(code, priority);
        const service = getJenisAntrian().find((item) => item.kode === code);
        if (!service) throw new Error("Layanan sudah tidak tersedia. Silakan pilih layanan lain.");
        ticketNumber.textContent = ticket.nomor;
        ticketService.textContent = service.nama;
        ticketPriority.textContent = `Prioritas: ${ticket.prioritas}`;
        ticketCard.hidden = false;
        message.textContent = "Tiket berhasil dibuat. Silakan cetak dan tunggu nomor Anda dipanggil.";
    } catch (error) {
        message.textContent = error instanceof Error ? error.message : "Tiket gagal dibuat. Silakan coba lagi.";
    }
});

printButton.addEventListener("click", () => window.print());

window.addEventListener("storage", (event) => {
    if (event.key === "jenisAntrian" || event.key === null) renderQueueOptions();
});

renderQueueOptions();
