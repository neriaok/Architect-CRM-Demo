import mongoose from "mongoose";
import { connectDB } from "../db/connectDB";
import { Client } from "../models/Client";
import { Project } from "../models/Project";

async function seed(): Promise<void> {
  await connectDB();

  await Promise.all([Client.deleteMany({}), Project.deleteMany({})]);

  const clients = await Client.insertMany([
    {
      name: "רבקה ועמית כהן",
      contactInfo: { email: "rivka.cohen@example.com", phone: "052-123-4567" },
      notes: "שיפוץ בית פרטי ברמת גן.",
    },
    {
      name: 'גולן טק בע"מ',
      contactInfo: { email: "office@golantech.example.com", phone: "03-765-4321" },
      notes: "משרדים חדשים, תקציב מוגבל.",
    },
    {
      name: "דנה לוי",
      contactInfo: { email: "dana.levi@example.com" },
      notes: "לקוחה חדשה, הגיעה בהמלצת גולן טק.",
    },
    {
      name: "James Whitfield",
      contactInfo: { email: "james.whitfield@example.com", phone: "+44 7911 123456" },
      notes: "Relocating to Israel; wants a vacation home in Herzliya. Prefers English correspondence.",
    },
  ]);

  await Project.insertMany([
    {
      title: "שיפוץ דירת כהן",
      clientId: clients[0]._id,
      stage: "detailed_design",
    },
    {
      title: "עיצוב משרדי גולן טק",
      clientId: clients[1]._id,
      stage: "permits",
    },
    {
      title: "הרחבת דירת לוי",
      clientId: clients[2]._id,
      stage: "inquiry",
    },
    {
      title: "בית אורחים כהן",
      clientId: clients[0]._id,
      stage: "construction_oversight",
    },
    {
      title: "Whitfield Vacation Home",
      clientId: clients[3]._id,
      stage: "quote",
    },
  ]);

  console.log(`Seeded ${clients.length} clients and 5 projects.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
