import mongoose from "mongoose";
import { connectDB } from "../db/connectDB";
import { Client } from "../models/Client";
import { Project } from "../models/Project";
import { Contact } from "../models/Contact";
import { Interaction } from "../models/Interaction";

async function seed(): Promise<void> {
  await connectDB();

  await Promise.all([
    Client.deleteMany({}),
    Project.deleteMany({}),
    Contact.deleteMany({}),
    Interaction.deleteMany({}),
  ]);

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
    {
      name: "אבי ורונית שגיא",
      contactInfo: { email: "avi.sagi@example.com", phone: "054-222-3344" },
      notes: "מחפשים סגנון מודרני עם חצר גדולה.",
    },
    {
      name: "משפחת אזולאי",
      contactInfo: { email: "azoulay.family@example.com", phone: "050-333-4455" },
      notes: "דירה ישנה, דרוש שיפוץ יסודי כולל אינסטלציה.",
    },
    {
      name: 'קרן נכסים בע"מ',
      contactInfo: { email: "info@kerennechasim.example.com", phone: "03-999-8877" },
      notes: "פרויקט גדול, לוח זמנים צפוף.",
    },
    {
      name: "עיריית רעננה - מחלקת הנדסה",
      contactInfo: { email: "engineering@raanana.example.gov.il", phone: "09-555-1122" },
      notes: "פרויקט ציבורי, דורש אישורי ועדה.",
    },
    {
      name: "מלון הוד ים נתניה",
      contactInfo: { email: "contact@hodyam.example.com", phone: "09-444-5566" },
      notes: "רוצים לשמור על פעילות המלון במהלך העבודות.",
    },
    {
      name: "משה ותמר גולדשטיין",
      contactInfo: { email: "goldstein.mt@example.com", phone: "052-777-8899" },
      notes: "תקציב גמיש, דגש על עיצוב יוקרתי.",
    },
    {
      name: 'נאנו-פארם בע"מ',
      contactInfo: { email: "office@nanofarm.example.com", phone: "03-111-2233" },
      notes: "פנייה ראשונית, ממתינים לפגישה.",
    },
    {
      name: "יוסי כרמי",
      contactInfo: { email: "yossi.carmi@example.com", phone: "050-666-7788" },
      notes: "שלב סופי, פיקוח על גימורים.",
    },
    {
      name: 'מרפאת שיניים "חיוך לבן"',
      contactInfo: { email: "info@hiyuchlavan.example.com", phone: "08-222-3344" },
      notes: "יש לעמוד בתקנות משרד הבריאות.",
    },
    {
      name: "קיבוץ געש",
      contactInfo: { email: "office@geash.example.com", phone: "09-887-6655" },
      notes: "הפרויקט הושלם, ממתינים למסירה סופית.",
    },
    {
      name: "דבורה ואיתן פלד",
      contactInfo: { email: "peled.family@example.com", phone: "054-123-9876" },
      notes: "מעוניינים להוסיף קומה שנייה.",
    },
  ]);

  const projects = await Project.insertMany([
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
    {
      title: "וילה פרטית בהרצליה פיתוח",
      clientId: clients[4]._id,
      stage: "consultation",
    },
    {
      title: "שיפוץ דירת 4 חדרים בתל אביב",
      clientId: clients[5]._id,
      stage: "contract",
    },
    {
      title: "בניין משרדים מסחרי בפתח תקווה",
      clientId: clients[6]._id,
      stage: "preliminary_design",
    },
    {
      title: "פרגולת קהילה בפארק העירוני",
      clientId: clients[7]._id,
      stage: "permits",
    },
    {
      title: "שיפוץ לובי ומסעדת המלון",
      clientId: clients[8]._id,
      stage: "quote",
    },
    {
      title: "וילה בקיסריה עם בריכה",
      clientId: clients[9]._id,
      stage: "detailed_design",
    },
    {
      title: "עיצוב משרדי סטארטאפ ברמת החייל",
      clientId: clients[10]._id,
      stage: "inquiry",
    },
    {
      title: "פנטהאוז בתל אביב",
      clientId: clients[11]._id,
      stage: "construction_oversight",
    },
    {
      title: "התאמת מרפאת שיניים חדשה",
      clientId: clients[12]._id,
      stage: "contract",
    },
    {
      title: "מרכז קהילתי חדש בקיבוץ",
      clientId: clients[13]._id,
      stage: "handover",
    },
    {
      title: "תוספת קומה לבית פרטי בגבעתיים",
      clientId: clients[14]._id,
      stage: "quote",
    },
  ]);

  const contacts = await Contact.insertMany([
    {
      name: "אריק שמעוני",
      role: "contractor",
      projectId: projects[0]._id,
      contactInfo: { phone: "052-987-6543" },
    },
    {
      name: "ד\"ר לילך ברק",
      role: "engineer",
      projectId: projects[0]._id,
      contactInfo: { email: "lilach.barak@example.com" },
    },
    {
      name: "יונתן אבידור",
      role: "contractor",
      projectId: projects[1]._id,
      contactInfo: { phone: "050-111-2233" },
    },
    {
      name: "מיכל רוזן",
      role: "consultant",
      projectId: projects[5]._id,
      contactInfo: { email: "michal.rozen@example.com", phone: "054-333-2211" },
    },
    {
      name: "Daniel Cohen-Levy",
      role: "engineer",
      projectId: projects[4]._id,
      contactInfo: { email: "daniel.cl@example.com" },
    },
  ]);

  console.log(`Seeded ${clients.length} clients, ${projects.length} projects, and ${contacts.length} contacts.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
