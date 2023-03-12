const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../../utils");

const signin = async (parent, args, context, info) => {
  const user = await context.prisma.users.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, env("APP_SECRET"));

  return {
    token,
    user,
  };
};

module.exports = {
  signin,
};
