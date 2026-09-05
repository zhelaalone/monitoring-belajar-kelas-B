    // ==========================================
// 1. FUNGSI LOGIN & PENCARIAN NAMA (SUPER AMAN + BYPASS ADMIN)
// ==========================================
const PASSWORD_WEB_BERSAMA = "ijhad2026";

function filterNamaGuruLogin() {
    const input = document.getElementById("input-nama-guru-login");
    const filter = input ? input.value.toLowerCase() : "";
    const listContainer = document.getElementById("autocomplete-list-login");

    if (!listContainer) return;
    listContainer.innerHTML = "";

    let sumberDataGuru = [];
    try { sumberDataGuru = JSON.parse(localStorage.getItem('daftarGuru')) || []; } catch (e) { }
    if (typeof daftarGuru !== 'undefined' && daftarGuru.length > 0) { sumberDataGuru = daftarGuru; }

    let adaHasil = false;

    // 1. Tampilkan Daftar Guru (Jika Ada)
    if (sumberDataGuru.length > 0) {
        sumberDataGuru.forEach(guru => {
            if (!filter || (guru.nama && guru.nama.toLowerCase().includes(filter))) {
                adaHasil = true;
                const div = document.createElement("div");
                div.style.padding = "10px 15px";
                div.style.cursor = "pointer";
                div.style.borderBottom = "1px solid #f9ecea";
                div.style.color = "#4a2525";
                div.style.fontWeight = "bold";
                div.innerHTML = guru.nama;

                div.onmouseover = function () { this.style.background = "#fdf6f5"; };
                div.onmouseout = function () { this.style.background = "white"; };

                // PERBAIKAN: Gunakan onmousedown agar nama 100% masuk saat diklik
                div.onmousedown = function (e) {
                    e.preventDefault();
                    input.value = guru.nama;
                    listContainer.style.display = "none";
                };

                listContainer.appendChild(div);
            }
        });
    }

    // 2. SELALU Tampilkan Opsi Admin (Sebagai Pintu Darurat)
    if (!filter || "admin".includes(filter)) {
        adaHasil = true;
        const divAdmin = document.createElement("div");
        divAdmin.style.padding = "10px 15px";
        divAdmin.style.cursor = "pointer";
        divAdmin.style.borderBottom = "1px solid #f9ecea";
        divAdmin.style.color = "#8c2222";
        divAdmin.style.fontWeight = "bold";
        divAdmin.innerHTML = "⭐ Admin Aplikasi";

        divAdmin.onmouseover = function () { this.style.background = "#fdf6f5"; };
        divAdmin.onmouseout = function () { this.style.background = "white"; };

        divAdmin.onmousedown = function (e) {
            e.preventDefault();
            input.value = "Admin Aplikasi";
            listContainer.style.display = "none";
        };
        listContainer.appendChild(divAdmin);
    }

    if (!adaHasil) {
        listContainer.innerHTML = `<div style="padding: 10px 15px; color: #c0392b; font-style: italic; font-size: 13px;">Nama tidak ditemukan...</div>`;
    }

    listContainer.style.display = "block";
}

// PERBAIKAN: Mencegah kotak tertutup secara tidak sengaja
document.addEventListener("click", function (e) {
    const input = document.getElementById("input-nama-guru-login");
    const listContainer = document.getElementById("autocomplete-list-login");

    if (e.target === input) {
        filterNamaGuruLogin();
    } else if (listContainer && !listContainer.contains(e.target)) {
        listContainer.style.display = "none";
    }
});


/* ==================================================================
   1. DATABASE DUMMY SISWA & DATA DEFAULT
   ================================================================== */
const databaseSiswa = {};

// ===============================
// FILTER MULTI KELAS
// ===============================
let kelasDipilih = [];

// Membuat 34 data siswa default
const SISWA_DEFAULT = {};
for (let i = 1; i <= 34; i++) {
    const nis = (65000 + i).toString();
    SISWA_DEFAULT[nis] = {
        nama: "Siswa " + i,
        nis: nis,
        kelas: "10-A",
        daerah: "Daerah " + i,
        barcode: nis,
        ttl: "-",
        jk: "-",
        alamat: "-",
        ortu: "-",
        hp: "-",
        status: "Belum Hadir"
    };
}

/* ==================================================================
   2. FUNGSI NAVIGASI & ISI DATA SISWA
   ================================================================== */
function pindahHalaman(idHalaman) {
    halamanAktif = idHalaman; // <--- BARIS UTAMA AGAR SISTEM TAHU POSISI GURU

    document.querySelectorAll(".page-section").forEach(s => s.classList.remove("active-section"));

    const targetSection = document.getElementById(idHalaman);
    if (targetSection) {
        targetSection.classList.add("active-section");
    }

    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
        if (idHalaman === "data-siswa") pageTitle.textContent = "Data Siswa";
        else if (idHalaman === "detail-siswa") pageTitle.textContent = "Detail Siswa";
        else if (idHalaman === "scan-barcode") pageTitle.textContent = "Scan Barcode";
        else if (idHalaman === "dashboard") pageTitle.textContent = "Dashboard";
        else if (idHalaman === "upload-excel") pageTitle.textContent = "Upload Excel";
        else if (idHalaman === "statistik") pageTitle.textContent = "Statistik";
        else if (idHalaman === "data-guru") pageTitle.textContent = "Guru";
        else if (idHalaman === "pengaturan") pageTitle.textContent = "Pengaturan";
        else if (idHalaman === "absen") pageTitle.textContent = "Absensi";
    }

    // Saat masuk ke halaman Statistik: isi dropdown kelas terbaru, lalu render datanya
    if (idHalaman === "statistik") {
        if (typeof isiDropdownFilterKelas === 'function') isiDropdownFilterKelas();
        if (typeof renderStatistikGlobal === 'function') renderStatistikGlobal();
    }

    if (idHalaman === "statistik") {
        kembaliKeMenuStatistik(); // Otomatis kembali ke kartu pilihan menu
    }

    if (idHalaman === "absen") {
        if (typeof setTanggalAbsen === 'function') setTanggalAbsen();
        if (typeof isiDropdownKelasAbsen === 'function') isiDropdownKelasAbsen();
    }
}
function isiDataPersonal(data) {
    if (document.getElementById('detail-nama')) document.getElementById('detail-nama').innerText = data.nama;
    if (document.getElementById('detail-stanbuk')) document.getElementById('detail-stanbuk').innerText = "Stanbuk: " + data.nis;
    if (document.getElementById('detail-kelas')) document.getElementById('detail-kelas').innerText = "Kelas: " + data.kelas;
    if (document.getElementById('detail-ttl')) document.getElementById('detail-ttl').innerText = data.ttl || '-';
    if (document.getElementById('detail-jk')) document.getElementById('detail-jk').innerText = data.jk || '-';
    if (document.getElementById('detail-alamat')) document.getElementById('detail-alamat').innerText = data.alamat || '-';
    if (document.getElementById('detail-ortu')) document.getElementById('detail-ortu').innerText = data.ortu || '-';
    if (document.getElementById('detail-hp')) document.getElementById('detail-hp').innerText = data.hp || '-';

    const inputNis = document.getElementById('id_siswa');
    if (inputNis) inputNis.value = data.nis;
}

function bukaDetailSiswa(nis) {
    if (databaseSiswa[nis]) {
        isiDataPersonal(databaseSiswa[nis]);
        muatProgresSiswa(nis);
        pindahHalaman('detail-siswa');
    } else {
        alert("Siswa dengan NIS " + nis + " tidak ditemukan!");
    }
}

function kembaliKeDataSiswa() {
    pindahHalaman('data-siswa');
}

/* ==================================================================
   3. CALLBACK & LOGIKA SCANNER BARCODE
   ================================================================== */
function onScanSuccess(decodedText) {
    const nisHasilScan = decodedText.trim();
    console.log("Barcode terbaca:", nisHasilScan);

    const inputNis = document.getElementById("id_siswa");
    if (inputNis) inputNis.value = nisHasilScan;

    if (databaseSiswa[nisHasilScan]) {
        isiDataPersonal(databaseSiswa[nisHasilScan]);
        muatProgresSiswa(nisHasilScan);
        pindahHalaman('detail-siswa');
    } else {
        alert("Siswa dengan NIS/Barcode [" + nisHasilScan + "] tidak ada di database!");
    }
}

function getFileScanElement() {
    let el = document.getElementById('reader-file');
    if (!el) {
        el = document.createElement('div');
        el.id = 'reader-file';
        el.style.display = 'none';
        document.body.appendChild(el);
    }
    return el;
}

function prosesFileGambarBarcode(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert("Harap masukkan file berupa gambar!");
        return;
    }

    getFileScanElement();
    const html5QrCode = new Html5Qrcode("reader-file");

    html5QrCode.scanFile(file, true)
        .then(qrCodeMessage => {
            onScanSuccess(qrCodeMessage);
            html5QrCode.clear().catch(() => { });
        })
        .catch(err => {
            alert("Gagal membaca Barcode/QR Code dari gambar ini. Pastikan gambar jelas dan tidak blur.");
            console.error("Error scan gambar:", err);
        });
}

function cekInputManual() {
    const inputNis = document.getElementById("id_siswa");
    if (inputNis && inputNis.value.trim() !== "") {
        bukaDetailSiswa(inputNis.value.trim());
    } else {
        alert("Harap masukkan NIS Siswa terlebih dahulu!");
    }
}

/* ==================================================================
   4. LOGIKA PROGRAM BELAJAR & KATEGORI
   ================================================================== */
const DAFTAR_PELAJARAN = [
    "Kimia", "Sosiologi", "Geografi", "Adyan", "Faroidh",
    "Biologi", "Qahshasul Anbiya'", "Dinul Islam", "Berhitung",
    "Tarikh Islam", "Imla", "Dictation", "Khat"
];

const JUMLAH_BAB = 10;
const JUMLAH_SUBBAB = 5;
const DAFTAR_KATEGORI = ["bacaan", "pemahaman", "rangkuman", "hafalan", "bahas soal"];

// === TAMBAHAN BARU: STRUKTUR MASTER PELAJARAN ===
const STRUKTUR_PELAJARAN = {
    "Kimia": {
        1: { judul: "Ilmu Kimia", subbab: ["Pendahuluan", "Sejarah Ilmu Kimia", "Profil Ilmuwan Muslim", "Panduan Kerja Ilmiah Dalam Bidang Kimia"] },
        2: { judul: "Materi", subbab: ["Pendahuluan", "Partikel Materi"] },
        3: { judul: "Atom", subbab: ["Pendahuluan", "Partikel Subatomik"] },
        4: { judul: "Rumus Tentang Atom", subbab: ["Nomor Atom", "Nomor Massa", "Rumus Kimia", "Isotop, Isobar, Isoton", "Stoikiometri (1)", "Soal-soal latihan"] },
        5: { judul: "Sistem Periodik", subbab: ["Sejarah Perkembangan Sistem Periodik Unsur Kimia", "Sistem Periodik Modern", "Konfigurasi Elektron dan Konfigurasi Valensi", "Sifat-Sifat Sistem Periodik", "Kondisi Stabil Atom"] },
        6: { judul: "Ikatan Kimia", subbab: ["Pengertian Ikatan Kimia", "Ikatan Ion", "Ikatan Kovalen", "Ikatan Kovalen Rangkap", "Ikatan Kovalen Koordinasi", "Ikatan Kovalen Polar dan Non Polar", "Ikatan Logam", "Ikatan Hidrogen dan Ikatan Van Der Waals", "Soal-soal latihan"] },
        7: { judul: "Persamaan Reaksi", subbab: ["Menuliskan Persamaan Reaksi", "Menyetarakan Persamaan Reaksi", "Soal-soal latihan"] },
        8: { judul: "Asam dan Basa", subbab: ["Pengertian Asam dan Basa", "Karakteristik Asam dan Basa", "Asam dan Basa di Sekitar Kita", "Teori Asam dan Basa", "Indikator Asam Basa"] },
        9: { judul: "Struktur Nama Senyawa", subbab: ["Tata Senyawa Biner", "Tata Senyawa Poliatomik", "Tata Nama Asam dan Basa", "Soal-soal latihan"] },
        10: { judul: "Hukum-Hukum Dasar Kimia", subbab: ["Teori Flagiston", "Hukum Kekekalan Massa (Hukum Lavoisier)", "Hukum Perbandingan Tetap (Hukum Proust)", "Hukum Kelipatan Perbandingan Berganda (Hukum Dalton)", "Hukum Perbandingan Volume (Hukum Gay-Lussac)", "Hukum Avogadro", "Soal-soal latihan"] },
        11: { judul: "Konsep Mol", subbab: ["Sejarah Mol", "Pengertian Mol", "Standar Mol", "Massa Molar", "Volume Molar Gas", "Komposisi (Kadar) Zat", "Soal-soal latihan"] },
        12: { judul: "Aplikasi Persamaan Reaksi", subbab: ["Menggunakan Persamaan Reaksi Pada Perhitungan Kimia", "Pereaksi Pembatas", "Soal-soal latihan"] }
    },
    "Sosiologi": {
        1: { judul: "Fungsi Sosiologi", subbab: ["Pengertian Sosiologi", "Hakikat Sosiologi", "Perkembangan Sosiologi", "Objek Kajian Sosiologi", "Metode-Metode dalam Sosiologi", "Manfaat Sosiologi", "Fungsi Sosiologi", "Rangkuman"] },
        2: { judul: "Nilai dan Norma dalam Masyarakat", subbab: ["Nilai yang Berlaku di dalam Masyarakat", "Tipe-Tipe Nilai", "Norma-Norma dalam Masyarakat", "Ciri-Ciri Norma Sosial", "Macam-Macam Norma Sosial dalam Masyarakat", "Rangkuman"] },
        3: { judul: "Proses Interaksi Sosial", subbab: ["Tindakan Sosial", "Interaksi Sosial", "Keteraturan Sosial sebagai Hasil Interaksi Sosial", "Dinamika Sosial", "Rangkuman"] },
        4: { judul: "Sosialisasi Membentuk Kepribadian", subbab: ["Proses Sosialisasi", "Media Sosialisasi", "Pengertian Kepribadian", "Pembentukan Kepribadian", "Rangkuman"] },
        5: { judul: "Perilaku Menyimpang", subbab: ["Pengertian Perilaku Menyimpang", "Faktor-Faktor Penyebab Penyimpangan", "Bentuk-Bentuk Penyimpangan", "Jenis Perilaku Menyimpang", "Teori Penyimpangan", "Proses Pembentukan Perilaku Menyimpang sebagai Akibat Proses Sosialisasi yang Tidak Sempurna", "Proses Pembentukan Perilaku Menyimpang sebagai Hasil Proses Sosialisasi Nilai Subkebudayaan yang Menyimpang", "Rangkuman"] },
        6: { judul: "Aturan Sosial dan Pengendalian Sosial", subbab: ["Aturan-Aturan Sosial", "Pengendalian Sosial", "Tujuan Pengendalian Sosial", "Bentuk Pengendalian Sosial", "Cara-Cara Pengendalian Sosial", "Jenis-Jenis Lembaga Sosial", "Rangkuman"] }
    },
    "Geografi": {
        // ================= KELAS 1 =================
        1: {
            judul: "Bab I (Kelas 1) — Pendahuluan",
            subbab: ["Pengetahuan Geografi", "Peta", "Atlas", "Globe"]
        },
        2: {
            judul: "Bab II (Kelas 1) — Keadaan Wilayah Indonesia",
            subbab: ["Letak Dan Luas Indonesia", "Bentuk Muka Bumi Indonesia", "Cuaca Dan Iklim Indonesia", "Flora Dan Fauna Indonesia"]
        },
        3: {
            judul: "Bab III (Kelas 1) — Pembagian Daerah di Indonesia",
            subbab: ["Jawa", "Sumatera", "Bali Dan Nusa Tenggara", "Kalimantan", "Sulawesi", "Kepulauan Maluku Dan Nusa Tenggara", "Papua (Irian Jaya)"]
        },
        4: {
            judul: "Bab IV (Kelas 1) — Sumber Daya Manusia Indonesia",
            subbab: ["Pertumbuhan Sumber Daya Manusia", "Mutu Sumber Daya Manusia", "Mobilitas Penduduk"]
        },
        5: {
            judul: "Bab V (Kelas 1) — Tata Kehidupan Sosial di Indonesia",
            subbab: ["Suku Bangsa di Indonesia", "Kebudayaan Daerah dan Kebudayaan Nasional"]
        },
        6: {
            judul: "Bab VI (Kelas 1) — Sumber Daya Alam Indonesia",
            subbab: ["Pengertian", "Tanah", "Air", "Udara", "Pelestarian SDA"]
        },
        7: {
            judul: "Bab VII (Kelas 1) — Pemanfaatan Sumber Daya Alam Indonesia",
            subbab: ["Pertanian", "Ladang", "Perkebunan", "Peternakan", "Perikanan", "Kehutanan", "Pertambangan", "Perindustrian", "Perdagangan", "Perhubungan Dan Pengangkutan", "Pariwisata"]
        },

        // ================= KELAS 2 =================
        8: {
            judul: "Bab I (Kelas 2) — Benua dan Samudra di Dunia",
            subbab: ["Benua-benua di Permukaan Bumi", "Samudra-samudra di Permukaan Bumi", "Pembagian Kawasan Benua di Dunia", "Daratan Kutub Utara (Arktika) dan Kutub Selatan (Antartika)"]
        },
        9: {
            judul: "Bab II (Kelas 2) — Benua Asia",
            subbab: ["Keadaan Umum Benua Asia", "Pembagian Kawasan Benua Asia"]
        },
        10: {
            judul: "Bab III (Kelas 2) — Benua Afrika",
            subbab: ["Keadaan Umum Benua Afrika", "Pembagian Kawasan Benua Afrika"]
        },

        // ================= KELAS 3 =================
        11: {
            judul: "Bab I (Kelas 3) — Benua Eropa",
            subbab: ["Keadaan Umum Benua Eropa", "Beberapa Negara di Benua Eropa"]
        },
        12: {
            judul: "Bab II (Kelas 3) — Benua Amerika",
            subbab: ["Keadaan Umum Benua Amerika", "Beberapa Negara di Benua Amerika"]
        },
        13: {
            judul: "Bab III (Kelas 3) — Australia dan Oceania",
            subbab: ["Australia", "Selandia Baru", "Kepulauan Oceania"]
        },
        14: {
            judul: "Bab IV (Kelas 3) — Kerja Sama Internasional",
            subbab: ["Faktor-Faktor Terjadinya Kerja Sama", "Bentuk Kerja Sama Internasional", "Perserikatan Bangsa-Bangsa"]
        }
    },
    "Berhitung": {
        // ================= KELAS 1 =================
        1: {
            judul: "Bab I (Kelas 1) — Operasi Hitung",
            subbab: ["Penjumlahan dan Pengurangan", "Perkalian dan Pembagian", "Pecahan"]
        },
        2: {
            judul: "Bab II (Kelas 1) — KPT dan PPT",
            subbab: ["KPT (Kelipatan Persekutuan Terkecil)", "PPT (Pembagi Persekutuan Terbesar)"]
        },
        3: {
            judul: "Bab III (Kelas 1) — Ukuran Metrik",
            subbab: ["Satuan Ukuran Panjang", "Satuan Ukuran Berat", "Satuan Ukuran Luas", "Satuan Ukuran Isi (Volume)", "Satuan Ukuran Waktu", "Satuan Ukuran Jumlah"]
        },
        4: {
            judul: "Bab IV (Kelas 1) — Bangun Datar",
            subbab: ["Rumus Keliling dan Luas Bangun Datar", "Susunan Bangun-bangun Datar"]
        },
        5: {
            judul: "Bab V (Kelas 1) — Bangun Ruang",
            subbab: ["Rumus Volume dan Luas Permukaan Bangun Ruang", "Susunan Bangun-bangun Ruang"]
        },
        6: {
            judul: "Bab VI (Kelas 1) — Perdagangan",
            subbab: ["Jual Beli, Laba, dan Rugi", "Rabat (Diskon)", "Bruto, Tara, dan Neto"]
        },
        7: {
            judul: "Bab VII (Kelas 1) — Skala",
            subbab: ["Skala"]
        },
        8: {
            judul: "Bab VIII (Kelas 1) — Kecepatan",
            subbab: ["Kecepatan"]
        },
        9: {
            judul: "Bab IX (Kelas 1) — Angka Romawi",
            subbab: ["Angka Romawi"]
        },

        // ================= KELAS 2 =================
        10: {
            judul: "Bab 1 (Kelas 2) — Perbandingan",
            subbab: ["Latihan 1", "Perbandingan Umur", "Latihan 2", "Perbandingan Uang atau Harga", "Latihan 3", "Perbandingan Roda atau Kaki", "Latihan 4", "Perbandingan Pekerjaan", "Latihan 5"]
        },
        11: {
            judul: "Bab 2 (Kelas 2) — Jarak & Susunan Benda",
            subbab: ["Jarak & Susunan Benda", "Latihan 6"]
        },
        12: {
            judul: "Bab 3 (Kelas 2) — Kalkulasi Bangunan",
            subbab: ["Kalkulasi Bangunan", "Latihan 7"]
        },
        13: {
            judul: "Bab 4 (Kelas 2) — Mencari Nilai yang Belum Diketahui",
            subbab: ["Mencari Nilai yang Belum Diketahui", "Latihan 8"]
        },
        14: {
            judul: "Bab 5 (Kelas 2) — Menghitung Kadar Emas",
            subbab: ["Menguji Kadar Emas", "Menghitung Kadar Emas", "Latihan 9"]
        },
        15: {
            judul: "Bab 6 (Kelas 2) — Pembagian Hasil Usaha",
            subbab: ["Pembagian Hasil Usaha Berdasarkan Persentase", "Latihan 10", "Pembagian Hasil Usaha Berdasarkan Perbandingan", "Latihan 11"]
        },
        16: {
            judul: "Bab 7 (Kelas 2) — Perjalanan",
            subbab: ["Perjalanan Berlawanan Arah Sehingga Terjadi Pertemuan", "Perjalanan Searah Sehingga Terjadi Penyusulan", "Latihan 12"]
        },

        // ================= KELAS 3 =================
        17: {
            judul: "Bab 1 (Kelas 3) — Pengenalan Administrasi dan Pembukuan",
            subbab: ["Pengertian Administrasi", "Kegunaan Administrasi Dalam Berbagai Bidang", "Pembukuan", "Latihan 1.1", "Latihan 1.2"]
        },
        18: {
            judul: "Bab 2 (Kelas 3) — Akuntansi",
            subbab: ["Pengertian dan Pemahaman Dasar Akuntansi", "Persamaan Dasar Akuntansi", "Beberapa Istilah dalam Pembukuan dan Akuntansi", "Pemahaman Konsep Dasar Akuntansi", "Perbedaan Pembukuan dan Akuntansi", "Latihan 2.1", "Latihan 2.2"]
        },
        19: {
            judul: "Bab 3 (Kelas 3) — Pengenalan Usaha",
            subbab: ["Pengertian Usaha dan Perusahaan", "Pembagian Bentuk Usaha Menurut Badan Hukum", "Pembagian Perusahaan Menurut Jenis Kegiatan Utama", "Latihan 3"]
        },
        20: {
            judul: "Bab 4 (Kelas 3) — Siklus Akuntansi",
            subbab: ["Siklus Akuntansi", "Latihan 4.1", "Latihan 4.2", "Akuntansi Perusahaan Dagang", "Latihan 4.3", "Latihan 4.4"]
        },
        21: {
            judul: "Bab 5 (Kelas 3) — Laporan Keuangan",
            subbab: ["Laporan Laba Rugi", "Laporan Perubahan Ekuitas", "Laporan Posisi Keuangan/Neraca", "Latihan 5.1", "Latihan 5.2"]
        }
    },

    "Biologi": {
        // ================= KELAS 1 =================
        1: {
            judul: "Bab 1 (Kelas 1) — Mengamati Gejala Kehidupan",
            subbab: ["Gejala Alam Biotik dan Abiotik", "Kerja Ilmiah sebagai Langkah Pemecahan Masalah", "Langkah-Langkah Metode Ilmiah"]
        },
        2: {
            judul: "Bab 2 (Kelas 1) — Mikroskop dan Alat-Alat Laboratorium",
            subbab: ["Penggunaan Mikroskop", "Objek Pengamatan", "Keselamatan Kerja"]
        },
        3: {
            judul: "Bab 3 (Kelas 1) — Ciri-Ciri Makhluk Hidup",
            subbab: ["Bernapas", "Bergerak", "Menerima dan Mereaksi Rangsang", "Memerlukan Makanan", "Tumbuh dan Berkembang", "Berkembang Biak", "Mengeluarkan Zat Sisa", "Melakukan Adaptasi", "Memerlukan Suhu Lingkungan Tertentu"]
        },
        4: {
            judul: "Bab 4 (Kelas 1) — Klasifikasi Makhluk Hidup",
            subbab: ["Dasar-Dasar Klasifikasi Makhluk Hidup", "Nama Ilmiah Makhluk Hidup", "Klasifikasi Sistem Lima Kingdom", "Kunci Determinasi sebagai Alat Bantu Klasifikasi (Materi Pengayaan)"]
        },
        5: {
            judul: "Bab 5 (Kelas 1) — Organisasi Kehidupan",
            subbab: ["Sel", "Jaringan", "Organ", "Sistem Organ", "Organisme"]
        },
        6: {
            judul: "Bab 6 (Kelas 1) — Ekosistem",
            subbab: ["Satuan Kehidupan dalam Organisasi Biologi", "Komponen-Komponen Penyusun Ekosistem", "Interaksi Antarkomponen Ekosistem", "Rantai Makanan dan Jaring-Jaring Kehidupan", "Arus Energi dalam Rantai Makanan", "Piramida Makanan", "Keseimbangan Ekosistem", "Interaksi Antarorganisme dalam Ekosistem"]
        },
        7: {
            judul: "Bab 7 (Kelas 1) — Upaya Pelestarian Keanekaragaman Makhluk Hidup",
            subbab: ["Keanekaragaman pada Makhluk Hidup", "Pentingnya Keanekaragaman bagi Kelestarian Makhluk Hidup", "Keanekaragaman Sumber Daya Alam Hayati di Indonesia", "Pelestarian Sumber Daya Alam Hayati"]
        },
        8: {
            judul: "Bab 8 (Kelas 1) — Hubungan Kepadatan Populasi Manusia dan Lingkungan",
            subbab: ["Dinamika Penduduk", "Dampak Peningkatan Kepadatan Penduduk"]
        },
        9: {
            judul: "Bab 9 (Kelas 1) — Peranan Manusia dalam Pengelolaan Lingkungan",
            subbab: ["Pengawetan Tanah", "Pengawetan Hutan", "Kerusakan dan Pencemaran Lingkungan", "Dampak Pencemaran Lingkungan", "Penanggulangan Pencemaran Lingkungan", "Peran Serta Individu dan Masyarakat dalam Pencegahan Pencemaran Lingkungan"]
        },

        // ================= KELAS 2 =================
        10: {
            judul: "Bab 1 (Kelas 2) — Pertumbuhan dan Perkembangan pada Makhluk Hidup",
            subbab: ["Pertumbuhan dan Perkembangan Organisme", "Faktor-Faktor yang Memengaruhi Pertumbuhan dan Perkembangan Organisme"]
        },
        11: {
            judul: "Bab 2 (Kelas 2) — Pertumbuhan dan Perkembangan Manusia",
            subbab: ["Pertumbuhan Manusia", "Perkembangan Manusia"]
        },
        12: {
            judul: "Bab 3 (Kelas 2) — Sistem Gerak pada Manusia",
            subbab: ["Rangka Manusia", "Tulang", "Otot", "Hubungan antara Tulang dan Otot"]
        },
        13: {
            judul: "Bab 4 (Kelas 2) — Sistem Pencernaan pada Manusia",
            subbab: ["Fungsi Makanan", "Makanan bagi Bayi", "Pencernaan Makanan pada Manusia"]
        },
        14: {
            judul: "Bab 5 (Kelas 2) — Sistem Pernapasan pada Manusia",
            subbab: ["Alat-Alat Pernapasan pada Manusia", "Mekanisme Pernapasan pada Manusia", "Gangguan dan Penyakit pada Alat Pernapasan Manusia"]
        },
        15: {
            judul: "Bab 6 (Kelas 2) — Sistem Peredaran Darah pada Manusia",
            subbab: ["Darah", "Alat-Alat Peredaran Darah", "Peredaran Darah", "Peredaran Getah Bening", "Gangguan dan Penyakit pada Sistem Peredaran Darah"]
        },
        16: {
            judul: "Bab 7 (Kelas 2) — Struktur dan Fungsi Jaringan pada Tumbuhan",
            subbab: ["Akar", "Batang", "Daun", "Bunga", "Buah dan Biji", "Pengangkutan pada Tumbuhan Tingkat Tinggi", "Proses Pengeluaran pada Tumbuhan", "Macam-Macam Gerak pada Tumbuhan"]
        },
        17: {
            judul: "Bab 8 (Kelas 2) — Fotosintesis",
            subbab: ["Unsur-Unsur yang Diperlukan Tumbuhan", "Proses Penyerapan Air dan Zat Hara", "Proses Fotosintesis"]
        },
        18: {
            judul: "Bab 9 (Kelas 2) — Hama dan Penyakit pada Tumbuhan",
            subbab: ["Hama Tumbuhan", "Penyakit Tumbuhan", "Cara Mengendalikan Hama"]
        },
        19: {
            judul: "Bab 10 (Kelas 2) — Bahan Kimia di Rumah",
            subbab: ["Pembersih", "Pemutih", "Pewangi", "Pembasmi Hama"]
        },
        20: {
            judul: "Bab 11 (Kelas 2) — Bahan Kimia di Bidang Industri, Pertanian, dan Kesehatan",
            subbab: ["Bahan Kimia di Bidang Industri", "Bahan Kimia di Bidang Pertanian", "Bahan Kimia di Bidang Kesehatan"]
        },
        21: {
            judul: "Bab 12 (Kelas 2) — Zat Aditif pada Makanan",
            subbab: ["Bahan Pengawet Makanan", "Pewarna Makanan", "Penyedap Makanan", "Pemanis Sintetis", "Pengembang Adonan Kue", "Antioksidan"]
        },
        22: {
            judul: "Bab 13 (Kelas 2) — Zat Adiktif dan Psikotropika",
            subbab: ["Pengertian Zat Adiktif dan Psikotropika", "Pengaruh Zat Adiktif dan Psikotropika pada Manusia"]
        },

        // ================= KELAS 3 =================
        23: {
            judul: "Bab 1 (Kelas 3) — Sistem Ekskresi pada Manusia",
            subbab: ["Ginjal", "Kulit", "Hati", "Paru-Paru"]
        },
        24: {
            judul: "Bab 2 (Kelas 3) — Sistem Reproduksi pada Manusia",
            subbab: ["Gametogenesis pada Manusia", "Sistem Reproduksi Manusia", "Menstruasi", "Proses Kehamilan", "Pertumbuhan dan Perkembangan Embrio", "Beberapa Penyakit yang Berkaitan dengan Organ Reproduksi"]
        },
        25: {
            judul: "Bab 3 (Kelas 3) — Sistem Koordinasi pada Manusia",
            subbab: ["Sistem Saraf pada Manusia", "Indra pada Manusia"]
        },
        26: {
            judul: "Bab 4 (Kelas 3) — Kelangsungan Hidup Makhluk Hidup",
            subbab: ["Adaptasi Makhluk Hidup terhadap Lingkungan", "Seleksi Alam", "Perkembangbiakan bagi Kelangsungan Hidup"]
        },
        27: {
            judul: "Bab 5 (Kelas 3) — Cara-Cara Reproduksi Berbagai Organisme",
            subbab: ["Reproduksi Generatif pada Tumbuhan", "Reproduksi Generatif pada Hewan", "Berbagai Cara Reproduksi Makhluk Hidup", "Hubungan Tingkat Pertumbuhan Populasi dengan Proses Reproduksi"]
        },
        28: {
            judul: "Bab 6 (Kelas 3) — Pewarisan Sifat",
            subbab: ["Materi Genetis", "Pewarisan Sifat menurut Mendel", "Persilangan dengan Satu Sifat Beda", "Persilangan dengan Dua Sifat Beda", "Keuntungan Hewan dan Tumbuhan Unggul"]
        },
        29: {
            judul: "Bab 7 (Kelas 3) — Bioteknologi",
            subbab: ["Penerapan Bioteknologi", "Keuntungan dan Kerugian Penerapan Bioteknologi"]
        }
    },

    "Faroidh": {
        1: {
            judul: "الدرس الأول: المقدمة في علم الفرائض",
            subbab: ["المقدمة في علم الفرائض"]
        },
        2: {
            judul: "الدرس الثاني: في الإرث",
            subbab: ["في الإرث"]
        },
        3: {
            judul: "الدرس الثالث: في الورثة",
            subbab: ["في الورثة"]
        },
        4: {
            judul: "الدرس الرابع: في الفروض المقدرة في كتاب الله",
            subbab: ["في الفروض المقدرة في كتاب الله"]
        },
        5: {
            judul: "الدرس الخامس: في التعصيب",
            subbab: ["في التعصيب"]
        },
        6: {
            judul: "الدرس السادس: في الحجب",
            subbab: ["في الحجب"]
        },
        7: {
            judul: "الدرس السابع: في طريقة التأصيل",
            subbab: ["في طريقة التأصيل"]
        },
        8: {
            judul: "الدرس الثامن: في العول",
            subbab: ["في العول"]
        },
        9: {
            judul: "الدرس التاسع: في تصحيح المسألة",
            subbab: ["في تصحيح المسألة"]
        },
        10: {
            judul: "الدرس العاشر: في الرد",
            subbab: ["في الرد"]
        },
        11: {
            judul: "الدرس الحادي عشر: في المسائل الفرضية المشهورة",
            subbab: ["في المسائل الفرضية المشهورة"]
        }
    },

    "Adyan": {
        1: {
            judul: "الباب الأول: مدخل إلى دراسة الأديان",
            subbab: [
                "التعريف",
                "نظرية بداية التدين",
                "تقسيم الأديان",
                "الأسئلة"
            ]
        },
        2: {
            judul: "الباب الثاني: المجوسية",
            subbab: [
                "التعريف",
                "انقسام المجوس",
                "معابد المجوس",
                "الاحتفال بالجنائز",
                "الاعتقاد بالروح",
                "الأسئلة"
            ]
        },
        3: {
            judul: "الباب الثالث: الصابئة",
            subbab: [
                "التعريف",
                "أنواع الصابئة",
                "تأسيس الصابئة",
                "معتقدات الصابئة",
                "عبادات الصابئة",
                "الأسئلة"
            ]
        },
        4: {
            judul: "الباب الرابع: ديانة المصريين القدماء",
            subbab: [
                "عبادة القوة الطبيعية",
                "عبادة الحيوان",
                "عبادة الأصنام",
                "عبادة الموتى",
                "التوحيد",
                "الأسئلة"
            ]
        },
        5: {
            judul: "الباب الخامس: الشنتوية",
            subbab: [
                "التعريف",
                "مؤسس الشنتوية",
                "المعتقدات",
                "الأسئلة"
            ]
        },
        6: {
            judul: "الباب السادس: الكونفوشيوسية",
            subbab: [
                "التعريف",
                "مؤسس الكونفوشيوسية",
                "المعتقدات الأساسية",
                "بعض تعاليم كونفوشيوس",
                "الأسئلة"
            ]
        },
        7: {
            judul: "الباب السابع: الطاوية",
            subbab: [
                "التعريف",
                "المعتقدات",
                "العبادة",
                "الكتب",
                "الاحتفالات الدينية والطقوس الطاوية",
                "الأسئلة"
            ]
        },
        8: {
            judul: "الباب الثامن: الهندوسية",
            subbab: [
                "التعريف",
                "المؤسس",
                "تطور الديانة الهندوسية",
                "الكتب المقدسة",
                "الآلهة في النظرة الهندوسية",
                "الطبقات في المجتمع الهندوسي",
                "معتقداتهم",
                "معتقدات أخرى",
                "الأسئلة"
            ]
        },
        9: {
            judul: "الباب التاسع: البوذية",
            subbab: [
                "التعريف",
                "المؤسس",
                "مولد سيدارتا ونشأته",
                "أفكار سيدارتا",
                "نشأة الديانة البوذية",
                "الكتب المقدسة",
                "بعض تعاليم سيدارتا",
                "الأسئلة"
            ]
        },
        10: {
            judul: "الباب العاشر: اليهودية",
            subbab: [
                "التعريف",
                "لمحة تاريخية عن اليهود",
                "المعتقدات",
                "الوصايا العشر",
                "كتبهم",
                "الأسئلة"
            ]
        },
        11: {
            judul: "الباب الحادي عشر: النصرانية",
            subbab: [
                "التعريف",
                "نشأة النصرانية",
                "أطوار النصرانية",
                "الكتب المقدسة",
                "الأصول النصرانية في الأناجيل المعروفة",
                "عقيدة النصارى في صلب المسيح",
                "التثليث",
                "الفرق النصرانية الرئيسية",
                "سبب ظهور هذه الحركة الفكرية يرجع إلى عوامل كثيرة، أهمها",
                "الأسئلة"
            ]
        },
        12: {
            judul: "الباب الثاني عشر: الإسلام",
            subbab: [
                "التعريف",
                "أصول الإسلام ومزاياه",
                "أهم ما جاء به الآيات القرآنية",
                "الفرق الإسلامية (المذاهب الإسلامية)",
                "أشهر المذاهب الإسلامية",
                "وللشيعة مذاهب أخرى، أشهرها",
                "الأسئلة"
            ]
        },
        13: {
            judul: "الباب الثالث عشر: الأحمدية",
            subbab: [
                "التعريف",
                "القاديانية",
                "اللاهورية",
                "الأسئلة"
            ]
        }
    },

    "Dinul Islam": {

        // ================= KELAS 3 =================

        1: {
            judul: "Bab 1 (Kelas 3) — الدين الإسلامي",
            subbab: [
                "الفصل الأول: خصائص الدين الإسلامي",
                "الخاصة الأولى: احترام العقل والاعتماد عليه في تعرف وجود الله وتوحيده",
                "احترام الدين للعقل",
                "الحث على تعليم العلوم الكونية",
                "تقرير القرآن أن لمن يستعمل عقله",
                "الخاصة الثانية: المساواة بين الناس في التكاليف والأحكام",
                "الحث على الإخاء والمساواة",
                "الحكام وطاعتهم",
                "الخاصة الثالثة: تقرير السلام بين الناس",
                "حال العرب قبل الإسلام",
                "حال العرب بعد الإسلام",
                "حال الإسلام مع غير أهله",
                "حرية المرأة في العقيدة",
                "آثار المصاهرة",
                "الجزية وسببها",
                "إيصاء الخلفاء قوادهم باحترام العباد وغيرهم",
                "حث المسلمين على صلة الأرحام مع غير المؤمنين",
                "الخاصة الرابعة: الجمع بين مصالح الدنيا والآخرة",
                "عناية الله بالإنسان",
                "الرخص في الإسلام",
                "الحث على الاقتصاد",
                "الحث على العمل",
                "الخاصة الخامسة: صلاحيته لكل أمة في أي زمان ومكان",
                "الاعتقاد",
                "العبادات الإسلامية",
                "الآداب الإسلامية",
                "المعاملات في الإسلام",
                "الفصل الثاني: أثر الدين في تهذيب النفس",
                "أثر العبادات في النفس",
                "أثر الصلاة",
                "أثر الصوم",
                "أثر الزكاة",
                "أثر الحج",
                "أثر الانتهاء عن المحرمات",
                "التهذيب يظهر في المعاشرة والمعاملة",
                "الفصل الثالث: أثر الدين في حياة الفرد والمجتمع",
                "أثر الدين في حياة الفرد",
                "أثر الدين في حياة الأسرة",
                "أثر الدين في حياة المجتمع",
                "الفصل الرابع: حالة العرب أصدق شاهد بتأثير الدين في حياة الأفراد والأمم"
            ]
        },

        2: {
            judul: "Bab 2 (Kelas 3) — الرسالة",
            subbab: [
                "الفصل الأول: الحاجة إلى الرسالة",
                "الطريقة الأولى في إثبات الحاجة إلى الرسالة",
                "اعتقاد الحياة الأخرى نوع من الإلهام الإلهي",
                "استشراف النفس الإنسانية دائماً إلى معرفة الأجل",
                "عجز النفوس عن معرفة الأجل ولو كان من أمور دنياهم",
                "الفصل الثاني: عموم رسالة محمد صلى الله عليه وسلم",
                "حال العرب وغيرهم قبل رسالة محمد",
                "رسالة محمد عامة لأن الحاجة إلى الإصلاح عامة",
                "معجزة محمد تفوق المعجزات",
                "القرآن حجة في حياة الرسول وبعد وفاته",
                "نص القرآن على عموم رسالة محمد",
                "الفصل الثالث: محمد خاتم النبيين وشريعته ناسخة لما قبلها من الشرائع",
                "سبب عقلية معجزة محمد",
                "فضائل رسالة محمد على الأخرى",
                "طريقة هداية الناس وإصلاحهم",
                "الإصلاح والهداية في الشريعة المحمدية",
                "محمد خاتم النبيين وشريعته آخر الشرائع"
            ]
        },

        // ================= KELAS 4 =================

        3: {
            judul: "Bab 1 (Kelas 4) — القرآن الكريم",
            subbab: [
                "الفصل الأول: معنى القرآن الكريم",
                "الفصل الثاني: نزول القرآن",
                "الفصل الثالث: جمع القرآن وتدوينه",
                "الفصل الرابع: المصحف الإمام أو مصحف عثمان"
            ]
        },

        4: {
            judul: "Bab 2 (Kelas 4) — السنة",
            subbab: [
                "الفصل الأول: معنى السنة",
                "الفصل الثاني: رواية السنة وكتابتها وجمعها",
                "الفصل الثالث: منزلة السنة من الدين",
                "الفصل الرابع: اجتهاد السلف وغيرهم في فهم الكتاب والسنة"
            ]
        },

        5: {
            judul: "Bab 3 (Kelas 4) — المذاهب الأربعة",
            subbab: [
                "المذهب الحنفي",
                "المذهب المالكي",
                "المذهب الشافعي",
                "المذهب الحنبلي"
            ]
        },

        6: {
            judul: "Bab 4 (Kelas 4) — الفرق الإسلامية",
            subbab: [
                "أهل السنة",
                "المعتزلة",
                "الشيعة",
                "فرقة الخوارج",
                "فرقة المرجئة"
            ]
        },

        7: {
            judul: "Bab 5 (Kelas 4) — أشهر علماء الإسلام",
            subbab: [
                "الإمام أبو حنيفة",
                "الإمام مالك",
                "الإمام الشافعي",
                "الإمام أحمد بن حنبل",
                "الإمام البخاري",
                "الإمام الغزالي",
                "الخليل بن أحمد",
                "ابن سينا",
                "ابن رشد"
            ]
        }

    },

    "Qahshasul Anbiya'": {
        1: {
            judul: "آدم عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        2: {
            judul: "إدريس عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        3: {
            judul: "نوح عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        4: {
            judul: "هود عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        5: {
            judul: "صالح عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        6: {
            judul: "إبراهيم عليه السلام والنمرود ملك الكلدانيين",
            subbab: [
                "Checklist"
            ]
        },
        7: {
            judul: "إبراهيم وإسماعيل عليهما السلام",
            subbab: [
                "Checklist"
            ]
        },
        8: {
            judul: "لوط عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        9: {
            judul: "إسحاق عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        10: {
            judul: "يعقوب عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        11: {
            judul: "يوسف عليه السلام مع إخوته",
            subbab: [
                "Checklist"
            ]
        },
        12: {
            judul: "يوسف عليه السلام في مصر",
            subbab: [
                "Checklist"
            ]
        },
        13: {
            judul: "شعيب عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        14: {
            judul: "أيوب عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        15: {
            judul: "ذو الكفل عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        16: {
            judul: "موسى عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        17: {
            judul: "هارون عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        18: {
            judul: "داود عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        19: {
            judul: "سليمان عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        20: {
            judul: "إلياس عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        21: {
            judul: "اليسع عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        22: {
            judul: "يونس عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        23: {
            judul: "زكريا ويحيى عليهما السلام",
            subbab: [
                "أ. قصة زكريا ومريم",
                "ب. مولد يحيى عليه السلام"
            ]
        },
        24: {
            judul: "عيسى عليه السلام",
            subbab: [
                "Checklist"
            ]
        },
        25: {
            judul: "محمد صلى الله عليه وسلم",
            subbab: [
                "Checklist"
            ]
        }
    },

    "Imla": {
        1: {
            judul: "Imla",
            subbab: ["Selesai"]
        }
    },
    "Dictation": {
        1: {
            judul: "Dictation",
            subbab: ["Selesai"]
        }
    },
    "Khat": {
        1: {
            judul: "Khat",
            subbab: ["Selesai"]
        }
    },

    "Tarikh Islam": {
        // ================= KELAS 2 =================
        1: {
            judul: "Buku 1 (Kelas 2) — الدور الأول",
            subbab: [
                "١. سيدنا محمد",
                "٢. نسبه ووفاة والده",
                "٣. ولادته ورضاعته",
                "٤. وفاة أمه وحضانته",
                "٥. تربيته ووفاة جده",
                "٦. رعيه الغنم وسفرته الأولى إلى الشام",
                "٧. سفرته الثانية إلى الشام",
                "٨. زواجه بالسيدة خديجة",
                "٩. حكمه بين قريش في وضع الحجر الأسود",
                "١٠. نشأته صلى الله عليه وسلم",
                "١١. حياته قبل الرسالة"
            ]
        },
        2: {
            judul: "Buku 1 (Kelas 2) — الدور الثاني",
            subbab: [
                "١٢. بدء نزول الوحي",
                "١٣. حالة العرب قبل الإسلام",
                "١٤. الدعوة سراً",
                "١٥. أول المؤمنين",
                "١٦. الدعوة جهراً",
                "١٧. جمعه لعشيرته",
                "١٨. تعصب قريش على النبي صلى الله عليه وسلم",
                "١٩. مجيء قريش لأبي طالب مرة ثانية",
                "٢٠. مجيء قريش لأبي طالب مرة ثالثة",
                "٢١. إيذاء قريش للنبي صلى الله عليه وسلم",
                "٢٢. إيذاء قريش للصحابة",
                "٢٣. مطالب قريش للنبي صلى الله عليه وسلم",
                "٢٤. هجرة الحبشة الأولى",
                "٢٥. إسلام حمزة وعمر",
                "٢٦. حصار النبي صلى الله عليه وسلم وأهل بيته",
                "٢٧. هجرة الحبشة الثانية",
                "٢٨. إسلام ملك الحبشة",
                "٢٩. خروج النبي من الحصار",
                "٣٠. وفد نجران",
                "٣١. وفاة خديجة زواج سودة وعائشة رضي الله عنهما",
                "٣٢. وفاة عمه",
                "٣٣. إيذاء قريش لرسول الله صلى الله عليه وسلم",
                "٣٤. الهجرة إلى الطائف",
                "٣٥. إسراؤه صلى الله عليه وسلم ومعراجه",
                "٣٦. دعوة القبائل إلى الدين",
                "٣٧. بدء إسلام الأنصار",
                "٣٨. بيعة العقبة الأولى",
                "٣٩. بيعة العقبة الثانية",
                "٤٠. هجرة المسلمين إلى المدينة",
                "٤١. اتفاق قريش على قتل الرسول صلى الله عليه وسلم",
                "٤٢. هجرة المصطفى صلى الله عليه وسلم",
                "٤٣. طلب قريش رسول الله صلى الله عليه وسلم",
                "٤٤. خروج النبي صلى الله عليه وسلم من الغار",
                "٤٥. النزول بقباء أول مسجد بني في الإسلام",
                "٤٦. الوصول إلى المدينة أول جمعة في الإسلام أول خطبة في الإسلام",
                "٤٧. دخول الرسول صلى الله عليه وسلم المدينة نزوله وقبول الأنصار للمهاجرين الأخوة الإسلامية",
                "٤٨. هجرة آل البيت من المستضعفين أصل القنوت همّ المدينة"
            ]
        },
        3: {
            judul: "Buku 2 (Kelas 2)",
            subbab: [
                "١. السنة الأولى من الهجرة",
                "٢. يهود المدينة",
                "٣. القتال",
                "٤. السنة الثانية من الهجرة",
                "٥. غزوة بدر الكبرى",
                "٦. البعث بالحق والعدل",
                "٧. المشروعات",
                "٨. السنة الثالثة من الهجرة",
                "٩. غزوة أحد",
                "١٠. ثبات الرسول صلى الله عليه وسلم",
                "١١. القصر",
                "١٢. حوادث",
                "١٣. السنة الرابعة من الهجرة",
                "١٤. حوادث",
                "١٥. السنة الخامسة من الهجرة",
                "١٦. حديث الإفك",
                "١٧. غزوة بني قريظة",
                "١٨. مسألة زيد وزينب",
                "١٩. إبطال التبني",
                "٢٠. آية الحجاب وفريضة الحج",
                "٢١. السنة السادسة من الهجرة",
                "٢٢. غزوة الحديبية وبيعة الرضوان",
                "٢٣. صلح الحديبية",
                "٢٤. السنة السابعة من الهجرة",
                "٢٥. فتح فدك ووادي القرى وتيماء",
                "٢٦. عمرة القضاء",
                "٢٧. حوادث",
                "٢٨. السنة الثامنة من الهجرة",
                "٢٩. غزوة الفتح في العشرين من رمضان",
                "٣٠. اليوم يوم المرحمة",
                "٣١. العفو عند المقدرة",
                "٣٢. البيعة",
                "٣٣. غزوة حنين",
                "٣٤. غزوة الطائف",
                "٣٥. رجوع الرسول صلى الله عليه وسلم إلى المدينة",
                "٣٦. السنة التاسعة من الهجرة",
                "٣٧. تخلف المنافقين",
                "٣٨. رجوع الرسول صلى الله عليه وسلم إلى المدينة",
                "٣٩. السنة العاشرة من الهجرة",
                "٤٠. حجة الوداع",
                "٤١. حوادث",
                "٤٢. تجهيز جيش أسامة",
                "٤٣. مرض الرسول صلى الله عليه وسلم",
                "٤٤. وفاة الرسول صلى الله عليه وسلم",
                "٤٥. دفنه صلى الله عليه وسلم",
                "٤٦. أول السنة الحادية عشرة",
                "٤٧. خاتمة أولاده صلى الله عليه وسلم",
                "٤٨. أزواجه صلى الله عليه وسلم",
                "٤٩. أعمامه وعماته أبناء عبد المطلب",
                "٥٠. هيئته وبعض أحواله صلى الله عليه وسلم",
                "٥١. أهله صلى الله عليه وسلم",
                "٥٢. معجزاته صلى الله عليه وسلم"
            ]
        },

        // ================= KELAS 3 =================
        4: {
            judul: "bab 1 الفصل الثاث، الباب الأول: الخلفاء الراشدون ووظيفتهم",
            subbab: [
                "الخلفاء الراشدون ووظيفتهم"
            ]
        },
        5: {
            judul: "bab 2 الفصل الثاث، الباب الثاني: الخليفة الأول، أبو بكر الصديق رضي الله عنه",
            subbab: [
                "ترجمة حياته",
                "سيرته بعد الإسلام",
                "مبايعته وتولّيه الخلافة",
                "أعماله العظيمة",
                "توحيد الجزيرة العربية بمحاربة المرتدين",
                "التوسع الإسلامي بإرسال الجيش المسلم للسيطرة على العراق والشام",
                "جمع القرآن الكريم",
                "وفاته"
            ]
        },
        6: {
            judul: "bab 3 الفصل الثاث، الباب الثالث: الخليفة الثاني، عمر بن الخطاب",
            subbab: [
                "ترجمة حياته",
                "مبايعته وتوليه الخلافة",
                "إدارة الدولة الإسلامية",
                "الفتوحات في عهده",
                "الفتوحات في بلاد فارس",
                "مبادراته الرائدة",
                "وفاته رضي الله عنه"
            ]
        },
        7: {
            judul: "bab 4 الفصل الثاث، الباب الرابع: الخليفة الثالث، عثمان بن عفان",
            subbab: [
                "ترجمة حياته",
                "مبايعته وتوليه الخلافة",
                "أعماله المهمة",
                "القضاء على الثورات داخل البلاد",
                "إنشاء القوة البحرية الإسلامية عن طريق معاوية بسوريا",
                "التوسع في الأراضي الإسلامية",
                "نسخ المصحف الكريم",
                "مبادراته الرائدة",
                "الثورات الداخلية في عهده",
                "وفاته"
            ]
        },
        8: {
            judul: "bab 5 الفصل الثاث،الباب الخامس: الخليفة الرابع، علي بن أبي طالب",
            subbab: [
                "ترجمة حياته",
                "مبايعته بالخلافة",
                "أول عمله بعد المبايعة",
                "الأحداث التاريخية في عصره",
                "واقعة الجمل",
                "مفاوضة معاوية في البيعة",
                "واقعة صفّين",
                "حادثة التحكيم وآثاره",
                "قتال الخوارج في وقعة النهروان",
                "استيلاء معاوية على معظم ولايات خلافة علي",
                "وفاته"
            ]
        },

        // ================= KELAS 4 =================
        9: {
            judul: "bab 1 الفصل الرابع، الباب الأول: الدولة الأموية",
            subbab: [
                "الفصل الأول: نشأة الدولة الأموية",
                "الفصل الثاني: تطور الدولة الأموية",
                "الفصل الثالث: انحطاط الدولة الأموية"
            ]
        },
        10: {
            judul: "bab 2 الفصل الرابع، الباب الثاني: الدولة العباسية",
            subbab: [
                "الفصل الأول: نشأة الدولة العباسية",
                "الفصل الثاني: تطور الدولة العباسية",
                "الفصل الثالث: انحطاط الدولة العباسية"
            ]
        },
        11: {
            judul: "bab 3 الفصل الرابع، الباب الثالث: الدولة العربية في الأندلس",
            subbab: [
                "الفصل الأول: نشأة الدولة العربية في الأندلس",
                "الفصل الثاني: تطور الدولة العربية في الأندلس",
                "المبحث الأول: تقدم الدولة في الحالة الاجتماعية",
                "المبحث الثاني: تقدم الدولة في الحالة العلمية",
                "الفصل الثالث: انحطاط الدولة العربية في الأندلس"
            ]
        },
        12: {
            judul: "bab 4 الفصل الرابع، الباب الرابع: الدولة الصفوية في إيران",
            subbab: [
                "الفصل الأول: نشأة الدولة الصفوية",
                "الفصل الثاني: تطور الدولة الصفوية",
                "الفصل الثالث: انحطاط الدولة الصفوية"
            ]
        },
        13: {
            judul: "bab 5 الفصل الرابع، الباب الخامس: الدولة المغولية في الهند",
            subbab: [
                "الفصل الأول: نشأة الدولة المغولية في الهند",
                "الفصل الثاني: تطور الدولة المغولية في الهند",
                "الفصل الثالث: انحطاط الدولة المغولية في الهند"
            ]
        },
        14: {
            judul: "bab 6 الفصل الرابع، الباب السادس: الدولة العثمانية في تركيا",
            subbab: [
                "الفصل الأول: نشأة الدولة العثمانية",
                "الفصل الثاني: تطور الدولة العثمانية",
                "الفصل الثالث: انحطاط الدولة العثمانية"
            ]
        },

        15: {
            judul: "bab 7 (Kelas 4) — تاريخ الحضارة الإسلامية",
            subbab: [
                "١. المقدمة",
                "٢. تعريف الحضارة",
                "٣. نشأة الحضارة",
                "٤. عناصر الحضارة وعوامل تكونها",
                "٥. أحوال العالم والعرب قبل الإسلام",
                "٦. ميادين الثقافة",
                "٧. أصول الحضارة الإسلامية",
                "٨. القرآن والسنة",
                "٩. الناحية الدينية",
                "١٠. الناحية الاقتصادية",
                "١١. الناحية الأدبية والناحية العملية",
                "١٢. الناحية السياسية"
            ]
        }

    }

};

