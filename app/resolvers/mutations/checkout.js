const checkout = async (parent, args, context, info) => {
  const { userId } = context;
  if (!userId) {
    throw new Error("You must be logged in to checkout");
  }

  const carts = await context.prisma
    .$queryRaw`SELECT "Carts".id, "Carts"."userId", "Carts"."inventoryId", "Carts".quantity, "Inventories".id, "Inventories".sku, "Inventories".price FROM "Carts" JOIN "Inventories" ON "Carts"."inventoryId" = "Inventories".id WHERE "userId" = ${userId}`;

  if (carts.length === 0) {
    throw new Error("No items in cart");
  }

  const freeGift = "43N23P";
  const buy3For2 = "120P90";
  const bulkDiscount = "A304SD";

  const total = carts.reduce((acc, cart) => {
    let total = 0;

    if (cart.sku === freeGift) {
      const price = cart.quantity * cart.price;
      total += price;
    }
    if (cart.sku === buy3For2) {
      if (cart.quantity % 3 === 0) {
        const quantity = cart.quantity - cart.quantity / 3;
        const price = quantity * cart.price;
        total += price;
      }
    }
    if (cart.sku === bulkDiscount) {
      if (cart.quantity >= 3) {
        const price = cart.quantity * cart.price * 0.9;
        total += price;
      } else {
        const price = cart.quantity * cart.price;
        total += price;
      }
    }

    return Math.round((acc + total) * 100) / 100;
  }, 0);

  const transaction = await context.prisma.transactions.create({
    data: {
      userId,
      total,
    },
  });

  return transaction;
};

module.exports = {
  checkout,
};
