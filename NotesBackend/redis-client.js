// const { Redis } = require('ioredis')

// const client = new Redis(process.env.REDIS_URL);

// const checkConnection = () => {
//     client.on('connect', () => {
//         console.log('Redis client connected');
//     });

//     client.on('error', (err) => {
//         console.log(`Something went wrong ${err}`);
//     });
// }

// module.exports = {
//     client,
//     checkConnection
// }