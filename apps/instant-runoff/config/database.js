const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  console.log('DBCONNECTION', 'attempting to connect to the db');
  if (cached.conn) {
    console.log('DBCONNECTION', 'returning cached connection');
    return cached.conn;
  }

  console.log('DBCONNECTION', 'establishing new connection', MONGODB_URI);
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI ?? '').then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = dbConnect;
