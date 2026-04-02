require("dotenv").config();

const mongoose = require("mongoose");

const { connectDB } = require("./config/db");
const User = require("./models/user.model");
const FinancialRecord = require("./models/financialRecord.model");

const seedUsers = async () => {
  const users = await User.create([
    {
      name: "System Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      status: "active",
    },
    {
      name: "Finance Analyst",
      email: "analyst@example.com",
      password: "analyst123",
      role: "analyst",
      status: "active",
    },
    {
      name: "Read Only Viewer",
      email: "viewer@example.com",
      password: "viewer123",
      role: "viewer",
      status: "active",
    },
  ]);

  return users;
};

const buildSampleRecords = (adminUserId) => {
  const now = new Date();

  return [
    {
      amount: 65000,
      type: "income",
      category: "salary",
      date: new Date(now.getFullYear(), now.getMonth(), 1),
      notes: "Monthly salary credited",
      createdBy: adminUserId,
    },
    {
      amount: 12000,
      type: "expense",
      category: "rent",
      date: new Date(now.getFullYear(), now.getMonth(), 3),
      notes: "Apartment rent payment",
      createdBy: adminUserId,
    },
    {
      amount: 3200,
      type: "expense",
      category: "food",
      date: new Date(now.getFullYear(), now.getMonth(), 5),
      notes: "Groceries and dining",
      createdBy: adminUserId,
    },
    {
      amount: 2500,
      type: "expense",
      category: "travel",
      date: new Date(now.getFullYear(), now.getMonth(), 8),
      notes: "Local transportation and fuel",
      createdBy: adminUserId,
    },
    {
      amount: 18000,
      type: "income",
      category: "freelance",
      date: new Date(now.getFullYear(), now.getMonth(), 10),
      notes: "Freelance project payout",
      createdBy: adminUserId,
    },
    {
      amount: 4200,
      type: "expense",
      category: "shopping",
      date: new Date(now.getFullYear(), now.getMonth(), 12),
      notes: "Clothes and essentials",
      createdBy: adminUserId,
    },
    {
      amount: 7000,
      type: "income",
      category: "salary",
      date: new Date(now.getFullYear(), now.getMonth() - 1, 28),
      notes: "Performance bonus",
      createdBy: adminUserId,
    },
    {
      amount: 1500,
      type: "expense",
      category: "food",
      date: new Date(now.getFullYear(), now.getMonth() - 1, 20),
      notes: "Weekend outings",
      createdBy: adminUserId,
    },
    {
      amount: 900,
      type: "expense",
      category: "travel",
      date: new Date(now.getFullYear(), now.getMonth() - 1, 18),
      notes: "Intercity bus tickets",
      createdBy: adminUserId,
    },
    {
      amount: 2200,
      type: "expense",
      category: "shopping",
      date: new Date(now.getFullYear(), now.getMonth() - 2, 15),
      notes: "Home utility purchases",
      createdBy: adminUserId,
    },
  ];
};

const seedDatabase = async () => {
  let exitCode = 0;

  try {
    await connectDB();

    await Promise.all([User.deleteMany({}), FinancialRecord.deleteMany({})]);

    const [adminUser] = await seedUsers();

    const sampleRecords = buildSampleRecords(adminUser._id);
    await FinancialRecord.insertMany(sampleRecords);

    console.log("Seed completed successfully");
    console.log("Users created: 3 (admin, analyst, viewer)");
    console.log("Financial records created: 10");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit(exitCode);
  }
};

seedDatabase();
