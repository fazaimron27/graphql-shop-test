const addInventorytoCart = async (parent, args, context, info) => {
  const { userId } = context;
  if (!userId) {
    throw new Error("You must be logged in to add inventory to cart");
  }

  const inventory = await context.prisma.inventories.findUnique({
    where: { sku: args.sku },
  });

  if (!inventory) {
    throw new Error("No such inventory found");
  }

  const cart = await context.prisma.carts.findFirst({
    where: { userId, inventoryId: inventory.id },
  });

  if (cart) {
    const updatedCart = await context.prisma.carts.update({
      where: { id: cart.id },
      data: { quantity: cart.quantity + args.quantity },
    });

    // const updatedInventory = await context.prisma.inventories.update({
    //   where: { id: inventory.id },
    //   data: { quantity: inventory.quantity - args.quantity },
    // });

    return updatedCart;
  }

  const newCart = await context.prisma.carts.create({
    data: {
      userId,
      inventoryId: inventory.id,
      quantity: args.quantity,
    },
  });

  // const updatedInventory = await context.prisma.inventories.update({
  //   where: { id: inventory.id },
  //   data: { quantity: inventory.quantity - args.quantity },
  // });

  return newCart;
};

module.exports = {
  addInventorytoCart,
};
