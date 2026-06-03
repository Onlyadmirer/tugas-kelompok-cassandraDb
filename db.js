const cassandra = require("cassandra-driver");

// Koneksi awal tanpa menentukan keyspace (karena keyspace-nya mungkin belum dibuat)
const client = new cassandra.Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1",
});

/**
 * Fungsi menginisialisasi skema CQL secara otomatis
 */
async function initializeSchema() {
  try {
    await client.connect();
    console.log("🔄 Menginisialisasi skema Cassandra...");

    // Buat Keyspace jika belum ada
    await client.execute(`
      CREATE KEYSPACE IF NOT EXISTS smart_farming 
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
    `);

    // Gunakan Keyspace yang baru dibuat/sudah ada
    await client.execute("USE smart_farming;");

    // Buat Tabel jika belum ada
    await client.execute(`
      CREATE TABLE IF NOT EXISTS sensor_data (
          sensor_id text,
          recorded_at timestamp,
          temperature double,
          PRIMARY KEY (sensor_id, recorded_at)
      ) WITH CLUSTERING ORDER BY (recorded_at DESC);
    `);

    console.log("✅ Keyspace dan Tabel siap digunakan!");
  } catch (error) {
    console.error("❌ Gagal menginisialisasi skema:", error);
    process.exit(1);
  }
}

module.exports = { initializeSchema, client };
