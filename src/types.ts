interface JenisAntrian {
    kode: string; // Contoh: 'A', 'B', 'C' (Wajib huruf kapital)
    nama: string; // Contoh: 'UMUM-1', 'GIGI'
    aktif: boolean;
}

interface Tiket {
    nomor: string; // Contoh: 'A-001'
    kodeAntrian: string;
    prioritas: 'Normal' | 'Lansia' | 'Disabilitas' | 'VIP';
    status: 'menunggu' | 'dipanggil' | 'selesai';
}