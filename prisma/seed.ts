import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  // Expenses
  { name: "Ads", type: TransactionType.EXPENSE, color: "#ef4444" },
  { name: "Fuel", type: TransactionType.EXPENSE, color: "#f97316" },
  { name: "Rent", type: TransactionType.EXPENSE, color: "#3b82f6" },
  { name: "Salary", type: TransactionType.EXPENSE, color: "#8b5cf6" },
  { name: "Food", type: TransactionType.EXPENSE, color: "#ec4899" },
  { name: "Tools", type: TransactionType.EXPENSE, color: "#64748b" },
  { name: "Hosting", type: TransactionType.EXPENSE, color: "#06b6d4" },
  { name: "Internet", type: TransactionType.EXPENSE, color: "#14b8a6" },
  
  // Income
  { name: "Freelance", type: TransactionType.INCOME, color: "#10b981" },
  { name: "Client Payment", type: TransactionType.INCOME, color: "#10b981" },
  { name: "Product Sales", type: TransactionType.INCOME, color: "#10b981" },
  { name: "Services", type: TransactionType.INCOME, color: "#10b981" },
];

async function main() {
  console.log("Seeding categories...");
  
  // Note: This requires a user ID. 
  // In a real app, we'd seed these per user registration.
  // For now, we'll leave it as a reference or a global seed if the user is known.
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
