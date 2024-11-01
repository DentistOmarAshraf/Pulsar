import { createClient } from "redis";

class RedisClient {
  constructor() {
    this.client = createClient();
    this.isConnected = true;

    this.client.on("error", (error) => {
      this.isConnected = false;
      console.log(`Redis Client Connection failed: ${error}`);
    });
    this.client.on("connect", () => {
      this.isConnected = true;
    });
    this.client.connect().catch(console.error);
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      return error;
    }
  }

  async set(key, value, duration = 86400) {
    try {
      this.client.setEx(key, duration, value);
    } catch (error) {
      return error;
    }
  }

  async del(key) {
    try {
      return await this.client.del(key);
    } catch (error) {
      return error;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
