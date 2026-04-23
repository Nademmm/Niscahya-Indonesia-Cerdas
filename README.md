# Niscahya Indonesia Cerdas - PJU Solar System

Situs web resmi **CV Niscahya Indonesia Cerdas**, distributor resmi Lampu PJU Tenaga Surya (Solar Cell) dan PLN berkualitas tinggi di Indonesia. Proyek ini dibangun menggunakan **React (Vite)** untuk frontend dan **Express.js** dengan **MySQL** untuk backend.

---

##  Fitur Utama

- **Katalog Produk Dinamis**: Menampilkan produk PJU (All In One, Two In One, Konvensional) langsung dari database MySQL.
- **Panel Admin**: Manajemen produk lengkap (Tambah, Edit, Hapus) dengan fitur upload gambar.
- **Blog & Edukasi**: Artikel terbaru seputar teknologi energi terbarukan.
- **AI Chat Assistant**: Integrasi Flowise AI untuk bantuan pelanggan secara real-time.
- **Desain Modern & Responsif**: UI premium yang optimal di perangkat mobile maupun desktop.
- **Integrasi WhatsApp**: Tombol pembelian langsung terhubung ke admin via WhatsApp.

---

##  Teknologi yang Digunakan

- **Frontend**: React.js, Vite, Tailwind CSS (v4), Framer Motion.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL (MariaDB).
- **Tools**: Multer (Upload Gambar), Cors, Lucide React / Boxicons.

---

##  Panduan Instalasi & Setup

### 1. Clone Repositori
```bash terminal
git clone https://github.com/username/niscahya-indonesia-cerdas.git
cd niscahya-indonesia-cerdas
code .
```

### 2. Instalasi Dependensi
Jalankan perintah ini di terminal utama:
```bash
npm install
```

### 3. Konfigurasi Database (MySQL)
1.  Pastikan **MySQL (XAMPP)** sudah aktif.
2.  Buat file `.env` di folder utama (root) dan sesuaikan konfigurasinya:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=niscahya_indonesia_cerdas
    DB_PORT=3306
    ```
3.  Jalankan script otomatis untuk membuat database:
    ```bash
    node setup-db.js
    npm run server
    ```

## Cara Menjalankan Aplikasi

Anda bisa menjalankan frontend dan backend secara bersamaan dengan satu perintah:

```bash
npm start
```

Atau jalankan secara terpisah:
- **Frontend saja**: `npm run dev` (Port: 5173)
- **Backend saja**: `npm run server` (Port: 3001)

---

## Struktur Folder Utama

```text
├── public/             # Aset statis (Logo, Gambar Hero)
├── server/             # Kode Backend (Express.js)
│   ├── db.js           # Konfigurasi Koneksi MySQL
│   ├── index.js        # API Endpoints & Logic
│   └── uploads/        # Folder penyimpanan foto produk
├── src/                # Kode Frontend (React)
│   ├── components/     # Komponen UI (Navbar, Footer, Card)
│   ├── context/        # State Management (AppContext)
│   ├── pages/          # Halaman Web (Home, Admin, Products)
│   └── App.jsx         # Routing Utama
├── .env                # Konfigurasi Database (LOKAL)
└── setup-db.js         # Script Inisialisasi Database
```

## Cara ke admin panel
```
/nsc-admin-panel-x9k2
Email: admin@niscahya.id
Password: n1scahya
```

© 2026 **CV NISCAHYA INDONESIA CERDAS**. Semua Sistem Beroperasi.
