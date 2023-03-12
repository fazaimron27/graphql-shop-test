const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../../utils");

const signup = async (parent, args, context, info) => {
  const userExists = await context.prisma.users.findUnique({
    where: { email: args.email },
  });
  if (userExists) {
    throw new Error("User already exists");
  }

  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.users.create({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, env("APP_SECRET"));

  return {
    token,
    user,
  };
};

module.exports = {
  signup,
};
