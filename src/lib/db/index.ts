import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-app';

let cached = (global as any).mongoose || { conn: null, promise: null };

if (!cached.promise) {
  cached.promise = mongoose.connect(MONGODB_URI)
    .then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

(global as any).mongoose = cached;