// Fungsi bantuan agar sistem tahu jumlah dan nama bab/subbab (Dinamic Checker)
function getJumlahBab(namaPelajaran, kategori) {
    // 1. Jika kategori adalah 'bahas soal', hitung jumlah tahun soal yang sudah diinput (dinamis)
    if (kategori === 'bahas soal') {
        if (nisAktif && databaseSiswa[nisAktif] &&
            databaseSiswa[nisAktif].progressBelajar &&
            databaseSiswa[nisAktif].progressBelajar['bahas soal'] &&
            databaseSiswa[nisAktif].progressBelajar['bahas soal'][namaPelajaran]) {

            return Object.keys(databaseSiswa[nisAktif].progressBelajar['bahas soal'][namaPelajaran]).length;
        }
        return 0; // Jika belum ada tahun soal yang diinput
    }

    // 2. Default: Ambil dari struktur pelajaran statis (Kimia, Biologi, Sosiologi, dll)
    if (STRUKTUR_PELAJARAN[namaPelajaran]) {
        return Object.keys(STRUKTUR_PELAJARAN[namaPelajaran]).length;
    }
    return JUMLAH_BAB; // Kembali ke default 10
}

function getJumlahSubBab(namaPelajaran, nomorBab, kategori) {
    // 1. Jika kategori adalah 'bahas soal', tetapkan jumlah sub-bab selalu 1 (card keterangan jumlah soal)
    if (kategori === 'bahas soal') {
        return 1;
    }

    // 2. Default untuk pelajaran reguler (Kimia, Biologi, Sosiologi, dll)
    if (STRUKTUR_PELAJARAN[namaPelajaran] && STRUKTUR_PELAJARAN[namaPelajaran][nomorBab]) {
        return STRUKTUR_PELAJARAN[namaPelajaran][nomorBab].subbab.length;
    }
    return JUMLAH_SUBBAB; // Kembali ke default 5
}

function getNamaBab(namaPelajaran, nomorBab, kategori) {
    // 1. Jika kategori adalah 'bahas soal', kembalikan teks format tahun soal
    if (kategori === 'bahas soal') {
        return "Soal Tahun " + nomorBab;
    }

    // 2. Default untuk pelajaran reguler (Kimia, Biologi, Sosiologi, dll)
    if (STRUKTUR_PELAJARAN[namaPelajaran] && STRUKTUR_PELAJARAN[namaPelajaran][nomorBab]) {
        const teksJudul = STRUKTUR_PELAJARAN[namaPelajaran][nomorBab].judul;

        // Jika judul sudah mengandung kata "Bab" (seperti di Geografi), langsung cetak apa adanya
        if (teksJudul.toLowerCase().includes("bab")) {
            return teksJudul;
        }

        // Jika tidak ada kata "Bab" (seperti Kimia/Sosiologi), otomatis tambahkan nomor babnya
        return "Bab " + nomorBab + ". " + teksJudul;
    }
    return "Bab " + nomorBab;
}

function getNamaSubBab(namaPelajaran, nomorBab, nomorSubBab, kategori) {
    // 1. Jika kategori adalah 'bahas soal', tampilkan keterangan jumlah soal
    if (kategori === 'bahas soal') {
        const siswa = databaseSiswa[nisAktif];
        let jumlahSoal = 0;
        if (siswa && siswa.progressBelajar && siswa.progressBelajar['bahas soal'] && siswa.progressBelajar['bahas soal'][namaPelajaran]) {
            const dataPel = siswa.progressBelajar['bahas soal'][namaPelajaran];
            if (dataPel[nomorBab] && typeof dataPel[nomorBab] === 'object' && dataPel[nomorBab].jumlah !== undefined) {
                jumlahSoal = dataPel[nomorBab].jumlah;
            }
        }
        return `Keterangan: ${jumlahSoal} Nomor Soal`;
    }

    // 2. Default untuk pelajaran reguler (Kimia, Biologi, Sosiologi, dll)
    if (STRUKTUR_PELAJARAN[namaPelajaran] && STRUKTUR_PELAJARAN[namaPelajaran][nomorBab]) {
        return STRUKTUR_PELAJARAN[namaPelajaran][nomorBab].subbab[nomorSubBab - 1];
    }
    return "Sub Bab " + nomorSubBab;
}

const programState = {};
DAFTAR_KATEGORI.forEach(kategori => {
    programState[kategori] = { selectedSubject: null, selectedBab: null, completed: {} };
});

function getCompletedSubBabSet(kategori, namaPelajaran, nomorBab) {
    // Pastikan struktur objek programState terinisialisasi
    if (!programState[kategori]) programState[kategori] = { completed: {} };
    if (!programState[kategori].completed[namaPelajaran]) programState[kategori].completed[namaPelajaran] = {};

    // Jika state untuk bab ini belum ada, tarik dari databaseSiswa (Berlaku untuk SEMUA Kategori)
    if (!programState[kategori].completed[namaPelajaran][nomorBab]) {
        let initialData = [];
        const siswa = databaseSiswa[nisAktif];
        const dataProgres = siswa?.progressBelajar?.[kategori]?.[namaPelajaran]?.[nomorBab];

        if (dataProgres) {
            // Tangani berbagai variasi format data yang tersimpan di database
            if (Array.isArray(dataProgres)) {
                initialData = dataProgres;
            } else if (typeof dataProgres === 'object') {
                if (Array.isArray(dataProgres.completed)) {
                    initialData = dataProgres.completed;
                } else if (dataProgres instanceof Set) {
                    initialData = Array.from(dataProgres);
                }
            }
        }
        
        programState[kategori].completed[namaPelajaran][nomorBab] = new Set(initialData);
    }

    // Konversi Array ke Set jika data berasal dari localStorage / JSON parsing
    let data = programState[kategori].completed[namaPelajaran][nomorBab];
    if (Array.isArray(data)) {
        data = new Set(data);
        programState[kategori].completed[namaPelajaran][nomorBab] = data;
    }

    return data;
}

function hitungSubBabSelesaiAkurat(kategori, namaPelajaran, nomorBab) {
    // 1. Pastikan data siswa dan struktur database tersedia
    if (!nisAktif || !databaseSiswa[nisAktif] || !databaseSiswa[nisAktif].progressBelajar) {
        return 0;
    }
    
    const progresSiswa = databaseSiswa[nisAktif].progressBelajar;
    
    // 2. Jika belum ada progres sama sekali di bab ini, kembalikan 0
    if (!progresSiswa[kategori] || !progresSiswa[kategori][namaPelajaran] || !progresSiswa[kategori][namaPelajaran][nomorBab]) {
        return 0;
    }

    const dataBab = progresSiswa[kategori][namaPelajaran][nomorBab];

    // 3. Logika perhitungan khusus 'Bahas Soal' (Membaca properti "completed")
    if (kategori === 'bahas soal') {
        if (dataBab && Array.isArray(dataBab.completed)) {
            return dataBab.completed.length;
        }
        return 0;
    }

    // 4. Logika perhitungan 'Kategori Reguler' (Langsung menghitung panjang Array)
    if (Array.isArray(dataBab)) {
        return dataBab.length; 
    }

    // 5. Fallback pencegah error (jika data rusak / tersimpan dalam format objek atau Set)
    if (dataBab instanceof Set) {
        return dataBab.size;
    }
    if (typeof dataBab === 'object') {
         return Object.values(dataBab).filter(v => v === true).length;
    }

    return 0;
}


// 1. Fungsi Pengecek Status Selesai (Diperbaiki agar mendeteksi kategori "bahas soal")
function isBabSelesai(kategori, namaPelajaran, nomorBab) {
    // Tambahkan 'kategori' di sini agar getJumlahSubBab tahu jika ini adalah "bahas soal"
    const batasSubBab = getJumlahSubBab(namaPelajaran, nomorBab, kategori);
    const completedSet = getCompletedSubBabSet(kategori, namaPelajaran, nomorBab);

    let jumlahSelesai = 0;
    // Hitung manual agar lebih akurat
    for (let i = 1; i <= batasSubBab; i++) {
        if (completedSet.has(i) || completedSet.has(String(i))) {
            jumlahSelesai++;
        }
    }
    return jumlahSelesai >= batasSubBab;
}

// Fungsi baru untuk mengecek apakah bab sudah selesai di SEMUA program
function isBabTuntasSemuaProgram(namaPelajaran, nomorBab) {
    return DAFTAR_KATEGORI.every(kategori => {
        const state = programState[kategori];
        const data = state && state.completed[namaPelajaran] && state.completed[namaPelajaran][nomorBab];

        if (!data) return false;

        // Hitung jumlah item (handle Set dan Array)
        const count = (data instanceof Set) ? data.size : (Array.isArray(data) ? data.length : 0);
        const totalSubBab = getJumlahSubBab(namaPelajaran, nomorBab);

        return totalSubBab > 0 && count === totalSubBab;
    });
}

function isPelajaranSelesai(namaPelajaran) {
    const jmlBab = getJumlahBab(namaPelajaran);
    for (let b = 1; b <= jmlBab; b++) {
        // Jika ada satu bab saja yang belum tuntas 4 program, maka pelajaran dianggap belum selesai
        if (!isBabTuntasSemuaProgram(namaPelajaran, b)) return false;
    }
    return true;
}

function isPelajaranSelesaiDiProgram(kategori, namaPelajaran) {
    const jmlBab = getJumlahBab(namaPelajaran);
    if (jmlBab === 0) return false;

    for (let b = 1; b <= jmlBab; b++) {
        if (!isBabSelesai(kategori, namaPelajaran, b)) {
            return false;
        }
    }
    return true;
}


