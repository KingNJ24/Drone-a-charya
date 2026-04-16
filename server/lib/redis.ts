import Redis from 'ioredis'

declare global {
  var redisGlobal: Redis | undefined
}

export const redis = process.env.REDIS_URL
  ? global.redisGlobal ??
    new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    })
  : null

if (redis && process.env.NODE_ENV !== 'production') {
  global.redisGlobal = redis
}
