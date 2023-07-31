# Plotline SDE assignment

## Must Have

- Create an account.
- Fetch all products and services information with their prices.
- Add a product or service to the cart.
- Remove a product or service from the cart.
- Clear the cart.
- View total bill (should include price, quantity, and tax on each item as well as total
  value of selected items)
- Confirm the order

## Additional Features

## API Routes Documentation

### Auth Routes

#### Signup

- **Method**: POST
- **Endpoint**: `/signup`
- **Controller**: `authController.signup`
- **Description**: Register a new user account.

#### Login

- **Method**: POST
- **Endpoint**: `/login`
- **Controller**: `authController.login`
- **Description**: Log in an existing user.

---

### Cart Routes

#### Get Cart

- **Method**: GET
- **Endpoint**: `/`
- **Controller**: `cartController.getCart`
- **Middleware**: `protect` (authentication required)
- **Description**: Get the cart items for the authenticated user.

#### Add to Cart

- **Method**: POST
- **Endpoint**: `/:itemId`
- **Controller**: `cartController.addToCart`
- **Middleware**: `protect` (authentication required)
- **Description**: Add a product or service to the cart for the authenticated user.

#### Remove from Cart

- **Method**: DELETE
- **Endpoint**: `/:itemId`
- **Controller**: `cartController.removeFromCart`
- **Middleware**: `protect` (authentication required)
- **Description**: Remove a product or service from the cart for the authenticated user.

#### Clear Cart

- **Method**: DELETE
- **Endpoint**: `/`
- **Controller**: `cartController.clearCart`
- **Middleware**: `protect` (authentication required)
- **Description**: Clear the cart for the authenticated user.

---

### Catalog Routes

#### Get All Catalog Items

- **Method**: GET
- **Endpoint**: `/`
- **Controller**: `catalogController.getAllCatalogItems`
- **Description**: Get all catalog items.

#### Get Single Catalog Item

- **Method**: GET
- **Endpoint**: `/:catalogId`
- **Controller**: `catalogController.getCatalogItem`
- **Description**: Get a single catalog item by its ID.

#### Create Catalog Item

- **Method**: POST
- **Endpoint**: `/`
- **Controller**: `catalogController.createCatalogItem`
- **Middleware**: `protect` (authentication required), `restrictTo('admin')` (only admins allowed)
- **Description**: Create a new catalog item. This route is only accessible to admin users.

#### Update Catalog Item

- **Method**: PATCH
- **Endpoint**: `/:catalogId`
- **Controller**: `catalogController.updateCatalogItem`
- **Middleware**: `protect` (authentication required), `restrictTo('admin')` (only admins allowed)
- **Description**: Update a catalog item by its ID. This route is only accessible to admin users.

#### Delete Catalog Item

- **Method**: DELETE
- **Endpoint**: `/:catalogId`
- **Controller**: `catalogController.deleteCatalogItem`
- **Middleware**: `protect` (authentication required), `restrictTo('admin')` (only admins allowed)
- **Description**: Delete a catalog item by its ID. This route is only accessible to admin users.

---

### Order Routes

#### Create Order

- **Method**: POST
- **Endpoint**: `/`
- **Controller**: `orderController.createOrder`
- **Middleware**: `protect` (authentication required)
- **Description**: Create a new order.

#### Get All Orders

- **Method**: GET
- **Endpoint**: `/`
- **Controller**: `orderController.getAllOrders`
- **Middleware**: `protect` (authentication required)
- **Description**: Get all orders for the authenticated user. If the user is an admin, all orders will be fetched.

#### Get Specific Order

- **Method**: GET
- **Endpoint**: `/:orderId`
- **Controller**: `orderController.getOrder`
- **Middleware**: `protect` (authentication required)
- **Description**: Get details of a specific order by its ID.

#### Cancel Order

- **Method**: PATCH
- **Endpoint**: `/:orderId/cancel`
- **Controller**: `orderController.cancelOrder`
- **Middleware**: `protect` (authentication required)
- **Description**: Cancel an order by its ID.

---

### User Routes

#### Get All Users

- **Method**: GET
- **Endpoint**: `/`
- **Controller**: `userController.getAllUsers`
- **Description**: Get all users. (This route might require admin access control depending on the implementation)

#### Get Single User

- **Method**: GET
- **Endpoint**: `/:id`
- **Controller**: `userController.getUser`
- **Description**: Get a single user by their ID.

#### Update User

- **Method**: PATCH
- **Endpoint**: `/:id`
- **Controller**: `userController.updateUser`
- **Middleware**: `protect` (authentication required), `restrictTo('admin')` (only admins allowed)
- **Description**: Update a user by their ID. This route is only accessible to admin users.

#### Delete User

- **Method**: DELETE
- **Endpoint**: `/:id`
- **Controller**: `userController.deleteUser`
- **Middleware**: `protect` (authentication required), `restrictTo('admin')` (only admins allowed)
- **Description**: Delete a user by their ID. This route is only accessible to admin users.
