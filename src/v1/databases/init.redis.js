const Redis = require('ioredis');
//const redis = new Redis(process.env.REDIS_URL); //local
const redis = new Redis({
    port:process.env.REDIS_PORT,
    host:process.env.REDIS_HOST,
    username:process.env.REDIS_USERNAME,
    password:process.env.REDIS_PASSWORD
})

redis.ping(function (err, result) {
    console.log(result);
})

redis.on('connect', () => {
    console.log('Redis client connected');
});

redis.on("error", (error) => {
    console.error(error);
});

module.exports = redis