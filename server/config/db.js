import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");

    mongoose.connection.on("error", (err) => {
      console.error("Database connection error:", err);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  }
};

export default connectDB;
