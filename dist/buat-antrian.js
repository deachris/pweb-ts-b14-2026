const TYPE_KEY = "jenisAntrian";
const TICKET_KEY = "tiketAntrian";
const COUNTER_KEY = "nomorAntrian";
function readArray(key) {
    const value = localStorage.getItem(key);
    if (!value)
        return [];
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed))
            throw new Error("Data antrean bukan daftar yang valid.");
        return parsed;
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Data "${key}" rusak. Hapus data antrean di penyimpanan browser lalu coba lagi.`);
        }
        throw error;
    }
}
function readCounters() {
    const value = localStorage.getItem(COUNTER_KEY);
    if (!value)
        return {};
    try {
        const parsed = JSON.parse(value);
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
            throw new Error("Data nomor antrean bukan objek yang valid.");
        }
        return parsed;
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error("Data nomor antrean rusak. Reset data antrean lalu coba lagi.");
        }
        throw error;
    }
}
export function getJenisAntrian() {
    return readArray(TYPE_KEY);
}
export function saveJenisAntrian(jenis) {
    localStorage.setItem(TYPE_KEY, JSON.stringify(jenis));
}
export function getTickets() {
    return readArray(TICKET_KEY);
}
export function updateTicketStatus(nomor, status) {
    const tickets = getTickets();
    const ticket = tickets.find((item) => item.nomor === nomor);
    if (!ticket)
        throw new Error(`Tiket ${nomor} tidak ditemukan.`);
    ticket.status = status;
    localStorage.setItem(TICKET_KEY, JSON.stringify(tickets));
}
export function issueTicket(kodeAntrian, prioritas) {
    const jenis = getJenisAntrian().find((item) => item.kode === kodeAntrian && item.aktif);
    if (!jenis)
        throw new Error("Jenis antrean tidak ditemukan atau sedang nonaktif.");
    const counters = readCounters();
    const next = (counters[kodeAntrian] ?? 0) + 1;
    if (next > 999)
        throw new Error(`Nomor antrean ${kodeAntrian} sudah mencapai batas 999.`);
    const tiket = {
        nomor: `${kodeAntrian}-${String(next).padStart(3, "0")}`,
        kodeAntrian,
        prioritas,
        status: "menunggu",
        dibuatPada: new Date().toISOString()
    };
    const tickets = getTickets();
    tickets.push(tiket);
    counters[kodeAntrian] = next;
    localStorage.setItem(TICKET_KEY, JSON.stringify(tickets));
    localStorage.setItem(COUNTER_KEY, JSON.stringify(counters));
    return tiket;
}
export function resetQueue(kodeAntrian) {
    if (!kodeAntrian) {
        localStorage.removeItem(TICKET_KEY);
        localStorage.removeItem(COUNTER_KEY);
        return;
    }
    const tickets = getTickets().filter((ticket) => ticket.kodeAntrian !== kodeAntrian);
    const counters = readCounters();
    delete counters[kodeAntrian];
    localStorage.setItem(TICKET_KEY, JSON.stringify(tickets));
    localStorage.setItem(COUNTER_KEY, JSON.stringify(counters));
}
