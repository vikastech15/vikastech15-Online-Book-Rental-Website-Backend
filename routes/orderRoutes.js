const express = require("express");
const router = express.Router();
const  {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} = require("../controllers/orderController")


// POST /api/orders - Place a new order
router.post("/", placeOrder);

// // GET /api/orders/user/:userId - Get orders for a user
router.get("/user/:userId", getUserOrders);

// // GET /api/orders - Admin: Get all orders
router.get("/", getAllOrders);

// // PATCH /api/orders/:orderId - Update order status
router.patch("/:orderId", updateOrderStatus);

// // DELETE /api/orders/:orderId - Delete an order
router.delete("/:orderId", deleteOrder);

module.exports = router;
