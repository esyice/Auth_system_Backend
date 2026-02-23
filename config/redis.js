import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";

console.log("🧩 Redis Config:", {
  host: REDIS_HOST,
  port: REDIS_PORT,
});

const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
  },
  password: REDIS_PASSWORD,
});

redisClient.on("connect", () => {
  console.log("🔄 Redis Connecting...");
});

redisClient.on("ready", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("❌ Redis Connection Failed:", error.message);
    process.exit(1);
  }
};

export { redisClient, connectRedis };
