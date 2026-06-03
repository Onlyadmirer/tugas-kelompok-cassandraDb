# Cassandra Node.js Demo - Smart Farming

Proyek ini adalah aplikasi sederhana berbasis Node.js untuk mendemonstrasikan cara menghubungkan dan berinteraksi dengan database **Apache Cassandra** menggunakan modul `cassandra-driver`.

Aplikasi ini mensimulasikan pencatatan suhu dari sensor pertanian pintar (Smart Farming).

## Fitur Utama
1. **Koneksi Database:** Menghubungkan ke node Cassandra lokal.
2. **Insert Data (Write):** Menyisipkan (insert) data suhu dummy secara otomatis untuk beberapa sensor.
3. **Read Data:** Membaca data suhu terbaru dari sensor tertentu.
4. **Demonstrasi Error Cassandra:** Mendemonstrasikan dan menjelaskan error ketika melakukan query tanpa *Partition Key* (aturan dasar dari *data modeling* di Cassandra).

## Prasyarat
Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:
- **Node.js** (v14 atau lebih baru)
- **pnpm** (sebagai package manager yang digunakan dalam proyek ini)
- **Apache Cassandra** berjalan di lokal komputer Anda (`127.0.0.1:9042`).

## Persiapan Database (Cassandra)
Sebelum menjalankan aplikasi, Anda perlu membuat *keyspace* dan tabel yang dibutuhkan. 

1. Buka terminal `cqlsh` dari instalasi Cassandra Anda.
2. Jalankan perintah CQL (Cassandra Query Language) berikut:

```sql
-- Membuat Keyspace
CREATE KEYSPACE IF NOT EXISTS smart_farming 
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};

-- Menggunakan Keyspace
USE smart_farming;

-- Membuat Tabel sensor_data
CREATE TABLE IF NOT EXISTS sensor_data (
    sensor_id text,
    recorded_at timestamp,
    temperature float,
    PRIMARY KEY (sensor_id, recorded_at)
) WITH CLUSTERING ORDER BY (recorded_at DESC);
```

## Cara Menjalankan

1. Clone atau buka direktori proyek ini.
2. Instal dependensi:
   ```bash
   pnpm install
   ```
3. Jalankan aplikasi:
   ```bash
   node index.js
   ```

## Struktur Proyek

- `db.js` - Konfigurasi koneksi ke database Apache Cassandra.
- `sensorService.js` - Berisi logika untuk menambah data dummy, mengambil data terbaru, dan mendemonstrasikan *invalid query*.
- `index.js` - *Entry point* dari aplikasi yang menjalankan alur keseluruhan sistem.
- `package.json` & `pnpm-lock.yaml` - Konfigurasi package dan dependensi Node.js.

## Penjelasan Invalid Query di Cassandra
Aplikasi ini memiliki fungsi `testInvalidQuery()` yang akan melempar *error* secara sengaja:
```sql
SELECT * FROM sensor_data WHERE recorded_at > '2026-06-03';
```
**Mengapa error?**
Cassandra adalah database terdistribusi. *Partition Key* (dalam hal ini `sensor_id`) **wajib** disertakan di klausa `WHERE` agar database tahu di *node* (server) mana data tersebut disimpan. Anda tidak dapat melakukan filter langsung pada *Clustering Key* (`recorded_at`) tanpa menentukan *Partition Key*-nya terlebih dahulu.
