import { redisClient } from "../config/redis.config.js";

export const setOTP = async (key: string, otp: number) => {
  await redisClient.set(key, otp);
  await redisClient.expire(key, 300);
  return otp;
};
