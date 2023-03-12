const removeInventoryfromCart = async (parent, args, context, info) => {
  const { userId } = context;
  if (!userId) {
    throw new Error("You must be logged in to remove inventory from cart");
  }

  const deletedCart = await context.prisma.carts.delete({
    where: { id: args.id },
  });

  return deletedCart;
};

module.exports = {
  removeInventoryfromCart,
};
