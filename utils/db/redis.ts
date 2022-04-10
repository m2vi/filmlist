import Redis from 'ioredis';

const client = new Redis(process.env.REDIS_URL!, { lazyConnect: true, password: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : undefined });

export async function connectToRedis() {
  const ping = await client.ping();

  if (ping === 'PONG') {
    return client;
  } else {
    await client.connect();

    return client;
  }
}
