import mongoose from "mongoose";

// Connection object to track state
const connection = {
  isConnected: 0 as number | undefined,
  promise: null as Promise<typeof mongoose> | null,
};

export async function dbConnection(): Promise<void> {
  try {
    // If already connected, return immediately
    if (connection.isConnected) {
      console.log("Database is already connected");
      return;
    }

    // If a connection is already in progress, wait for it to resolve
    if (connection.promise) {
      await connection.promise;
      console.log("Using existing database connection");
      return;
    }

    // Create a new connection promise
    connection.promise = mongoose.connect(process.env.MONGO_DB_URL || "", );

    // Await the promise and update the connection status
    const db = await connection.promise;
    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    connection.promise = null; // Reset the promise to allow retries
  }
}
