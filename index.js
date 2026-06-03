const client = require("./db");
const {
  insertDummyData,
  getLatestData,
  testInvalidQuery,
} = require("./sensorService");

async function runApplication() {
  try {
    await client.connect();
    console.log(" Terhubung ke cluster Cassandra!");

    await insertDummyData();
    await getLatestData("Sensor-A", 10);
    await testInvalidQuery();
  } catch (error) {
    console.error("Terjadi kesalahan sistem:", error);
  } finally {
    await client.shutdown();
    console.log("\n🔌 Koneksi ke Cassandra ditutup.");
  }
}

runApplication();
