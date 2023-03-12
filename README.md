# How to use this project

1. ## Installation
   - clone this project `git clone https://github.com/fazaimron27/kuncie-shop-test.git`
   - open using your favorite text editor
2. ## Setup

   - install dependencies
     ```bash
        pnpm install
        # or
        npm install
        # or
        yarn install
     ```
   - copy `.env.example` to `.env`
   - generate prisma client
     ```bash
         pnpm prisma generate
         # or
         npm run prisma generate
         # or
         yarn prisma generate
     ```

3. ## Running the app

   - start server
     ```bash
         pnpm start
         # or
         npm run start
         # or
         yarn start
     ```
   - start server with nodemon
     ```bash
         pnpm dev
         # or
         npm run dev
         # or
         yarn dev
     ```
   - server will run on `http://localhost:4000`
   - open with your favorite browser and test query with graphql playground

4. ## Testing

   - unit testing

     ```bash
         pnpm test
         # or
         npm run test
         # or
         yarn test
     ```

     > important: to run unit tests, you must run the server using `pnpm start` or `npm run start` or `yarn start`

     > otherwise it will definitely error

5. ## GraphQL Documentation

   - sign up

     ```graphql
     mutation {
       signup(
         name: "your_name"
         email: "your_email"
         password: "your_password"
       ) {
         token
         user {
           id
           name
           email
         }
       }
     }
     ```

   - sign in

     ```graphql
     mutation {
       signin(email: "your_email", password: "your_password") {
         token
         user {
           id
           name
           email
         }
       }
     }
     ```

   - list of inventories

     ```graphql
     query {
       inventories {
         id
         sku
         name
         price
         quantity
       }
     }
     ```

   - add inventory to cart

     ```graphql
     mutation {
       addInventorytoCart(sku: "inventory_sku", quantity: number_of_quantity) {
         id
         quantity
       }
     }
     ```

   - remove inventory from cart

     ```graphql
     mutation {
       removeInventoryfromCart(id: "cart_id") {
         id
         quantity
       }
     }
     ```

   - checkout

     ```graphql
     mutation {
       checkout {
         id
         total
       }
     }
     ```
