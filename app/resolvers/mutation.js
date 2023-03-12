const { signup } = require("./mutations/signup");
const { signin } = require("./mutations/signin");
const { addInventorytoCart } = require("./mutations/addInventorytoCart");
const {
  removeInventoryfromCart,
} = require("./mutations/removeInventoryfromCart");
const { checkout } = require("./mutations/checkout");

module.exports = {
  signup,
  signin,
  addInventorytoCart,
  removeInventoryfromCart,
  checkout,
};