// 2. Fungsi Render Daftar Bab (Mendukung Bab Statis & Bahas Soal Dinamis)
function renderDaftarBab(kategori, namaPelajaran) {
    const babContainer = document.getElementById("chapter-cards-container-" + kategori);
    if (!babContainer) return;

    babContainer.innerHTML = "";

    // --- LOGIKA KHUSUS KATEGORI "bahas soal" ---
    if (kategori === "bahas soal") {
        // 1. Render Form Input Tahun & Jumlah Soal
        const formDiv = document.createElement("div");
        formDiv.style.cssText = "background: #fdf6f5; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #f9ecea;";
        formDiv.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #8c2222; font-size: 14px;"><i class="fas fa-plus-circle"></i> Tambah Tahun & Jumlah Soal</h4>
            <div style="margin-bottom: 8px;">
                <input type="text" id="input-tahun-soal-bahas-soal" placeholder="Tahun Soal (Contoh: 2025)" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px;">
            </div>
            <div style="margin-bottom: 10px;">
                <input type="number" id="input-jumlah-soal-bahas-soal" placeholder="Jumlah Nomor Soal (Contoh: 10)" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px;" min="1">
            </div>
            <button type="button" onclick="tambahBahasSoalBaru('${kategori}', '${namaPelajaran}')" style="width: 100%; padding: 8px; background: #8c2222; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px;">Tambah Tahun Soal</button>
        `;
        babContainer.appendChild(formDiv);

        // 2. Ambil data bahas soal yang sudah tersimpan untuk siswa aktif
        const siswa = databaseSiswa[nisAktif];
        const dataBahasSoal = (siswa && siswa.progressBelajar && siswa.progressBelajar['bahas soal'] && siswa.progressBelajar['bahas soal'][namaPelajaran]) || {};

        const listContainer = document.createElement("div");
        const tahunKeys = Object.keys(dataBahasSoal);

        if (tahunKeys.length === 0) {
            listContainer.innerHTML = `<p style="text-align: center; color: #777; font-style: italic; font-size: 13px; padding: 10px;">Belum ada tahun soal yang ditambahkan.</p>`;
        } else {
            tahunKeys.forEach(tahun => {
                const detailSoal = dataBahasSoal[tahun];
                const jumlahSoal = (typeof detailSoal === 'object' && detailSoal.jumlah) ? detailSoal.jumlah : 5;

                // Cek status tuntas (untuk memberikan warna hijau jika seluruh nomor soal di tahun tersebut selesai)
                const tuntas = isBabSelesai(kategori, namaPelajaran, tahun);

                // Buat Card Tahun (Bab)
                const babCard = document.createElement("div");
                babCard.className = "subject-card";
                babCard.dataset.bab = tahun;

                if (tuntas) {
                    babCard.style.backgroundColor = "#e6f4ea";
                    babCard.style.color = "#1e8e3e";
                    babCard.style.borderColor = "#1e8e3e";
                }

                // Layout Card dengan Teks Informasi dan Tombol Hapus di sebelah kanan
                babCard.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <span>Soal Tahun ${tahun} (${jumlahSoal} Nomor) ${tuntas ? '<i class="fas fa-check-circle" style="margin-left: 5px;"></i>' : ''}</span>
                        <button type="button" onclick="event.stopPropagation(); hapusBahasSoal('${kategori}', '${namaPelajaran}', '${tahun}')" style="background: none; border: none; color: #d9534f; cursor: pointer; font-size: 14px; padding: 4px 8px;" title="Hapus Tahun Soal">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

                // Saat card diklik, buka halaman sub-bab (berisi 1 card keterangan jumlah soal)
                babCard.addEventListener("click", () => bukaBab(kategori, namaPelajaran, tahun));
                listContainer.appendChild(babCard);
            });
        }
        babContainer.appendChild(listContainer);
        return;
    }

    // --- LOGIKA STANDAR (KIMIA, BIOLOGI, SOSIOLOGI, DLL) ---
    const jmlBab = getJumlahBab(namaPelajaran, kategori);

    for (let nomorBab = 1; nomorBab <= jmlBab; nomorBab++) {
        const babCard = document.createElement("div");
        babCard.className = "subject-card";
        babCard.dataset.bab = String(nomorBab);

        const tuntas = isBabSelesai(kategori, namaPelajaran, nomorBab);

        if (tuntas) {
            babCard.style.backgroundColor = "#e6f4ea";
            babCard.style.color = "#1e8e3e";
            babCard.style.borderColor = "#1e8e3e";
            babCard.innerHTML = `<span>${getNamaBab(namaPelajaran, nomorBab, kategori)}</span> <i class="fas fa-check-circle" style="float: right; margin-top: 3px;"></i>`;
        } else {
            babCard.textContent = getNamaBab(namaPelajaran, nomorBab, kategori);
        }

        babCard.addEventListener("click", () => bukaBab(kategori, namaPelajaran, nomorBab));
        babContainer.appendChild(babCard);
    }
}

function toggleSubBabBahasSoal(namaPelajaran, tahun, nomorSoal) {
    if (!nisAktif || !databaseSiswa[nisAktif]) return;

    if (!databaseSiswa[nisAktif].progressBelajar) databaseSiswa[nisAktif].progressBelajar = {};
    if (!databaseSiswa[nisAktif].progressBelajar['bahas soal']) databaseSiswa[nisAktif].progressBelajar['bahas soal'] = {};
    if (!databaseSiswa[nisAktif].progressBelajar['bahas soal'][namaPelajaran]) databaseSiswa[nisAktif].progressBelajar['bahas soal'][namaPelajaran] = {};

    let tahunData = databaseSiswa[nisAktif].progressBelajar['bahas soal'][namaPelajaran][tahun];
    if (!tahunData || typeof tahunData !== 'object') {
        tahunData = { jumlah: 5, completed: [] };
    }

    let completedArr = Array.isArray(tahunData.completed) ? tahunData.completed : [];

    // Cek apakah nomor sudah dicentang
    const index = completedArr.findIndex(val => String(val) === String(nomorSoal));
    let isChecked = false;

    if (index > -1) {
        completedArr.splice(index, 1); // Batalkan centang (uncheck)
    } else {
        completedArr.push(parseInt(nomorSoal)); // Centang (check)
        isChecked = true; // Tandai bahwa ini adalah aksi mencentang
    }

    tahunData.completed = completedArr;
    databaseSiswa[nisAktif].progressBelajar['bahas soal'][namaPelajaran][tahun] = tahunData;

    // Simpan otomatis ke localStorage & Firebase
    simpanProgresSiswaAktif();

    // Refresh tampilan card agar warna tombol langsung berubah hijau/abu-abu
    renderDaftarBab('bahas soal', namaPelajaran);
    
    // PEMANGGILAN STATISTIK PRIBADI
    if (typeof updateStatistik === 'function') updateStatistik();

    // ==========================================
    // PERBAIKAN: PEREKAM AKTIVITAS GURU
    // ==========================================
    if (isChecked && typeof catatAktivitasGuru === 'function') {
        catatAktivitasGuru(`Menerima setoran Bahas Soal: ${namaPelajaran}`);
    }
}

// 3. Fungsi Render Sub-Bab (Diperkuat agar ceklis lama tidak hilang)
function renderDaftarSubBab(kategori, namaPelajaran, nomorBab) {
    const subbabContainer = document.getElementById("subbab-cards-container-" + kategori);
    if (!subbabContainer) return;

    const completedSet = getCompletedSubBabSet(kategori, namaPelajaran, nomorBab);
    const jmlSubBab = getJumlahSubBab(namaPelajaran, nomorBab, kategori); // Tambahkan parameter kategori di sini

    subbabContainer.innerHTML = "";
    for (let nomorSubBab = 1; nomorSubBab <= jmlSubBab; nomorSubBab++) {
        const subBabCard = document.createElement("label");
        subBabCard.className = "subject-card subbab-item";
        subBabCard.dataset.subbab = String(nomorSubBab);

        // Ceklis ganda untuk antisipasi perbedaan format data lama
        const isChecked = completedSet.has(nomorSubBab) || completedSet.has(String(nomorSubBab));
        if (isChecked) {
            subBabCard.classList.add("selected");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "subbab-checkbox";
        checkbox.checked = isChecked;
        checkbox.addEventListener("change", () => {
            toggleSubBab(kategori, namaPelajaran, nomorBab, nomorSubBab, subBabCard, checkbox.checked);
        });

        const teks = document.createElement("span");
        teks.textContent = getNamaSubBab(namaPelajaran, nomorBab, nomorSubBab, kategori); // Tambahkan parameter kategori di sini

        subBabCard.appendChild(checkbox);
        subBabCard.appendChild(teks);
        subbabContainer.appendChild(subBabCard);
    }
}

// 4. Fungsi Toggle Sub-Bab (Jantung pewarnaan realtime dan link ke Tabel Guru)
function toggleSubBab(kategori, namaPelajaran, nomorBab, nomorSubBab, element, isChecked) {
    const completedSet = getCompletedSubBabSet(kategori, namaPelajaran, nomorBab);

    // Update data di memori sementara
    if (isChecked) completedSet.add(Number(nomorSubBab));
    else {
        completedSet.delete(Number(nomorSubBab));
        completedSet.delete(String(nomorSubBab));
    }

    // --- PERBAIKAN KUNCI: Simpan ke databaseSiswa untuk SEMUA kategori ---
    if (nisAktif && databaseSiswa[nisAktif]) {
        if (!databaseSiswa[nisAktif].progressBelajar) databaseSiswa[nisAktif].progressBelajar = {};
        if (!databaseSiswa[nisAktif].progressBelajar[kategori]) databaseSiswa[nisAktif].progressBelajar[kategori] = {};
        if (!databaseSiswa[nisAktif].progressBelajar[kategori][namaPelajaran]) databaseSiswa[nisAktif].progressBelajar[kategori][namaPelajaran] = {};

        if (kategori === 'bahas soal') {
            let detailTahun = databaseSiswa[nisAktif].progressBelajar['bahas soal'][namaPelajaran][nomorBab];
            if (!detailTahun || typeof detailTahun !== 'object') {
                detailTahun = { jumlah: 1, completed: [] };
            }
            detailTahun.completed = Array.from(completedSet);
            databaseSiswa[nisAktif].progressBelajar['bahas soal'][namaPelajaran][nomorBab] = detailTahun;
        } else {
            // Untuk kategori reguler, simpan langsung Array dari Set
            databaseSiswa[nisAktif].progressBelajar[kategori][namaPelajaran][nomorBab] = Array.from(completedSet);
        }
    }
    // ----------------------------------------------------------------------

    // Refresh UI secara paksa
    if (element) element.classList.toggle("selected", isChecked);

    // Cek status terbaru (per-program, sesuai kategori yang sedang aktif)
    const statusSelesai = isBabSelesai(kategori, namaPelajaran, nomorBab);

    // 1. Update visual kartu bab (di Daftar Bab)
    const babContainer = document.getElementById("chapter-cards-container-" + kategori);
    if (babContainer) {
        const babCard = babContainer.querySelector(`[data-bab="${nomorBab}"]`);
        if (babCard) {
            if (statusSelesai) {
                babCard.style.backgroundColor = "#e6f4ea";
                babCard.style.color = "#1e8e3e";
                babCard.style.borderColor = "#1e8e3e";
                if (!babCard.querySelector('.fa-check-circle')) {
                    babCard.innerHTML += ' <i class="fas fa-check-circle" style="float: right; margin-top: 3px;"></i>';
                }
            } else {
                babCard.style.backgroundColor = "";
                babCard.style.color = "";
                babCard.style.borderColor = "";
                const icon = babCard.querySelector('.fa-check-circle');
                if (icon) icon.remove();
            }
        }
    }

    // 2. Update Badge Judul (Atas)
    const babTerpilih = document.getElementById("nama-bab-terpilih-" + kategori);
    if (babTerpilih) {
        const namaBabAsli = getNamaBab(namaPelajaran, nomorBab) + " - " + namaPelajaran;
        babTerpilih.innerHTML = statusSelesai
            ? `${namaBabAsli} <span style="color:#1e8e3e; background:#e6f4ea; padding:4px 10px; border-radius:20px; font-size:13px; margin-left:10px;"><i class="fas fa-check-circle"></i> Selesai</span>`
            : namaBabAsli;
    }

    // 3. Update badge kartu Pelajaran (Level 3) tanpa merusak tampilan aktif
    if (typeof refreshBadgePelajaran === 'function') refreshBadgePelajaran(kategori);

    simpanProgresSiswaAktif(); // Pastikan ini menyimpan ke localStorage
    if (typeof renderTabelTarget === 'function') renderTabelTarget();

    // 4. Auto-refresh Statistik
    if (typeof renderStatistikGlobal === 'function') renderStatistikGlobal();
    
    // PEMANGGILAN STATISTIK PRIBADI (Ini yang membuat UI Persentase merespons)
    if (typeof updateStatistik === 'function') updateStatistik();

    // [FITUR LAMA] Catat Recent Activity Dashboard HANYA saat guru MENCENTANG
    if (isChecked && typeof catatAktivitasChecklist === 'function') {
        catatAktivitasChecklist(kategori, namaPelajaran, nomorBab, nomorSubBab);
    }

    // ==========================================
    // PERBAIKAN: PEREKAM AKTIVITAS LEADERBOARD GURU
    // ==========================================
    if (isChecked && typeof catatAktivitasGuru === 'function') {
        // Kapitalisasi nama kategori agar rapi (misal "bacaan" jadi "Bacaan")
        const namaKategori = kategori.charAt(0).toUpperCase() + kategori.slice(1);
        catatAktivitasGuru(`Menerima setoran ${namaKategori}: ${namaPelajaran}`);
    }
}

function renderDaftarPelajaran(kategori) {
    const container = document.getElementById("program-content-" + kategori);
    if (!container) return;

    // --- BAGIAN INI YANG DIUPDATE ---
    const subjectCardsHtml = DAFTAR_PELAJARAN.map(nama => {
        // Cek apakah pelajaran ini sudah tuntas di program (kategori) yang sedang aktif
        const tuntas = isPelajaranSelesaiDiProgram(kategori, nama);

        // Tentukan style jika tuntas
        const styleInline = tuntas ? 'style="background-color: #e6f4ea; color: #1e8e3e; border-color: #1e8e3e;"' : '';
        const icon = tuntas ? '<i class="fas fa-check-circle" style="float: right; margin-top: 3px;"></i>' : '';

        return `<div class="subject-card" data-subject="${escapeHtml(nama)}" ${styleInline}>
                    ${escapeHtml(nama)} ${icon}
                </div>`;
    }).join("");
    // ---------------------------------

    container.innerHTML = `
        <div class="subject-cards-container" id="subject-list-${kategori}">
            ${subjectCardsHtml}
        </div>

        <div id="chapter-list-${kategori}" class="hidden">
            <button class="btn-back" data-action="back-to-subjects">← Kembali ke Daftar Pelajaran</button>
            <h4 id="nama-subjek-terpilih-${kategori}">Pelajaran</h4>
            <div class="subject-cards-container" id="chapter-cards-container-${kategori}"></div>
        </div>

        <div id="subbab-list-${kategori}" class="hidden">
            <button class="btn-back" data-action="back-to-chapters">← Kembali ke Daftar Bab</button>
            <h4 id="nama-bab-terpilih-${kategori}">Bab</h4>
            <div class="subject-cards-container" id="subbab-cards-container-${kategori}"></div>
        </div>
    `;

    container.querySelectorAll(".subject-card").forEach(card => {
        card.addEventListener("click", () => {
            bukaPelajaran(kategori, card.dataset.subject);
        });
    });

    const btnBackSubjects = container.querySelector('[data-action="back-to-subjects"]');
    if (btnBackSubjects) {
        btnBackSubjects.addEventListener("click", () => backToSubjects(kategori));
    }

    const btnBackChapters = container.querySelector('[data-action="back-to-chapters"]');
    if (btnBackChapters) {
        btnBackChapters.addEventListener("click", () => backToChapters(kategori));
    }
}

function refreshBadgePelajaran(kategori) {
    const subjectList = document.getElementById("subject-list-" + kategori);
    if (!subjectList) return;

    subjectList.querySelectorAll(".subject-card").forEach(card => {
        const namaPelajaran = card.dataset.subject;
        if (!namaPelajaran) return;

        const tuntas = isPelajaranSelesaiDiProgram(kategori, namaPelajaran);
        const iconLama = card.querySelector('.fa-check-circle');

        if (tuntas) {
            card.style.backgroundColor = "#e6f4ea";
            card.style.color = "#1e8e3e";
            card.style.borderColor = "#1e8e3e";
            if (!iconLama) {
                card.innerHTML += ' <i class="fas fa-check-circle" style="float: right; margin-top: 3px;"></i>';
            }
        } else {
            card.style.backgroundColor = "";
            card.style.color = "";
            card.style.borderColor = "";
            if (iconLama) iconLama.remove();
        }
    });
}

function bukaBab(kategori, namaPelajaran, nomorBab) {
    programState[kategori].selectedBab = nomorBab;

    const babTerpilih = document.getElementById("nama-bab-terpilih-" + kategori);

    if (babTerpilih) {
        const namaBabAsli = getNamaBab(namaPelajaran, nomorBab) + " - " + namaPelajaran;

        // Logika Badge: Gunakan pengecekan per-program (kategori yang sedang dibuka)
        if (isBabSelesai(kategori, namaPelajaran, nomorBab)) {
            babTerpilih.innerHTML = namaBabAsli + ' <span style="color:#1e8e3e; background:#e6f4ea; padding:4px 10px; border-radius:20px; font-size:13px; margin-left:10px;"><i class="fas fa-check-circle"></i> Selesai</span>';
        } else {
            babTerpilih.innerHTML = namaBabAsli;
        }
    }

    renderDaftarSubBab(kategori, namaPelajaran, nomorBab);

    const chapterList = document.getElementById("chapter-list-" + kategori);
    if (chapterList) chapterList.classList.add("hidden");

    const subbabList = document.getElementById("subbab-list-" + kategori);
    if (subbabList) subbabList.classList.remove("hidden");
}

function backToChapters(kategori) {
    const subbabList = document.getElementById("subbab-list-" + kategori);
    if (subbabList) subbabList.classList.add("hidden");

    const chapterList = document.getElementById("chapter-list-" + kategori);
    if (chapterList) chapterList.classList.remove("hidden");

    programState[kategori].selectedBab = null;
}

function pilihKategori(kategori) {
    const cardsContainer = document.querySelector(".program-cards-container");
    if (cardsContainer) cardsContainer.style.display = "none";

    const area = document.getElementById("daftar-pelajaran-area");
    if (area) area.classList.remove("hidden");

    document.querySelectorAll(".pelajaran-content").forEach(el => el.classList.remove("active"));

    const targetKonten = document.getElementById("program-content-" + kategori);
    if (targetKonten) {
        targetKonten.classList.add("active");

        if (!targetKonten.dataset.rendered) {
            renderDaftarPelajaran(kategori);
            targetKonten.dataset.rendered = "true";
        }
    }

    const judul = document.getElementById("nama-kategori-terpilih");
    if (judul) judul.textContent = "Pilihan: " + kategori.charAt(0).toUpperCase() + kategori.slice(1);
}

function kembaliKeKategori() {
    const cardsContainer = document.querySelector(".program-cards-container");
    if (cardsContainer) cardsContainer.style.display = "grid";

    const area = document.getElementById("daftar-pelajaran-area");
    if (area) area.classList.add("hidden");

    document.querySelectorAll(".pelajaran-content").forEach(el => el.classList.remove("active"));
}

function bukaPelajaran(kategori, namaPelajaran) {
    programState[kategori].selectedSubject = namaPelajaran;

    const subjekTerpilih = document.getElementById("nama-subjek-terpilih-" + kategori);
    if (subjekTerpilih) subjekTerpilih.textContent = "Pelajaran: " + namaPelajaran;

    renderDaftarBab(kategori, namaPelajaran);

    const subjectList = document.getElementById("subject-list-" + kategori);
    if (subjectList) subjectList.style.display = "none";

    const chapterList = document.getElementById("chapter-list-" + kategori);
    if (chapterList) chapterList.classList.remove("hidden");
}

function backToSubjects(kategori) {
    const subbabList = document.getElementById("subbab-list-" + kategori);
    if (subbabList) subbabList.classList.add("hidden");

    const chapterList = document.getElementById("chapter-list-" + kategori);
    if (chapterList) chapterList.classList.add("hidden");

    const subjectList = document.getElementById("subject-list-" + kategori);
    if (subjectList) subjectList.style.display = "grid";

    programState[kategori].selectedSubject = null;
    programState[kategori].selectedBab = null;
}

/* ==================================================================
   4b. PENYIMPANAN PROGRES BELAJAR PER SISWA
   ================================================================== */
let nisAktif = null;

let lastLocalUpdateTimestamp = 0; // Pengaman anti-tabrakan data

function ubahCompletedKeArray(completedObj, kategori) {
    const hasil = {};
    if (!completedObj) return hasil;

    Object.keys(completedObj).forEach(namaPelajaran => {
        hasil[namaPelajaran] = {};
        Object.keys(completedObj[namaPelajaran]).forEach(key => {
            const item = completedObj[namaPelajaran][key];

            // KHUSUS KATEGORI "bahas soal": Simpan dalam bentuk objek { jumlah, completed }
            if (kategori === 'bahas soal') {
                const dataLama = databaseSiswa[nisAktif] &&
                    databaseSiswa[nisAktif].progressBelajar &&
                    databaseSiswa[nisAktif].progressBelajar['bahas soal'] &&
                    databaseSiswa[nisAktif].progressBelajar['bahas soal'][namaPelajaran] &&
                    databaseSiswa[nisAktif].progressBelajar['bahas soal'][namaPelajaran][key];

                const jumlahSoal = (dataLama && typeof dataLama === 'object' && dataLama.jumlah) ? dataLama.jumlah : 5;
                const completedArr = item instanceof Set ? Array.from(item) : (Array.isArray(item) ? item : []);

                hasil[namaPelajaran][key] = {
                    jumlah: jumlahSoal,
                    completed: completedArr
                };
                return;
            }

            // Kategori reguler (bacaan, pemahaman, rangkuman, hafalan)
            if (item instanceof Set) {
                hasil[namaPelajaran][key] = Array.from(item);
            } else if (Array.isArray(item)) {
                hasil[namaPelajaran][key] = item;
            } else {
                hasil[namaPelajaran][key] = [];
            }
        });
    });
    return hasil;
}

function ubahCompletedKeSet(dataTersimpan, kategori) {
    const hasil = {};
    if (!dataTersimpan) return hasil;

    Object.keys(dataTersimpan).forEach(namaPelajaran => {
        hasil[namaPelajaran] = {};
        if (dataTersimpan[namaPelajaran]) {
            Object.keys(dataTersimpan[namaPelajaran]).forEach(nomorBab => {
                const val = dataTersimpan[namaPelajaran][nomorBab];

                // KHUSUS KATEGORI "bahas soal": Ambil array dari properti .completed
                if (kategori === 'bahas soal') {
                    const arr = (val && typeof val === 'object' && Array.isArray(val.completed)) ? val.completed : (Array.isArray(val) ? val : []);
                    hasil[namaPelajaran][nomorBab] = new Set(arr);
                    return;
                }

                // AMAN: Jika val bernilai null, undefined, atau dihapus Firebase, 
                // otomatis diubah menjadi array kosong agar Set menjadi kosong (ter-uncheck)
                hasil[namaPelajaran][nomorBab] = new Set(Array.isArray(val) ? val : []);
            });
        }
    });
    return hasil;
}

function resetNavigasiSemuaKategori() {
    DAFTAR_KATEGORI.forEach(kategori => {
        const subjectList = document.getElementById("subject-list-" + kategori);
        if (subjectList) subjectList.style.display = "grid";

        const chapterList = document.getElementById("chapter-list-" + kategori);
        if (chapterList) chapterList.classList.add("hidden");

        const subbabList = document.getElementById("subbab-list-" + kategori);
        if (subbabList) subbabList.classList.add("hidden");
    });

    kembaliKeKategori();
}

function muatProgresSiswa(nis) {
    nisAktif = nis;
    const siswa = databaseSiswa[nis];

    // --- KODE PEMBERSIH DATA SAMPAH (JUNK CLEANER) ---
    // Menghapus data tahun 1-30 yang nyasar di pelajaran lain akibat bug
    if (siswa && siswa.progressBelajar && siswa.progressBelajar['bahas soal']) {
        let adaSampah = false;
        Object.keys(siswa.progressBelajar['bahas soal']).forEach(pelajaran => {
            const dataPel = siswa.progressBelajar['bahas soal'][pelajaran];
            Object.keys(dataPel).forEach(tahun => {
                // Jika tahun berupa angka 1 sampai 30, itu adalah sampah! Hapus!
                if (!isNaN(tahun) && Number(tahun) <= 30) {
                    delete dataPel[tahun];
                    adaSampah = true;
                }
            });
        });
        if (adaSampah) simpanKeStorage(); // Simpan jika ada yang dibersihkan
    }
    // -------------------------------------------------

    const progresTersimpan = (siswa && siswa.progressBelajar) ? siswa.progressBelajar : {};

    DAFTAR_KATEGORI.forEach(kategori => {
        programState[kategori] = {
            selectedSubject: null,
            selectedBab: null,
            completed: ubahCompletedKeSet(progresTersimpan[kategori], kategori)
        };
    });

    resetNavigasiSemuaKategori();

    if (typeof switchDetailTab === 'function') switchDetailTab('program');
    updateStatistik();
}

function simpanProgresSiswaAktif() {
    if (!nisAktif || !databaseSiswa[nisAktif]) return;

    // Catat waktu klik lokal agar tidak tertimpa data firebase sesaat
    lastLocalUpdateTimestamp = Date.now();

    // 1. Amankan data progres yang sudah ada di database (Jangan ditimpa dari nol)
    let progresSiswa = databaseSiswa[nisAktif].progressBelajar || {};

    // 2. Update secara spesifik HANYA data yang ada di programState saat ini
    if (typeof programState === 'object') {
        DAFTAR_KATEGORI.forEach(kategori => {
            // Abaikan bahas soal karena strukturnya berbeda dan sudah aman
            if (kategori !== 'bahas soal' && programState[kategori] && programState[kategori].completed) {
                if (!progresSiswa[kategori]) progresSiswa[kategori] = {};
                
                const dataPelajaran = programState[kategori].completed;
                Object.keys(dataPelajaran).forEach(pelajaran => {
                    if (!progresSiswa[kategori][pelajaran]) progresSiswa[kategori][pelajaran] = {};
                    
                    Object.keys(dataPelajaran[pelajaran]).forEach(bab => {
                        const nilaiBab = dataPelajaran[pelajaran][bab];
                        // Konversi tipe Set ke Array sebelum masuk ke LocalStorage/Firebase
                        progresSiswa[kategori][pelajaran][bab] = (nilaiBab instanceof Set) 
                            ? Array.from(nilaiBab) 
                            : Array.isArray(nilaiBab) ? nilaiBab : [];
                    });
                });
            }
        });
    }

    // Kembalikan objek yang sudah diperbarui dengan aman ke database utama
    databaseSiswa[nisAktif].progressBelajar = progresSiswa;

    // 3. Simpan ke LocalStorage & Firebase
    try {
        localStorage.setItem('databaseSiswa', JSON.stringify(databaseSiswa));
    } catch (err) {
        console.error("Gagal menyimpan ke localStorage:", err);
    }

    if (typeof firebaseDb !== 'undefined' && nisAktif) {
        firebaseDb.ref('databaseSiswa/' + nisAktif).set(databaseSiswa[nisAktif])
            .catch(err => console.error("Gagal sinkron progres ke Firebase:", err));
    }

    // 4. Panggil pembaruan visual
    if (typeof updateStatistik === 'function') updateStatistik();
    if (typeof renderTabelTarget === 'function') renderTabelTarget();
    if (typeof renderStatistikGlobal === 'function') renderStatistikGlobal();
}

function simpanProgresManual() {
    if (!nisAktif) {
        alert("Tidak ada data siswa yang sedang dibuka.");
        return;
    }

    simpanProgresSiswaAktif();

    if (typeof catatAktivitasGuru === "function") {
        catatAktivitasGuru("Menyimpan/Menceklist progress pelajaran siswa");
    }

    alert("Progres belajar siswa berhasil disimpan!");
}

let riwayatAbsensi = [];

function muatAbsensiDariStorage() {
    try {
        const data = localStorage.getItem('riwayatAbsensi');
        riwayatAbsensi = data ? JSON.parse(data) : [];
    } catch (err) { riwayatAbsensi = []; }
}

/* ==================================================================
   5. INISIALISASI DOM
   ================================================================== */
let html5QrcodeScanner = null;

document.addEventListener("DOMContentLoaded", () => {
    loadDataDariStorage();
    muatAbsensiDariStorage();
    inisialisasiFormTarget();

    // TARIK DATA TERBARU DARI FIREBASE SAAT WEB DIBUKA
    if (typeof sinkronisasiFirebaseAwal === 'function') sinkronisasiFirebaseAwal();

    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("data-target");

            navLinks.forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");

            pindahHalaman(targetId);
        });
    });

    try {
        const readerElement = document.getElementById("reader");
        if (readerElement && typeof Html5QrcodeScanner !== "undefined") {
            html5QrcodeScanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 }, facingMode: "environment" },
                false
            );
            html5QrcodeScanner.render(onScanSuccess);
        }
    } catch (err) {
        console.error("Gagal menginisialisasi scanner kamera:", err);
    }

    // --- EVENT LISTENER SCANNER FILE GAMBAR BARCODE ---
    const fileInput = document.getElementById('qr-input-file');
    if (fileInput) {
        fileInput.addEventListener('change', e => {
            if (e.target.files.length > 0) prosesFileGambarBarcode(e.target.files[0]);
        });
    }

    const btnBukaModal = document.getElementById('btn-buka-modal');
    if (btnBukaModal) btnBukaModal.addEventListener('click', bukaModal);

    const btnSimpanManual = document.getElementById('btn-simpan-manual');
    if (btnSimpanManual) btnSimpanManual.addEventListener('click', simpanManual);

    const btnTutupModal = document.getElementById('btn-tutup-modal');
    if (btnTutupModal) btnTutupModal.addEventListener('click', tutupModal);

    // --- EVENT LISTENER UPLOAD EXCEL ---
    const excelInput = document.getElementById('excel-input');
    if (excelInput) {
        excelInput.addEventListener('change', handleImportExcel);
    }

    const btnSimpanProgres = document.querySelector('.learning-card > .btn-add');
    if (btnSimpanProgres) {
        btnSimpanProgres.addEventListener('click', simpanProgresManual);
    }

    // Dropdown filter kelas pada halaman Statistik: render ulang saat kelas diganti
    const filterKelasStatistik = document.getElementById('filter-kelas-statistik');
    if (filterKelasStatistik) {
        filterKelasStatistik.addEventListener('change', () => {
            if (typeof renderStatistikGlobal === 'function') renderStatistikGlobal();
        });
    }

    renderTabelSiswa();

    // ============================================================
    // [FITUR BARU] INIT DASHBOARD: Recent Activity & Belum Progress Hari Ini
    // ============================================================
    if (typeof muatAktivitasDariStorage === 'function') muatAktivitasDariStorage();
    if (typeof refreshDashboardBaru === 'function') refreshDashboardBaru();

    // Refresh ulang dashboard setiap kali guru klik menu "Dashboard"
    const navDashboardBaru = document.querySelector('.nav-links a[data-target="dashboard"]');
    if (navDashboardBaru) {
        navDashboardBaru.addEventListener('click', () => {
            if (typeof refreshDashboardBaru === 'function') refreshDashboardBaru();
        });
    }
});



/* ==================================================================
   6. MANAJEMEN DATA (LOCAL STORAGE & EXCEL)
   ================================================================== */
function generateDataDefault() {
    const defaultData = {};
    for (let i = 1; i <= 34; i++) {
        const nis = (65000 + i).toString();
        defaultData[nis] = {
            nama: "Siswa " + i,
            nis: nis,
            kelas: "10-A",
            daerah: "Daerah " + i,
            barcode: nis,
            ttl: "-",
            jk: "-",
            alamat: "-",
            ortu: "-",
            hp: "-",
            status: "Belum Hadir"
        };
    }
    return defaultData;
}

function loadDataDariStorage() {
    try {
        const dataTersimpan = localStorage.getItem('databaseSiswa');

        // Bersihkan dulu objek databaseSiswa agar data lama tidak menumpuk/double
        for (let key in databaseSiswa) {
            delete databaseSiswa[key];
        }

        if (dataTersimpan) {
            // Jika sudah pernah buka web, pakai data dari memori HP agar cepat tampil
            Object.assign(databaseSiswa, JSON.parse(dataTersimpan));
        } else {
            // FITUR 34 SISWA UJI COBA (DUMMY) RESMI DIHAPUS DI SINI!
            // Jika ini HP baru, biarkan kosong. Aplikasi akan otomatis memuat 
            // jumlah aslinya langsung dari Firebase dalam sepersekian detik.
            console.log("HP Baru terdeteksi. Menunggu unduhan data asli dari Firebase...");
        }
    } catch (err) {
        console.error("Gagal memuat data dari localStorage:", err);
    }
}

function simpanKeStorage() {
    try {
        localStorage.setItem('databaseSiswa', JSON.stringify(databaseSiswa));
    } catch (err) {
        console.error("Gagal menyimpan data ke localStorage:", err);
    }
    // Sinkron ke Firebase supaya semua guru melihat data yang sama
    if (typeof firebaseDb !== 'undefined') {
        firebaseDb.ref('databaseSiswa').set(databaseSiswa)
            .catch(err => console.error("Gagal sinkron databaseSiswa ke Firebase:", err));
    }
}

function bukaModal() {
    const modal = document.getElementById('modal-siswa');
    if (modal) modal.style.display = 'flex';
}

function tutupModal() {
    const modal = document.getElementById('modal-siswa');
    if (modal) modal.style.display = 'none';

    ['input-stanbuk', 'input-nama', 'input-kelas', 'input-daerah'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

function simpanManual() {
    const nis = document.getElementById('input-stanbuk')?.value.trim();
    const nama = document.getElementById('input-nama')?.value.trim();
    const kelas = document.getElementById('input-kelas')?.value.trim();
    const daerah = document.getElementById('input-daerah')?.value.trim();
    const noAbsen = document.getElementById('input-no-absen')?.value.trim();

    // 1. Cek apakah form kosong
    if (!nis || !nama) return alert("NIS/Stanbuk dan Nama wajib diisi!");

    // 2. Cek apakah stanbuk sudah ada
    if (databaseSiswa[nis]) {
        return alert("Stanbuk " + nis + " sudah terdaftar. Gunakan Stanbuk lain.");
    }

    // 3. FITUR PASSWORD DITAMBAHKAN DI SINI
    // Jika password salah atau dibatalkan, proses penambahan berhenti
    if (!verifikasiPasswordAdmin("menambah siswa baru (" + nama + ")")) {
        return;
    }

    // 4. Jika password benar, data akan dimasukkan ke database
    databaseSiswa[nis] = {
        nama: nama,
        nis: nis,
        noAbsen: noAbsen || "-",
        kelas: kelas || "-",
        daerah: daerah || "-",
        barcode: nis,
        ttl: "-",
        jk: "-",
        alamat: "-",
        ortu: "-",
        hp: "-",
        status: "Belum Hadir"
    };

    simpanKeStorage();
    tutupModal();
    renderTabelSiswa();
    alert("Data berhasil ditambahkan!");
}

function normalisasiBarisExcel(row) {
    const hasil = {};
    Object.keys(row).forEach(key => {
        const keyBersih = key.trim().toLowerCase();
        hasil[keyBersih] = row[key];
    });
    return hasil;
}

function ambilNilai(rowNormal, ...kemungkinanNama) {
    for (const nama of kemungkinanNama) {
        const val = rowNormal[nama.toLowerCase()];
        if (val !== undefined && val !== null && String(val).trim() !== "") {
            return String(val).trim();
        }
    }
    return "";
}

function handleImportExcel(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
        let jsonData;
        try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            jsonData = XLSX.utils.sheet_to_json(sheet);
        } catch (err) {
            console.error("Gagal membaca file Excel:", err);
            alert("Gagal membaca file Excel. Pastikan file berformat .xlsx atau .xls yang valid.");
            e.target.value = "";
            return;
        }

        if (!jsonData || jsonData.length === 0) {
            alert("File Excel kosong atau tidak ada baris data yang terbaca.");
            e.target.value = "";
            return;
        }

        // Wajib password khusus sebelum bisa import data dari Excel
        if (!verifikasiPasswordAdmin("import data Excel")) {
            e.target.value = "";
            return;
        }

        let jumlahDitambahkan = 0;
        let jumlahDilewati = 0;

        jsonData.forEach(row => {
            const rowNormal = normalisasiBarisExcel(row);
            const idSiswa = ambilNilai(rowNormal, "nis", "stanbuk", "no stanbuk", "no stambuk");

            if (!idSiswa) {
                jumlahDilewati++;
                return;
            }

            databaseSiswa[idSiswa] = {
                nama: ambilNilai(rowNormal, "nama") || "-",
                nis: idSiswa,
                noAbsen: ambilNilai(rowNormal, "no absen", "no_absen", "absen") || "-",
                kelas: ambilNilai(rowNormal, "kelas") || "-",
                daerah: ambilNilai(rowNormal, "daerah") || "-",
                barcode: ambilNilai(rowNormal, "barcode") || idSiswa,
                ttl: ambilNilai(rowNormal, "ttl") || "-",
                jk: ambilNilai(rowNormal, "gender", "jk") || "-",
                alamat: ambilNilai(rowNormal, "alamat") || "-",
                ortu: ambilNilai(rowNormal, "orangtua", "orang tua") || "-",
                hp: ambilNilai(rowNormal, "hp") || "-",
                status: ambilNilai(rowNormal, "status") || "Belum Hadir"
            };
            jumlahDitambahkan++;
        });

        simpanKeStorage();
        renderTabelSiswa();

        if (jumlahDitambahkan === 0) {
            alert("Import selesai TAPI tidak ada siswa yang ditambahkan. Pastikan ada kolom 'Stanbuk' atau 'NIS'.");
        } else {
            let pesan = `Berhasil menambahkan ${jumlahDitambahkan} siswa dari Excel!`;
            if (jumlahDilewati > 0) {
                pesan += `\n(${jumlahDilewati} baris dilewati karena kolom Stanbuk/NIS kosong)`;
            }
            alert(pesan);
        }

        e.target.value = "";
    };
    reader.readAsArrayBuffer(file);
}

/* ==================================================================
   7. FUNGSI RENDER TABEL
   ================================================================== */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = (text === undefined || text === null) ? '-' : String(text);
    return div.innerHTML;
}

function renderTabelSiswa() {
    const tbody = document.getElementById('tabel-body-siswa');
    if (!tbody) return;

    tbody.innerHTML = "";
    let daftarSiswa = Object.values(databaseSiswa);

    // Fitur Sorting (Urutkan) berdasarkan kelas & absen
    const sortSelect = document.getElementById('sort-siswa');
    const sortBy = sortSelect ? sortSelect.value : "nama";

    daftarSiswa.sort((a, b) => {
        if (sortBy === "nama") {
            return a.nama.localeCompare(b.nama);
        } else if (sortBy === "kelas" || sortBy === "absen") {
            const hasilKelas = (a.kelas || "").localeCompare(b.kelas || "", 'id', { numeric: true });
            if (hasilKelas !== 0) return hasilKelas;
            const absA = parseInt(a.noAbsen) || 9999;
            const absB = parseInt(b.noAbsen) || 9999;
            return absA - absB;
        } else if (sortBy === "stanbuk") {
            return a.nis.localeCompare(b.nis);
        }
        return 0;
    });

    daftarSiswa.forEach((siswa, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHtml(siswa.noAbsen || '-')}</td>
            <td>${escapeHtml(siswa.nis)}</td>
            <td>${escapeHtml(siswa.nama)}</td>
            <td>${escapeHtml(siswa.kelas)}</td>
            <td>${escapeHtml(siswa.daerah)}</td>
            <td><code>${escapeHtml(siswa.barcode)}</code></td>
            <td>
                <button class="btn-detail" onclick="bukaDetailSiswa('${siswa.nis}')" style="padding: 5px 10px; cursor: pointer;">Detail</button>
                <button onclick="bukaModalEdit('${siswa.nis}')" style="padding: 5px 10px; cursor: pointer; background: #2980b9; color: white; border: none; border-radius: 4px; margin-left: 5px;">Edit</button>
                <button class="btn-hapus" onclick="hapusSiswa('${siswa.nis}')" style="padding: 5px 10px; cursor: pointer; background: #c0392b; color: white; border: none; border-radius: 4px; margin-left: 5px;">Hapus</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const totalEl = document.getElementById('total-siswa-count');
    if (totalEl) totalEl.innerText = daftarSiswa.length;

    // Panggil fungsi untuk memunculkan checkbox kelas otomatis
    if (typeof isiDropdownKelasSiswa === 'function') {
        isiDropdownKelasSiswa();
    }

    if (typeof filterSiswa === 'function') {
        filterSiswa();
    }
}

// FUNGSI 1 BARU: Memuat daftar kelas secara dinamis ke semua dropdown kelas
function isiDropdownKelasSiswa() {
    const container = document.getElementById('checkbox-kelas-list');
    if (!container) return;

    // Ambil semua kelas unik dari database siswa
    let kelasSet = new Set();
    Object.values(databaseSiswa).forEach(s => {
        if (s.kelas) kelasSet.add(s.kelas);
    });

    let kelasArray = Array.from(kelasSet).sort((a, b) => a.localeCompare(b, 'id', { numeric: true }));

    // Simpan kelas yang sebelumnya tercentang (jika ada)
    let kelasTercentang = Array.from(container.querySelectorAll('.checkbox-kelas-item:checked')).map(cb => cb.value);

    container.innerHTML = "";

    // Opsi "Semua"
    const labelSemua = document.createElement('label');
    labelSemua.style.cssText = "font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-weight: bold;";
    labelSemua.innerHTML = `<input type="checkbox" id="pilih-semua-kelas" checked onchange="togglePilihSemuaKelas(this)"> Semua`;
    container.appendChild(labelSemua);

    // Buat checkbox untuk setiap kelas yang tersedia
    kelasArray.forEach(kelas => {
        const isChecked = kelasTercentang.length === 0 || kelasTercentang.includes(kelas);
        const label = document.createElement('label');
        label.style.cssText = "font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 4px;";
        label.innerHTML = `<input type="checkbox" class="checkbox-kelas-item" value="${kelas}" ${isChecked ? 'checked' : ''} onchange="filterSiswa()"> ${kelas}`;
        container.appendChild(label);
    });
}

// --- FUNGSI MASTER CHECKBOX "SEMUA" ---
function togglePilihSemuaKelas(masterCheckbox) {
    const items = document.querySelectorAll('.checkbox-kelas-item');
    items.forEach(cb => {
        cb.checked = masterCheckbox.checked;
    });
    filterSiswa();
}

/* ==================================================================
   8. HAPUS DATA SISWA
   ================================================================== */
function hapusSiswaDariDetail() {
    if (!nisAktif || !databaseSiswa[nisAktif]) {
        alert("Tidak ada data siswa yang sedang dibuka.");
        return;
    }

    hapusSiswa(nisAktif, true);
}

function hapusSiswa(nis, dariHalamanDetail = false) {
    const siswa = databaseSiswa[nis];
    if (!siswa) {
        alert("Siswa dengan Stanbuk " + nis + " tidak ditemukan!");
        return;
    }

    // Memanggil prompt password sebagai pengganti konfirmasi biasa
    if (!verifikasiPasswordAdmin("menghapus data " + siswa.nama)) {
        return;
    }

    // Jika password benar, data dihapus
    delete databaseSiswa[nis];
    simpanKeStorage();
    renderTabelSiswa();

    alert("Data siswa berhasil dihapus.");

    if (dariHalamanDetail) {
        nisAktif = null;
        pindahHalaman('data-siswa');
    }
}

/* ==================================================================
   9. FUNGSI TAB & STATISTIK BELAJAR SISWA
   ================================================================== */
let progressChartInstance = null;

// ==========================================
// FUNGSI NAVIGASI TAB PROGRAM & STATISTIK
// ==========================================
function switchDetailTab(tabId) {
    const tabProgram = document.getElementById('tab-program');
    const tabStatistik = document.getElementById('tab-statistik');
    const tabNilai = document.getElementById('tab-nilai'); // Tambahan untuk tab nilai

    const btnProgram = document.getElementById('btn-tab-program');
    const btnStatistik = document.getElementById('btn-tab-statistik');

    if (tabId === 'program') {
        if (tabProgram) {
            tabProgram.classList.add('active');
            tabProgram.style.display = ''; // Pastikan tidak disembunyikan inline
        }
        if (tabStatistik) {
            tabStatistik.classList.remove('active');
            tabStatistik.style.display = 'none'; // Sembunyikan inline
        }
        if (btnProgram) btnProgram.classList.add('active');
        if (btnStatistik) btnStatistik.classList.remove('active');

        // Sembunyikan tab nilai secara paksa saat tab Program diklik
        if (tabNilai) tabNilai.style.display = 'none';

    } else if (tabId === 'statistik') {
        if (tabProgram) {
            tabProgram.classList.remove('active');
            tabProgram.style.display = 'none';
        }
        if (tabStatistik) {
            tabStatistik.classList.add('active');
            tabStatistik.style.display = 'block';
        }
        if (btnStatistik) btnStatistik.classList.add('active');
        if (btnProgram) btnProgram.classList.remove('active');

        // Sembunyikan tab nilai secara paksa saat tab Statistik diklik
        if (tabNilai) tabNilai.style.display = 'none';

        if (typeof nisAktif !== 'undefined' && nisAktif) {
            updateStatistik();
        }
    }
}

// ==========================================
// FUNGSI KEAMANAN & BUKA TAB NILAI SISWA
// ==========================================
function cekPasswordNilaiSiswa() {
    let password = prompt("Masukkan password untuk mengakses Nilai Siswa:");

    if (password === "impervious") {
        const tabProgram = document.getElementById('tab-program');
        const tabStatistik = document.getElementById('tab-statistik');
        const tabNilai = document.getElementById('tab-nilai');

        const btnProgram = document.getElementById('btn-tab-program');
        const btnStatistik = document.getElementById('btn-tab-statistik');

        // Matikan status "active" dan sembunyikan tab lain
        if (tabProgram) {
            tabProgram.classList.remove('active');
            tabProgram.style.display = 'none';
        }
        if (tabStatistik) {
            tabStatistik.classList.remove('active');
            tabStatistik.style.display = 'none';
        }
        if (btnProgram) btnProgram.classList.remove('active');
        if (btnStatistik) btnStatistik.classList.remove('active');

        // Tampilkan tab nilai
        if (tabNilai) tabNilai.style.display = 'block';

        // Render otomatis tabel Ulangan Umum saat berhasil login
        renderSubTabNilai('Ulangan Umum');

    } else if (password !== null) {
        alert("Password salah! Akses ditolak.");
    }
}

// ==========================================
// FUNGSI LOGIKA WARNA INDIKATOR NILAI
// ==========================================
function getWarnaNilai(nilai) {
    if (nilai === "" || nilai === null || isNaN(nilai)) return "transparent";

    let n = parseFloat(nilai);
    if (n <= 50) return "#ff4d4d"; // Merah (di bawah 50 dan 50)
    if (n >= 51 && n <= 69) return "#ffd633"; // Kuning (51 - 69)
    if (n >= 70 && n <= 100) return "#4CAF50"; // Hijau (70 - 100)

    return "transparent";
}

// ==========================================
// FUNGSI RENDER SUB-TAB & TABEL NILAI
// ==========================================
// ==========================================
// FUNGSI 3: RENDER SUB-TAB & TABEL NILAI (FINAL)
// ==========================================
function renderSubTabNilai(jenisUjian) {
    const wadah = document.getElementById('wadah-tabel-nilai');
    if (!wadah) return;

    // Ambil data nilai siswa aktif dari database
    const siswa = databaseSiswa[nisAktif];
    const dataNilai = (siswa && siswa.nilai && siswa.nilai[jenisUjian]) ? siswa.nilai[jenisUjian] : {};
    const listPelajaranDiImport = Object.keys(dataNilai);

    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 style="margin: 0; color: #4a2525;">Data: ${jenisUjian}</h4>
            <button onclick="importNilaiSiswa('${jenisUjian}')" style="background: #27ae60; color: white; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px; font-weight: bold;">
                <i class="fas fa-file-excel"></i> Import Nilai
            </button>
        </div>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc; font-size: 14px;">
            <thead>
                <tr style="background: #f4f4f4; color: #4a2525;">
                    <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Mata Pelajaran</th>
                    <th style="border: 1px solid #ccc; padding: 10px; text-align: center; width: 120px;">Nilai</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalNilai = 0;
    let jumlahPelajaran = 0;
    let mapPelajaran = [];

    // Logika: Ujian Akhir Tahun hanya render yg di-import, yang lain pakai daftar default
    if (jenisUjian === 'Ujian Akhir Tahun') {
        mapPelajaran = listPelajaranDiImport;
    } else {
        // Gabungkan pelajaran default dan pelajaran tambahan (jika ada di file Excel)
        mapPelajaran = [...new Set([...DAFTAR_PELAJARAN, ...listPelajaranDiImport])];
    }

    if (mapPelajaran.length === 0) {
        html += `<tr><td colspan="2" style="text-align:center; padding: 20px; color: #777;">Belum ada mata pelajaran. Silakan import nilai dari Excel.</td></tr>`;
    } else {
        mapPelajaran.forEach(pel => {
            const nilai = dataNilai[pel] !== undefined ? parseFloat(dataNilai[pel]) : '-';

            let styleNilai = '';
            if (nilai !== '-') {
                const warnaBg = getWarnaNilai(nilai);
                styleNilai = `background-color: ${warnaBg}; color: #222; font-weight: bold;`;
                totalNilai += nilai;
                jumlahPelajaran++;
            }

            html += `<tr>
                <td style="border: 1px solid #ccc; padding: 10px;">${pel}</td>
                <td style="border: 1px solid #ccc; padding: 10px; text-align: center; ${styleNilai}">${nilai}</td>
            </tr>`;
        });
    }

    // Hitung Rata-rata
    let rataRata = (jumlahPelajaran > 0) ? (totalNilai / jumlahPelajaran).toFixed(1) : '-';
    let styleRata = '';
    if (rataRata !== '-') {
        styleRata = `background-color: ${getWarnaNilai(rataRata)}; color: #222; font-weight: bold;`;
    }

    html += `
            </tbody>
            <tfoot>
                <tr style="font-weight: bold; background: #eee; color: #4a2525;">
                    <td style="border: 1px solid #ccc; padding: 10px; text-align: right;">RATA-RATA:</td>
                    <td style="border: 1px solid #ccc; padding: 10px; text-align: center; ${styleRata}">${rataRata}</td>
                </tr>
            </tfoot>
        </table>
    `;

    wadah.innerHTML = html;
}

