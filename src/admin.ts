// Auth Guard
const role = localStorage.getItem('role');
if (!role || (role !== 'admin' && role !== 'moderator')) {
    window.location.href = 'login.html';
}

// 2. Fungsi CRUD Jenis Antrian
const formJenis = document.getElementById('form-jenis-antrian') as HTMLFormElement;

formJenis.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const kodeInput = (document.getElementById('kode-antrian') as HTMLInputElement).value.toUpperCase();
    const namaInput = (document.getElementById('nama-antrian') as HTMLInputElement).value;

    let jenisAntrian: JenisAntrian[] = JSON.parse(localStorage.getItem('jenisAntrian') || '[]');

    // Validasi Duplikasi (Case-insensitive)
    const isDuplicate = jenisAntrian.some(j => j.kode === kodeInput || j.nama.toLowerCase() === namaInput.toLowerCase());
    
    if (isDuplicate) {
        alert("Kode atau Nama Layanan sudah ada!");
        return;
    }

    jenisAntrian.push({ kode: kodeInput, nama: namaInput, aktif: true });
    localStorage.setItem('jenisAntrian', JSON.stringify(jenisAntrian));
    
    // Panggil fungsi render ulang daftar di layar...
    formJenis.reset();
});