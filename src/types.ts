export interface JenisAntrian {
    kode: string; // Contoh: 'A', 'B', 'C' (Wajib huruf kapital)
    nama: string; // Contoh: 'UMUM-1', 'GIGI'
    aktif: boolean;
}

export interface Tiket {
    nomor: string; // Contoh: 'A-001'
    kodeAntrian: string;
    prioritas: Prioritas;
    status: 'menunggu' | 'dipanggil' | 'selesai' | 'dilewati';
    dibuatPada: string;
}

export type Prioritas = 'Normal' | 'Lansia' | 'Disabilitas' | 'VIP';

export interface UserSession {
  token: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  role: string;
}