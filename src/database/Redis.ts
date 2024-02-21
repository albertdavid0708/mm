import IORedis from "ioredis";
import { env } from "../config/config";

function createRedisClient(label = "default") {
  const newClient = new IORedis({
    ...env.redis,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  });
  newClient
    // .on("connect", () => logger.info(`Redis[${label}]: Connected`))
    // .on("ready", () => logger.info(`Redis[${label}]: Ready`))
    .on("error", (error) => console.log(`Redis[${label}]: Error: `, error))
    .on("close", () => console.log(`Redis[${label}]: Close connection`))
    .on("reconnecting", () => console.log(`Redis[${label}]: Reconnecting`))
    .on("+node", (data) =>
      console.log(`Redis[${label}]: A new node is connected: `)
    )
    .on("-node", (data) =>
      console.log(`Redis[${label}]: A node is disconnected: `)
    )
    .on("node error", (data) =>
      console.log(
        `Redis[${label}]: An error occurs when connecting to a node: `
      )
    )
    .on("end", () => console.log(`Redis[${label}]: End`));
  return newClient;
}

const redis = createRedisClient();

export { createRedisClient, redis };
