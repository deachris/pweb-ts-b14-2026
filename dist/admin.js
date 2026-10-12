import { logout } from "./auth-guard.js";
import { issueTicket, getJenisAntrian, getTickets, resetQueue, saveJenisAntrian, updateTicketStatus } from "./buat-antrian.js";
import { getSession } from "./session.js";
const jenisForm = document.getElementById("form-jenis-antrian");
const kodeInput = document.getElementById("kode-antrian");
const namaInput = document.getElementById("nama-antrian");
const jenisList = document.getElementById("list-jenis-antrian");
const ticketForm = document.getElementById("form-terbitkan-tiket");
const ticketType = document.getElementById("jenis-tiket");
const ticketPriority = document.getElementById("prioritas-tiket");
const ticketList = document.getElementById("list-tiket");
const logoutButton = document.getElementById("logout-button");
const resetButton = document.getElementById("reset-antrian");
const activeUserGreeting = document.getElementById("active-user-greeting");
const activeUser = getSession()?.user;
const firstName = typeof activeUser?.firstName === "string" ? activeUser.firstName.trim() : "";
const username = typeof activeUser?.username === "string" ? activeUser.username.trim() : "";
activeUserGreeting.textContent = `Halo, ${firstName || username || "Pengguna"}`;
jenisForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const kode = kodeInput.value.trim().toUpperCase();
    const nama = namaInput.value.trim();
    if (!/^[A-Z]$/.test(kode)) {
        alert("Kode antrean harus tepat satu huruf kapital.");
        kodeInput.focus();
        return;
    }
    const jenis = getJenisAntrian();
    if (jenis.some((item) => item.kode.toUpperCase() === kode ||
        item.nama.trim().toLocaleLowerCase() === nama.toLocaleLowerCase())) {
        alert("Kode atau nama layanan sudah digunakan.");
        return;
    }
    jenis.push({ kode, nama, aktif: true });
    saveJenisAntrian(jenis);
    jenisForm.reset();
    render();
});
ticketForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const kode = ticketType.value;
    const priority = ticketPriority.value;
    if (!kode) {
        alert("Tambahkan dan aktifkan jenis antrean terlebih dahulu.");
        return;
    }
    try {
        issueTicket(kode, priority);
        render();
    }
    catch (error) {
        alert(error instanceof Error ? error.message : "Tiket gagal diterbitkan.");
    }
});
resetButton.addEventListener("click", () => {
    if (!confirm("Reset semua nomor dan riwayat tiket antrean? Tindakan ini tidak dapat dibatalkan.")) {
        return;
    }
    resetQueue();
    render();
});
logoutButton.addEventListener("click", logout);
function renderJenisAntrian(jenis, tickets) {
    jenisList.replaceChildren();
    if (jenis.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Belum ada jenis antrean. Tambahkan layanan pertama Anda.";
        jenisList.append(empty);
        return;
    }
    for (const item of jenis) {
        const row = document.createElement("article");
        row.className = "queue-type-row";
        const description = document.createElement("div");
        description.className = "queue-type-description";
        const title = document.createElement("strong");
        title.textContent = item.nama;
        const code = document.createElement("span");
        code.className = "queue-code";
        code.textContent = `(${item.kode})`;
        const waiting = document.createElement("span");
        waiting.className = "waiting-count";
        const count = tickets.filter((ticket) => ticket.kodeAntrian === item.kode && ticket.status === "menunggu").length;
        waiting.textContent = `${count} menunggu`;
        description.append(title, code, waiting);
        const actions = document.createElement("div");
        actions.className = "row-actions";
        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "button button-small button-secondary";
        toggleButton.textContent = item.aktif ? "Nonaktifkan" : "Aktifkan";
        toggleButton.setAttribute("aria-label", `${item.aktif ? "Nonaktifkan" : "Aktifkan"} ${item.nama}`);
        toggleButton.addEventListener("click", () => {
            const current = getJenisAntrian();
            const target = current.find((entry) => entry.kode === item.kode);
            if (!target)
                return;
            target.aktif = !target.aktif;
            saveJenisAntrian(current);
            render();
        });
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "button button-small button-danger";
        deleteButton.textContent = "Hapus";
        deleteButton.setAttribute("aria-label", `Hapus ${item.nama}`);
        deleteButton.addEventListener("click", () => {
            if (!confirm(`Hapus jenis antrean ${item.nama} (${item.kode})?`))
                return;
            saveJenisAntrian(getJenisAntrian().filter((entry) => entry.kode !== item.kode));
            render();
        });
        actions.append(toggleButton, deleteButton);
        row.append(description, actions);
        jenisList.append(row);
    }
}
function renderTicketOptions(jenis) {
    const selected = ticketType.value;
    ticketType.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Pilih jenis antrean";
    ticketType.append(placeholder);
    for (const item of jenis.filter((entry) => entry.aktif)) {
        const option = document.createElement("option");
        option.value = item.kode;
        option.textContent = `${item.nama} (${item.kode})`;
        ticketType.append(option);
    }
    if (jenis.some((item) => item.kode === selected && item.aktif)) {
        ticketType.value = selected;
    }
    ticketType.disabled = ticketType.options.length === 1;
    ticketForm.querySelector("button[type='submit']").disabled = ticketType.disabled;
}
function renderTickets(tickets, jenis) {
    ticketList.replaceChildren();
    if (tickets.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Belum ada tiket yang diterbitkan.";
        ticketList.append(empty);
        return;
    }
    const groups = [
        ...jenis.map((item) => ({
            kode: item.kode,
            nama: item.nama,
            tickets: tickets.filter((ticket) => ticket.kodeAntrian === item.kode)
        })),
        ...[...new Set(tickets.map((ticket) => ticket.kodeAntrian))]
            .filter((kode) => !jenis.some((item) => item.kode === kode))
            .map((kode) => ({ kode, nama: `Layanan (${kode})`, tickets: tickets.filter((ticket) => ticket.kodeAntrian === kode) }))
    ];
    for (const group of groups) {
        if (group.tickets.length === 0)
            continue;
        const section = document.createElement("section");
        section.className = "ticket-group";
        const heading = document.createElement("h3");
        heading.className = "ticket-group-heading";
        heading.textContent = group.nama;
        section.append(heading);
        for (const ticket of group.tickets.slice().reverse()) {
            const row = document.createElement("article");
            row.className = "ticket-row";
            const number = document.createElement("strong");
            number.className = "ticket-number";
            number.textContent = ticket.nomor;
            const priority = document.createElement("span");
            priority.className = "priority-badge";
            priority.textContent = ticket.prioritas;
            const state = document.createElement("span");
            state.className = `ticket-status ${ticket.status}`;
            state.textContent = ticket.status === "menunggu" ? "Menunggu" :
                ticket.status === "dipanggil" ? "Dipanggil" :
                    ticket.status === "selesai" ? "Selesai" : "Lewati";
            const actions = document.createElement("div");
            actions.className = "ticket-actions";
            if (ticket.status === "menunggu") {
                const callButton = document.createElement("button");
                callButton.type = "button";
                callButton.className = "ticket-action";
                callButton.textContent = "Panggil";
                callButton.addEventListener("click", () => changeTicketStatus(ticket.nomor, "dipanggil"));
                const skipButton = document.createElement("button");
                skipButton.type = "button";
                skipButton.className = "ticket-action ticket-action-danger";
                skipButton.textContent = "Lewati";
                skipButton.addEventListener("click", () => changeTicketStatus(ticket.nomor, "dilewati"));
                actions.append(callButton, skipButton);
            }
            else if (ticket.status === "dipanggil") {
                const doneButton = document.createElement("button");
                doneButton.type = "button";
                doneButton.className = "ticket-action ticket-action-success";
                doneButton.textContent = "Selesai";
                doneButton.addEventListener("click", () => changeTicketStatus(ticket.nomor, "selesai"));
                actions.append(doneButton);
            }
            row.append(number, priority, state, actions);
            section.append(row);
        }
        ticketList.append(section);
    }
}
function changeTicketStatus(nomor, status) {
    try {
        updateTicketStatus(nomor, status);
        render();
    }
    catch (error) {
        alert(error instanceof Error ? error.message : "Status tiket gagal diperbarui.");
    }
}
function render() {
    const jenis = getJenisAntrian();
    const tickets = getTickets();
    renderJenisAntrian(jenis, tickets);
    renderTicketOptions(jenis);
    renderTickets(tickets, jenis);
}
window.addEventListener("storage", (event) => {
    if (["jenisAntrian", "tiketAntrian", "nomorAntrian"].includes(event.key ?? ""))
        render();
});
render();
