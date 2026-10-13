import { requireAuth, logout } from "./auth-guard.js";
import { getSession } from "./session.js";
import { getJenisAntrian, getTickets, updateTicketStatus } from "./buat-antrian.js";
// Halaman operator hanya dapat diakses admin atau moderator.
requireAuth(["admin", "moderator"]);
const currentNumber = document.getElementById("current-number");
const currentService = document.getElementById("current-service");
const currentPriority = document.getElementById("current-priority");
const nextList = document.getElementById("next-list");
const statusMessage = document.getElementById("operator-message");
const callNextButton = document.getElementById("call-next");
const skipButton = document.getElementById("skip-current");
const doneButton = document.getElementById("finish-current");
const logoutButton = document.getElementById("operator-logout");
// Memastikan sesi tersedia sebelum halaman digunakan.
getSession();
const priorityOrder = {
    VIP: 0,
    Disabilitas: 1,
    Lansia: 2,
    Normal: 3
};
function getWaitingTickets() {
    return getTickets()
        .filter((ticket) => ticket.status === "menunggu")
        .sort((a, b) => {
        const priorityDifference = priorityOrder[a.prioritas] - priorityOrder[b.prioritas];
        if (priorityDifference !== 0)
            return priorityDifference;
        return new Date(a.dibuatPada).getTime() - new Date(b.dibuatPada).getTime();
    });
}
function getCurrentTicket() {
    return getTickets().find((ticket) => ticket.status === "dipanggil");
}
function getServiceName(kode) {
    return getJenisAntrian().find((jenis) => jenis.kode === kode)?.nama ?? `Layanan ${kode}`;
}
function render() {
    const current = getCurrentTicket();
    const waiting = getWaitingTickets();
    if (current) {
        currentNumber.textContent = current.nomor;
        currentService.textContent = getServiceName(current.kodeAntrian);
        currentPriority.textContent = `Prioritas: ${current.prioritas}`;
        skipButton.disabled = false;
        doneButton.disabled = false;
    }
    else {
        currentNumber.textContent = "—";
        currentService.textContent = "Belum ada antrean yang dipanggil.";
        currentPriority.textContent = "Tidak ada tiket aktif.";
        skipButton.disabled = true;
        doneButton.disabled = true;
    }
    callNextButton.disabled = waiting.length === 0;
    nextList.replaceChildren();
    if (waiting.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "Tidak ada antrean yang menunggu.";
        nextList.append(empty);
        return;
    }
    for (const ticket of waiting) {
        const row = document.createElement("p");
        row.textContent = `${ticket.nomor} - ${getServiceName(ticket.kodeAntrian)} - ${ticket.prioritas}`;
        nextList.append(row);
    }
}
function setStatus(nomor, status) {
    updateTicketStatus(nomor, status);
}
callNextButton.addEventListener("click", () => {
    try {
        const waiting = getWaitingTickets();
        if (waiting.length === 0) {
            statusMessage.textContent = "Tidak ada antrean yang menunggu.";
            render();
            return;
        }
        // Tiket aktif sebelumnya diselesaikan sebelum tiket berikutnya dipanggil.
        const current = getCurrentTicket();
        if (current)
            setStatus(current.nomor, "selesai");
        setStatus(waiting[0].nomor, "dipanggil");
        statusMessage.textContent = `Memanggil nomor ${waiting[0].nomor}.`;
        render();
    }
    catch (error) {
        statusMessage.textContent = error instanceof Error ? error.message : "Gagal memanggil antrean.";
    }
});
skipButton.addEventListener("click", () => {
    const current = getCurrentTicket();
    if (!current)
        return;
    try {
        setStatus(current.nomor, "dilewati");
        statusMessage.textContent = `Nomor ${current.nomor} dilewati.`;
        render();
    }
    catch (error) {
        statusMessage.textContent = error instanceof Error ? error.message : "Gagal melewati tiket.";
    }
});
doneButton.addEventListener("click", () => {
    const current = getCurrentTicket();
    if (!current)
        return;
    try {
        setStatus(current.nomor, "selesai");
        statusMessage.textContent = `Nomor ${current.nomor} selesai.`;
        render();
    }
    catch (error) {
        statusMessage.textContent = error instanceof Error ? error.message : "Gagal menyelesaikan tiket.";
    }
});
logoutButton.addEventListener("click", logout);
window.addEventListener("storage", (event) => {
    if (["jenisAntrian", "tiketAntrian", "nomorAntrian"].includes(event.key ?? "")) {
        render();
    }
});
render();
