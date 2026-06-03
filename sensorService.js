const client = require("./db");

// Fungsi untuk memasukkan data dummy
async function insertDummyData() {
  console.log("\n[1] Menambahkan data dummy untuk Sensor-A dan Sensor-B...");
  const insertQuery =
    "INSERT INTO sensor_data (sensor_id, recorded_at, temperature) VALUES (?, ?, ?)";

  const now = new Date();

  for (let i = 1; i <= 15; i++) {
    const recordTime = new Date(now.getTime() - i * 60000);
    const tempA = parseFloat((Math.random() * (35 - 25) + 25).toFixed(2));
    const tempB = parseFloat((Math.random() * (35 - 25) + 25).toFixed(2));

    await client.execute(insertQuery, ["Sensor-A", recordTime, tempA], {
      prepare: true,
    });
    await client.execute(insertQuery, ["Sensor-B", recordTime, tempB], {
      prepare: true,
    });
  }
  console.log("✅ Berhasil memasukkan 30 data dummy.");
}

// Fungsi untuk mengambil data terbaru
async function getLatestData(sensorId, limit = 10) {
  console.log(
    `\n[2] Mengambil ${limit} data suhu terakhir dari ${sensorId}: (data terurut berdasarkan waktu)`,
  );
  const readQuery = "SELECT * FROM sensor_data WHERE sensor_id = ? LIMIT ?";

  const result = await client.execute(readQuery, [sensorId, limit], {
    prepare: true,
  });

  const formattedData = result.rows.map((row, index) => ({
    No: index + 1,
    "Sensor ID": row.sensor_id,
    "Waktu Record (recorded_at)": row.recorded_at.toLocaleString(),
    "Suhu (°C)": row.temperature,
  }));

  console.table(formattedData);
}

// Fungsi untuk menguji query invalid
async function testInvalidQuery() {
  console.log("\n[3] Mencoba query invalid tanpa Partition Key...");
  const invalidQuery =
    "SELECT * FROM sensor_data WHERE recorded_at > '2026-06-03'";

  try {
    await client.execute(invalidQuery);
  } catch (error) {
    console.error("\n❌ [ERROR DITEMUKAN PADA QUERY]:");
    console.error(error.message);

    console.log("\n📝 PENJELASAN:");
    console.log(
      "Error ini terjadi karena Cassandra adalah database terdistribusi. Partition Key (sensor_id) WAJIB disertakan di klausa WHERE agar database tahu di node (server) mana data tersebut disimpan.",
    );
    console.log(
      "Kita tidak bisa melakukan filter langsung pada Clustering Key (recorded_at) tanpa menentukan Partition Key-nya terlebih dahulu.",
    );
  }
}

module.exports = {
  insertDummyData,
  getLatestData,
  testInvalidQuery,
};
