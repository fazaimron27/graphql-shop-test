const fetch = require("node-fetch");
const matchers = require("jest-json-schema").matchers;

describe("App", () => {
  let resolveToken = null;
  let promiseToken = new Promise((resolve) => (resolveToken = resolve));

  // should login
  test("should login", async () => {
    const response = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation {
            signin(email: "user@mail.com", password: "user") {
              token
              user {
                id
                name
                email
              }
            }
          }`,
      }),
    });

    const { data } = await response.json();
    resolveToken(data.signin.token);

    expect.extend(matchers);
    expect(data.signin.user).toMatchSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
      },
      required: ["id", "name", "email"],
    });
  });

  // should return inventories
  test("should return inventories", async () => {
    const response = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await promiseToken}`,
      },
      body: JSON.stringify({
        query: `
            query {
              inventories {
                id
                sku
                name
                price
                quantity
              }
            }`,
      }),
    });

    const { data } = await response.json();

    expect.extend(matchers);
    expect(data.inventories).toMatchSchema({
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          sku: { type: "string" },
          name: { type: "string" },
          price: { type: "number" },
          quantity: { type: "number" },
        },
        required: ["id", "sku", "name", "price", "quantity"],
      },
    });
  });

  // should add inventory to cart
  let resolveInventoryId = null;
  let promiseInventoryId = new Promise(
    (resolve) => (resolveInventoryId = resolve)
  );
  test("should add inventory to cart", async () => {
    const response = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await promiseToken}`,
      },

      body: JSON.stringify({
        query: `
            mutation {
              addInventorytoCart(sku: "120P90", quantity: 1) {
                id
                quantity
              }
            }`,
      }),
    });

    const { data } = await response.json();

    resolveInventoryId(data.addInventorytoCart.id);

    expect.extend(matchers);
    expect(data.addInventorytoCart).toMatchSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        quantity: { type: "number" },
      },
      required: ["id", "quantity"],
    });
  });

  // should remove inventory from cart
  test("should remove inventory from cart", async () => {
    const response = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await promiseToken}`,
      },

      body: JSON.stringify({
        query: `
            mutation {
              removeInventoryfromCart(id: "${await promiseInventoryId}") {
                id
                quantity
              }
            }`,
      }),
    });

    const { data } = await response.json();

    expect.extend(matchers);
    expect(data.removeInventoryfromCart).toMatchSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        quantity: { type: "number" },
      },
      required: ["id", "quantity"],
    });
  });

  let CheckoutInventoryId = null;
  test("should checkout MacBook Pro", async () => {
    const response = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await promiseToken}`,
      },

      body: JSON.stringify({
        query: `
            mutation {
              addInventorytoCart(sku: "43N23P", quantity: 1) {
                id
                quantity
              }
            }`,
      }),
    });

    const { data } = await response.json();

    CheckoutInventoryId = data.addInventorytoCart.id;

    expect.extend(matchers);
    expect(data.addInventorytoCart).toMatchSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        quantity: { type: "number" },
      },
      required: ["id", "quantity"],
    });

    const response2 = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await promiseToken}`,
      },
      body: JSON.stringify({
        query: `
            mutation {
              checkout {
                id
                total
              }
            }`,
      }),
    });

    const { data: data2 } = await response2.json();

    expect.extend(matchers);
    expect(data2.checkout).toMatchSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        total: { type: "number" },
      },
      required: ["id", "total"],
    });

    expect(data2.checkout.total).toBe(5399.99);

    const response3 = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await promiseToken}`,
      },
      body: JSON.stringify({
        query: `
            mutation {
              removeInventoryfromCart(id: "${CheckoutInventoryId}") {
                id
                quantity
              }
            }`,
      }),
    });

    const { data: data3 } = await response3.json();

    expect.extend(matchers);
    expect(data3.removeInventoryfromCart).toMatchSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        quantity: { type: "number" },
      },
      required: ["id", "quantity"],
    });
  });

  let CheckoutInventoryId2 = null;
  test("should checkout Google Home", async () => {
    const response = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await promiseToken}`,
      },

      body: JSON.stringify({
        query: `
            mutation {
              addInventorytoCart(sku: "120P90", quantity: 3) {
                id
                quantity
              }
            }`,
      }),
    });

    const { data } = await response.json();

    CheckoutInventoryId2 = data.addInventorytoCart.id;

    expect.extend(matchers);
    expect(data.addInventorytoCart).toMatchSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        quantity: { type: "number" },
      },
      required: ["id", "quantity"],
    });

    const response2 = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await promiseToken}`,
      },
      body: JSON.stringify({
        query: `
            mutation {
              checkout {
                id
                total
              }
            }`,
      }),
    });

    const { data: data2 } = await response2.json();

    expect.extend(matchers);
    expect(data2.checkout).toMatchSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        total: { type: "number" },
      },
      required: ["id", "total"],
    });

    expect(data2.checkout.total).toBe(99.98);

    const response3 = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await promiseToken}`,
      },
      body: JSON.stringify({
        query: `
            mutation {
              removeInventoryfromCart(id: "${CheckoutInventoryId2}") {
                id
                quantity
              }
            }`,
      }),
    });

    const { data: data3 } = await response3.json();

    expect.extend(matchers);
    expect(data3.removeInventoryfromCart).toMatchSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        quantity: { type: "number" },
      },
      required: ["id", "quantity"],
    });
  });

  let CheckoutInventoryId3 = null;
  test("should checkout Alexa Speaker", async () => {
    const response = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await promiseToken}`,
      },

      body: JSON.stringify({
        query: `
            mutation {
              addInventorytoCart(sku: "A304SD", quantity: 3) {
                id
                quantity
              }
            }`,
      }),
    });

    const { data } = await response.json();

    CheckoutInventoryId3 = data.addInventorytoCart.id;

    expect.extend(matchers);
    expect(data.addInventorytoCart).toMatchSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        quantity: { type: "number" },
      },
      required: ["id", "quantity"],
    });

    const response2 = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await promiseToken}`,
      },
      body: JSON.stringify({
        query: `
            mutation {
              checkout {
                id
                total
              }
            }`,
      }),
    });

    const { data: data2 } = await response2.json();

    expect.extend(matchers);
    expect(data2.checkout).toMatchSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        total: { type: "number" },
      },
      required: ["id", "total"],
    });

    expect(data2.checkout.total).toBe(295.65);

    const response3 = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await promiseToken}`,
      },
      body: JSON.stringify({
        query: `
            mutation {
              removeInventoryfromCart(id: "${CheckoutInventoryId3}") {
                id
                quantity
              }
            }`,
      }),
    });

    const { data: data3 } = await response3.json();

    expect.extend(matchers);
    expect(data3.removeInventoryfromCart).toMatchSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        quantity: { type: "number" },
      },
      required: ["id", "quantity"],
    });
  });
});
