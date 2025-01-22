import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));
export const initRedis = async () => {
  await redisClient.connect();
};
export { redisClient };
