import mongoose from "mongoose";
import Item from "../models/Item";
import AuditLog from "../models/AuditLog";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pizza-pantry";

const sampleItems = [
  {
    name: "Mozzarella Cheese",
    category: "Dairy",
    unit: "kg",
    quantity: 50,
    reorderThreshold: 10,
    costPrice: 8.99,
    createdBy: "seed_script",
  },
  {
    name: "Pepperoni",
    category: "Meats",
    unit: "kg",
    quantity: 25,
    reorderThreshold: 5,
    costPrice: 12.5,
    createdBy: "seed_script",
  },
  {
    name: "Pizza Dough",
    category: "Bakery",
    unit: "units",
    quantity: 100,
    reorderThreshold: 20,
    costPrice: 1.5,
    createdBy: "seed_script",
  },
  {
    name: "Tomato Sauce",
    category: "Sauces",
    unit: "liters",
    quantity: 30,
    reorderThreshold: 8,
    costPrice: 4.25,
    createdBy: "seed_script",
  },
  {
    name: "Bell Peppers",
    category: "Vegetables",
    unit: "kg",
    quantity: 15,
    reorderThreshold: 5,
    costPrice: 3.75,
    createdBy: "seed_script",
  },
  {
    name: "Mushrooms",
    category: "Vegetables",
    unit: "kg",
    quantity: 12,
    reorderThreshold: 4,
    costPrice: 5.5,
    createdBy: "seed_script",
  },
  {
    name: "Italian Sausage",
    category: "Meats",
    unit: "kg",
    quantity: 20,
    reorderThreshold: 6,
    costPrice: 9.99,
    createdBy: "seed_script",
  },
  {
    name: "Parmesan Cheese",
    category: "Dairy",
    unit: "kg",
    quantity: 8,
    reorderThreshold: 3,
    costPrice: 15.99,
    createdBy: "seed_script",
  },
  {
    name: "Olive Oil",
    category: "Oils",
    unit: "liters",
    quantity: 10,
    reorderThreshold: 3,
    costPrice: 12.0,
    createdBy: "seed_script",
  },
  {
    name: "Fresh Basil",
    category: "Herbs",
    unit: "bunches",
    quantity: 20,
    reorderThreshold: 5,
    costPrice: 2.5,
    createdBy: "seed_script",
  },
  {
    name: "Black Olives",
    category: "Toppings",
    unit: "kg",
    quantity: 5,
    reorderThreshold: 2,
    costPrice: 6.75,
    createdBy: "seed_script",
  },
  {
    name: "Onions",
    category: "Vegetables",
    unit: "kg",
    quantity: 18,
    reorderThreshold: 5,
    costPrice: 2.25,
    createdBy: "seed_script",
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await Item.deleteMany({});
    await AuditLog.deleteMany({});
    console.log("Existing data cleared");

    // Insert sample items
    console.log("Inserting sample items...");
    const items = await Item.insertMany(sampleItems);
    console.log(`Inserted ${items.length} items`);

    // Create audit logs for the items
    console.log("Creating audit logs...");
    const auditLogs = items.map((item) => ({
      itemId: item._id,
      itemName: item.name,
      action: "create",
      userId: "seed_script",
      userName: "Seed Script",
      changes: {
        newValue: `Created with quantity: ${item.quantity}`,
      },
      timestamp: new Date(),
    }));

    await AuditLog.insertMany(auditLogs);
    console.log(`Created ${auditLogs.length} audit logs`);

    console.log("\n✅ Seed completed successfully!");
    console.log("\nSample items created:");
    items.forEach((item) => {
      console.log(`  - ${item.name} (${item.category}): ${item.quantity} ${item.unit}`);
    });

    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
