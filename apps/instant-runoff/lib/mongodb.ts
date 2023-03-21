import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

let client;
let mongoClient: Promise<typeof mongoose>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<typeof mongoose>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = mongoose.connect(uri ?? '').then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    });
    globalWithMongo._mongoClientPromise = client;
  }
  mongoClient = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = mongoose.connect(uri ?? '').then((mongoose) => {
    console.log('Connected to MongoDB');
    return mongoose;
  });
  mongoClient = client;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default mongoClient;
