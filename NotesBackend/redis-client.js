// const { Redis } = require('ioredis')

const client = new Redis(process.env.REDIS_URL);

// const checkConnection = () => {
//     // client.on('connect', () => {
//     //     console.log('Redis client connected');
//     // });

//     // client.on('error', (err) => {
//     //     console.log(`Something went wrong ${err}`);
//     // });
//     console.log('Redis client is commented out');
// }

// module.exports = {
//     client,
//     checkConnection
// }