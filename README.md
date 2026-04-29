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
│   └── root.tsx        # Root Layout + Routing SSR
├── .env                # Konfigurasi Database (LOKAL)
└── setup-db.js         # Script Inisialisasi Database
```

## Cara ke admin panel
```
/nsc-admin-panel-x9k2
Email: admin@niscahya.id
Password: n1scahya
```

### Panel Admin - Manajemen Produk & Blog

#### Login Admin
Akses admin panel di URL `/nsc-admin-panel-x9k2`. Masukkan:
- **Email**: `admin@niscahya.id`
- **Password**: `n1scahya`

#### Fitur Admin Panel

**Tab 1: Produk**
- Tambah produk baru dengan kategori utama dan sub-kategori
- Upload gambar utama + 4 slot gambar galeri
- Edit produk yang sudah ada
- Hapus produk (dan gambar lokal terhubung otomatis dihapus)
- Semua gambar dioptimalkan menjadi format WebP saat upload

**Tab 2: Blog**
- Tulis artikel baru dengan judul, tanggal, kategori, gambar, ringkasan, dan konten
- Edit artikel yang sudah terbit
- Hapus artikel (dan gambar lokal terhubung dihapus)
- Artikel disimpan di MySQL dan dapat diakses di halaman blog publik

---

## Migrasi Blog ke Database

Saat pertama kali menjalankan aplikasi, blog statis dari `src/data/blog.js` harus dimigrasikan ke MySQL agar bisa dikelola via admin panel.

### Langkah Migrasi

1. **Pastikan MySQL aktif** dan `.env` sudah dikonfigurasi dengan benar.

2. **Jalankan script migrasi**:
   ```bash
   node scripts/migrate-blog-to-db.mjs
   ```
   Output yang diharapkan:
   ```
   [MIGRATE] Table ensured
   [MIGRATE] Upserted: [slug-artikel-1]
   [MIGRATE] Upserted: [slug-artikel-2]
   ...
   [MIGRATE] Done
   ```

3. **Verifikasi migrasi berhasil**:
   ```bash
   node scripts/check-blogs-count.mjs
   ```
   Seharusnya menunjukkan: `Blogs count: 11` (atau jumlah artikel yang dimigrasikan)

4. **Mulai dev server**:
   ```bash
   npm start
   ```

### Konfigurasi Environment Variable (Opsional)

Untuk keamanan tambahan, set environment variable `ADMIN_SECRET`:

```env
ADMIN_SECRET=your-secret-password
```

Jika tidak diset, sistem default menggunakan password dari `/api/admin-auth` (`n1scahya`).

Ketika admin panel login, password disimpan sementara dan digunakan sebagai header `x-admin-auth` untuk melindungi endpoint blog POST/PUT/DELETE.

---

## Struktur Database

### Tabel `products`
```sql
id (INT) | name | category | image | images (JSON) | description | slug | price | created_at | updated_at
```

### Tabel `blogs`
```sql
id (INT) | title | slug (UNIQUE) | date | category | image | excerpt | content (LONGTEXT) | author | created_at | updated_at
```

---

## API Endpoints

### Produk
- `GET /api/products` - Dapatkan semua produk
- `GET /api/products/:slugOrId` - Dapatkan detail produk
- `POST /api/products` - Tambah produk (Admin)
- `PUT /api/products/:id` - Edit produk (Admin)
- `DELETE /api/products/:id` - Hapus produk (Admin)

### Blog
- `GET /api/blogs` - Dapatkan semua artikel
- `GET /api/blogs/:slugOrId` - Dapatkan detail artikel
- `POST /api/blogs` - Tambah artikel (Admin, requires `x-admin-auth` header)
- `PUT /api/blogs/:id` - Edit artikel (Admin, requires `x-admin-auth` header)
- `DELETE /api/blogs/:id` - Hapus artikel (Admin, requires `x-admin-auth` header)

### Upload
- `POST /api/upload` - Upload gambar (otomatis convert ke WebP)

### Auth
- `POST /api/admin-auth` - Login admin

© 2026 **CV NISCAHYA INDONESIA CERDAS**. Semua Sistem Beroperasi.
