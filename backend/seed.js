import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import { User } from "./models/userModel.js";

dotenv.config();

const seedUsers = async () => {
  await connectDb();

  await User.deleteMany({});

  const users = await User.insertMany([
    { name: "Ali Raza", email: "ali@example.com", password: "demo123", gender: "male" },
    { name: "Sana Khan", email: "sana@example.com", password: "demo456", gender: "female" },
    { name: "Bilal Ahmed", email: "bilal@example.com", password: "demo789", gender: "male" },
  ]);
await User.create({ name: "Eiffa Tariq", email: "eiffatariq1@gmail.com", password: "112233", gender: "female" });
  console.log("Seeded users:");
  users.forEach((u) => console.log(`${u.name} -> ${u._id}`));

  mongoose.connection.close();
};

seedUsers();