// ==========================================
// FUNGSI 4: IMPORT EXCEL NILAI SISWA (UNIVERSAL & MULTI-BARIS)
// ==========================================
function importNilaiSiswa(jenisUjian) {
    let fileInput = document.getElementById('file-import-nilai');
    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'file-import-nilai';
        fileInput.style.display = 'none';
        fileInput.accept = '.xlsx, .xls';
        document.body.appendChild(fileInput);
    }

    fileInput.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;

        let password = prompt(`Masukkan password untuk memproses import nilai ${jenisUjian}:`);
        if (password !== "impervious") {
            if (password !== null) alert("Password salah! Proses import dibatalkan.");
            fileInput.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = function (evt) {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];

                // Baca sebagai array 2D mentah (header: 1)
                const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (!rawData || rawData.length === 0) {
                    alert("File Excel kosong.");
                    return;
                }

                let siswaTerupdate = 0;
                let headerRowIdx = -1;
                let nisColIdx = -1;

                // 1. Cari baris header yang mengandung kata 'stanbuk' atau 'nis'
                for (let r = 0; r < rawData.length; r++) {
                    const row = rawData[r];
                    if (!row) continue;
                    for (let c = 0; c < row.length; c++) {
                        const val = String(row[c] || "").toLowerCase().trim();
                        if (val.includes("stanbuk") || val.includes("nis")) {
                            headerRowIdx = r;
                            nisColIdx = c;
                            break;
                        }
                    }
                    if (headerRowIdx !== -1) break;
                }

                if (headerRowIdx === -1) {
                    alert("Format Excel tidak dikenali. Pastikan ada kolom 'Stanbuk' atau 'NIS'.");
                    return;
                }

                // 2. Iterasi baris setelah header untuk mendeteksi data siswa
                for (let r = headerRowIdx + 1; r < rawData.length; r++) {
                    const row = rawData[r];
                    if (!row) continue;

                    const nisVal = String(row[nisColIdx] || "").trim();
                    if (!nisVal) continue;

                    // Cek apakah baris berikutnya (r+1) berisi angka (nilai) dan baris r berisi nama pelajaran
                    const nextRow = (r + 1 < rawData.length) ? rawData[r + 1] : null;
                    let hasNumericInNextRow = false;
                    if (nextRow) {
                        hasNumericInNextRow = nextRow.some(cell => {
                            const num = parseFloat(cell);
                            return !isNaN(num);
                        });
                    }

                    if (hasNumericInNextRow) {
                        // Format Multi-Baris (seperti file Excel Anda)
                        const subjectsRow = row;
                        const valuesRow = nextRow;
                        const nisReal = String(subjectsRow[nisColIdx] || "").trim();

                        if (nisReal && databaseSiswa[nisReal]) {
                            if (!databaseSiswa[nisReal].nilai) databaseSiswa[nisReal].nilai = {};
                            if (!databaseSiswa[nisReal].nilai[jenisUjian]) databaseSiswa[nisReal].nilai[jenisUjian] = {};

                            for (let c = nisColIdx + 1; c < subjectsRow.length; c++) {
                                const sub = subjectsRow[c];
                                const val = valuesRow[c];
                                if (sub !== undefined && val !== undefined && val !== "") {
                                    const angka = parseFloat(val);
                                    if (!isNaN(angka)) {
                                        const namaPel = String(sub).trim();
                                        const pelAsli = DAFTAR_PELAJARAN.find(p => p.toLowerCase() === namaPel.toLowerCase());
                                        const namaPelFinal = pelAsli || (namaPel.charAt(0).toUpperCase() + namaPel.slice(1));

                                        databaseSiswa[nisReal].nilai[jenisUjian][namaPelFinal] = angka;
                                    }
                                }
                            }
                            siswaTerupdate++;
                        }
                    } else {
                        // Format Standar 1 Baris per Siswa
                        const headerRow = rawData[headerRowIdx];
                        if (nisVal && databaseSiswa[nisVal]) {
                            if (!databaseSiswa[nisVal].nilai) databaseSiswa[nisVal].nilai = {};
                            if (!databaseSiswa[nisVal].nilai[jenisUjian]) databaseSiswa[nisVal].nilai[jenisUjian] = {};

                            for (let c = 0; c < row.length; c++) {
                                if (c === nisColIdx) continue;
                                const colName = String(headerRow[c] || "").trim().toLowerCase();
                                const val = row[c];
                                if (colName && val !== undefined && val !== "") {
                                    const angka = parseFloat(val);
                                    if (!isNaN(angka)) {
                                        const pelAsli = DAFTAR_PELAJARAN.find(p => p.toLowerCase() === colName);
                                        const namaPelFinal = pelAsli || (colName.charAt(0).toUpperCase() + colName.slice(1));

                                        databaseSiswa[nisVal].nilai[jenisUjian][namaPelFinal] = angka;
                                    }
                                }
                            }
                            siswaTerupdate++;
                        }
                    }
                }

                simpanKeStorage();
                alert(`Berhasil mengimpor nilai ${jenisUjian} untuk ${siswaTerupdate} siswa.`);
                renderSubTabNilai(jenisUjian);

            } catch (err) {
                console.error("Error import Excel Nilai:", err);
                alert("Gagal memproses file Excel: " + err.message);
            } finally {
                fileInput.value = "";
            }
        };
        reader.readAsArrayBuffer(file);
    };

    fileInput.click();
}

function updateStatistik() {
    if (!nisAktif) return;

    // --- 1. INISIALISASI VARIABEL ---
    let totalPelajaranSemua = DAFTAR_PELAJARAN.length;
    let totalPelajaranSelesai = 0;
    let totalBabSemua = 0;
    let totalBabTuntas = 0;
    let totalSubBabSemua = 0;
    let totalSubBabSelesai = 0;

    // --- 2. KALKULASI DATA ---
    let akumulasiProgram = { bacaan: 0, pemahaman: 0, rangkuman: 0, hafalan: 0 };
    let persentaseBaris = {};

    DAFTAR_PELAJARAN.forEach(pelajaran => {
        const jmlBabReguler = getJumlahBab(pelajaran); // Khusus pelajaran reguler
        let babTuntasSemuaProgramDalamPelajaran = 0;

        // Loop untuk mengecek kategori standar (Bacaan, Pemahaman, Rangkuman, Hafalan)
        for (let b = 1; b <= jmlBabReguler; b++) {
            let babTuntasDiSemuaProgramIni = true;

            DAFTAR_KATEGORI.forEach(kategori => {
                if (kategori === 'bahas soal') return; // Lewati 'bahas soal' dari hitungan reguler (1,2,3..)

                totalBabSemua++;

                if (isBabSelesai(kategori, pelajaran, b)) {
                    totalBabTuntas++;
                } else {
                    babTuntasDiSemuaProgramIni = false;
                }

                // Tambahkan parameter kategori agar pembacaan jumlah subbab presisi
                const jSub = getJumlahSubBab(pelajaran, b, kategori);
                totalSubBabSemua += jSub;
                totalSubBabSelesai += hitungSubBabSelesaiAkurat(kategori, pelajaran, b);
            });

            if (babTuntasDiSemuaProgramIni) {
                babTuntasSemuaProgramDalamPelajaran++;
            }
        }

        // Loop Khusus untuk "Bahas Soal" (Membaca list tahun yang BENAR-BENAR ada)
        const siswa = databaseSiswa[nisAktif];
        const dataBahasSoal = (siswa && siswa.progressBelajar && siswa.progressBelajar['bahas soal'] && siswa.progressBelajar['bahas soal'][pelajaran]) || {};

        Object.keys(dataBahasSoal).forEach(tahun => {
            totalBabSemua++;
            if (isBabSelesai('bahas soal', pelajaran, tahun)) {
                totalBabTuntas++;
            }

            // Sub-bab untuk bahas soal selalu 1 (hanya card keterangan)
            totalSubBabSemua += 1;
            totalSubBabSelesai += hitungSubBabSelesaiAkurat('bahas soal', pelajaran, tahun);
        });

        // Hitung selesai pelajaran jika bab regulernya tuntas
        if (babTuntasSemuaProgramDalamPelajaran === jmlBabReguler && jmlBabReguler > 0) {
            totalPelajaranSelesai++;
        }
    });

    // --- 3. UPDATE KARTU RINGKASAN (DOM) ---
    const elTotalPel = document.getElementById('stat-total-pelajaran');
    const elPelSelesai = document.getElementById('stat-pelajaran-selesai');
    const elBabSelesai = document.getElementById('stat-bab-selesai');
    const elSubBabSelesai = document.getElementById('stat-subbab-selesai');
    const elProgressTotal = document.getElementById('stat-progress-total');

    if (elTotalPel) elTotalPel.textContent = totalPelajaranSemua;
    if (elPelSelesai) elPelSelesai.textContent = totalPelajaranSelesai;
    if (elBabSelesai) elBabSelesai.textContent = `${totalBabTuntas} / ${totalBabSemua}`;
    if (elSubBabSelesai) elSubBabSelesai.textContent = `${totalSubBabSelesai} / ${totalSubBabSemua}`;

    const progressTotal = totalSubBabSemua === 0 ? 0 : Math.round((totalSubBabSelesai / totalSubBabSemua) * 100);
    if (elProgressTotal) elProgressTotal.textContent = `${progressTotal}%`;

    // --- 4. UPDATE TABEL DETAIL PRIBADI + FOOTER RATA-RATA ---
    const container = document.getElementById('statistik-pelajaran-container');
    if (!container) return;

    let html = `
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
                <tr style="background: #fdf6f5; color: #8c2222;">
                    <th style="padding: 10px; border: 1px solid #eee; text-align: left;">Pelajaran</th>
                    <th style="padding: 10px; border: 1px solid #eee; text-align: center;">Bacaan</th>
                    <th style="padding: 10px; border: 1px solid #eee; text-align: center;">Paham</th>
                    <th style="padding: 10px; border: 1px solid #eee; text-align: center;">Rangkum</th>
                    <th style="padding: 10px; border: 1px solid #eee; text-align: center;">Hafal</th>
                    <th style="padding: 10px; border: 1px solid #eee; text-align: center; background: #f9ecea;">Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    let akumulasiTotalSemua = 0;
    let jumlahPelajaran = DAFTAR_PELAJARAN.length;

    DAFTAR_PELAJARAN.forEach(pelajaran => {
        let pelSelesai = 0;
        let pelTotal = 0;
        let persentaseBaris = {};

        DAFTAR_KATEGORI.forEach(kategori => {
            let subBabSelesai = 0;
            let totalSubBab = 0;

            if (kategori === 'bahas soal') {
                const dataBS = (databaseSiswa[nisAktif] && databaseSiswa[nisAktif].progressBelajar && databaseSiswa[nisAktif].progressBelajar['bahas soal'] && databaseSiswa[nisAktif].progressBelajar['bahas soal'][pelajaran]) || {};
                Object.keys(dataBS).forEach(tahun => {
                    totalSubBab += 1;
                    subBabSelesai += hitungSubBabSelesaiAkurat(kategori, pelajaran, tahun);
                });
            } else {
                const jmlBab = getJumlahBab(pelajaran);
                for (let b = 1; b <= jmlBab; b++) {
                    totalSubBab += getJumlahSubBab(pelajaran, b, kategori);
                    subBabSelesai += hitungSubBabSelesaiAkurat(kategori, pelajaran, b);
                }
            }

            pelSelesai += subBabSelesai;
            pelTotal += totalSubBab;

            // Jangan masukkan 'bahas soal' ke dalam persentase tabel reguler
            if (kategori !== 'bahas soal') {
                const persen = totalSubBab === 0 ? 0 : Math.round((subBabSelesai / totalSubBab) * 100);
                persentaseBaris[kategori] = persen;
                if (akumulasiProgram[kategori] !== undefined) {
                    akumulasiProgram[kategori] += persen;
                }
            }
        });

        const totalPersenPel = pelTotal === 0 ? 0 : Math.round((pelSelesai / pelTotal) * 100);
        akumulasiTotalSemua += totalPersenPel;

        html += `<tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 9px; font-weight: bold; color: #4a2525;">${pelajaran}</td>`;

        // Render khusus 4 kategori reguler ke dalam tabel
        ['bacaan', 'pemahaman', 'rangkuman', 'hafalan'].forEach(kat => {
            const persen = persentaseBaris[kat] || 0;
            let warna = "#8c2222";
            if (persen >= 100) warna = "#1e8e3e";
            else if (persen >= 50) warna = "#b97603";

            html += `<td style="padding: 9px; text-align: center; color: ${warna}; font-weight: 600;">${persen}%</td>`;
        });

        html += `<td style="padding: 9px; text-align: center; color: #8c2222; font-weight: 800; background: #fdf6f5;">${totalPersenPel}%</td>`;
        html += `</tr>`;
    });

    // Hitung rata-rata untuk baris tfoot
    let rataBacaan = jumlahPelajaran > 0 ? Math.round(akumulasiProgram.bacaan / jumlahPelajaran) : 0;
    let rataPaham = jumlahPelajaran > 0 ? Math.round(akumulasiProgram.pemahaman / jumlahPelajaran) : 0;
    let rataRangkum = jumlahPelajaran > 0 ? Math.round(akumulasiProgram.rangkuman / jumlahPelajaran) : 0;
    let rataHafal = jumlahPelajaran > 0 ? Math.round(akumulasiProgram.hafalan / jumlahPelajaran) : 0;
    let rataTotalSemua = jumlahPelajaran > 0 ? Math.round(akumulasiTotalSemua / jumlahPelajaran) : 0;

    html += `
            </tbody>
            <tfoot>
                <tr style="background: #fdf6f5; font-weight: bold; border-top: 2px solid #8c2222; color: #8c2222;">
                    <td style="padding: 10px; border: 1px solid #eee; text-align: left;">RATA-RATA KESELURUHAN</td>
                    <td style="padding: 10px; border: 1px solid #eee; text-align: center;">${rataBacaan}%</td>
                    <td style="padding: 10px; border: 1px solid #eee; text-align: center;">${rataPaham}%</td>
                    <td style="padding: 10px; border: 1px solid #eee; text-align: center;">${rataRangkum}%</td>
                    <td style="padding: 10px; border: 1px solid #eee; text-align: center;">${rataHafal}%</td>
                    <td style="padding: 10px; border: 1px solid #eee; text-align: center; background: #f9ecea; color: #8c2222;">${rataTotalSemua}%</td>
                </tr>
            </tfoot>
        </table>
    `;

    container.innerHTML = html;
}


