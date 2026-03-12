// config/db.js
// Simple MongoDB connection using the native driver

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config(); // load .env values

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI must be set in .env');
}

// Explicit database name (matches your MongoDB database)
const dbName = process.env.MONGO_DB_NAME || 'skillmatchai';

// create a client instance - not connected yet
// mongodb@5+ no longer needs useUnifiedTopology
const client = new MongoClient(uri);
let dbInstance = null;

// connect to the database and cache the instance
async function connectDB() {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    await client.connect();
    dbInstance = client.db(dbName);
    // console.log(`Connected to MongoDB database: ${dbName}`);
    return dbInstance;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
}

function getDB() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return dbInstance;
}

module.exports = {
  connectDB,
  getDB,
};