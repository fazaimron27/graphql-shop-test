const info = () => `This is the API of a Inventory Management System`;

const inventories = async (parent, args, context, info) => {
  if (!context.userId) {
    throw new Error("You must be logged in to view inventories");
  }

  return await context.prisma.inventories.findMany();
};

const carts = async (parent, args, context, info) => {
  if (!context.userId) {
    throw new Error("You must be logged in to view carts");
  }

  return await context.prisma
    .$queryRaw`SELECT "Carts".id, "Carts"."userId", "Carts"."inventoryId", "Carts".quantity, "Inventories".id, "Inventories".sku, "Inventories".name, "Inventories".price FROM "Carts" JOIN "Inventories" ON "Carts"."inventoryId" = "Inventories".id WHERE "userId" = ${context.userId}`;
};

const transactions = async (parent, args, context, info) => {
  if (!context.userId) {
    throw new Error("You must be logged in to view transactions");
  }

  return await context.prisma.transactions.findMany({
    where: {
      userId: context.userId,
    },
  });
};

module.exports = {
  info,
  inventories,
  carts,
  transactions,
};