function updateProgressChart(stats) {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;

    const labels = stats.map(s => s.nama);
    const data = stats.map(s => s.progress);

    if (progressChartInstance) {
        progressChartInstance.data.labels = labels;
        progressChartInstance.data.datasets[0].data = data;
        progressChartInstance.update();
    } else {
        progressChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Progress (%)',
                    data: data,
                    backgroundColor: '#8c2222',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: function (value) { return value + '%'; } }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

/* ==================================================================
   10. MANAJEMEN TARGET GURU (FITUR BARU)
   ================================================================== */
function inisialisasiFormTarget() {
    const contProgram = document.getElementById("container-program");
    const contPelajaran = document.getElementById("container-pelajaran");
    const selectSiswa = document.getElementById("target-siswa");

    if (!selectSiswa || !contProgram || !contPelajaran) return;

    // Injeksi otomatis input nama guru di atas pilihan siswa jika belum ada
    let wrapperGuru = document.getElementById("wrapper-nama-guru");
    if (!wrapperGuru && selectSiswa.parentNode) {
        wrapperGuru = document.createElement("div");
        wrapperGuru.id = "wrapper-nama-guru";
        wrapperGuru.style.marginBottom = "10px";
        wrapperGuru.innerHTML = `
            <label style="display:block; font-size:13px; font-weight:bold; margin-bottom:4px; color:#4a2525;">Nama Guru / Pemberi Target:</label>
            <input type="text" id="target-nama-guru" placeholder="Masukkan nama guru..." style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; font-size:13px;">
        `;
        selectSiswa.parentNode.insertBefore(wrapperGuru, selectSiswa);
    }

    // 1. Isi Siswa
    selectSiswa.innerHTML = '<option value="">-- Pilih Siswa --</option>';
    Object.values(databaseSiswa).forEach(s => {
        selectSiswa.innerHTML += `<option value="${s.nis}">${s.nama}</option>`;
    });

    // 2. Isi Program (Radio)
    contProgram.innerHTML = DAFTAR_KATEGORI.map(k => `
        <div style="margin-bottom:5px;">
            <input type="radio" name="program-group" value="${k}"> 
            ${k.charAt(0).toUpperCase() + k.slice(1)}
        </div>`).join('');

    // 3. Isi Pelajaran (Checkbox)
    contPelajaran.innerHTML = DAFTAR_PELAJARAN.map(p => `
        <div style="margin-bottom:5px;">
            <input type="checkbox" class="check-pelajaran" value="${p}"> ${p}
        </div>`).join('');

    contPelajaran.addEventListener('change', function (e) {
        if (e.target.classList.contains('check-pelajaran')) {
            renderCheckboxesBab();
        }
    });

    const selectFilterPelajaran = document.getElementById("filter-pelajaran");
    if (selectFilterPelajaran) {
        selectFilterPelajaran.innerHTML = '<option value="Semua">Semua Pelajaran</option>';
        DAFTAR_PELAJARAN.forEach(p => {
            selectFilterPelajaran.innerHTML += `<option value="${p}">${p}</option>`;
        });
    }
}

// Fungsi untuk membuat checkbox Bab & Subbab saat pelajaran dipilih
function renderCheckboxesBab() {
    const contBab = document.getElementById("container-bab");
    if (!contBab) return;

    // Ambil semua pelajaran yang dicentang
    const checkPelajaran = document.querySelectorAll('.check-pelajaran:checked');
    const pelajaranDipilih = Array.from(checkPelajaran).map(i => i.value);

    contBab.innerHTML = "";

    if (pelajaranDipilih.length === 0) {
        contBab.innerHTML = '<small style="color:#666;">Pilih pelajaran terlebih dahulu...</small>';
        return;
    }

    pelajaranDipilih.forEach(pel => {
        const jmlBab = getJumlahBab(pel);
        contBab.innerHTML += `<div style="margin-top:10px; font-weight:bold; color:#8c2222; border-bottom:1px solid #f9ecea;">${pel}</div>`;

        for (let i = 1; i <= jmlBab; i++) {
            contBab.innerHTML += `
                <div style="margin-left: 15px; margin-top:5px;">
                    <input type="checkbox" name="target-bab" data-pel="${pel}" data-bab="${i}"> 
                    ${getNamaBab(pel, i)}
                </div>`;
        }
    });
}

// Mengubah fungsi simpan agar hanya menyimpan sampai level Bab
// Mengubah fungsi simpan agar otomatis cek progres belajar siswa
function simpanTargetMulti() {
    const nis = document.getElementById("target-siswa").value;
    const deadline = document.getElementById("target-deadline").value;
    const progRadio = document.querySelector('input[name="program-group"]:checked');
    const program = progRadio ? progRadio.value : null;
    const babTerpilih = document.querySelectorAll('input[name="target-bab"]:checked');

    const namaGuruInput = document.getElementById("target-nama-guru");
    const namaGuru = namaGuruInput ? namaGuruInput.value.trim() : "";

    if (!nis || !program || babTerpilih.length === 0) {
        alert("Harap lengkapi: Siswa, Program, dan minimal 1 Bab!");
        return;
    }

    if (!databaseSiswa[nis].targetBelajar) databaseSiswa[nis].targetBelajar = [];

    let jumlahDitambahkan = 0;
    let adaDuplikat = false;

    babTerpilih.forEach(cb => {
        const namaPelajaran = cb.dataset.pel;
        const nomorBab = cb.dataset.bab;

        const sudahAda = databaseSiswa[nis].targetBelajar.some(t =>
            String(t.program).trim().toLowerCase() === String(program).trim().toLowerCase() &&
            String(t.pelajaran).trim().toLowerCase() === String(namaPelajaran).trim().toLowerCase() &&
            String(t.bab).trim() === String(nomorBab).trim()
        );

        if (!sudahAda) {
            let initialStatus = "Belum Selesai";
            if (typeof isBabSelesai === 'function') {
                if (isBabSelesai(program, namaPelajaran, nomorBab)) {
                    initialStatus = "Selesai";
                }
            }

            databaseSiswa[nis].targetBelajar.push({
                id: Date.now() + Math.random(),
                tglDiberikan: new Date().toLocaleDateString('id-ID'),
                deadline: deadline,
                program: program,
                pelajaran: namaPelajaran,
                bab: nomorBab,
                status: initialStatus,
                namaGuru: namaGuru || "-" // Menyimpan nama guru
            });
            jumlahDitambahkan++;
        } else {
            adaDuplikat = true;
        }
    });

    simpanKeStorage();
    renderTabelTarget();

    if (typeof renderStatistikGlobal === 'function') renderStatistikGlobal();

    if (jumlahDitambahkan > 0) {
        alert("Target berhasil dikirim!");
        
        // PERBAIKAN: Fungsi perekam dipindah ke bagian sukses menambahkan target
        if (typeof catatAktivitasGuru === "function") {
            catatAktivitasGuru(`Memberikan ${jumlahDitambahkan} target pelajaran kepada siswa`);
        }
    }
    
    if (adaDuplikat) {
        alert("Beberapa target dilewati karena sudah pernah diberikan sebelumnya.");
    }
}   
    

    // Fungsi: mengecek status selesai satu Bab (per program/kategori) milik siswa manapun
    // Dibuat karena isBabSelesai() yang lama hanya bisa mengecek siswa yang sedang aktif dibuka (programState)
    function isBabSelesaiUntukSiswa(siswa, kategori, namaPelajaran, nomorBab) {
        if (!siswa || !siswa.progressBelajar) return false;

        const batasSubBab = getJumlahSubBab(namaPelajaran, nomorBab);
        if (!batasSubBab || batasSubBab === 0) return false;

        const dataKategori = siswa.progressBelajar[kategori];
        const dataPelajaran = dataKategori ? dataKategori[namaPelajaran] : null;
        const dataBab = dataPelajaran ? dataPelajaran[nomorBab] : null;

        if (!Array.isArray(dataBab) || dataBab.length === 0) return false;

        let jumlahSelesai = 0;
        for (let i = 1; i <= batasSubBab; i++) {
            if (dataBab.includes(i) || dataBab.includes(String(i))) {
                jumlahSelesai++;
            }
        }
        return jumlahSelesai >= batasSubBab;
    }

function isTargetSelesaiRealtime(siswa, target) {
    if (!siswa || !target) return false;
    if (typeof isBabSelesai !== 'function' && typeof getJumlahSubBab !== 'function') {
        return target.status === "Selesai";
    }

    const progresSiswaIni = siswa.progressBelajar || {};
    const dataKategori = progresSiswaIni[target.program];
    const dataPelajaran = dataKategori ? dataKategori[target.pelajaran] : null;
    const dataBab = dataPelajaran ? dataPelajaran[target.bab] : null;

    if (!dataBab) return false;

    const jmlSubBabTarget = getJumlahSubBab(target.pelajaran, target.bab, target.program);
    
    // Pengecekan aman untuk format reguler maupun format objek Bahas Soal
    const jumlahTercentang = (target.program === 'bahas soal' && typeof dataBab === 'object' && Array.isArray(dataBab.completed)) 
        ? dataBab.completed.length 
        : (Array.isArray(dataBab) ? dataBab.length : 0);

    return jumlahTercentang >= jmlSubBabTarget;
}


// 1. HELPER: MENGHITUNG SUB-BAB SELESAI (REALTIME & AMAN)
function hitungSubBabSelesaiUntukSiswa(siswa, kategori, namaPelajaran, nomorBab) {
    if (!siswa || !siswa.progressBelajar) return 0;

    const dataKategori = siswa.progressBelajar[kategori];
    const dataPelajaran = dataKategori ? dataKategori[namaPelajaran] : null;
    const dataBab = dataPelajaran ? dataPelajaran[nomorBab] : null;

    if (kategori === 'bahas soal') {
        if (dataBab && typeof dataBab === 'object' && Array.isArray(dataBab.completed)) {
            return dataBab.completed.length;
        }
        return 0;
    }

    if (!Array.isArray(dataBab)) return 0;

    const batasSubBab = (typeof getJumlahSubBab === 'function') 
        ? getJumlahSubBab(namaPelajaran, nomorBab, kategori) 
        : 1;

    let jumlahSelesai = 0;
    for (let i = 1; i <= batasSubBab; i++) {
        if (dataBab.includes(i) || dataBab.includes(String(i))) {
            jumlahSelesai++;
        }
    }
    return Math.min(jumlahSelesai, batasSubBab);
}

// 2. MENGHITUNG STATISTIK KELAS (DENGAN NULL-CHECK & DIRECT PARSING)
function hitungStatistikKelas(kelasTerpilih) {
    const dataSiswaSafe = (typeof databaseSiswa !== 'undefined' && databaseSiswa) ? databaseSiswa : {};
    const daftarSiswaTerfilter = Object.values(dataSiswaSafe).filter(siswa => {
        return siswa && (kelasTerpilih === "Semua" || siswa.kelas === kelasTerpilih);
    });

    const jumlahSiswa = daftarSiswaTerfilter.length;

    const hasil = {
        jumlahSiswa: jumlahSiswa,
        totalBab: 0,
        babSelesai: 0,
        babBelumSelesai: 0,
        progressBab: 0,
        progressKeseluruhan: 0,
        perProgram: {},
        perPelajaran: {}
    };

    const listKategori = (typeof DAFTAR_KATEGORI !== 'undefined') ? DAFTAR_KATEGORI : [];
    const listPelajaran = (typeof DAFTAR_PELAJARAN !== 'undefined') ? DAFTAR_PELAJARAN : [];

    listKategori.forEach(kategori => {
        hasil.perProgram[kategori] = { total: 0, selesai: 0, persen: 0 };
    });

    listPelajaran.forEach(pelajaran => {
        hasil.perPelajaran[pelajaran] = { totalPersen: 0 };
        listKategori.forEach(kategori => {
            hasil.perPelajaran[pelajaran][kategori] = { selesai: 0, total: 0, persen: 0 };
        });
    });

    if (jumlahSiswa === 0) return hasil;

    daftarSiswaTerfilter.forEach(siswa => {
        const progresSiswa = siswa.progressBelajar || {};

        listPelajaran.forEach(pelajaran => {
            const jmlBabReguler = (typeof getJumlahBab === 'function') ? getJumlahBab(pelajaran) : 0;

            listKategori.forEach(kategori => {
                const dataPelajaranKategori = (progresSiswa[kategori] && progresSiswa[kategori][pelajaran]) || {};

                if (kategori === 'bahas soal') {
                    Object.keys(dataPelajaranKategori).forEach(tahun => {
                        const dataTahun = dataPelajaranKategori[tahun];
                        const targetSoal = (dataTahun && typeof dataTahun === 'object' && dataTahun.jumlah) ? dataTahun.jumlah : 1;
                        
                        hasil.totalBab += targetSoal;
                        hasil.perPelajaran[pelajaran][kategori].total += targetSoal;
                        hasil.perProgram[kategori].total += targetSoal;

                        // BACA LANGSUNG DATA BAHAS SOAL (Tanpa fungsi eksternal)
                        let poinSelesai = 0;
                        if (dataTahun && Array.isArray(dataTahun.completed)) {
                            poinSelesai = dataTahun.completed.length;
                        }
                        
                        poinSelesai = Math.min(poinSelesai, targetSoal); // Fail-safe
                        
                        hasil.babSelesai += poinSelesai;
                        hasil.perPelajaran[pelajaran][kategori].selesai += poinSelesai;
                        hasil.perProgram[kategori].selesai += poinSelesai;
                    });
                } else {
                    for (let b = 1; b <= jmlBabReguler; b++) {
                        const targetSub = (typeof getJumlahSubBab === 'function') ? getJumlahSubBab(pelajaran, b, kategori) : 1;
                        
                        hasil.totalBab += targetSub;
                        hasil.perPelajaran[pelajaran][kategori].total += targetSub;
                        hasil.perProgram[kategori].total += targetSub;

                        // BACA LANGSUNG DATA REGULER (Tanpa fungsi eksternal)
                        let poinSelesai = 0;
                        const dataBab = dataPelajaranKategori[b];
                        
                        if (dataBab) {
                            if (Array.isArray(dataBab)) {
                                poinSelesai = dataBab.length;
                            } else if (dataBab instanceof Set) {
                                poinSelesai = dataBab.size;
                            } else if (typeof dataBab === 'object') {
                                poinSelesai = Object.values(dataBab).filter(v => v === true).length;
                            }
                        }
                        
                        poinSelesai = Math.min(poinSelesai, targetSub); // Fail-safe

                        hasil.babSelesai += poinSelesai;
                        hasil.perPelajaran[pelajaran][kategori].selesai += poinSelesai;
                        hasil.perProgram[kategori].selesai += poinSelesai;
                    }
                }
            });
        });
    });

    // Kalkulasi persentase akhir
    hasil.babBelumSelesai = hasil.totalBab - hasil.babSelesai;
    hasil.progressBab = hasil.totalBab === 0 ? 0 : Math.round((hasil.babSelesai / hasil.totalBab) * 100);
    hasil.progressKeseluruhan = hasil.progressBab;

    listKategori.forEach(kategori => {
        const p = hasil.perProgram[kategori];
        p.persen = p.total === 0 ? 0 : Math.round((p.selesai / p.total) * 100);
    });

    listPelajaran.forEach(pelajaran => {
        let totalSelesaiPel = 0;
        let totalTotPel = 0;

        listKategori.forEach(kategori => {
            const d = hasil.perPelajaran[pelajaran][kategori];
            d.persen = d.total === 0 ? 0 : Math.round((d.selesai / d.total) * 100);
            totalSelesaiPel += d.selesai;
            totalTotPel += d.total;
        });

        hasil.perPelajaran[pelajaran].totalPersen = totalTotPel === 0 ? 0 : Math.round((totalSelesaiPel / totalTotPel) * 100);
    });

    return hasil;
}

// 3. GET DAFTAR KELAS UNIK
function getDaftarKelasUnik() {
    const dataSiswaSafe = (typeof databaseSiswa !== 'undefined' && databaseSiswa) ? databaseSiswa : {};
    const semuaKelas = Object.values(dataSiswaSafe)
        .map(siswa => siswa ? siswa.kelas : null)
        .filter(kelas => kelas && kelas !== "-");

    const kelasUnik = [...new Set(semuaKelas)];
    kelasUnik.sort((a, b) => a.localeCompare(b, 'id', { numeric: true }));

    return kelasUnik;
}

// 4. ISI DROPDOWN FILTER KELAS
function isiDropdownFilterKelas() {
    const selectEl = document.getElementById("filter-kelas-statistik");
    if (!selectEl) return;

    const kelasTerpilihSebelumnya = selectEl.value || "Semua";
    const daftarKelas = getDaftarKelasUnik();

    let optionsHtml = `<option value="Semua">Semua Kelas</option>`;
    daftarKelas.forEach(kelas => {
        optionsHtml += `<option value="${escapeHtml(kelas)}">${escapeHtml(kelas)}</option>`;
    });

    selectEl.innerHTML = optionsHtml;

    if (daftarKelas.includes(kelasTerpilihSebelumnya) || kelasTerpilihSebelumnya === "Semua") {
        selectEl.value = kelasTerpilihSebelumnya;
    } else {
        selectEl.value = "Semua";
    }
}

// 5. BUAT BARIS PROGRESS PROGRAM
function buatBarisProgressProgram(namaProgram, dataProgram) {
    if (!dataProgram) return "";
    const labelKapital = namaProgram.charAt(0).toUpperCase() + namaProgram.slice(1);
    const persen = dataProgram.persen || 0;

    let warnaBar = "#8c2222";
    if (persen >= 100) warnaBar = "#1e8e3e";
    else if (persen >= 50) warnaBar = "#b97603";

    return `
    <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px;">
            <span style="font-weight: 600; color: #4a2525;">${labelKapital}</span>
            <span style="color: #8c2222; font-weight: 700;">${persen}% (${dataProgram.selesai || 0}/${dataProgram.total || 0})</span>
        </div>
        <div style="background: #f9ecea; border-radius: 20px; height: 16px; overflow: hidden;">
            <div style="height: 100%; width: ${persen}%; background: ${warnaBar}; transition: width 0.8s ease; border-radius: 20px;"></div>
        </div>
    </div>
`;
}

// 6. RENDER STATISTIK GLOBAL
function renderStatistikGlobal() {
    const selectEl = document.getElementById("filter-kelas-statistik");
    if (!selectEl) return;

    const kelasTerpilih = selectEl.value || "Semua";
    const data = hitungStatistikKelas(kelasTerpilih);

    const elJumlahSiswa = document.getElementById("statistik-jumlah-siswa");
    const elTotalTarget = document.getElementById("statistik-total-target");
    const elTargetSelesai = document.getElementById("statistik-target-selesai");
    const elBelumSelesai = document.getElementById("statistik-belum-selesai");
    const elProgressPersen = document.getElementById("statistik-progress-persen");

    if (elJumlahSiswa) elJumlahSiswa.textContent = data.jumlahSiswa;
    if (elTotalTarget) elTotalTarget.textContent = data.totalBab.toLocaleString('id-ID');
    if (elTargetSelesai) elTargetSelesai.textContent = data.babSelesai.toLocaleString('id-ID');
    if (elBelumSelesai) elBelumSelesai.textContent = data.babBelumSelesai.toLocaleString('id-ID');
    if (elProgressPersen) elProgressPersen.textContent = data.progressBab + "%";

    const containerProgram = document.getElementById("statistik-program-container");
    if (containerProgram) {
        let htmlProgram = "";
        const listKategori = (typeof DAFTAR_KATEGORI !== 'undefined') ? DAFTAR_KATEGORI : [];
        listKategori.forEach(kategori => {
            if (data.perProgram[kategori]) {
                htmlProgram += buatBarisProgressProgram(kategori, data.perProgram[kategori]);
            }
        });
        containerProgram.innerHTML = htmlProgram;
    }

    const containerPelajaran = document.getElementById("statistik-pelajaran-kelas-container");
    if (containerPelajaran) {
        containerPelajaran.innerHTML = buatTabelStatistikPelajaranKelas(data.perPelajaran);
    }

    const elJudulKelas = document.getElementById("statistik-judul-kelas");
    if (elJudulKelas) {
        elJudulKelas.textContent = kelasTerpilih === "Semua"
            ? "STATISTIK SEMUA KELAS"
            : "STATISTIK KELAS " + kelasTerpilih.toUpperCase();
    }

    const elBarKeseluruhan = document.getElementById("statistik-bar-keseluruhan");
    if (elBarKeseluruhan) elBarKeseluruhan.style.width = data.progressKeseluruhan + "%";

    const elTeksKeseluruhan = document.getElementById("statistik-teks-keseluruhan");
    if (elTeksKeseluruhan) elTeksKeseluruhan.textContent = "Progress Keseluruhan: " + data.progressKeseluruhan + "%";
}

// 7. TABEL STATISTIK PELAJARAN (DINAMIS & DINAMIS FOOTER)
function buatTabelStatistikPelajaranKelas(dataPerPelajaran) {
    const listKategori = (typeof DAFTAR_KATEGORI !== 'undefined') ? DAFTAR_KATEGORI : [];
    const listPelajaran = (typeof DAFTAR_PELAJARAN !== 'undefined') ? DAFTAR_PELAJARAN : [];

    // Header Kolom Dinamis sesuai isi DAFTAR_KATEGORI
    let thKategori = "";
    listKategori.forEach(kat => {
        const namaKat = kat.charAt(0).toUpperCase() + kat.slice(1);
        thKategori += `<th style="padding: 10px; border: 1px solid #eee; text-align: center;">${escapeHtml(namaKat)}</th>`;
    });

    let html = `
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
            <tr style="background: #fdf6f5; color: #8c2222;">
                <th style="padding: 10px; border: 1px solid #eee; text-align: left;">Pelajaran</th>
                ${thKategori}
                <th style="padding: 10px; border: 1px solid #eee; text-align: center; background: #f9ecea;">Total</th>
            </tr>
        </thead>
        <tbody>
`;

    let akumulasiProgram = {};
    listKategori.forEach(kat => { akumulasiProgram[kat] = 0; });
    let akumulasiTotalSemua = 0;
    let jumlahPelajaran = listPelajaran.length;

    listPelajaran.forEach(pelajaran => {
        const data = dataPerPelajaran[pelajaran];
        if (!data) return;

        html += `<tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 9px; font-weight: bold; color: #4a2525;">${escapeHtml(pelajaran)}</td>`;

        listKategori.forEach(kategori => {
            const persen = data[kategori] ? data[kategori].persen : 0;
            akumulasiProgram[kategori] = (akumulasiProgram[kategori] || 0) + persen;

            let warna = "#8c2222";
            if (persen >= 100) warna = "#1e8e3e";
            else if (persen >= 50) warna = "#b97603";

            html += `<td style="padding: 9px; text-align: center; color: ${warna}; font-weight: 600;">${persen}%</td>`;
        });

        akumulasiTotalSemua += data.totalPersen;

        html += `<td style="padding: 9px; text-align: center; color: #8c2222; font-weight: 800; background: #fdf6f5;">${data.totalPersen}%</td>`;
        html += `</tr>`;
    });

    // Rata-rata Footer Dinamis
    let tdRataRata = "";
    listKategori.forEach(kategori => {
        let rata = jumlahPelajaran > 0 ? Math.round((akumulasiProgram[kategori] || 0) / jumlahPelajaran) : 0;
        tdRataRata += `<td style="padding: 10px; border: 1px solid #eee; text-align: center;">${rata}%</td>`;
    });
    let rataTotalSemua = jumlahPelajaran > 0 ? Math.round(akumulasiTotalSemua / jumlahPelajaran) : 0;

    html += `
        </tbody>
        <tfoot>
            <tr style="background: #fdf6f5; font-weight: bold; border-top: 2px solid #8c2222; color: #8c2222;">
                <td style="padding: 10px; border: 1px solid #eee; text-align: left;">RATA-RATA KESELURUHAN</td>
                ${tdRataRata}
                <td style="padding: 10px; border: 1px solid #eee; text-align: center; background: #f9ecea; color: #8c2222;">${rataTotalSemua}%</td>
            </tr>
        </tfoot>
    </table>
`;

    return html;
}

    /* ==================================================================
       RENDER TABEL TARGET (SUDAH DIPERBARUI DENGAN LOGIKA FILTER)
       ================================================================== */
    function renderTabelTarget() {
        const tbody = document.getElementById("tabel-rekapan-target");
        if (!tbody) return;

        tbody.innerHTML = "";
        let adaData = false;

        // Ambil nilai dari seluruh input filter
        const searchEl = document.getElementById("search-target-guru");
        const keyword = searchEl ? searchEl.value.toLowerCase() : "";

        const statusFilter = document.getElementById("filter-status") ? document.getElementById("filter-status").value : "Semua";
        const programFilter = document.getElementById("filter-program") ? document.getElementById("filter-program").value : "Semua";
        const pelajaranFilter = document.getElementById("filter-pelajaran") ? document.getElementById("filter-pelajaran").value : "Semua";
        const deadlineFilter = document.getElementById("filter-deadline") ? document.getElementById("filter-deadline").value : "Semua";

        // Setup helper tanggal (Reset waktu ke 00:00:00 untuk komparasi tanggal yang akurat)
        const now = new Date();
        const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Setup helper untuk perhitungan "Minggu Ini" (Senin - Minggu)
        const dayOfWeek = now.getDay();
        const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diffToMonday);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        Object.values(databaseSiswa).forEach(siswa => {
            if (siswa.targetBelajar && siswa.targetBelajar.length > 0) {

                siswa.targetBelajar.forEach((target, index) => {

                    // --- 1. Kalkulasi Status Dinamis (SEKARANG SINKRON DENGAN PROGRESS TERBARU) ---
                    let statusDinamis = target.status;
                    let targetDateObj = new Date(target.deadline);
                    targetDateObj.setHours(0, 0, 0, 0);

                    // Cek progress realtime siswa untuk target ini (Level 4)
                    let progresSudahSelesai = false;
                    if (typeof isBabSelesai === 'function') {
                        // Untuk mengecek bab siswa lain (bukan siswa aktif), kita perlu Set sementara dari data tersimpan
                        const progresSiswaIni = siswa.progressBelajar || {};
                        const dataKategori = progresSiswaIni[target.program];
                        const dataPelajaran = dataKategori ? dataKategori[target.pelajaran] : null;
                        const dataBab = dataPelajaran ? dataPelajaran[target.bab] : null;

                        if (dataBab) {
                            const jmlSubBabTarget = getJumlahSubBab(target.pelajaran, target.bab);
                            const jumlahTercentang = Array.isArray(dataBab) ? dataBab.length : 0;
                            progresSudahSelesai = jumlahTercentang >= jmlSubBabTarget;
                        }
                    }

                    if (progresSudahSelesai) {
                        statusDinamis = "Selesai";
                    } else if (target.status !== "Selesai" && targetDateObj < todayDate) {
                        statusDinamis = "Terlambat";
                    } else {
                        statusDinamis = target.status;
                    }

                    // --- 2. Evaluasi Semua Filter Bersamaan ---
                    let passSearch = siswa.nama.toLowerCase().includes(keyword);
                    let passStatus = statusFilter === "Semua" || statusDinamis === statusFilter;
                    let passProgram = programFilter === "Semua" || target.program.toLowerCase() === programFilter.toLowerCase();
                    let passPelajaran = pelajaranFilter === "Semua" || target.pelajaran === pelajaranFilter;

                    let passDeadline = true;
                    if (deadlineFilter === "Hari Ini") {
                        passDeadline = targetDateObj.getTime() === todayDate.getTime();
                    } else if (deadlineFilter === "Minggu Ini") {
                        passDeadline = targetDateObj >= startOfWeek && targetDateObj <= endOfWeek;
                    } else if (deadlineFilter === "Sudah Lewat") {
                        passDeadline = targetDateObj < todayDate && statusDinamis !== "Selesai";
                    }

                    // --- 3. Render Baris Jika Semua Filter Lolos ---
                    if (passSearch && passStatus && passProgram && passPelajaran && passDeadline) {
                        adaData = true;

                        let badgeBg = statusDinamis === "Selesai" ? "#e6f4ea" : (statusDinamis === "Terlambat" ? "#fbe9e7" : "#fdf6f5");
                        let badgeColor = statusDinamis === "Selesai" ? "#1e8e3e" : (statusDinamis === "Terlambat" ? "#d32f2f" : "#c0392b");
                        let badgeBorder = statusDinamis === "Selesai" ? "#1e8e3e" : (statusDinamis === "Terlambat" ? "#d32f2f" : "#c0392b");
                        let iconStatus = statusDinamis === "Selesai" ? '<i class="fas fa-check-circle"></i> ' : (statusDinamis === "Terlambat" ? '<i class="fas fa-exclamation-circle"></i> ' : '<i class="fas fa-clock"></i> ');

                        let textBab = getNamaBab(target.pelajaran, target.bab);
                        let textSub = "Seluruh materi dalam bab ini";

                        const tr = document.createElement("tr");
                        tr.style.cursor = 'pointer';
                        tr.addEventListener('mouseenter', () => tr.style.backgroundColor = '#fdf6f5');
                        tr.addEventListener('mouseleave', () => tr.style.backgroundColor = 'transparent');
                        tr.style.transition = '0.2s ease';

                        tr.onclick = function (e) {
                            if (e.target.closest('button') || e.target.closest('i')) {
                                return;
                            }
                            lompatKeTargetSiswa(siswa.nis, target.program, target.pelajaran, target.bab);
                        };

                        tr.innerHTML = `
                        <td style="padding: 15px; border-bottom: 1px solid #f9ecea; color: #4a2525;">
                            <strong style="color: #8c2222;">${siswa.nama}</strong><br>
                            <small style="opacity: 0.8;">NIS: ${siswa.nis}</small>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid #f9ecea; color: #4a2525;">
                            <span style="text-transform: capitalize; font-weight: 600; color: #b97603;">${target.program}</span><br>
                            <span style="color: #c9560f;">${target.pelajaran}</span>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid #f9ecea; color: #4a2525; max-width: 250px;">
                            <div style="font-weight: 600; margin-bottom: 4px;">${textBab}</div>
                            <div style="font-size: 13px; opacity: 0.9; line-height: 1.4;">${textSub}</div>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid #f9ecea; color: #4a2525; font-size: 13px;">
                            ${target.tglDiberikan}<br>
                            <small style="color: #8c2222; font-weight: 600;">Guru: ${escapeHtml(target.namaGuru || '-')}</small>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid #f9ecea; color: #c9560f; font-weight: 700; font-size: 13px;">
                            ${target.deadline}
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid #f9ecea; text-align: center;">
                            <span style="background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder}; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; display: inline-block;">
                                ${iconStatus}${statusDinamis}
                            </span>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid #f9ecea; text-align: center;">
                            <button type="button" onclick="event.stopPropagation(); hapusTarget('${siswa.nis}', ${index})" style="background: transparent; color: #c0392b; border: none; cursor: pointer; padding: 8px; border-radius: 50%; transition: 0.3s;" onmouseover="this.style.background='#fdf6f5'" onmouseout="this.style.background='transparent'">
                                <i class="fas fa-trash-alt" style="font-size: 16px; pointer-events: none;"></i>
                            </button>
                        </td>
                    `;
                        tbody.appendChild(tr);
                    }
                });
            }
        });

        if (!adaData) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px; color: #b96d03; font-style: italic; background-color: #fdf6f5;">Belum ada target yang memenuhi kriteria pencarian / filter.</td></tr>`;
        }
    }

    function hapusTarget(nis, index) {
        if (confirm("Yakin ingin menghapus target ini?")) {
            databaseSiswa[nis].targetBelajar.splice(index, 1);
            simpanKeStorage();
            renderTabelTarget();

            // Auto-refresh Statistik Kelas setelah target dihapus
            if (typeof renderStatistikGlobal === 'function') renderStatistikGlobal();
        }
    }

    // --- TOMBOL RESET FILTER ---
    function resetFilterTarget() {
        const searchEl = document.getElementById("search-target-guru");
        const statusEl = document.getElementById("filter-status");
        const programEl = document.getElementById("filter-program");
        const pelajaranEl = document.getElementById("filter-pelajaran");
        const deadlineEl = document.getElementById("filter-deadline");

        if (searchEl) searchEl.value = "";
        if (statusEl) statusEl.value = "Semua";
        if (programEl) programEl.value = "Semua";
        if (pelajaranEl) pelajaranEl.value = "Semua";
        if (deadlineEl) deadlineEl.value = "Semua";

        renderTabelTarget();
    }

    function lompatKeTargetSiswa(nis, program, pelajaran, bab) {
        // 1. Pindah ke halaman Detail Siswa dan buka profilnya
        bukaDetailSiswa(nis);

        // 2. Gunakan setTimeout agar navigasi program tidak bentrok dengan proses render halaman
        setTimeout(() => {
            // A. Buka kategori program
            pilihKategori(program);

            // B. Buka pelajaran tersebut
            bukaPelajaran(program, pelajaran);

            // C. Buka bab tersebut
            bukaBab(program, pelajaran, bab);

            // D. Pastikan tab program aktif (jika sebelumnya di tab statistik)
            switchDetailTab('program');
        }, 100);
    }


    // Fungsi Jembatan (Jika masih dibutuhkan oleh elemen HTML lama)
    function filterTabelTarget() {
        renderTabelTarget();
    }

    // --- PENCARIAN & FILTER SISWA DI HALAMAN DATA SISWA (MULTI-KELAS) ---
    function filterSiswa() {
        // 1. Ambil nilai teks dari kolom pencarian
        const inputTeks = document.getElementById("search-target");
        const filterTeks = inputTeks ? inputTeks.value.toLowerCase() : "";

        // 2. Ambil daftar kelas yang dicentang oleh pengguna
        const checkedKelas = Array.from(document.querySelectorAll('.checkbox-kelas-item:checked')).map(cb => cb.value);

        // 3. Ambil elemen tabel siswa di HTML
        const tbody = document.getElementById("tabel-body-siswa");
        if (!tbody) return;
        const tr = tbody.getElementsByTagName("tr");
        let nomorUrut = 1;

        // 4. Periksa setiap baris data siswa di dalam tabel
        for (let i = 0; i < tr.length; i++) {
            const tdStanbuk = tr[i].getElementsByTagName("td")[2];
            const tdNama = tr[i].getElementsByTagName("td")[3];
            const tdKelas = tr[i].getElementsByTagName("td")[4]; // Kolom ke-4 di tabel adalah Kelas

            if (tdStanbuk && tdNama && tdKelas) {
                const txtValueStanbuk = tdStanbuk.textContent || tdStanbuk.innerText;
                const txtValueNama = tdNama.textContent || tdNama.innerText;
                const txtValueKelas = (tdKelas.textContent || tdKelas.innerText).trim();

                // Cek kecocokan pencarian nama atau stanbuk
                const matchTeks = txtValueStanbuk.toLowerCase().includes(filterTeks) ||
                    txtValueNama.toLowerCase().includes(filterTeks);

                // Cek apakah kelas siswa termasuk dalam pilihan kelas yang dicentang
                const matchKelas = checkedKelas.length === 0 || checkedKelas.includes(txtValueKelas);

                // Tampilkan baris HANYA jika cocok dengan teks pencarian DAN kelas yang dipilih
                if (matchTeks && matchKelas) {
                    tr[i].style.display = "";
                    // Perbarui nomor urut pada tabel secara otomatis agar tetap rapi
                    if (tr[i].cells[0]) tr[i].cells[0].innerText = nomorUrut++;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    function updateDropdownSiswa() {
        const selectSiswa = document.getElementById("target-siswa");
        if (!selectSiswa) return;

        // Simpan pilihan yang sedang aktif agar tidak hilang saat update
        const valSebelumnya = selectSiswa.value;
        selectSiswa.innerHTML = '<option value="">-- Pilih Siswa --</option>';

        Object.values(databaseSiswa).forEach(siswa => {
            selectSiswa.innerHTML += `<option value="${siswa.nis}">${siswa.nama} (${siswa.kelas})</option>`;
        });

        if (valSebelumnya && databaseSiswa[valSebelumnya]) {
            selectSiswa.value = valSebelumnya;
        }
    }

    /* ==================================================================
       ============================================================
       [FITUR BARU] DASHBOARD: RECENT ACTIVITY & BELUM PROGRESS HARI INI
       ------------------------------------------------------------
       Semua kode di bawah ini adalah TAMBAHAN BARU.
       - Tidak mengubah struktur databaseSiswa / progressBelajar.
       - Tidak mengubah fungsi/checklist lama.
       - Menggunakan array baru "recentActivityLog" yang disimpan
         terpisah di localStorage (key: 'recentActivityLog').
       ============================================================
       ================================================================== */

    // Array baru khusus menyimpan log aktivitas (terpisah dari databaseSiswa)
    let recentActivityLog = [];

    // --- [BARU] Helper: format tanggal hari ini sebagai key pembanding (YYYY-MM-DD) ---
    function getTanggalKeyHariIni() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    // --- [BARU] Muat log aktivitas dari localStorage (dipanggil sekali saat DOMContentLoaded) ---
    function muatAktivitasDariStorage() {
        try {
            const data = localStorage.getItem('recentActivityLog');
            recentActivityLog = data ? JSON.parse(data) : [];
        } catch (err) {
            console.error("Gagal memuat recentActivityLog dari localStorage:", err);
            recentActivityLog = [];
        }
    }

    // --- [BARU] Simpan log aktivitas ke localStorage ---
    function simpanAktivitasKeStorage() {
        try {
            localStorage.setItem('recentActivityLog', JSON.stringify(recentActivityLog));
        } catch (err) {
            console.error("Gagal menyimpan recentActivityLog ke localStorage:", err);
        }
        // Sinkron log aktivitas ke Firebase
        if (typeof firebaseDb !== 'undefined') {
            firebaseDb.ref('recentActivityLog').set(recentActivityLog)
                .catch(err => console.error("Gagal sinkron recentActivityLog ke Firebase:", err));
        }
    }

    // --- [BARU] Fitur 1: Dicatat otomatis saat guru MENCENTANG Sub Bab (dipanggil dari toggleSubBab) ---
    function catatAktivitasChecklist(kategori, namaPelajaran, nomorBab, nomorSubBab) {
        if (!nisAktif || !databaseSiswa[nisAktif] || typeof firebaseDb === 'undefined') return;

        const siswa = databaseSiswa[nisAktif];
        const now = new Date();
        const jam = String(now.getHours()).padStart(2, '0');
        const menit = String(now.getMinutes()).padStart(2, '0');

        const aktivitas = {
            nis: siswa.nis,
            nama: siswa.nama,
            kelas: siswa.kelas,
            program: kategori,
            pelajaran: namaPelajaran,
            bab: getNamaBab(namaPelajaran, nomorBab),
            subbab: getNamaSubBab(namaPelajaran, nomorBab, nomorSubBab),
            waktu: `${jam}.${menit}`,
            tanggal: now.toLocaleDateString('id-ID'),
            tanggalKey: getTanggalKeyHariIni(),
            timestamp: now.getTime()
        };

        // GUNAKAN PUSH: Membuat antrean unik di Firebase agar data 30 guru tidak saling bertabrakan
        firebaseDb.ref('recentActivityLog').push(aktivitas).catch(err => {
            console.error("Gagal mengirim aktivitas:", err);
        });
    }

    // --- [BARU] Render daftar Recent Activity (ringkas: 3 teratas, tiap item bisa diklik untuk lihat riwayat lengkap) ---
    function renderRecentActivity() {
        const listEl = document.querySelector('.activity-box .activity-list');
        if (!listEl) return;

        const tigaTerbaru = recentActivityLog.slice(0, 3);

        if (tigaTerbaru.length === 0) {
            listEl.innerHTML = '<li>Belum ada aktivitas checklist hari ini.</li>';
            return;
        }

        listEl.innerHTML = tigaTerbaru.map(a => {
            const namaAman = escapeHtml(a.nama);
            const kelasAman = escapeHtml(a.kelas);
            const programAman = escapeHtml(a.program.charAt(0).toUpperCase() + a.program.slice(1));
            const pelajaranAman = escapeHtml(a.pelajaran);
            const babAman = escapeHtml(a.bab);
            const subbabAman = escapeHtml(a.subbab);
            return `<li onclick="bukaRiwayatSemua()" style="cursor:pointer;" title="Klik untuk lihat riwayat aktivitas semua siswa">
                <strong>${a.waktu}</strong> — ${namaAman} (${kelasAman}) menyetorkan <strong>${subbabAman}</strong>
                <br><small>${programAman} • ${pelajaranAman} • ${babAman} • ${a.tanggal}</small></li>`;
        }).join('');
    }

    // --- [BARU] Buka modal riwayat aktivitas SEMUA SISWA (urut terbaru ke terlama) ---
    function bukaRiwayatSemua() {
        const modal = document.getElementById('modal-riwayat-siswa');
        const judulEl = document.getElementById('riwayat-siswa-judul');
        const listEl = document.getElementById('riwayat-siswa-list');
        if (!modal || !listEl) return;

        const riwayat = recentActivityLog; // semua siswa, sudah terbaru->terlama

        if (judulEl) judulEl.textContent = 'Riwayat Aktivitas Semua Siswa';

        if (riwayat.length === 0) {
            listEl.innerHTML = '<li style="padding:10px 0;">Belum ada riwayat aktivitas.</li>';
        } else {
            listEl.innerHTML = riwayat.map(a => {
                const namaAman = escapeHtml(a.nama);
                const kelasAman = escapeHtml(a.kelas);
                const programAman = escapeHtml(a.program.charAt(0).toUpperCase() + a.program.slice(1));
                const pelajaranAman = escapeHtml(a.pelajaran);
                const babAman = escapeHtml(a.bab);
                const subbabAman = escapeHtml(a.subbab);
                return `<li style="padding: 10px 0; border-bottom: 1px solid #f9ecea;">
                    <strong>${a.tanggal} • ${a.waktu}</strong> — ${namaAman} (${kelasAman})
                    <br>Setoran: <strong>${subbabAman}</strong>
                    <br><small>${programAman} • ${pelajaranAman} • ${babAman}</small></li>`;
            }).join('');
        }

        modal.style.display = 'flex';
    }

    // --- [BARU] Tutup modal riwayat aktivitas semua siswa ---
    function tutupRiwayatSemua() {
        const modal = document.getElementById('modal-riwayat-siswa');
        if (modal) modal.style.display = 'none';
    }

    // --- [BARU] Hitung progress keseluruhan (%) untuk SIAPA PUN siswa (bukan hanya siswa yang sedang dibuka) ---
    // Membaca langsung dari databaseSiswa[nis].progressBelajar yang SUDAH ADA, tanpa mengubah strukturnya.
    function hitungProgressKeseluruhanSiswa(nis) {
        const siswa = databaseSiswa[nis];
        if (!siswa) return 0;

        const progresTersimpan = siswa.progressBelajar || {};
        let totalSubBabSemua = 0;
        let totalSubBabSelesai = 0;

        DAFTAR_PELAJARAN.forEach(pelajaran => {
            const jmlBab = getJumlahBab(pelajaran);
            for (let b = 1; b <= jmlBab; b++) {
                const jSub = getJumlahSubBab(pelajaran, b);

                DAFTAR_KATEGORI.forEach(kategori => {
                    totalSubBabSemua += jSub;

                    const dataKategori = progresTersimpan[kategori];
                    const dataPelajaran = dataKategori ? dataKategori[pelajaran] : null;
                    const dataBab = dataPelajaran ? dataPelajaran[b] : null;
                    const arr = Array.isArray(dataBab) ? dataBab : [];

                    // Hitung unik agar tidak dobel hitung jika ada format campuran number/string
                    const unik = new Set(arr.map(String));
                    totalSubBabSelesai += unik.size;
                });
            }
        });

        return totalSubBabSemua === 0 ? 0 : Math.round((totalSubBabSelesai / totalSubBabSemua) * 100);
    }

    function isiDropdownDashboardKelas() {
        const filterTeraktif = document.getElementById("filter-kelas-teraktif");
        const filterBelum = document.getElementById("filter-kelas-belum");

        if (!filterTeraktif || !filterBelum) return;

        // --- 1. SIMPAN PILIHAN FILTER YANG SEDANG AKTIF SAAT INI ---
        const valTeraktifSebelumnya = filterTeraktif.value || "Semua";
        const valBelumSebelumnya = filterBelum.value || "Semua";

        // Ambil seluruh kelas unik dari database
        const daftarKelas = [...new Set(
            Object.values(databaseSiswa)
                .map(s => (s.kelas || "").trim())
                .filter(k => k !== "")
        )].sort((a, b) => a.localeCompare(b, 'id'));

        // Reset dropdown
        filterTeraktif.innerHTML = "";
        filterBelum.innerHTML = "";

        // Tambahkan pilihan default
        filterTeraktif.add(new Option("Semua Kelas", "Semua"));
        filterBelum.add(new Option("Semua Kelas", "Semua"));

        // Tambahkan semua kelas
        daftarKelas.forEach(kelas => {
            filterTeraktif.add(
                new Option(kelas, kelas)
            );
            filterBelum.add(
                new Option(kelas, kelas)
            );
        });

        // --- 2. KEMBALIKAN PILIHAN SEBELUMNYA SETELAH DI-RESET ---
        if (daftarKelas.includes(valTeraktifSebelumnya) || valTeraktifSebelumnya === "Semua") {
            filterTeraktif.value = valTeraktifSebelumnya;
        }
        if (daftarKelas.includes(valBelumSebelumnya) || valBelumSebelumnya === "Semua") {
            filterBelum.value = valBelumSebelumnya;
        }
    }

    // --- [BARU] Fitur 2: Render card "Belum Ada Progress Hari Ini" ---
    function renderBelumProgressHariIniCard() {
        const container = document.getElementById('dashboard-belum-progress-list');
        if (!container) return;

        // Ambil nilai filter kelas
        const selectKelas = document.getElementById('filter-kelas-belum');
        const kelasTerpilih = selectKelas ? selectKelas.value : "Semua";

        const todayKey = getTanggalKeyHariIni();

        // Kumpulan NIS siswa yang SUDAH punya minimal 1 checklist hari ini
        const nisSudahAktivitasHariIni = new Set(
            recentActivityLog.filter(a => a.tanggalKey === todayKey).map(a => a.nis)
        );

        // Filter daftar siswa (Cek yang belum aktivitas DAN cocokkan kelasnya)
        const daftarBelumProgress = Object.values(databaseSiswa).filter(
            siswa => !nisSudahAktivitasHariIni.has(siswa.nis) &&
                (kelasTerpilih === "Semua" || siswa.kelas === kelasTerpilih)
        );

        // Urutkan berdasarkan abjad kelas, lalu nama siswa secara alfabetis
        daftarBelumProgress.sort((a, b) => {
            const hKelas = (a.kelas || "").localeCompare(b.kelas || "", 'id', { numeric: true });
            if (hKelas !== 0) return hKelas;
            return (a.nama || "").localeCompare(b.nama || "", 'id');
        });

        if (daftarBelumProgress.length === 0) {
            container.innerHTML = '<p style="color:#4a2525; text-align:center; padding: 10px 0;">🎉 Semua siswa di daftar ini sudah setor hari ini.</p>';
            return;
        }

        container.innerHTML = daftarBelumProgress.map(siswa => {
            const persen = hitungProgressKeseluruhanSiswa(siswa.nis);
            return `
            <div style="padding: 10px; border-bottom: 1px solid #f9ecea; border-radius: 8px; cursor: pointer; transition: background 0.2s;" 
                 onmouseover="this.style.background='#fdf6f5'" 
                 onmouseout="this.style.background='transparent'" 
                 onclick="keStatistikPribadi('${siswa.nis}')" 
                 title="Klik untuk lihat statistik pribadi ${escapeHtml(siswa.nama)}">
                <p style="margin:0; font-weight:600; color:#4a2525;">${escapeHtml(siswa.nama)}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                    <span style="color:#c9560f; font-size: 13px;">${escapeHtml(siswa.kelas)}</span>
                    <span style="color:#8c2222; font-size: 13px; font-weight:600;">Progress ${persen}%</span>
                </div>
            </div>`;
        }).join('');
    }

    // --- [BARU] Hitung & urutkan siswa teraktif dengan FILTER KELAS ---
    function hitungSiswaTeraktifHariIni(kelasTerpilih) {
        const todayKey = getTanggalKeyHariIni();
        const jumlahPerSiswa = {};

        recentActivityLog
            .filter(a => a.tanggalKey === todayKey)
            .forEach(a => {
                // Cek filter kelas
                if (kelasTerpilih === "Semua" || a.kelas === kelasTerpilih) {
                    if (!jumlahPerSiswa[a.nis]) {
                        jumlahPerSiswa[a.nis] = { nis: a.nis, nama: a.nama, kelas: a.kelas, jumlah: 0 };
                    }
                    jumlahPerSiswa[a.nis].jumlah += 1;
                }
            });

        return Object.values(jumlahPerSiswa)
            .sort((a, b) => {
                // 1. Urutkan utama: jumlah setoran terbanyak ke paling sedikit (Descending)
                if (b.jumlah !== a.jumlah) {
                    return b.jumlah - a.jumlah;
                }
                // 2. Jika jumlah setoran sama, urutkan berdasarkan abjad kelas
                const hKelas = (a.kelas || "").localeCompare(b.kelas || "", 'id', { numeric: true });
                if (hKelas !== 0) return hKelas;

                // 3. Jika kelas sama, urutkan berdasarkan abjad nama
                return (a.nama || "").localeCompare(b.nama || "", 'id');
            })
            .slice(0, 5); // Ambil 5 Teratas
    }

    // --- [BARU] Render card "Siswa Teraktif Hari Ini" (Bisa di-klik) ---
    function renderSiswaTeraktifCard() {
        const container = document.getElementById('dashboard-siswa-teraktif-list');
        if (!container) return;

        // Ambil nilai filter kelas
        const selectKelas = document.getElementById('filter-kelas-teraktif');
        const kelasTerpilih = selectKelas ? selectKelas.value : "Semua";

        const daftarTeraktif = hitungSiswaTeraktifHariIni(kelasTerpilih);

        if (daftarTeraktif.length === 0) {
            container.innerHTML = '<p style="color:#4a2525; text-align:center; padding: 10px 0;">Belum ada aktivitas checklist hari ini.</p>';
            return;
        }

        container.innerHTML = daftarTeraktif.map((s, idx) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding: 10px; border-bottom: 1px solid #f9ecea; border-radius: 8px; cursor: pointer; transition: background 0.2s;"
                 onmouseover="this.style.background='#fdf6f5'" 
                 onmouseout="this.style.background='transparent'"
                 onclick="bukaRiwayatSpesifik('${s.nis}', '${escapeHtml(s.nama)}')"
                 title="Klik untuk lihat rincian setoran ${escapeHtml(s.nama)}">
                <div>
                    <p style="margin:0; font-weight:600; color:#4a2525;">${idx + 1}. ${escapeHtml(s.nama)}</p>
                    <p style="margin:2px 0 0; color:#c9560f; font-size: 13px;">${escapeHtml(s.kelas)}</p>
                </div>
                <p style="margin:0; color:#8c2222; font-size: 13px; font-weight:600; white-space:nowrap;">
                    ${s.jumlah} checklist <i class="fas fa-chevron-right" style="margin-left: 5px; font-size: 10px;"></i>
                </p>
            </div>`).join('');
    }

    // --- [BARU] Pemanggil gabungan: refresh kedua bagian dashboard sekaligus ---
    function refreshDashboardBaru() {
        isiDropdownDashboardKelas();
        renderRecentActivity();
        renderBelumProgressHariIniCard();
        renderSiswaTeraktifCard();
        updateCountdownUjian(); // Tambahkan baris ini agar tulisan "X Hari" terupdate otomatis
        renderKelasTeraktifCard();
        if (typeof renderKelasTeraktifHariIniCard === 'function') renderKelasTeraktifHariIniCard(); // <-- FITUR BARU DISISIPKAN DI SINI
        renderRekapHarianDashboard();
    }


    /* ========== [AKHIR FITUR BARU: DASHBOARD RECENT ACTIVITY & BELUM PROGRESS] ========== */

    const PASSWORD_ADMIN = "raihan";

    function verifikasiPasswordAdmin(namaAksi) {
        const input = prompt("Masukkan password untuk " + namaAksi + ":");
        if (input === null) return false; // jika guru klik "Batal"
        if (input !== PASSWORD_ADMIN) {
            alert("Password salah. Aksi dibatalkan.");
            return false;
        }
        return true;
    }

    /* ==================================================================
       11. FITUR DASHBOARD: KALENDER UJIAN & DAFTAR PELAJARAN
       ================================================================== */

    // --- A. FITUR KALENDER & COUNTDOWN UJIAN ---
    const TANGGAL_UJIAN = new Date(2026, 7, 23); // 23 Agustus 2026 (Bulan 7 = Agustus dalam JavaScript)
    const NAMA_BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const NAMA_HARI_PENDEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    function updateCountdownUjian() {
        const elCountdown = document.getElementById('countdown-timer');
        if (!elCountdown) return;

        const tanggalUjian = new Date(2026, 7, 23);
        tanggalUjian.setHours(0, 0, 0, 0);

        const sekarang = new Date();
        const hariIni = new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate());

        const selisihMs = tanggalUjian.getTime() - hariIni.getTime();
        const selisihHari = Math.round(selisihMs / (1000 * 60 * 60 * 24));

        if (selisihHari > 0) {
            elCountdown.textContent = selisihHari + ' Hari';
        } else if (selisihHari === 0) {
            elCountdown.textContent = 'Hari Ini!';
        } else {
            elCountdown.textContent = 'Ujian Selesai';
        }
    }

    function buatHtmlKalender(tahun, bulan, tandaiTanggal) {
        const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();
        const hariPertama = new Date(tahun, bulan, 1).getDay();

        let sel = '';
        // Kosongkan sel untuk hari sebelum tanggal 1
        for (let i = 0; i < hariPertama; i++) sel += `<div></div>`;

        // Isi tanggal
        for (let tgl = 1; tgl <= jumlahHari; tgl++) {
            const styleSel = (tgl === tandaiTanggal)
                ? 'background:#8c2222; color:#fff; border-radius:50%; font-weight:700;'
                : 'color:#4a2525;';
            sel += `<div style="padding:6px 0; text-align:center; font-size:13px; ${styleSel}">${tgl}</div>`;
        }

        const headerHari = NAMA_HARI_PENDEK.map(h => `<div style="text-align:center; font-size:12px; font-weight:700; color:#8c2222; padding-bottom:5px;">${h}</div>`).join('');

        return `
        <p style="text-align:center; font-weight:700; margin: 0 0 10px; color:#4a2525;">${NAMA_BULAN[bulan]} ${tahun}</p>
        <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:2px;">
            ${headerHari}${sel}
        </div>`;
    }

    function bukaKalenderUjian() {
        const modal = document.getElementById('modal-kalender-ujian');
        const gridEl = document.getElementById('kalender-ujian-grid');
        const selisihEl = document.getElementById('kalender-ujian-selisih');
        if (!modal || !gridEl) return;

        const sekarang = new Date();
        const hariIni = new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate());
        const tglUjianNormal = new Date(TANGGAL_UJIAN.getFullYear(), TANGGAL_UJIAN.getMonth(), TANGGAL_UJIAN.getDate());

        const selisihHari = Math.round((tglUjianNormal.getTime() - hariIni.getTime()) / (1000 * 60 * 60 * 24));

        if (selisihEl) {
            if (selisihHari > 0) selisihEl.textContent = selisihHari + ' hari lagi menuju ujian';
            else if (selisihHari === 0) selisihEl.textContent = 'Ujian hari ini!';
            else selisihEl.textContent = 'Ujian sudah berlalu';
        }

        gridEl.innerHTML = buatHtmlKalender(TANGGAL_UJIAN.getFullYear(), TANGGAL_UJIAN.getMonth(), TANGGAL_UJIAN.getDate());
        modal.style.display = 'flex';
    }

    function tutupKalenderUjian() {
        const modal = document.getElementById('modal-kalender-ujian');
        if (modal) modal.style.display = 'none';
    }


    // --- B. FITUR DAFTAR PELAJARAN ---
    function bukaDaftarPelajaranDashboard() {
        const modal = document.getElementById('modal-daftar-pelajaran');
        const listEl = document.getElementById('daftar-pelajaran-list');
        if (!modal || !listEl) return;

        listEl.innerHTML = DAFTAR_PELAJARAN.map((p, idx) => `
        <li style="padding: 10px 0; border-bottom: 1px solid #f9ecea; color:#4a2525;">
            ${idx + 1}. ${escapeHtml(p)}
        </li>`).join('');

        modal.style.display = 'flex';
    }

    function tutupDaftarPelajaranDashboard() {
        const modal = document.getElementById('modal-daftar-pelajaran');
        if (modal) modal.style.display = 'none';
    }

    /* ==================================================================
       [FITUR BARU] SINKRONISASI DATA VIA FIREBASE (ANTAR GURU)
       ================================================================== */
    let sedangMenerimaDariFirebase = false;

    // Variabel untuk melacak halaman apa yang sedang dibuka guru
    let halamanAktif = "dashboard";

    // Update variabel saat guru pindah halaman via klik menu (opsional jika sudah dimasukkan ke fungsi pindahHalaman)
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", function () {
            halamanAktif = this.getAttribute("data-target");
        });
    });

    function sinkronisasiFirebaseAwal() {
        if (typeof firebaseDb === 'undefined') return;

        // 1. SINKRONISASI DATABASE SISWA (MENGGUNAKAN METODE CHILD - ANTI LAG)
        // Ambil data awal sekali saja
        firebaseDb.ref('databaseSiswa').once('value').then(snapshot => {
            if (snapshot.val()) {
                // KUNCI PENCEGAHAN DUPLIKASI: Bersihkan dulu databaseSiswa sebelum diisi data dari server
                for (let key in databaseSiswa) {
                    delete databaseSiswa[key];
                }

                Object.assign(databaseSiswa, snapshot.val());
                localStorage.setItem('databaseSiswa', JSON.stringify(databaseSiswa));
                if (halamanAktif === "data-siswa") renderTabelSiswa();
                if (halamanAktif === "dashboard") refreshDashboardBaru();
            }

            // 2. SETELAH DATA AWAL TERMUAT, DENGARKAN PERUBAHAN SPESIFIK (CHILD_CHANGED)
            firebaseDb.ref('databaseSiswa').on('child_changed', snapshot => {
                const nis = snapshot.key;
                const dataSiswaBaru = snapshot.val();

                databaseSiswa[nis] = dataSiswaBaru;
                localStorage.setItem('databaseSiswa', JSON.stringify(databaseSiswa));

                // Update tampilan tergantung halaman yang sedang dibuka guru
                if (halamanAktif === "data-siswa") renderTabelSiswa();
                if (halamanAktif === "dashboard") refreshDashboardBaru();
                if (halamanAktif === "statistik") renderStatistikGlobal();

                // PENGAMAN: Jika HP ini baru saja melakukan klik dalam 2 detik terakhir, 
                // abaikan update masuk untuk mencegah centangan berubah/uncheck sendiri
                if (halamanAktif === "detail-siswa" && nisAktif === nis) {
                    if (Date.now() - lastLocalUpdateTimestamp < 2000) return;

                    // Perbarui data set tanpa mereset navigasi layar
                    const progresTersimpan = dataSiswaBaru.progressBelajar || {};
                    DAFTAR_KATEGORI.forEach(kategori => {
                        if (programState[kategori]) {
                            programState[kategori].completed = ubahCompletedKeSet(progresTersimpan[kategori]);
                        }
                    });
                    updateStatistik();

                    // Jika guru sedang membuka kotak sub-bab tertentu, refresh centangnya secara real-time
                    DAFTAR_KATEGORI.forEach(kategori => {
                        const subbabList = document.getElementById("subbab-cards-container-" + kategori);
                        if (subbabList && !subbabList.parentElement.classList.contains("hidden")) {
                            const activeSubject = programState[kategori].selectedSubject;
                            const activeBab = programState[kategori].selectedBab;
                            if (activeSubject && activeBab) {
                                renderDaftarSubBab(kategori, activeSubject, activeBab);
                            }
                        }
                    });
                }
            });

            firebaseDb.ref('databaseSiswa').on('child_added', snapshot => {
                const nis = snapshot.key;
                if (!databaseSiswa[nis]) {
                    databaseSiswa[nis] = snapshot.val();
                    if (halamanAktif === "data-siswa") renderTabelSiswa();
                }
            });

            // TAMBAHAN: DENGARKAN JIKA ADA SISWA YANG DIHAPUS OLEH GURU LAIN
            firebaseDb.ref('databaseSiswa').on('child_removed', snapshot => {
                const nis = snapshot.key;
                if (databaseSiswa[nis]) {
                    delete databaseSiswa[nis];
                    localStorage.setItem('databaseSiswa', JSON.stringify(databaseSiswa));

                    // Update tabel jika guru sedang membuka halaman data siswa
                    if (halamanAktif === "data-siswa") renderTabelSiswa();
                }
            });
        });

        // 2. SINKRONISASI AKTIVITAS CHECKLIST (ANTI SALING TIMPA)
        // Kita tambahkan .limitToLast(6000) agar HP guru hanya memproses data 7 hari terakhir
        firebaseDb.ref('recentActivityLog')
            .limitToLast(6000)
            .on('value', snapshot => {
                const data = snapshot.val();
                if (data) {
                    // Firebase mengubah push() menjadi objek, kita kembalikan ke Array dan urutkan dari yang terbaru
                    recentActivityLog = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
                    localStorage.setItem('recentActivityLog', JSON.stringify(recentActivityLog));
                } else {
                    // JIKA DATA KOSONG (KARENA DI-RESET DARI HP LAIN)
                    recentActivityLog = [];
                    localStorage.removeItem('recentActivityLog'); // Bersihkan memori HP juga
                }

                // PENTING: Syarat "if (halamanAktif === 'dashboard')" DIHAPUS
                // Selalu perbarui elemen dashboard di latar belakang seketika agar angka tidak basi
                if (typeof refreshDashboardBaru === 'function') {
                    refreshDashboardBaru();
                }
            });
        // 3. SINKRONISASI RIWAYAT ABSENSI (ANTI SALING TIMPA)
        firebaseDb.ref('riwayatAbsensi').on('value', snapshot => {
            const data = snapshot.val();
            if (data) {
                // Urutkan absen dari yang ID-nya paling baru
                riwayatAbsensi = Object.values(data).sort((a, b) => b.id - a.id);
                localStorage.setItem('riwayatAbsensi', JSON.stringify(riwayatAbsensi));
                if (halamanAktif === "absen" && document.getElementById('tab-rekap-absen').style.display === 'block') {
                    renderRekapAbsen();
                }
            } else {
                riwayatAbsensi = [];
            }
        });
    }

    // FUNGSI 1: Navigasi langsung ke tab Statistik Pribadi Siswa
    function keStatistikPribadi(nis) {
        bukaDetailSiswa(nis); // Buka halaman detail siswa tersebut

        // Beri sedikit jeda agar halaman selesai dimuat, lalu pindah ke tab statistik
        setTimeout(() => {
            switchDetailTab('statistik');
        }, 50);
    }

    // FUNGSI 1 BARU: Mereset daftar siswa teraktif HARI INI
    function resetSiswaTeraktif() {
        if (!verifikasiPasswordAdmin("reset daftar siswa teraktif")) return;

        if (confirm("Yakin ingin mereset daftar siswa teraktif? Ini akan menghapus riwayat aktivitas setoran HARI INI.")) {
            const todayKey = getTanggalKeyHariIni();

            if (typeof firebaseDb !== 'undefined') {
                // Cari data HARI INI langsung di server Firebase
                firebaseDb.ref('recentActivityLog').once('value').then(snapshot => {
                    const data = snapshot.val();
                    if (data) {
                        const updates = {};
                        // Kumpulkan semua data yang tanggalnya hari ini untuk dihapus
                        Object.keys(data).forEach(key => {
                            if (data[key].tanggalKey === todayKey) {
                                updates[key] = null; // null berarti memerintahkan Firebase untuk menghapusnya
                            }
                        });

                        // Eksekusi hapus massal khusus hari ini tanpa merusak data kemarin
                        firebaseDb.ref('recentActivityLog').update(updates).then(() => {
                            alert("✅ Data aktivitas hari ini berhasil direset menjadi nol.");
                        }).catch(err => console.error("Gagal mereset:", err));
                    }
                });
            }
        }
    }

    // FUNGSI BARU: Melihat rekap 7 hari terakhir untuk Siswa Teraktif
    function bukaRekapTeraktifMingguan() {
        const modal = document.getElementById('modal-riwayat-siswa');
        const judulEl = document.getElementById('riwayat-siswa-judul');
        const listEl = document.getElementById('riwayat-siswa-list');
        if (!modal || !listEl) return;

        // Batas waktu 7 hari ke belakang
        const now = new Date();
        const startMinggu = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);

        // Ambil aktivitas dalam rentang waktu tersebut
        const logMingguan = recentActivityLog.filter(a => {
            return a.timestamp >= startMinggu.getTime();
        });

        // Kelompokkan per NIS untuk mencari hari-hari unik (tidak ganda jika setor 2x di hari yang sama)
        const mapAktif = {};
        logMingguan.forEach(a => {
            if (!mapAktif[a.nis]) {
                mapAktif[a.nis] = { nis: a.nis, nama: a.nama, kelas: a.kelas, hariAktif: new Set(), detailHari: {} };
            }
            mapAktif[a.nis].hariAktif.add(a.tanggalKey);
            mapAktif[a.nis].detailHari[a.tanggalKey] = a.tanggal;
        });

        // Urutkan dari jumlah hari aktif terbanyak
        const sorted = Object.values(mapAktif)
            .sort((a, b) => b.hariAktif.size - a.hariAktif.size || a.nama.localeCompare(b.nama));

        if (judulEl) judulEl.innerHTML = 'Rekap Siswa Teraktif (7 Hari Terakhir)';

        if (sorted.length === 0) {
            listEl.innerHTML = '<li style="padding:10px 0;">Belum ada aktivitas dalam 7 hari terakhir.</li>';
        } else {
            listEl.innerHTML = sorted.map((s, idx) => {
                const arrTanggal = Array.from(s.hariAktif).map(k => s.detailHari[k]);
                return `<li style="padding: 10px 0; border-bottom: 1px solid #f9ecea;">
                    <strong>${idx + 1}. ${escapeHtml(s.nama)} (${escapeHtml(s.kelas)})</strong>
                    <br><span style="color:#8c2222; font-weight:600;">Aktif: ${s.hariAktif.size} Hari</span>
                    <br><small style="color:#c9560f;">Tanggal: ${arrTanggal.join(', ')}</small></li>`;
            }).join('');
        }

        modal.style.display = 'flex';
    }

    // FUNGSI 3 BARU: Menampilkan pop-up rincian aktivitas siswa tertentu hari ini
    function bukaRiwayatSpesifik(nis, nama) {
        const modal = document.getElementById('modal-riwayat-siswa');
        const judulEl = document.getElementById('riwayat-siswa-judul');
        const listEl = document.getElementById('riwayat-siswa-list');
        if (!modal || !listEl) return;

        const todayKey = getTanggalKeyHariIni();

        // Saring log aktivitas HANYA untuk siswa yang di-klik dan HANYA hari ini
        const riwayatSiswa = recentActivityLog.filter(a => a.nis === nis && a.tanggalKey === todayKey);

        if (judulEl) judulEl.textContent = 'Rincian Setoran Hari Ini: ' + nama;

        if (riwayatSiswa.length === 0) {
            listEl.innerHTML = '<li style="padding:10px 0;">Belum ada setoran hari ini.</li>';
        } else {
            listEl.innerHTML = riwayatSiswa.map(a => {
                const programAman = escapeHtml(a.program.charAt(0).toUpperCase() + a.program.slice(1));
                const pelajaranAman = escapeHtml(a.pelajaran);
                const babAman = escapeHtml(a.bab);
                const subbabAman = escapeHtml(a.subbab);

                // Format HTML sesuai contoh yang Anda minta: Hafalan - Kimia - Bab 1 - Sub bab 1
                return `<li style="padding: 10px 0; border-bottom: 1px solid #f9ecea;">
                    <strong>${a.waktu}</strong>
                    <br>Setoran: <strong style="color:#8c2222;">${subbabAman}</strong>
                    <br><small style="color:#c9560f;">${programAman} - ${pelajaranAman} - ${babAman}</small></li>`;
            }).join('');
        }

        // Tampilkan modal
        modal.style.display = 'flex';
    }

    // ==================================================================
    // FITUR REKAP MINGGUAN & EXCEL (BELUM ADA PROGRESS)
    // ==================================================================

    // Variabel global sementara untuk menyimpan data rekap mingguan agar bisa diexport
    let dataExportMingguan = [];

    // 1. Membuka Modal Rekap 7 Hari Tidak Ada Progress
    function bukaRekapBelumProgressMingguan() {
        const modal = document.getElementById('modal-riwayat-siswa');
        const judulEl = document.getElementById('riwayat-siswa-judul');
        const listEl = document.getElementById('riwayat-siswa-list');
        if (!modal || !listEl) return;

        const selectKelas = document.getElementById('filter-kelas-belum');
        const kelasTerpilih = selectKelas ? selectKelas.value : "Semua";

        // Siapkan daftar 7 hari terakhir
        const now = new Date();
        const datesToCheck = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            datesToCheck.push({
                key: `${yyyy}-${mm}-${dd}`,
                display: d.toLocaleDateString('id-ID')
            });
        }

        const rekapTidakAktif = [];

        // Cek setiap siswa
        Object.values(databaseSiswa).forEach(siswa => {
            if (kelasTerpilih !== "Semua" && siswa.kelas !== kelasTerpilih) return;

            const hariTidakAktif = [];
            datesToCheck.forEach(dateObj => {
                // Jika tidak ditemukan satupun log untuk siswa ini di tanggal tersebut
                const adaAktivitas = recentActivityLog.some(a => a.nis === siswa.nis && a.tanggalKey === dateObj.key);
                if (!adaAktivitas) {
                    hariTidakAktif.push(dateObj.display);
                }
            });

            if (hariTidakAktif.length > 0) {
                rekapTidakAktif.push({
                    nis: siswa.nis,
                    nama: siswa.nama,
                    kelas: siswa.kelas,
                    jumlahKosong: hariTidakAktif.length,
                    hari: hariTidakAktif
                });
            }
        });

        // Urutkan dari yang paling banyak tidak setor
        rekapTidakAktif.sort((a, b) => b.jumlahKosong - a.jumlahKosong || a.nama.localeCompare(b.nama));

        // Simpan ke variabel global untuk diexport ke Excel
        dataExportMingguan = rekapTidakAktif;

        // Tambahkan tombol Export Excel di dalam judul Modal
        if (judulEl) {
            judulEl.innerHTML = `Rekap Belum Progress (7 Hari) <button onclick="exportBelumProgressMingguan()" style="margin-left: 10px; padding: 4px 10px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 13px;"><i class="fas fa-file-excel"></i> Export</button>`;
        }

        if (rekapTidakAktif.length === 0) {
            listEl.innerHTML = '<li style="padding:10px 0;">🎉 Semua siswa terpilih selalu setor setiap hari dalam seminggu terakhir.</li>';
        } else {
            listEl.innerHTML = rekapTidakAktif.map((s, idx) => {
                return `<li style="padding: 10px 0; border-bottom: 1px solid #f9ecea;">
                    <strong>${idx + 1}. ${escapeHtml(s.nama)} (${escapeHtml(s.kelas)})</strong>
                    <br><span style="color:#c0392b; font-weight:600;">Tidak Progress: ${s.jumlahKosong} Hari</span>
                    <br><small style="color:#4a2525;">Tanggal: ${s.hari.join(', ')}</small></li>`;
            }).join('');
        }

        modal.style.display = 'flex';
    }

    // 2. Export ke Excel untuk daftar "Belum Ada Progress" HARI INI
    function exportBelumProgressHarian() {
        // --- [BARU] Verifikasi Password Admin sebelum proses dimulai ---
        if (!verifikasiPasswordAdmin("export Excel data belum progress hari ini")) {
            return; // Hentikan eksekusi jika password salah atau dibatalkan
        }

        const selectKelas = document.getElementById('filter-kelas-belum');
        const kelasTerpilih = selectKelas ? selectKelas.value : "Semua";

        const todayKey = getTanggalKeyHariIni();
        const nisSudahAktivitas = new Set(recentActivityLog.filter(a => a.tanggalKey === todayKey).map(a => a.nis));

        const dataExport = Object.values(databaseSiswa)
            .filter(siswa => !nisSudahAktivitas.has(siswa.nis) && (kelasTerpilih === "Semua" || siswa.kelas === kelasTerpilih))
            .map((siswa, idx) => ({
                "No": idx + 1,
                "Stanbuk": siswa.nis,
                "Nama": siswa.nama,
                "Kelas": siswa.kelas,
                "Progress Keseluruhan (%)": hitungProgressKeseluruhanSiswa(siswa.nis)
            }));

        if (dataExport.length === 0) return alert("Tidak ada data untuk diexport (semua sudah progress).");

        const ws = XLSX.utils.json_to_sheet(dataExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Belum Progress Harian");
        XLSX.writeFile(wb, `Data_Belum_Progress_Hari_Ini_${kelasTerpilih}.xlsx`);
    }
    // 3. Export ke Excel untuk rekap "Belum Ada Progress" 7 HARI TERAKHIR
    function exportBelumProgressMingguan() {
        if (dataExportMingguan.length === 0) return alert("Tidak ada data rekap mingguan untuk diexport.");

        // --- [BARU] Verifikasi Password Admin sebelum proses dimulai ---
        if (!verifikasiPasswordAdmin("export Excel rekap belum progress 7 hari")) {
            return; // Hentikan eksekusi jika password salah atau dibatalkan
        }

        const selectKelas = document.getElementById('filter-kelas-belum');
        const kelasTerpilih = selectKelas ? selectKelas.value : "Semua";

        const dataExport = dataExportMingguan.map((s, idx) => ({
            "No": idx + 1,
            "Stanbuk": s.nis,
            "Nama": s.nama,
            "Kelas": s.kelas,
            "Total Hari Kosong": s.jumlahKosong,
            "Daftar Tanggal Kosong": s.hari.join(', ')
        }));

        const ws = XLSX.utils.json_to_sheet(dataExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rekap Kosong 7 Hari");
        XLSX.writeFile(wb, `Rekap_Belum_Progress_7_Hari_${kelasTerpilih}.xlsx`);
    }

    // Variabel penampung NIS yang sedang diedit
    let nisSedangDiedit = null;

    function bukaModalEdit(nis) {
        const siswa = databaseSiswa[nis];
        if (!siswa) return;

        nisSedangDiedit = nis;

        // Masukkan data lama ke dalam input modal
        document.getElementById('edit-stanbuk').value = siswa.nis;
        document.getElementById('edit-no-absen').value = siswa.noAbsen || '';
        document.getElementById('edit-nama').value = siswa.nama || '';
        document.getElementById('edit-kelas').value = siswa.kelas || '';
        document.getElementById('edit-daerah').value = siswa.daerah || '';

        // Tampilkan modal edit
        const modal = document.getElementById('modal-edit-siswa');
        if (modal) modal.style.display = 'flex';
    }

    function tutupModalEdit() {
        nisSedangDiedit = null;
        const modal = document.getElementById('modal-edit-siswa');
        if (modal) modal.style.display = 'none';
    }

    function simpanPerubahanEdit() {
        if (!nisSedangDiedit || !databaseSiswa[nisSedangDiedit]) return;

        // Verifikasi password admin sebelum menyimpan perubahan
        if (!verifikasiPasswordAdmin("mengubah data siswa " + databaseSiswa[nisSedangDiedit].nama)) {
            return;
        }

        const absenBaru = document.getElementById('edit-no-absen').value.trim();
        const namaBaru = document.getElementById('edit-nama').value.trim();
        const kelasBaru = document.getElementById('edit-kelas').value.trim();
        const daerahBaru = document.getElementById('edit-daerah').value.trim();

        if (!namaBaru) {
            alert("Nama wajib diisi!");
            return;
        }

        // Update data tanpa menyentuh progressBelajar / targetBelajar
        databaseSiswa[nisSedangDiedit].noAbsen = absenBaru || "-";
        databaseSiswa[nisSedangDiedit].nama = namaBaru;
        databaseSiswa[nisSedangDiedit].kelas = kelasBaru || "-";
        databaseSiswa[nisSedangDiedit].daerah = daerahBaru || "-";

        simpanKeStorage();
        tutupModalEdit();
        renderTabelSiswa();
        alert("Data siswa berhasil diperbarui!");
    }

// ==========================================
// MANAJEMEN DATA GURU & HAK AKSES
// ==========================================

// Mengambil data dari LocalStorage atau membuat default data
let daftarGuru = JSON.parse(localStorage.getItem('daftarGuru')) || [
    { noGuru: "G-001", nama: "Raihan Muhammad Ikbal", tahun: "2024", daerah: "Ponorogo", bagian: "Admin Utama", noHp: "-" }
];

function renderTabelGuru() {
    const tbody = document.getElementById('tabel-body-guru');
    if (!tbody) return;

    const searchInput = document.getElementById("search-guru");
    const ddlTahun = document.getElementById("filter-tahun-guru");
    const ddlDaerah = document.getElementById("filter-daerah-guru");
    const ddlBagian = document.getElementById("filter-bagian-guru");

    const searchVal = searchInput ? searchInput.value.toLowerCase() : "";
    const filterTahun = ddlTahun && ddlTahun.value ? ddlTahun.value : "Semua";
    const filterDaerah = ddlDaerah && ddlDaerah.value ? ddlDaerah.value : "Semua";
    const filterBagian = ddlBagian && ddlBagian.value ? ddlBagian.value : "Semua";

    let setTahun = new Set();
    let setDaerah = new Set();
    let setBagian = new Set();
    let count = 0;
    let barisHTML = "";

    daftarGuru.forEach((guru, index) => {
        if (guru.tahun && guru.tahun !== "-") setTahun.add(guru.tahun);
        if (guru.daerah && guru.daerah !== "-") setDaerah.add(guru.daerah);
        if (guru.bagian && guru.bagian !== "-") setBagian.add(guru.bagian);

        const matchSearch = (guru.noGuru && guru.noGuru.toLowerCase().includes(searchVal)) || (guru.nama && guru.nama.toLowerCase().includes(searchVal));
        const matchTahun = (filterTahun === "Semua" || guru.tahun === filterTahun);
        const matchDaerah = (filterDaerah === "Semua" || guru.daerah === filterDaerah);
        const matchBagian = (filterBagian === "Semua" || guru.bagian === filterBagian);

        if (matchSearch && matchTahun && matchDaerah && matchBagian) {
            count++;
            barisHTML += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; color: #8c2222;">${guru.noGuru || '-'}</td>
                <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; color: #4a2525;">${guru.nama}</td>
                <td style="padding: 10px; border: 1px solid #eee;">${guru.tahun || '-'}</td>
                <td style="padding: 10px; border: 1px solid #eee;">${guru.daerah || '-'}</td>
                <td style="padding: 10px; border: 1px solid #eee;"><span style="background: #fdf6f5; color: #8c2222; padding: 3px 8px; border-radius: 10px; font-size: 12px; font-weight: bold; border: 1px solid #f9ecea;">${guru.bagian || '-'}</span></td>
                <td style="padding: 10px; border: 1px solid #eee;">${guru.noHp || '-'}</td>
                <td style="padding: 10px; border: 1px solid #eee; text-align: center;">
                    <button onclick="bukaModalEditGuru(${index})" style="background: #f39c12; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-bottom: 2px;" title="Edit"><i class="fas fa-edit"></i></button>
                    <button onclick="hapusGuru(${index})" style="background: #c0392b; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 5px;" title="Hapus"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
            `;
        }
    });

    if (count === 0) {
        barisHTML = `<tr><td colspan="7" style="text-align: center; padding: 15px; color: #777; font-style: italic;">Tidak ada data guru yang cocok.</td></tr>`;
    }

    tbody.innerHTML = barisHTML;
    updateDropdownFilterGuru(setTahun, setDaerah, setBagian);
}

function updateDropdownFilterGuru(setTahun, setDaerah, setBagian) {
    const ddlTahun = document.getElementById("filter-tahun-guru");
    const ddlDaerah = document.getElementById("filter-daerah-guru");
    const ddlBagian = document.getElementById("filter-bagian-guru");

    if (ddlTahun) {
        const currentTahun = ddlTahun.value;
        ddlTahun.innerHTML = `<option value="Semua">Semua Tahun</option>`;
        [...setTahun].sort((a, b) => b - a).forEach(t => ddlTahun.innerHTML += `<option value="${t}">${t}</option>`);
        ddlTahun.value = currentTahun || "Semua";
    }

    if (ddlDaerah) {
        const currentDaerah = ddlDaerah.value;
        ddlDaerah.innerHTML = `<option value="Semua">Semua Daerah</option>`;
        [...setDaerah].sort().forEach(d => ddlDaerah.innerHTML += `<option value="${d}">${d}</option>`);
        ddlDaerah.value = currentDaerah || "Semua";
    }

    if (ddlBagian) {
        const currentBagian = ddlBagian.value;
        ddlBagian.innerHTML = `<option value="Semua">Semua Bagian</option>`;
        [...setBagian].sort().forEach(b => ddlBagian.innerHTML += `<option value="${b}">${b}</option>`);
        ddlBagian.value = currentBagian || "Semua";
    }
}

function resetFilterGuru() {
    if (document.getElementById("search-guru")) document.getElementById("search-guru").value = "";
    if (document.getElementById("filter-tahun-guru")) document.getElementById("filter-tahun-guru").value = "Semua";
    if (document.getElementById("filter-daerah-guru")) document.getElementById("filter-daerah-guru").value = "Semua";
    if (document.getElementById("filter-bagian-guru")) document.getElementById("filter-bagian-guru").value = "Semua";
    renderTabelGuru();
}

function simpanGuruKeStorage() {
    localStorage.setItem('daftarGuru', JSON.stringify(daftarGuru));
    if (typeof firebaseDb !== 'undefined') {
        firebaseDb.ref('daftarGuru').set(daftarGuru).catch(err => console.error("Gagal sinkron guru ke Firebase:", err));
    }
}

function bukaModalGuru() {
    document.getElementById('modal-guru-judul').textContent = "Tambah Data Guru";
    document.getElementById('edit-index-guru').value = "";

    document.getElementById('input-noguru-guru').value = "";
    document.getElementById('input-nama-guru').value = "";
    document.getElementById('input-tahun-guru').value = "";
    document.getElementById('input-daerah-guru').value = "";
    document.getElementById('input-bagian-guru').value = "";
    document.getElementById('input-hp-guru').value = "";

    document.getElementById('modal-guru').style.display = 'flex';
}

function bukaModalEditGuru(index) {
    const guru = daftarGuru[index];
    if (!guru) return;

    document.getElementById('modal-guru-judul').textContent = "Edit Data Guru";
    document.getElementById('edit-index-guru').value = index;

    document.getElementById('input-noguru-guru').value = guru.noGuru || "";
    document.getElementById('input-nama-guru').value = guru.nama || "";
    document.getElementById('input-tahun-guru').value = guru.tahun || "";
    document.getElementById('input-daerah-guru').value = guru.daerah || "";
    document.getElementById('input-bagian-guru').value = guru.bagian || "";
    document.getElementById('input-hp-guru').value = guru.noHp || "";

    document.getElementById('modal-guru').style.display = 'flex';
}

function tutupModalGuru() {
    document.getElementById('modal-guru').style.display = 'none';
}

function simpanDataGuru() {
    const noGuru = document.getElementById('input-noguru-guru').value.trim() || ("G-" + Date.now().toString().slice(-4));
    const nama = document.getElementById('input-nama-guru').value.trim();
    const tahun = document.getElementById('input-tahun-guru').value.trim() || "-";
    const daerah = document.getElementById('input-daerah-guru').value.trim() || "-";
    const bagian = document.getElementById('input-bagian-guru').value.trim() || "-";
    const noHp = document.getElementById('input-hp-guru').value.trim() || "-";
    const editIndex = document.getElementById('edit-index-guru').value;

    if (!nama) {
        alert("Nama Guru wajib diisi!");
        return;
    }

    if (typeof verifikasiPasswordAdmin === 'function' && !verifikasiPasswordAdmin(editIndex === "" ? "menambah data guru" : "mengubah data guru")) return;

    if (editIndex === "") {
        daftarGuru.push({ noGuru, nama, tahun, daerah, bagian, noHp });
        if (typeof catatAktivitasGuru === 'function') catatAktivitasGuru(`Menambahkan data guru baru: ${nama}`);
    } else {
        daftarGuru[editIndex] = { noGuru, nama, tahun, daerah, bagian, noHp };
        if (typeof catatAktivitasGuru === 'function') catatAktivitasGuru(`Mengubah data guru: ${nama}`);
    }

    simpanGuruKeStorage();
    tutupModalGuru();
    renderTabelGuru();
    alert("Data guru berhasil disimpan!");
}

function hapusGuru(index) {
    if (typeof verifikasiPasswordAdmin === 'function' && !verifikasiPasswordAdmin("menghapus data guru")) return;

    if (confirm(`Yakin ingin menghapus guru ${daftarGuru[index].nama}?`)) {
        daftarGuru.splice(index, 1);
        simpanGuruKeStorage();
        renderTabelGuru();
        alert("Data guru berhasil dihapus.");
    }
}

    // ==========================================
    // PENGATURAN & KEAMANAN SISTEM
    // ==========================================

    // Mengambil password dari localStorage jika ada, default "raihan"
    function getPasswordAdminAktif() {
        return localStorage.getItem('passwordAdmin') || "raihan";
    }

    function verifikasiPasswordAdmin(namaAksi) {
        const currentPass = getPasswordAdminAktif();
        const input = prompt("Masukkan password untuk " + namaAksi + ":");
        if (input === null) return false;
        if (input !== currentPass) {
            alert("Password salah. Aksi dibatalkan.");
            return false;
        }
        return true;
    }

    function simpanPasswordBaru() {
        const oldPass = document.getElementById('old-password').value;
        const newPass = document.getElementById('new-password').value;
        const currentPass = getPasswordAdminAktif();

        if (!oldPass || !newPass) {
            alert("Harap isi password lama dan password baru!");
            return;
        }

        if (oldPass !== currentPass) {
            alert("Password lama salah!");
            return;
        }

        if (newPass.length < 4) {
            alert("Password baru minimal 4 karakter.");
            return;
        }

        localStorage.setItem('passwordAdmin', newPass);
        document.getElementById('old-password').value = "";
        document.getElementById('new-password').value = "";
        alert("Password admin berhasil diperbarui!");
    }

    function backupDataApp() {
        if (!verifikasiPasswordAdmin("melakukan backup data aplikasi")) return;

        const backupData = {
            databaseSiswa: databaseSiswa,
            daftarGuru: daftarGuru,
            recentActivityLog: recentActivityLog,
            tanggalBackup: new Date().toLocaleDateString('id-ID')
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `Backup_Aplikasi_Siswa_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    // Script otomatis untuk merubah teks "Data Guru" menjadi "Guru" pada halaman terkait
    document.addEventListener("DOMContentLoaded", function () {
        // Cari semua elemen yang memuat teks "Data Guru" di heading halaman
        const headings = document.querySelectorAll('h1, h2, h3, .page-title, .section-title');
        headings.forEach(el => {
            if (el.textContent.trim() === "Data Guru") {
                el.textContent = "Guru";
            }
        });
    });

    // ==========================================
    // AUTOCOMPLETE / PENCARIAN OTOMATIS NAMA SISWA
    // ==========================================
    function filterSiswaTargetAutocomplete() {
        const inputKeyword = document.getElementById('cari-siswa-target').value.toLowerCase().trim();
        const suggestionBox = document.getElementById('autocomplete-list-siswa');
        const selectSiswa = document.getElementById('target-siswa');

        if (!suggestionBox || !selectSiswa) return;

        suggestionBox.innerHTML = "";

        if (inputKeyword === "") {
            suggestionBox.style.display = "none";
            selectSiswa.value = "";
            return;
        }

        // Ambil data siswa yang cocok dengan ketikan
        const daftarSiswa = Object.values(databaseSiswa);
        const hasilFilter = daftarSiswa.filter(s => s.nama.toLowerCase().includes(inputKeyword));

        if (hasilFilter.length === 0) {
            suggestionBox.style.display = "block";
            suggestionBox.innerHTML = `<div style="padding: 10px; color: #777; font-size: 13px;">Siswa tidak ditemukan</div>`;
            return;
        }

        suggestionBox.style.display = "block";

        // Tampilkan daftar nama yang sesuai di bawah input
        hasilFilter.forEach(siswa => {
            const item = document.div || document.createElement('div');
            item.style.cssText = "padding: 10px; font-size: 13px; cursor: pointer; border-bottom: 1px solid #f9ecea; color: #4a2525;";
            item.innerHTML = `<strong>${escapeHtml(siswa.nama)}</strong> <small style="color: #c9560f;">(${escapeHtml(siswa.kelas)})</small>`;

            // Efek hover interaktif
            item.onmouseover = () => item.style.background = "#fdf6f5";
            item.onmouseout = () => item.style.background = "white";

            // Ketika salah satu nama diklik
            item.onclick = function () {
                document.getElementById('cari-siswa-target').value = siswa.nama; // Masukkan nama ke input teks
                selectSiswa.value = siswa.nis; // Set value pada select tersembunyi
                suggestionBox.style.display = "none"; // Tutup kotak rekomendasi
            };

            suggestionBox.appendChild(item);
        });
    }

    // Tutup kotak rekomendasi jika pengguna mengklik di luar area input/dropdown
    document.addEventListener("click", function (e) {
        const cariInput = document.getElementById('cari-siswa-target');
        const suggestionBox = document.getElementById('autocomplete-list-siswa');
        if (cariInput && suggestionBox && !cariInput.contains(e.target) && !suggestionBox.contains(e.target)) {
            suggestionBox.style.display = "none";
        }
    });

    // Fungsi untuk membuka/menutup dropdown pilihan kelas
    function toggleDropdownKelasSiswa() {
        const list = document.getElementById('checkbox-kelas-list');
        if (list) {
            list.style.display = (list.style.display === 'none' || list.style.display === '') ? 'flex' : 'none';
        }
    }

    // Menutup dropdown otomatis jika pengguna mengklik di luar area filter
    document.addEventListener('click', function (e) {
        const container = document.getElementById('checkbox-kelas-list');
        const btn = container ? container.previousElementSibling : null;
        if (container && btn && !container.contains(e.target) && !btn.contains(e.target)) {
            container.style.display = 'none';
        }
    });

    // ==========================================
    // PASSWORD BERSAMA WEB
    // ==========================================
    // const PASSWORD_WEB_BERSAMA = "ijhad2026";

    // ==========================================
    // FITUR PENCARIAN NAMA GURU SAAT LOGIN
    // ==========================================
    function filterNamaGuruLogin() {
        const input = document.getElementById("input-nama-guru-login");
        const filter = input.value.toLowerCase();
        const listContainer = document.getElementById("autocomplete-list-login");

        listContainer.innerHTML = ""; // Kosongkan daftar sebelumnya

        // Sembunyikan jika input kosong
        if (!filter) {
            listContainer.style.display = "none";
            return;
        }

        let adaHasil = false;

        // Cari nama yang cocok di daftarGuru
        if (typeof daftarGuru !== 'undefined') {
            daftarGuru.forEach(guru => {
                if (guru.nama && guru.nama.toLowerCase().includes(filter)) {
                    adaHasil = true;
                    const div = document.createElement("div");
                    div.style.padding = "10px 15px";
                    div.style.cursor = "pointer";
                    div.style.borderBottom = "1px solid #f9ecea";
                    div.style.color = "#4a2525";
                    div.style.fontWeight = "bold";
                    div.innerHTML = guru.nama;

                    // Efek hover
                    div.onmouseover = function () { this.style.background = "#fdf6f5"; };
                    div.onmouseout = function () { this.style.background = "white"; };

                    // Saat nama diklik
                    div.onclick = function () {
                        input.value = guru.nama; // Masukkan nama ke kolom input
                        listContainer.style.display = "none"; // Tutup kotak pilihan
                    };

                    listContainer.appendChild(div);
                }
            });
        }

        // Tampilkan kotak pilihan jika ada hasil
        listContainer.style.display = adaHasil ? "block" : "none";
    }

    // Menutup kotak pencarian jika user klik di luar kotak
    document.addEventListener("click", function (e) {
        const input = document.getElementById("input-nama-guru-login");
        const listContainer = document.getElementById("autocomplete-list-login");
        if (e.target !== input && e.target !== listContainer) {
            if (listContainer) listContainer.style.display = "none";
        }
    });


    // ==========================================
// FUNGSI LOGIN / PASSWORD BERSAMA WEB (REVISI)
// ==========================================
function cekPasswordWeb() {
    const inputEl = document.getElementById('input-password-web');
    const inputNamaEl = document.getElementById('input-nama-guru-login');
    const pesanError = document.getElementById('pesan-error-login');

    if (!inputEl) return;

    const input = inputEl.value.trim();
    const namaGuru = inputNamaEl ? inputNamaEl.value.trim() : "";

    // 1. BLOKIR JIKA NAMA KOSONG
    if (!namaGuru || namaGuru === "") {
        tampilkanErrorLogin("Akses ditolak! Silakan cari & pilih nama Anda terlebih dahulu.");
        return;
    }

    // 2. BLOKIR JIKA NAMA TIDAK ADA DI DATABASE GURU (TIDAK BOLEH NGETIK ASAL)
    const cekGuruValid = daftarGuru.find(g => g.nama.toLowerCase() === namaGuru.toLowerCase());
    if (!cekGuruValid) {
        tampilkanErrorLogin("Nama tidak ditemukan di database! Pastikan memilih dari hasil pencarian.");
        return;
    }

    // 3. PENGECEKAN PASSWORD
    if (input === PASSWORD_WEB_BERSAMA) {
        // Gunakan nama asli dari database
        const namaResmi = cekGuruValid.nama;

        sessionStorage.setItem('isWebUnlocked', 'true');
        sessionStorage.setItem('guruAktif', namaResmi);
        
        // Simpan ke localStorage agar nama tidak hilang saat di-refresh
        localStorage.setItem('guruAktif', namaResmi); 

        const userInfo = document.querySelector(".user-info span");
        if (userInfo) userInfo.textContent = namaResmi;

        const loginScreen = document.getElementById('login-screen');
        if (loginScreen) loginScreen.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Perekam aktivitas "Melakukan Login" SUDAH DIHAPUS DARI SINI
        
    } else {
        tampilkanErrorLogin("Password salah! Silakan coba lagi.");
    }
}

    // Fungsi Bantuan untuk Error
    function tampilkanErrorLogin(pesan) {
        const pesanError = document.getElementById('pesan-error-login');
        if (pesanError) {
            pesanError.textContent = pesan;
            pesanError.style.display = 'block';
            setTimeout(() => { pesanError.style.display = 'none'; }, 4000);
        } else {
            alert(pesan);
        }
    }

    // --- INISIALISASI PENGECEKAN LOGIN WEB SAAT HALAMAN DIMUAT ---
    document.addEventListener("DOMContentLoaded", () => {
        // Siapkan opsi nama di dropdown login
        if (typeof siapkanDropdownLogin === "function") {
            siapkanDropdownLogin();
        }

        // 1. Pengecekan Sesi Login Web
        if (sessionStorage.getItem('isWebUnlocked') === 'true') {
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen) loginScreen.style.display = 'none';
            document.body.style.overflow = 'auto';

            // Kembalikan nama guru di UI jika sudah login
            const namaGuru = sessionStorage.getItem('guruAktif');
            const userInfo = document.querySelector(".user-info span");
            if (namaGuru && userInfo) {
                userInfo.textContent = namaGuru;
            }
        } else {
            document.body.style.overflow = 'hidden'; // Matikan scroll saat di layar login
        }

        // 2. Fitur agar bisa login dengan menekan tombol "Enter" di keyboard
        const inputPassWeb = document.getElementById('input-password-web');
        if (inputPassWeb) {
            inputPassWeb.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    cekPasswordWeb();
                }
            });
        }
    });

    // ==========================================
// FUNGSI LOGOUT SISTEM
// ==========================================
function logoutWeb() {
    // 1. Konfirmasi dulu agar tidak tidak sengaja terklik
    const konfirmasi = confirm("Apakah Anda yakin ingin keluar dari aplikasi?");
    if (!konfirmasi) return;

    // Perekam aktivitas "Melakukan Logout" SUDAH DIHAPUS DARI SINI

    // 2. Hapus data kunci di Session Storage & Local Storage
    sessionStorage.removeItem('isWebUnlocked');
    sessionStorage.removeItem('guruAktif');
    // localStorage.removeItem('guruAktif'); // Opsional, bisa diaktifkan jika ingin nama benar-benar bersih

    // 3. Reset inputan di form login
    const inputPass = document.getElementById('input-password-web');
    const inputNama = document.getElementById('input-nama-guru-login');
    if (inputPass) inputPass.value = "";
    if (inputNama) inputNama.value = "";

    // 4. Kembalikan nama profil ke awal
    const userInfo = document.querySelector(".user-info span");
    if (userInfo) userInfo.textContent = "Pengguna";

    // 5. Tampilkan kembali layar kunci (login screen) dan matikan scroll web
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.style.display = 'flex'; // Tampilkan layar
    }
    document.body.style.overflow = 'hidden'; // Kunci scroll
}

    /* ==================================================================
       12. FITUR ABSENSI & REKAP
       ================================================================== */

    function simpanAbsensiKeStorage() {
        localStorage.setItem('riwayatAbsensi', JSON.stringify(riwayatAbsensi));
        if (typeof firebaseDb !== 'undefined') {
            firebaseDb.ref('riwayatAbsensi').set(riwayatAbsensi);
        }
    }

    function switchAbsenTab(tab) {
        const isForm = tab === 'form';

        const elForm = document.getElementById('tab-form-absen');
        const elRekap = document.getElementById('tab-rekap-absen');

        if (elForm) elForm.style.display = isForm ? 'block' : 'none';
        if (elRekap) elRekap.style.display = isForm ? 'none' : 'block';

        const btnForm = document.getElementById('btn-tab-form-absen');
        const btnRekap = document.getElementById('btn-tab-rekap-absen');

        if (isForm) {
            if (btnForm) { btnForm.style.background = '#8c2222'; btnForm.style.color = 'white'; }
            if (btnRekap) { btnRekap.style.background = '#fafafa'; btnRekap.style.color = '#444'; }
        } else {
            if (btnRekap) { btnRekap.style.background = '#8c2222'; btnRekap.style.color = 'white'; }
            if (btnForm) { btnForm.style.background = '#fafafa'; btnForm.style.color = '#444'; }

            if (typeof renderRekapAbsen === 'function') {
                renderRekapAbsen();
            }
        }
    }

    function setTanggalAbsen() {
        const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const now = new Date();
        const text = `${hari[now.getDay()]}, ${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;

        const el = document.getElementById('absen-tanggal');
        if (el) el.value = text;
    }

    function isiDropdownKelasAbsen() {
        const selectEl = document.getElementById("absen-filter-kelas");
        if (!selectEl) return;

        const valSebelumnya = selectEl.value;
        const daftarKelas = getDaftarKelasUnik(); // Menggunakan fungsi unik yang sudah ada sebelumnya

        let html = `<option value="">-- Pilih Kelas --</option>`;
        daftarKelas.forEach(k => html += `<option value="${escapeHtml(k)}">${escapeHtml(k)}</option>`);

        selectEl.innerHTML = html;
        if (valSebelumnya && daftarKelas.includes(valSebelumnya)) selectEl.value = valSebelumnya;
    }

    function renderTabelAbsen() {
        const kelas = document.getElementById("absen-filter-kelas").value;
        const tbody = document.getElementById("tabel-body-absen");
        if (!tbody) return;

        if (!kelas) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px;">Silakan pilih kelas terlebih dahulu.</td></tr>';
            return;
        }

        // Urutkan siswa berdasarkan nama A-Z untuk menentukan No. Absen
        const siswaKelas = Object.values(databaseSiswa)
            .filter(s => s.kelas === kelas)
            .sort((a, b) => a.nama.localeCompare(b.nama));

        if (siswaKelas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px;">Tidak ada siswa terdaftar di kelas ini.</td></tr>';
            return;
        }

        let html = "";
        siswaKelas.forEach((siswa, index) => {
            // Tarik data akumulasi statistik per siswa dari fungsi yang sudah kita buat sebelumnya
            const progresTotal = hitungProgressKeseluruhanSiswa(siswa.nis);

            let warnaProgres = "#8c2222";
            if (progresTotal >= 100) warnaProgres = "#1e8e3e";
            else if (progresTotal >= 50) warnaProgres = "#b97603";

            html += `
            <tr style="border-bottom: 1px solid #f9ecea;">
                <td style="text-align: center; font-weight: bold; color: #4a2525;">${index + 1}</td>
                <td>${escapeHtml(siswa.nis)}</td>
                <td style="font-weight: 600; color: #8c2222;">${escapeHtml(siswa.nama)}</td>
                <td>${escapeHtml(siswa.kelas)}</td>
                <td>${escapeHtml(siswa.daerah)}</td>
                <td><code>${escapeHtml(siswa.barcode)}</code></td>
                <td style="font-weight: bold; color: ${warnaProgres}; text-align: center;">${progresTotal}%</td>
                <td style="text-align:center;">
                    <input type="checkbox" class="cb-kehadiran" data-nis="${siswa.nis}" style="width:20px; height:20px; cursor:pointer;" title="Centang jika hadir">
                </td>
            </tr>
        `;
        });
        tbody.innerHTML = html;
    }

    function simpanDataAbsen() {
        const kelas = document.getElementById("absen-filter-kelas").value;
        const keterangan = document.getElementById("absen-keterangan").value.trim();
        const tanggal = document.getElementById("absen-tanggal").value;

        if (!kelas) return alert("Pilih kelas terlebih dahulu!");
        if (!keterangan) return alert("Keterangan pembaca absen wajib diisi (misal: Ustadz Fulan)!");

        if (!verifikasiPasswordAdmin("menyimpan absensi kelas " + kelas)) return;

        const checkboxes = document.querySelectorAll(".cb-kehadiran");
        const dataHadir = [];
        let hadirCount = 0;

        checkboxes.forEach(cb => {
            dataHadir.push({
                nis: cb.dataset.nis,
                hadir: cb.checked
            });
            if (cb.checked) hadirCount++;
        });

        // ... (kode di atasnya biarkan sama sampai variabel absensiBaru)

        const absensiBaru = {
            id: Date.now(),
            tanggal: tanggal,
            waktu: new Date().toLocaleTimeString('id-ID'),
            kelas: kelas,
            pembaca: keterangan,
            totalSiswa: checkboxes.length,
            hadir: hadirCount,
            detail: dataHadir
        };

        // GUNAKAN PUSH (TIDAK LAGI MENGGUNAKAN unshift ke lokal lalu menimpa server)
        if (typeof firebaseDb !== 'undefined') {
            firebaseDb.ref('riwayatAbsensi').push(absensiBaru).then(() => {
                alert("✅ Data absensi kelas " + kelas + " berhasil disimpan!");

                // Kosongkan form
                document.getElementById("absen-keterangan").value = "";
                document.getElementById("absen-filter-kelas").value = "";
                document.getElementById("tabel-body-absen").innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px;">Silakan pilih kelas terlebih dahulu.</td></tr>';

                // Pindah ke tab rekap
                switchAbsenTab('rekap');
            }).catch(err => {
                alert("Gagal menyimpan absensi ke server. Periksa koneksi internet.");
                console.error(err);
            });
        }
    }

    function renderRekapAbsen() {
        const tbody = document.getElementById("tabel-body-rekap-absen");
        if (!tbody) return;

        if (riwayatAbsensi.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color:#666;">Belum ada riwayat absensi.</td></tr>';
            return;
        }

        let html = "";
        riwayatAbsensi.forEach((rekap, index) => {
            let persenHadir = Math.round((rekap.hadir / rekap.totalSiswa) * 100);
            let warnaBadge = persenHadir === 100 ? '#e6f4ea' : (persenHadir > 50 ? '#fff3e0' : '#fbe9e7');
            let teksWarna = persenHadir === 100 ? '#1e8e3e' : (persenHadir > 50 ? '#e65100' : '#d32f2f');

            html += `
            <tr style="border-bottom: 1px solid #f9ecea;">
                <td style="padding: 12px;"><strong style="color:#8c2222;">${rekap.tanggal}</strong><br><small style="color:#666;">${rekap.waktu}</small></td>
                <td style="font-weight:bold; color:#c9560f; padding: 12px;">${rekap.kelas}</td>
                <td style="padding: 12px; color: #4a2525;">${rekap.pembaca}</td>
                <td style="padding: 12px;">
                    <span style="background: ${warnaBadge}; color: ${teksWarna}; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 13px;">
                        ${rekap.hadir} dari ${rekap.totalSiswa} Hadir
                    </span>
                </td>
                <td style="padding: 12px;">
                    <button onclick="hapusRekapAbsen(${index})" style="background: transparent; color: #c0392b; border: none; cursor: pointer; padding: 5px; transition: 0.2s;" onmouseover="this.style.color='#8c2222'" onmouseout="this.style.color='#c0392b'" title="Hapus Riwayat Ini">
                        <i class="fas fa-trash-alt"></i> Hapus
                    </button>
                </td>
            </tr>
        `;
        });
        tbody.innerHTML = html;
    }

    function hapusRekapAbsen(index) {
        if (!verifikasiPasswordAdmin("menghapus riwayat absen")) return;
        riwayatAbsensi.splice(index, 1);
        simpanAbsensiKeStorage();
        renderRekapAbsen();
    }

    /* ==================================================================
       13. FITUR KELAS TERAKTIF (DASHBOARD) & PERINGKAT KELAS (STATISTIK)
       ================================================================== */

    function renderKelasTeraktifCard() {
        const container = document.getElementById("list-kelas-teraktif");
        if (!container) return;

        const daftarKelas = getDaftarKelasUnik();
        if (daftarKelas.length === 0) {
            container.innerHTML = "<p style='text-align:center;'>Belum ada data kelas.</p>";
            return;
        }

        // Hitung rata-rata progres per kelas
        let skorKelas = daftarKelas.map(kelas => {
            const siswaKelas = Object.values(databaseSiswa).filter(s => s.kelas === kelas);
            if (siswaKelas.length === 0) return { kelas, rataRata: 0 };

            let totalProgres = 0;
            siswaKelas.forEach(s => {
                totalProgres += hitungProgressKeseluruhanSiswa(s.nis);
            });
            return { kelas, rataRata: Math.round(totalProgres / siswaKelas.length) };
        });

        // Urutkan dari persentase tertinggi
        skorKelas.sort((a, b) => b.rataRata - a.rataRata);

        let html = "";
        skorKelas.forEach((item, idx) => { // Ditampilkan semua kelas
            let medali = idx === 0 ? "🏆" : (idx === 1 ? "🥈" : (idx === 2 ? "🥉" : `${idx + 1}.`));
            let bg = idx === 0 ? "#fff9e6" : "#fdf6f5";
            html += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; padding:12px; background:${bg}; border-radius:8px; border-left: 4px solid #f39c12;">
                <span style="font-weight:600; color:#4a2525;">${medali} Kelas ${item.kelas}</span>
                <span style="font-weight:bold; color:#1e8e3e; font-size:16px;">${item.rataRata}%</span>
            </div>
        `;
        });
        container.innerHTML = html;
    }

    function switchStatistikTab(tab) {
        const isDetail = tab === 'detail';

        document.getElementById('tab-stat-detail').style.display = isDetail ? 'block' : 'none';
        document.getElementById('tab-stat-semua').style.display = isDetail ? 'none' : 'block';

        const btnDetail = document.getElementById('btn-tab-stat-detail');
        const btnSemua = document.getElementById('btn-tab-stat-semua');

        if (isDetail) {
            btnDetail.style.background = '#8c2222'; btnDetail.style.color = 'white';
            btnSemua.style.background = '#fafafa'; btnSemua.style.color = '#444';
        } else {
            btnSemua.style.background = '#8c2222'; btnSemua.style.color = 'white';
            btnDetail.style.background = '#fafafa'; btnDetail.style.color = '#444';
            renderPeringkatKelas(); // Render tabel peringkat saat tab dibuka
        }
    }

    function renderPeringkatKelas() {
        const tbody = document.getElementById("tabel-peringkat-kelas");
        if (!tbody) return;

        const daftarKelas = getDaftarKelasUnik();
        let dataPeringkat = [];

        daftarKelas.forEach(kelas => {
            const stat = hitungStatistikKelas(kelas);
            dataPeringkat.push({
                kelas: kelas,
                jumlahSiswa: stat.jumlahSiswa,
                totalBab: stat.totalBab,
                babSelesai: stat.babSelesai,
                persen: stat.progressKeseluruhan
            });
        });

        // Urutkan dari progres tertinggi
        dataPeringkat.sort((a, b) => b.persen - a.persen);

        let html = "";
        dataPeringkat.forEach((item, index) => {
            let warnaMedali = index === 0 ? "#FFD700" : (index === 1 ? "#C0C0C0" : (index === 2 ? "#CD7F32" : "#ccc"));
            let rankBadge = index < 3 ? `<i class="fas fa-trophy" style="color:${warnaMedali}; font-size:18px;"></i> ${index + 1}` : `<strong>${index + 1}</strong>`;

            html += `
            <tr style="border-bottom: 1px solid #f9ecea;">
                <td style="text-align:center; padding: 12px;">${rankBadge}</td>
                <td style="font-weight:bold; color:#8c2222; text-transform:uppercase; padding: 12px;">${item.kelas}</td>
                <td style="text-align:center; padding: 12px;">${item.jumlahSiswa} Siswa</td>
                <td style="text-align:center; padding: 12px;">${item.babSelesai} / ${item.totalBab} Bab</td>
                <td style="text-align:center; font-weight:bold; color:#1e8e3e; font-size:16px; padding: 12px;">${item.persen}%</td>
            </tr>
        `;
        });

        if (dataPeringkat.length === 0) {
            html = "<tr><td colspan='5' style='text-align:center; padding: 20px;'>Belum ada data kelas.</td></tr>";
        }

        tbody.innerHTML = html;
    }

    function renderKelasTeraktifHariIniCard() {
        const container = document.getElementById("list-kelas-teraktif-hari-ini");
        if (!container) return;

        let skorKelas = {};
        const daftarKelas = getDaftarKelasUnik();
        daftarKelas.forEach(k => skorKelas[k] = 0);

        const todayKey = getTanggalKeyHariIni();
        let hasData = false;

        if (typeof recentActivityLog !== 'undefined' && Array.isArray(recentActivityLog)) {
            recentActivityLog.forEach(log => {
                if (log.tanggalKey === todayKey) {
                    if (log.kelas) {
                        skorKelas[log.kelas]++;
                        hasData = true;
                    }
                }
            });
        }

        let sortedKelas = Object.keys(skorKelas).map(kelas => {
            return { kelas: kelas, skor: skorKelas[kelas] };
        });
        sortedKelas.sort((a, b) => b.skor - a.skor);

        let html = "";
        let top3 = sortedKelas.slice(0, 3);

        top3.forEach((item, idx) => {
            if (item.skor > 0) {
                let ikon = idx === 0 ? "🔥" : (idx === 1 ? "⚡" : "✨");
                let bg = idx === 0 ? "#fff2f0" : "#fdf6f5";
                html += `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; padding:12px; background:${bg}; border-radius:8px; border-left: 4px solid #e74c3c;">
                    <span style="font-weight:600; color:#4a2525;">${ikon} Kelas ${item.kelas}</span>
                    <span style="font-weight:bold; color:#e74c3c; font-size:16px;">${item.skor} Setoran</span>
                </div>
            `;
            }
        });

        if (!hasData) {
            html = "<p style='text-align:center; color: #777; font-size:14px; font-style:italic;'>Belum ada aktivitas setoran sub-bab hari ini.</p>";
        } else {
            html += `
            <div style="text-align: right; margin-top: 12px; border-top: 1px dashed #f9ecea; padding-top: 8px;">
                <button type="button" onclick="resetKelasTeraktifHariIni()" style="background: transparent; color: #c0392b; border: 1px solid #c0392b; padding: 5px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#fbe9e7'" onmouseout="this.style.background='transparent'">
                    <i class="fas fa-undo"></i> Reset Hari Ini
                </button>
            </div>
        `;
        }

        container.innerHTML = html;
    }

    function resetKelasTeraktifHariIni() {
        if (!verifikasiPasswordAdmin("reset data kelas teraktif hari ini")) return;

        if (confirm("Yakin ingin mereset data kelas teraktif hari ini? Ini akan menghapus riwayat aktivitas setoran HARI INI.")) {
            const todayKey = getTanggalKeyHariIni();

            if (typeof firebaseDb !== 'undefined') {
                // Cari data HARI INI langsung di server Firebase
                firebaseDb.ref('recentActivityLog').once('value').then(snapshot => {
                    const data = snapshot.val();
                    if (data) {
                        const updates = {};
                        // Kumpulkan semua data yang tanggalnya hari ini untuk dihapus
                        Object.keys(data).forEach(key => {
                            if (data[key].tanggalKey === todayKey) {
                                updates[key] = null;
                            }
                        });

                        // Eksekusi hapus massal khusus hari ini tanpa merusak data kemarin
                        firebaseDb.ref('recentActivityLog').update(updates).then(() => {
                            alert("✅ Data kelas teraktif hari ini berhasil direset menjadi nol.");
                        }).catch(err => console.error("Gagal mereset:", err));
                    }
                });
            }
        }
    }

    // 1. Render Card Rekap di Dashboard
    function renderRekapHarianDashboard() {
        const container = document.getElementById("container-rekap-harian");
        if (!container) return;

        const todayKey = getTanggalKeyHariIni();
        let totalSetoranHariIni = 0;

        if (typeof recentActivityLog !== 'undefined' && Array.isArray(recentActivityLog)) {
            totalSetoranHariIni = recentActivityLog.filter(log => log.tanggalKey === todayKey).length;
        }

        container.innerHTML = `
        <div onclick="bukaModalRekapHarian()" style="background: linear-gradient(135deg, #8c2222, #b52b2b); color: white; padding: 20px; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 10px rgba(140, 34, 34, 0.2); display: flex; justify-content: space-between; align-items: center; transition: 0.3s;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
            <div>
                <h3 style="margin: 0 0 5px 0; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-chart-line"></i> Rekap Kelas Hari Ini
                </h3>
                <p style="margin: 0; font-size: 13px; opacity: 0.9;">Klik untuk melihat nama siswa & export detail</p>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 32px; font-weight: bold; line-height: 1;">
                    ${totalSetoranHariIni}
                </div>
                <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">Setoran Sub-bab</div>
            </div>
        </div>
    `;
    }

    // 2. Fungsi Buka Modal & Isi Tabel Detail
    function bukaModalRekapHarian() {
        const modal = document.getElementById("modal-rekap-harian");
        const tbody = document.getElementById("tbody-rekap-harian");
        const selectKelas = document.getElementById("filter-kelas-rekap-harian");
        if (!modal || !tbody) return;

        const todayKey = getTanggalKeyHariIni();
        let setoranHariIni = (recentActivityLog || []).filter(log => log.tanggalKey === todayKey);

        // 1. Ambil dan isi daftar kelas secara mandiri & aman
        if (selectKelas) {
            const currentVal = selectKelas.value || "Semua";

            const daftarKelas = [...new Set(
                Object.values(databaseSiswa || {})
                    .map(s => (s.kelas || "").trim())
                    .filter(k => k !== "" && k !== "-")
            )].sort((a, b) => a.localeCompare(b, 'id'));

            selectKelas.innerHTML = '<option value="Semua">Semua Kelas</option>';
            daftarKelas.forEach(k => {
                selectKelas.innerHTML += `<option value="${k}">Kelas ${k}</option>`;
            });

            selectKelas.value = daftarKelas.includes(currentVal) ? currentVal : "Semua";
        }

        // 2. Filter data berdasarkan kelas yang dipilih
        const selectedKelas = selectKelas ? selectKelas.value : "Semua";
        if (selectedKelas !== "Semua") {
            setoranHariIni = setoranHariIni.filter(log => String(log.kelas || "").trim().toLowerCase() === String(selectedKelas).trim().toLowerCase());
        }

        let html = "";

        if (setoranHariIni.length === 0) {
            html = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: #777; font-style: italic;">Belum ada setoran hari ini untuk filter kelas yang dipilih.</td></tr>`;
        } else {
            setoranHariIni.forEach((log, index) => {
                html += `
                <tr style="border-bottom: 1px solid #f2f2f2; transition: 0.2s;" onmouseover="this.style.background='#fdf6f5'" onmouseout="this.style.background='transparent'">
                    <td style="padding: 12px; text-align: center; color: #555; font-weight: bold;">${index + 1}</td>
                    <td style="padding: 12px; text-align: center; color: #555;">${log.waktu || '-'}</td>
                    <td style="padding: 12px; color: #8c2222;"><strong>${log.nama}</strong></td>
                    <td style="padding: 12px; text-align: center; font-weight: bold; color: #555;">${log.kelas || '-'}</td>
                    <td style="padding: 12px;">
                        <span style="color: #b97603; font-weight: bold; text-transform: capitalize; font-size: 13px;">${log.program}</span><br>
                        <span style="font-size: 12px; color: #777;">${log.pelajaran}</span>
                    </td>
                    <td style="padding: 12px;">
                        <div style="font-weight: 600; font-size: 13px; color: #444;">${log.bab}</div>
                        <div style="font-size: 12px; color: #777; margin-top: 2px;">${log.subbab}</div>
                    </td>
                </tr>
            `;
            });
        }

        tbody.innerHTML = html;
        modal.style.display = "block";
    }

    // 3. Fungsi Tutup Modal
    function tutupModalRekapHarian() {
        const modal = document.getElementById("modal-rekap-harian");
        if (modal) modal.style.display = "none";
    }

    // 4. Export ke Excel / CSV (Aman tanpa library luar)
    function exportRekapHarianExcel() {
        const todayKey = getTanggalKeyHariIni();
        let setoranHariIni = (recentActivityLog || []).filter(log => log.tanggalKey === todayKey);

        // Ambil status filter kelas yang sedang aktif
        const selectKelas = document.getElementById("filter-kelas-rekap-harian");
        const selectedKelas = selectKelas ? selectKelas.value : "Semua";

        if (selectedKelas !== "Semua") {
            setoranHariIni = setoranHariIni.filter(log => String(log.kelas).trim().toLowerCase() === String(selectedKelas).trim().toLowerCase());
        }

        if (setoranHariIni.length === 0) {
            alert("Tidak ada data untuk diexport berdasarkan filter kelas saat ini.");
            return;
        }

        let csvContent = "Waktu,Nama Siswa,Kelas,Program,Pelajaran,Bab,Sub Bab\n";

        setoranHariIni.forEach(log => {
            csvContent += `"${log.waktu || ''}","${log.nama || ''}","${log.kelas || ''}","${log.program || ''}","${log.pelajaran || ''}","${log.bab || ''}","${log.subbab || ''}"\n`;
        });

        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        const suffix = selectedKelas !== "Semua" ? `_Kelas_${selectedKelas}` : "_Semua_Kelas";
        link.setAttribute("href", url);
        link.setAttribute("download", `Rekap_Setoran_Harian${suffix}_${todayKey}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function resetLogAktivitas() {
        // Meminta verifikasi password admin demi keamanan
        if (!verifikasiPasswordAdmin("mereset seluruh riwayat aktivitas")) return;

        if (confirm("⚠️ Yakin ingin menghapus seluruh riwayat aktivitas (log centang sub-bab)? Data rekap harian juga akan ikut bersih.")) {
            if (typeof firebaseDb !== 'undefined') {
                firebaseDb.ref('recentActivityLog').remove().then(() => {
                    alert("✅ Riwayat aktivitas berhasil dibersihkan dari server!");
                    recentActivityLog = [];
                    localStorage.removeItem('recentActivityLog');
                    if (typeof refreshDashboardBaru === 'function') refreshDashboardBaru();
                }).catch(err => {
                    alert("Gagal mereset data. Periksa koneksi internet.");
                    console.error(err);
                });
            }
        }
    }

    function tambahBahasSoalBaru(kategori = 'bahas soal', namaPelajaranParam) {
        const elPelajaran = document.getElementById('input-pelajaran-soal');
        const pelajaran = namaPelajaranParam || (elPelajaran ? elPelajaran.value : (programState['bahas soal'] ? programState['bahas soal'].selectedSubject : null));

        // PERBAIKAN: Spasi diganti dengan strip agar ID bisa dibaca
        const inputTahunEl = document.getElementById('input-tahun-soal-bahas-soal') || document.getElementById('input-tahun-soal');
        const inputJumlahEl = document.getElementById('input-jumlah-soal-bahas-soal') || document.getElementById('input-jumlah-soal');

        const tahun = inputTahunEl ? inputTahunEl.value.trim() : "";
        const jumlah = inputJumlahEl ? parseInt(inputJumlahEl.value) : NaN;

        if (!nisAktif || !databaseSiswa[nisAktif]) {
            return alert("Pilih siswa terlebih dahulu!");
        }
        if (!pelajaran || !tahun || isNaN(jumlah) || jumlah <= 0) {
            return alert("Harap lengkapi semua data (Pelajaran, Tahun, dan Jumlah Soal yang valid)!");
        }

        if (!databaseSiswa[nisAktif].progressBelajar) databaseSiswa[nisAktif].progressBelajar = {};
        if (!databaseSiswa[nisAktif].progressBelajar['bahas soal']) {
            databaseSiswa[nisAktif].progressBelajar['bahas soal'] = {};
        }
        if (!databaseSiswa[nisAktif].progressBelajar['bahas soal'][pelajaran]) {
            databaseSiswa[nisAktif].progressBelajar['bahas soal'][pelajaran] = {};
        }

        databaseSiswa[nisAktif].progressBelajar['bahas soal'][pelajaran][tahun] = {
            jumlah: jumlah, 
            completed: []   
        };

        simpanKeStorage();

        if (typeof renderDaftarBab === 'function' && pelajaran) {
            renderDaftarBab('bahas soal', pelajaran);
        } else {
            muatProgresSiswa(nisAktif);
        }

        alert("Program 'Bahas Soal' (Tahun " + tahun + " dengan " + jumlah + " nomor) berhasil ditambahkan!");
    }

    function hapusBahasSoal(kategori, namaPelajaran, tahun) {
        console.log("Mencoba menghapus tahun:", tahun);

        if (!confirm(`Apakah Anda yakin ingin menghapus Soal Tahun ${tahun}?`)) return;

        if (nisAktif && databaseSiswa[nisAktif] && databaseSiswa[nisAktif].progressBelajar && databaseSiswa[nisAktif].progressBelajar['bahas soal'] && databaseSiswa[nisAktif].progressBelajar['bahas soal'][namaPelajaran]) {

            let dataPel = databaseSiswa[nisAktif].progressBelajar['bahas soal'][namaPelajaran];

            delete dataPel[tahun];
            delete dataPel[String(tahun)];
            delete dataPel[Number(tahun)];
            delete dataPel[tahun.toString().trim()];

            Object.keys(dataPel).forEach(k => {
                if (k.trim() == String(tahun).trim()) {
                    delete dataPel[k];
                }
            });

            if (typeof simpanProgresSiswaAktif === 'function') {
                simpanProgresSiswaAktif();
            }
            localStorage.setItem('databaseSiswa', JSON.stringify(databaseSiswa));

            console.log("Data setelah dihapus:", dataPel);
            renderDaftarBab(kategori, namaPelajaran);
        }
    }

// ==================================================================
// PUSAT PEREKAMAN & PENAMPIL AKTIVITAS GURU (VERSI TABEL FINAL)
// ==================================================================
function catatAktivitasGuru(deskripsi) {
    let namaGuru = localStorage.getItem('guruAktif') || sessionStorage.getItem('guruAktif');
    if (!namaGuru || namaGuru === "Admin Aplikasi") return;

    let riwayat = JSON.parse(localStorage.getItem('riwayatAktivitasGuru')) || [];
    let now = new Date();
    
    riwayat.push({
        nama: namaGuru,
        aktivitas: deskripsi,
        tanggal: now.toLocaleDateString('id-ID'),
        waktu: now.toLocaleTimeString('id-ID'),
        timestamp: now.getTime()
    });

    localStorage.setItem('riwayatAktivitasGuru', JSON.stringify(riwayat));

    if (typeof firebaseDb !== 'undefined') {
        firebaseDb.ref('riwayatAktivitasGuru').set(riwayat).catch(e => console.log("Gagal sinkron:", e));
    }

    if (typeof renderAktifitasGuruLengkap === 'function') {
        renderAktifitasGuruLengkap();
    }
}

// ==================================================================
// FUNGSI RENDER TABEL AKTIVITAS GURU (DENGAN PENCARIAN)
// ==================================================================
function renderAktifitasGuruLengkap() {
    let riwayat = JSON.parse(localStorage.getItem('riwayatAktivitasGuru')) || [];
    let tanggalHariIni = new Date().toLocaleDateString('id-ID');
    
    let sumberDataGuru = JSON.parse(localStorage.getItem('daftarGuru')) || [];
    if (typeof daftarGuru !== 'undefined' && daftarGuru.length > 0) {
        sumberDataGuru = daftarGuru;
    }

    let aktivitasHariIni = riwayat.filter(item => item.tanggal === tanggalHariIni);
    let rekapGuru = {};
    
    aktivitasHariIni.forEach(item => {
        if (!rekapGuru[item.nama]) rekapGuru[item.nama] = 0;
        rekapGuru[item.nama]++;
    });

    let guruTeraktif = Object.keys(rekapGuru).map(nama => {
        return { nama: nama, jumlah: rekapGuru[nama] };
    }).sort((a, b) => b.jumlah - a.jumlah);

    let namaGuruYangAktif = Object.keys(rekapGuru);
    let guruTanpaAktivitas = sumberDataGuru
        .map(g => g.nama)
        .filter(nama => !namaGuruYangAktif.includes(nama) && nama !== "Admin Aplikasi");

    // === FITUR PENCARIAN GURU NON-AKTIF ===
    let inputPencarian = document.getElementById('search-guru-nonaktif');
    let kataKunci = inputPencarian ? inputPencarian.value.toLowerCase() : "";
    
    if (kataKunci !== "") {
        guruTanpaAktivitas = guruTanpaAktivitas.filter(nama => nama.toLowerCase().includes(kataKunci));
    }

    let tbodyTeraktif = document.getElementById('tabel-body-teraktif');
    let tbodyNonAktif = document.getElementById('tabel-body-nonaktif');

    // -- TABEL KIRI: TOP 5 TERAKTIF --
    if (tbodyTeraktif) {
        tbodyTeraktif.innerHTML = "";
        let top5 = guruTeraktif.slice(0, 5); 

        if (top5.length === 0) {
            tbodyTeraktif.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:15px; color:#777; font-style: italic;">Belum ada aktivitas terekam hari ini</td></tr>';
        } else {
            top5.forEach((g, idx) => {
                let medali = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "";
                tbodyTeraktif.innerHTML += `
                <tr onclick="bukaDetailAktivitasGuru('${g.nama}')" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#fdf6f5'" onmouseout="this.style.background='transparent'" title="Klik untuk lihat rincian setoran">
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; font-weight: bold; font-size: 16px;">${idx + 1} ${medali}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; color: #4a2525; font-weight: 600;">${g.nama}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                        <span style="background: #27ae60; color: white; padding: 4px 10px; border-radius: 15px; font-size: 12px; font-weight: bold;">${g.jumlah} Aksi</span>
                    </td>
                </tr>`;
            });
        }
    }

    // -- TABEL KANAN: TANPA AKTIVITAS --
    if (tbodyNonAktif) {
        tbodyNonAktif.innerHTML = "";
        if (guruTanpaAktivitas.length === 0) {
            if (kataKunci !== "") {
                tbodyNonAktif.innerHTML = '<tr><td colspan="2" style="text-align:center; padding:15px; color:#c0392b; font-style: italic;">Nama tidak ditemukan.</td></tr>';
            } else {
                tbodyNonAktif.innerHTML = '<tr><td colspan="2" style="text-align:center; padding:15px; color:#27ae60; font-weight: bold;">Luar Biasa! Semua guru aktif hari ini.</td></tr>';
            }
        } else {
            guruTanpaAktivitas.forEach((nama, idx) => {
                tbodyNonAktif.innerHTML += `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #f9ecea; text-align: center; font-weight: bold; color: #777;">${idx + 1}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #f9ecea; color: #c0392b; font-weight: 600;">${nama}</td>
                </tr>`;
            });
        }
    }
}

// ==================================================================
// FUNGSI EXPORT EXCEL GURU TANPA AKTIVITAS
// ==================================================================
function exportGuruTanpaAktivitasExcel() {
    if (typeof XLSX === 'undefined') {
        alert("Library Excel (SheetJS) belum dimuat di web ini!");
        return;
    }

    // Kalkulasi ulang dari database agar data 100% akurat
    let riwayat = JSON.parse(localStorage.getItem('riwayatAktivitasGuru')) || [];
    let tanggalHariIni = new Date().toLocaleDateString('id-ID');
    
    let sumberDataGuru = JSON.parse(localStorage.getItem('daftarGuru')) || [];
    if (typeof daftarGuru !== 'undefined' && daftarGuru.length > 0) {
        sumberDataGuru = daftarGuru;
    }

    let aktivitasHariIni = riwayat.filter(item => item.tanggal === tanggalHariIni);
    let namaGuruYangAktif = aktivitasHariIni.map(item => item.nama);
    
    // Dapatkan guru yang tidak ada di daftar aktif
    let guruTanpaAktivitas = sumberDataGuru
        .map(g => g.nama)
        .filter(nama => !namaGuruYangAktif.includes(nama) && nama !== "Admin Aplikasi");

    if (guruTanpaAktivitas.length === 0) {
        alert("Hebat! Semua guru aktif hari ini, tidak ada data non-aktif untuk diexport.");
        return;
    }

    // Format Data untuk Excel
    let dataExcel = guruTanpaAktivitas.map((nama, index) => {
        return {
            "No": index + 1,
            "Nama Guru": nama,
            "Keterangan Tanggal": tanggalHariIni,
            "Status": "Tidak Ada Aktivitas"
        };
    });

    // Proses Konversi ke Excel
    let worksheet = XLSX.utils.json_to_sheet(dataExcel);
    
    // Lebarkan kolom otomatis
    worksheet['!cols'] = [
        { wch: 5 },  // Lebar kolom No
        { wch: 30 }, // Lebar kolom Nama Guru
        { wch: 20 }, // Lebar kolom Keterangan Tanggal
        { wch: 25 }  // Lebar kolom Status
    ];

    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guru Non-Aktif");

    // Simpan & Download
    let namaFile = `Daftar_Guru_NonAktif_${tanggalHariIni.replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(workbook, namaFile);
}

// ==================================================================
// FUNGSI NAVIGASI MENU GURU (GANTI VIEW) - DIREVISI
// ==================================================================
function bukaMenuGuru(jenisView) {
    document.getElementById('guru-menu-utama').style.display = 'none';
    document.getElementById('view-data-guru').style.display = 'none';
    document.getElementById('view-target-siswa').style.display = 'none';

    const viewAktifitas = document.getElementById('view-aktifitas-guru');
    if (viewAktifitas) viewAktifitas.style.display = 'none';

    if (jenisView === 'data') {
        document.getElementById('view-data-guru').style.display = 'block';
        if (typeof renderTabelGuru === 'function') renderTabelGuru();
    } else if (jenisView === 'target') {
        document.getElementById('view-target-siswa').style.display = 'block';
    } else if (jenisView === 'aktifitas') {
        document.getElementById('view-aktifitas-guru').style.display = 'block';
        if (typeof renderAktifitasGuruLengkap === 'function') renderAktifitasGuruLengkap();
    }
}

    function kembaliKeMenuGuru() {
        document.getElementById('guru-menu-utama').style.display = 'block';

        document.getElementById('view-data-guru').style.display = 'none';
        document.getElementById('view-target-siswa').style.display = 'none';

        const viewAktifitas = document.getElementById('view-aktifitas-guru');
        if (viewAktifitas) viewAktifitas.style.display = 'none';
    }

    // ==================================================================
// MANAJEMEN DATA GURU & HAK AKSES (GLOBAL SCOPE)
// Diletakkan di luar document.addEventListener agar tombol HTML bisa memanggilnya
// ==================================================================

function renderTabelGuru() {
    const tbody = document.getElementById('tabel-body-guru');
    if (!tbody) return;

    const searchInput = document.getElementById("search-guru");
    const ddlTahun = document.getElementById("filter-tahun-guru");
    const ddlDaerah = document.getElementById("filter-daerah-guru");
    const ddlBagian = document.getElementById("filter-bagian-guru");

    const searchVal = searchInput ? searchInput.value.toLowerCase() : "";
    const filterTahun = ddlTahun && ddlTahun.value ? ddlTahun.value : "Semua";
    const filterDaerah = ddlDaerah && ddlDaerah.value ? ddlDaerah.value : "Semua";
    const filterBagian = ddlBagian && ddlBagian.value ? ddlBagian.value : "Semua";

    let setTahun = new Set();
    let setDaerah = new Set();
    let setBagian = new Set();
    let count = 0;
    let barisHTML = "";

    daftarGuru.forEach((guru, index) => {
        if (guru.tahun && guru.tahun !== "-") setTahun.add(guru.tahun);
        if (guru.daerah && guru.daerah !== "-") setDaerah.add(guru.daerah);
        if (guru.bagian && guru.bagian !== "-") setBagian.add(guru.bagian);

        const matchSearch = (guru.noGuru && guru.noGuru.toLowerCase().includes(searchVal)) || (guru.nama && guru.nama.toLowerCase().includes(searchVal));
        const matchTahun = (filterTahun === "Semua" || guru.tahun === filterTahun);
        const matchDaerah = (filterDaerah === "Semua" || guru.daerah === filterDaerah);
        const matchBagian = (filterBagian === "Semua" || guru.bagian === filterBagian);

        if (matchSearch && matchTahun && matchDaerah && matchBagian) {
            count++;
            barisHTML += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; color: #8c2222;">${guru.noGuru || '-'}</td>
                <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; color: #4a2525;">${guru.nama}</td>
                <td style="padding: 10px; border: 1px solid #eee;">${guru.tahun || '-'}</td>
                <td style="padding: 10px; border: 1px solid #eee;">${guru.daerah || '-'}</td>
                <td style="padding: 10px; border: 1px solid #eee;"><span style="background: #fdf6f5; color: #8c2222; padding: 3px 8px; border-radius: 10px; font-size: 12px; font-weight: bold; border: 1px solid #f9ecea;">${guru.bagian || '-'}</span></td>
                <td style="padding: 10px; border: 1px solid #eee;">${guru.noHp || '-'}</td>
                <td style="padding: 10px; border: 1px solid #eee; text-align: center;">
                    <button onclick="bukaModalEditGuru(${index})" style="background: #f39c12; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-bottom: 2px;" title="Edit"><i class="fas fa-edit"></i></button>
                    <button onclick="hapusGuru(${index})" style="background: #c0392b; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 5px;" title="Hapus"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
            `;
        }
    });

    if (count === 0) {
        barisHTML = `<tr><td colspan="7" style="text-align: center; padding: 15px; color: #777; font-style: italic;">Tidak ada data guru yang cocok.</td></tr>`;
    }

    tbody.innerHTML = barisHTML;
    updateDropdownFilterGuru(setTahun, setDaerah, setBagian);
}

function updateDropdownFilterGuru(setTahun, setDaerah, setBagian) {
    const ddlTahun = document.getElementById("filter-tahun-guru");
    const ddlDaerah = document.getElementById("filter-daerah-guru");
    const ddlBagian = document.getElementById("filter-bagian-guru");

    if (ddlTahun) {
        const currentTahun = ddlTahun.value;
        ddlTahun.innerHTML = `<option value="Semua">Semua Tahun</option>`;
        [...setTahun].sort((a, b) => b - a).forEach(t => ddlTahun.innerHTML += `<option value="${t}">${t}</option>`);
        ddlTahun.value = currentTahun || "Semua";
    }

    if (ddlDaerah) {
        const currentDaerah = ddlDaerah.value;
        ddlDaerah.innerHTML = `<option value="Semua">Semua Daerah</option>`;
        [...setDaerah].sort().forEach(d => ddlDaerah.innerHTML += `<option value="${d}">${d}</option>`);
        ddlDaerah.value = currentDaerah || "Semua";
    }

    if (ddlBagian) {
        const currentBagian = ddlBagian.value;
        ddlBagian.innerHTML = `<option value="Semua">Semua Bagian</option>`;
        [...setBagian].sort().forEach(b => ddlBagian.innerHTML += `<option value="${b}">${b}</option>`);
        ddlBagian.value = currentBagian || "Semua";
    }
}

function resetFilterGuru() {
    if (document.getElementById("search-guru")) document.getElementById("search-guru").value = "";
    if (document.getElementById("filter-tahun-guru")) document.getElementById("filter-tahun-guru").value = "Semua";
    if (document.getElementById("filter-daerah-guru")) document.getElementById("filter-daerah-guru").value = "Semua";
    if (document.getElementById("filter-bagian-guru")) document.getElementById("filter-bagian-guru").value = "Semua";
    renderTabelGuru();
}

function simpanGuruKeStorage() {
    localStorage.setItem('daftarGuru', JSON.stringify(daftarGuru));
    if (typeof firebaseDb !== 'undefined') {
        firebaseDb.ref('daftarGuru').set(daftarGuru).catch(err => console.error("Gagal sinkron guru ke Firebase:", err));
    }
}

function bukaModalGuru() {
    document.getElementById('modal-guru-judul').textContent = "Tambah Data Guru";
    document.getElementById('edit-index-guru').value = "";

    document.getElementById('input-noguru-guru').value = "";
    document.getElementById('input-nama-guru').value = "";
    document.getElementById('input-tahun-guru').value = "";
    document.getElementById('input-daerah-guru').value = "";
    document.getElementById('input-bagian-guru').value = "";
    document.getElementById('input-hp-guru').value = "";

    document.getElementById('modal-guru').style.display = 'flex';
}

function bukaModalEditGuru(index) {
    const guru = daftarGuru[index];
    if (!guru) return;

    document.getElementById('modal-guru-judul').textContent = "Edit Data Guru";
    document.getElementById('edit-index-guru').value = index;

    document.getElementById('input-noguru-guru').value = guru.noGuru || "";
    document.getElementById('input-nama-guru').value = guru.nama || "";
    document.getElementById('input-tahun-guru').value = guru.tahun || "";
    document.getElementById('input-daerah-guru').value = guru.daerah || "";
    document.getElementById('input-bagian-guru').value = guru.bagian || "";
    document.getElementById('input-hp-guru').value = guru.noHp || "";

    document.getElementById('modal-guru').style.display = 'flex';
}

function tutupModalGuru() {
    document.getElementById('modal-guru').style.display = 'none';
}

function simpanDataGuru() {
    const noGuru = document.getElementById('input-noguru-guru').value.trim() || ("G-" + Date.now().toString().slice(-4));
    const nama = document.getElementById('input-nama-guru').value.trim();
    const tahun = document.getElementById('input-tahun-guru').value.trim() || "-";
    const daerah = document.getElementById('input-daerah-guru').value.trim() || "-";
    const bagian = document.getElementById('input-bagian-guru').value.trim() || "-";
    const noHp = document.getElementById('input-hp-guru').value.trim() || "-";
    const editIndex = document.getElementById('edit-index-guru').value;

    if (!nama) {
        alert("Nama Guru wajib diisi!");
        return;
    }

    if (typeof verifikasiPasswordAdmin === 'function' && !verifikasiPasswordAdmin(editIndex === "" ? "menambah data guru" : "mengubah data guru")) return;

    if (editIndex === "") {
        daftarGuru.push({ noGuru, nama, tahun, daerah, bagian, noHp });
        if (typeof catatAktivitasGuru === 'function') catatAktivitasGuru(`Menambahkan data guru baru: ${nama}`);
    } else {
        daftarGuru[editIndex] = { noGuru, nama, tahun, daerah, bagian, noHp };
        if (typeof catatAktivitasGuru === 'function') catatAktivitasGuru(`Mengubah data guru: ${nama}`);
    }

    simpanGuruKeStorage();
    tutupModalGuru();
    renderTabelGuru();
    alert("Data guru berhasil disimpan!");
}

function hapusGuru(index) {
    if (typeof verifikasiPasswordAdmin === 'function' && !verifikasiPasswordAdmin("menghapus data guru")) return;

    if (confirm(`Yakin ingin menghapus guru ${daftarGuru[index].nama}?`)) {
        daftarGuru.splice(index, 1);
        simpanGuruKeStorage();
        renderTabelGuru();
        alert("Data guru berhasil dihapus.");
    }
}

// ==================================================================
// FUNGSI EXPORT & IMPORT EXCEL GURU (FINAL & GLOBAL)
// ==================================================================

function exportExcelGuru() {
    if (typeof daftarGuru === 'undefined' || daftarGuru.length === 0) {
        alert("Tidak ada data guru untuk diexport!");
        return;
    }

    if (typeof XLSX === 'undefined') {
        alert("Sistem gagal memuat Excel. Pastikan script SheetJS sudah terpasang di HTML!");
        return;
    }

    const dataExcel = daftarGuru.map((guru, index) => ({
        "No": index + 1,
        "No Guru / ID": guru.noGuru || "-",
        "Nama Guru": guru.nama || "-",
        "Tahun": guru.tahun || "-",
        "Daerah": guru.daerah || "-",
        "Bagian": guru.bagian || "-",
        "No HP": guru.noHp || "-"
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Guru");

    worksheet['!cols'] = [
        { wch: 5 },  
        { wch: 15 }, 
        { wch: 30 }, 
        { wch: 10 }, 
        { wch: 20 }, 
        { wch: 20 }, 
        { wch: 15 }  
    ];

    const namaFile = `Rekap_Data_Guru_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(workbook, namaFile);

    if (typeof catatAktivitasGuru === 'function') {
        catatAktivitasGuru("Mengexport data guru ke format Excel");
    }
}

function importExcelGuru(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (typeof XLSX === 'undefined') {
        alert("Sistem gagal membaca Excel. Pastikan script SheetJS sudah terpasang di HTML!");
        e.target.value = "";
        return;
    }

    if (typeof verifikasiPasswordAdmin === 'function') {
        if (!verifikasiPasswordAdmin("mengimport data guru dari Excel")) {
            e.target.value = ""; 
            return;
        }
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            let count = 0;
            rows.forEach(row => {
                let namaRaw = row["Nama Guru"] || row["Nama"] || row["nama"] || row["NAMA"];
                if (!namaRaw) return; 

                let noGuruRaw = row["No Guru / ID"] || row["No Guru"] || row["ID"] || ("G-" + Date.now().toString().slice(-4) + count);

                daftarGuru.push({
                    noGuru: noGuruRaw.toString().trim(),
                    nama: namaRaw.toString().trim(),
                    tahun: (row["Tahun"] || row["Tahun Masuk"] || "-").toString(),
                    daerah: (row["Daerah"] || row["Asal"] || "-").toString(),
                    bagian: (row["Bagian"] || row["Tugas"] || "-").toString(),
                    noHp: (row["No HP"] || row["NoHP"] || row["Telepon"] || "-").toString()
                });
                count++;
            });

            if (count > 0) {
                if (typeof simpanGuruKeStorage === 'function') simpanGuruKeStorage(); 
                if (typeof renderTabelGuru === 'function') renderTabelGuru(); 

                if (typeof catatAktivitasGuru === 'function') {
                    catatAktivitasGuru(`Mengimpor ${count} data guru dari file Excel`);
                }
                alert(`Berhasil mengimpor ${count} data guru!`);
            } else {
                alert("Tidak ada data yang berhasil diimpor. Pastikan format nama kolom Excel sudah benar.");
            }
            
            e.target.value = ""; 
        } catch (error) {
            console.error("Error membaca Excel:", error);
            alert("Gagal membaca file Excel. Pastikan menggunakan file format .xlsx yang valid.");
            e.target.value = "";
        }
    };
    reader.readAsArrayBuffer(file);
}

// ==================================================================
// FUNGSI NAVIGASI & RENDER TAB STATISTIK (GLOBAL SCOPE)
// ==================================================================

// Variabel penyimpan jenis ujian aktif pada Statistik Nilai
let jenisUjianStatistikAktif = 'Ulangan Umum';

// 1. Fungsi Buka Card Statistik
function bukaStatistikView(jenis) {
    const menuUtama = document.getElementById('statistik-menu-utama');
    const viewPembelajaran = document.getElementById('view-statistik-pembelajaran');
    const viewNilai = document.getElementById('view-statistik-nilai');

    // Sembunyikan semua dulu
    if (menuUtama) menuUtama.style.display = 'none';
    if (viewPembelajaran) viewPembelajaran.style.display = 'none';
    if (viewNilai) viewNilai.style.display = 'none';

    // Tampilkan view yang dipilih
    if (jenis === 'pembelajaran') {
        if (viewPembelajaran) viewPembelajaran.style.display = 'block';
        if (typeof isiDropdownFilterKelas === 'function') isiDropdownFilterKelas();
        if (typeof renderStatistikGlobal === 'function') renderStatistikGlobal();
    } else if (jenis === 'nilai') {
        if (viewNilai) viewNilai.style.display = 'block';
        if (typeof isiDropdownFilterKelas === 'function') isiDropdownFilterKelas();
        pilihStatistikUjian('Ulangan Umum'); // Otomatis muat data Ulangan Umum
    }
}

// 2. Fungsi Kembali ke Menu Card Statistik
function kembaliKeMenuStatistik() {
    const menuUtama = document.getElementById('statistik-menu-utama');
    const viewPembelajaran = document.getElementById('view-statistik-pembelajaran');
    const viewNilai = document.getElementById('view-statistik-nilai');

    if (menuUtama) menuUtama.style.display = 'block';
    if (viewPembelajaran) viewPembelajaran.style.display = 'none';
    if (viewNilai) viewNilai.style.display = 'none';
}

// 3. Fungsi Navigasi Sub-Tab (Jika ada tombol di dalam halaman)
function switchStatistikGlobalTab(tab) {
    const btnPembelajaran = document.getElementById('btn-stat-pembelajaran');
    const btnNilai = document.getElementById('btn-stat-nilai');
    const kontenPembelajaran = document.getElementById('konten-stat-pembelajaran') || document.querySelector('#statistik > .cards-container, #statistik > div:not(#konten-stat-nilai)');
    const kontenNilai = document.getElementById('konten-stat-nilai');

    if (tab === 'pembelajaran') {
        if (btnPembelajaran) { btnPembelajaran.style.background = '#8c2222'; btnPembelajaran.style.color = 'white'; }
        if (btnNilai) { btnNilai.style.background = '#ddd'; btnNilai.style.color = '#333'; }
        if (kontenPembelajaran) kontenPembelajaran.style.display = 'block';
        if (kontenNilai) kontenNilai.style.display = 'none';
    } else if (tab === 'nilai') {
        if (btnNilai) { btnNilai.style.background = '#8c2222'; btnNilai.style.color = 'white'; }
        if (btnPembelajaran) { btnPembelajaran.style.background = '#ddd'; btnPembelajaran.style.color = '#333'; }
        if (kontenPembelajaran) kontenPembelajaran.style.display = 'none';
        if (kontenNilai) kontenNilai.style.display = 'block';
        renderStatistikNilaiGlobal();
    }
}

// 4. Fungsi Pilih Jenis Ujian
function pilihStatistikUjian(jenisUjian) {
    jenisUjianStatistikAktif = jenisUjian;

    const btn1 = document.getElementById('btn-stat-ulangan-umum');
    const btn2 = document.getElementById('btn-stat-ujian-awal');
    const btn3 = document.getElementById('btn-stat-ujian-akhir');

    [btn1, btn2, btn3].forEach(b => {
        if (b) { b.style.background = '#ddd'; b.style.color = '#333'; }
    });

    if (jenisUjian === 'Ulangan Umum' && btn1) { btn1.style.background = '#8c2222'; btn1.style.color = 'white'; }
    if (jenisUjian === 'Ujian Awal Tahun' && btn2) { btn2.style.background = '#8c2222'; btn2.style.color = 'white'; }
    if (jenisUjian === 'Ujian Akhir Tahun' && btn3) { btn3.style.background = '#8c2222'; btn3.style.color = 'white'; }

    const judulEl = document.getElementById('judul-statistik-nilai-global');
    if (judulEl) judulEl.textContent = 'Statistik Nilai: ' + jenisUjian;

    renderStatistikNilaiGlobal();
}

// 5. Fungsi Render Tabel Nilai Global
function renderStatistikNilaiGlobal() {
    const filterKelasEl = document.getElementById('filter-kelas-statistik-nilai') || document.getElementById('filter-kelas-statistik');
    const kelasTerpilih = filterKelasEl ? filterKelasEl.value : "Semua";

    const siswaList = Object.values(databaseSiswa).filter(s => {
        return kelasTerpilih === "Semua" || s.kelas === kelasTerpilih;
    });

    let akupPel = {};
    if (typeof DAFTAR_PELAJARAN !== 'undefined') {
        DAFTAR_PELAJARAN.forEach(pel => { akupPel[pel] = { totalNilai: 0, count: 0 }; });
    }

    siswaList.forEach(siswa => {
        if (siswa.nilai && siswa.nilai[jenisUjianStatistikAktif]) {
            const mapNilai = siswa.nilai[jenisUjianStatistikAktif];
            Object.keys(mapNilai).forEach(pel => {
                const val = parseFloat(mapNilai[pel]);
                if (!isNaN(val) && akupPel[pel]) {
                    akupPel[pel].totalNilai += val;
                    akupPel[pel].count += 1;
                }
            });
        }
    });

    const wadahKeseluruhan = document.getElementById('tabel-nilai-keseluruhan-container');
    if (wadahKeseluruhan && typeof DAFTAR_PELAJARAN !== 'undefined') {
        let html = `
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
                <tr style="background: #fdf6f5; color: #8c2222;">
                    <th style="padding: 10px; border: 1px solid #eee; text-align: left;">Mata Pelajaran</th>
                    <th style="padding: 10px; border: 1px solid #eee; text-align: center;">Jumlah Data Nilai</th>
                    <th style="padding: 10px; border: 1px solid #eee; text-align: center;">Rata-rata Nilai (${jenisUjianStatistikAktif})</th>
                </tr>
            </thead>
            <tbody>
        `;

        let totalSemuaNilai = 0, totalSemuaCount = 0;

        DAFTAR_PELAJARAN.forEach(pel => {
            const data = akupPel[pel];
            const rata = data.count > 0 ? (data.totalNilai / data.count).toFixed(1) : '-';

            if (data.count > 0) {
                totalSemuaNilai += data.totalNilai;
                totalSemuaCount += data.count;
            }

            const warnaBg = typeof getWarnaNilai === 'function' ? getWarnaNilai(rata) : '#fff';
            const styleNilai = rata !== '-' ? `background-color: ${warnaBg}; font-weight: bold;` : '';

            html += `<tr>
            <td style="padding: 9px; border: 1px solid #eee; font-weight: bold; color: #4a2525;">${pel}</td>
            <td style="padding: 9px; border: 1px solid #eee; text-align: center;">${data.count} siswa</td>
            <td style="padding: 9px; border: 1px solid #eee; text-align: center; ${styleNilai}">${rata}</td>
            </tr>`;
        });

        const rataGlobal = totalSemuaCount > 0 ? (totalSemuaNilai / totalSemuaCount).toFixed(1) : '-';
        const warnaGlobal = typeof getWarnaNilai === 'function' ? getWarnaNilai(rataGlobal) : '#fff';

        html += `
            </tbody>
            <tfoot>
                <tr style="background: #fdf6f5; font-weight: bold; border-top: 2px solid #8c2222; color: #8c2222;">
                    <td style="padding: 10px; border: 1px solid #eee; text-align: left;">RATA-RATA KESELURUHAN</td>
                    <td style="padding: 10px; border: 1px solid #eee; text-align: center;">-</td>
                    <td style="padding: 10px; border: 1px solid #eee; text-align: center; background-color: ${warnaGlobal};">${rataGlobal}</td>
                </tr>
            </tfoot>
        </table>
        `;
        wadahKeseluruhan.innerHTML = html;
    }

    const wadahPerKelas = document.getElementById('tabel-nilai-per-kelas-container');
    if (wadahPerKelas && typeof DAFTAR_PELAJARAN !== 'undefined') {
        let kelasSet = new Set();
        Object.values(databaseSiswa).forEach(s => { if (s.kelas) kelasSet.add(s.kelas); });
        let daftarKelas = Array.from(kelasSet).sort((a, b) => a.localeCompare(b, 'id', { numeric: true }));

        let htmlKelas = `
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; overflow-x: auto; display: block;">
            <thead>
                <tr style="background: #fdf6f5; color: #8c2222;">
                    <th style="padding: 10px; border: 1px solid #eee; text-align: left; min-width: 120px;">Kelas</th>
        `;
        DAFTAR_PELAJARAN.forEach(pel => { htmlKelas += `<th style="padding: 10px; border: 1px solid #eee; text-align: center; min-width: 90px;">${pel}</th>`; });
        htmlKelas += `</tr></thead><tbody>`;

        daftarKelas.forEach(kelas => {
            const siswaKelas = Object.values(databaseSiswa).filter(s => s.kelas === kelas);
            htmlKelas += `<tr><td style="padding: 9px; border: 1px solid #eee; font-weight: bold; color: #4a2525;">${kelas}</td>`;

            DAFTAR_PELAJARAN.forEach(pel => {
                let sum = 0, cnt = 0;
                siswaKelas.forEach(s => {
                    if (s.nilai && s.nilai[jenisUjianStatistikAktif] && s.nilai[jenisUjianStatistikAktif][pel] !== undefined) {
                        const v = parseFloat(s.nilai[jenisUjianStatistikAktif][pel]);
                        if (!isNaN(v)) { sum += v; cnt++; }
                    }
                });
                const avg = cnt > 0 ? (sum / cnt).toFixed(1) : '-';
                const warnaBg = typeof getWarnaNilai === 'function' ? getWarnaNilai(avg) : '#fff';
                const styleCell = avg !== '-' ? `background-color: ${warnaBg}; font-weight: 600; text-align: center;` : 'text-align: center; color: #777;';

                htmlKelas += `<td style="padding: 9px; border: 1px solid #eee; ${styleCell}">${avg}</td>`;
            });
            htmlKelas += `</tr>`;
        });

        htmlKelas += `</tbody></table>`;
        wadahPerKelas.innerHTML = htmlKelas;
    }
}

// 6. Fungsi Update Dropdown Kelas
function isiDropdownFilterKelas() {
    const ids = ['filter-kelas-statistik', 'filter-kelas-statistik-nilai'];
    let kelasSet = new Set();
    Object.values(databaseSiswa).forEach(s => { if (s.kelas) kelasSet.add(s.kelas); });
    let kelasArray = Array.from(kelasSet).sort((a, b) => a.localeCompare(b, 'id', { numeric: true }));

    ids.forEach(id => {
        const selectEl = document.getElementById(id);
        if (!selectEl) return;
        const kelasTerpilihSebelumnya = selectEl.value || "Semua";
        let optionsHtml = `<option value="Semua">Semua Kelas</option>`;
        
        kelasArray.forEach(kelas => {
            optionsHtml += `<option value="${kelas}">${kelas}</option>`; // Asumsi escapeHtml tidak selalu ada
        });

        selectEl.innerHTML = optionsHtml;
        selectEl.value = (kelasArray.includes(kelasTerpilihSebelumnya) || kelasTerpilihSebelumnya === "Semua") ? kelasTerpilihSebelumnya : "Semua";
    });
}

// 7. Fungsi Import Nilai Global
function importNilaiGlobalExcel() {
    let password = prompt("Masukkan password untuk import nilai global:");
    if (password !== "impervious") {
        if (password !== null) alert("Password salah!");
        return;
    }
    let jenisUjian = prompt("Masukkan jenis ujian (Contoh: Ulangan Umum / Ujian Awal Tahun):", "Ulangan Umum");
    if (!jenisUjian) return;
    if (typeof importNilaiSiswa === 'function') importNilaiSiswa(jenisUjian);
}

// ==================================================================
// FUNGSI POP-UP DETAIL AKTIVITAS GURU
// ==================================================================
function bukaDetailAktivitasGuru(namaGuru) {
    const modal = document.getElementById('modal-detail-aktivitas-guru');
    const judul = document.getElementById('judul-detail-aktivitas-guru');
    const list = document.getElementById('list-detail-aktivitas-guru');

    if (!modal || !judul || !list) return;

    judul.innerHTML = `<i class="fas fa-user-clock"></i> Aktivitas: ${namaGuru}`;

    let riwayat = JSON.parse(localStorage.getItem('riwayatAktivitasGuru')) || [];
    let tanggalHariIni = new Date().toLocaleDateString('id-ID');

    let aktivitasGuruIni = riwayat
        .filter(item => item.nama === namaGuru && item.tanggal === tanggalHariIni)
        .sort((a, b) => b.timestamp - a.timestamp); 

    list.innerHTML = "";
    if (aktivitasGuruIni.length === 0) {
        list.innerHTML = `<li style="padding: 15px; color: #777; font-style: italic; text-align: center;">Tidak ada aktivitas terekam.</li>`;
    } else {
        aktivitasGuruIni.forEach(item => {
            list.innerHTML += `
            <li style="padding: 12px 10px; border-bottom: 1px solid #f9ecea;">
                <div style="font-weight: bold; color: #8c2222; font-size: 13px; margin-bottom: 4px;">
                    <i class="far fa-clock"></i> Pukul ${item.waktu}
                </div>
                <div style="color: #4a2525; font-size: 14px;">
                    ${item.aktivitas}
                </div>
            </li>`;
        });
    }

    modal.style.display = 'flex';
}

function tutupDetailAktivitasGuru() {
    const modal = document.getElementById('modal-detail-aktivitas-guru');
    if (modal) modal.style.display = 'none';
}
