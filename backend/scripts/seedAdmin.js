/**
 * Seed Admin Script
 * Run from inside the backend/ folder:
 *   node scripts/seedAdmin.js
 *
 * Creates an admin user if one doesn't already exist.
 */

import "../env.js";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import UserModel from "../src/user/models/user.schema.js";

const ADMIN = {
    name: "Admin",
    email: "admin@storefleet.com",
    password: "Admin@123",
    role: "admin",
};

async function seed() {
    await connectDB();

    const existing = await UserModel.findOne({ email: ADMIN.email });

    if (existing) {
        console.log(`✅ Admin already exists: ${ADMIN.email}`);
    } else {
        // Use 'new + save' so the Mongoose pre-save hook bcrypt-hashes the password
        const admin = new UserModel(ADMIN);
        await admin.save();
        console.log("✅ Admin user created successfully!");
        console.log(`   Email    : ${ADMIN.email}`);
        console.log(`   Password : ${ADMIN.password}`);
    }

    await mongoose.connection.close();
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
});
