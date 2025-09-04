
const Order = require("../models/order")

// Place a new order
const User = require("../models/users");
const Listing = require("../models/listing");

const placeOrder = async (req, res) => {
  try {
    const { email, addressId, cartItems, paymentMethod } = req.body;

    if (!email || !addressId || !cartItems?.length) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    // Find the selected address in user's deliveryAddresses
    const selectedAddress = user.deliveryAddresses.id(addressId);
    if (!selectedAddress) {
      return res.status(404).json({ error: "Address not found." });
    }

    // Create orders
    const orderPromises = cartItems.map(async (item) => {
      const book = await Listing.findOne({ _id: item._id }); // or use _id if available
      if (!book) throw new Error(`Book not found: ${item.title}`);

      const rent = item.forRent?"Rent":"Buy";
      const order = new Order({
        user: user._id,
        book: book._id,
        type: rent, // you can customize based on item type
        price: item.price,
        rentalPeriodDays: item.rentalPeriod,
        shippingAddress: {
          street: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zip: selectedAddress.pin,
        },
      });

      return order.save();
    });

    const savedOrders = await Promise.all(orderPromises);
    res.status(201).json({ message: "Orders placed", orders: savedOrders });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = placeOrder;


// Get orders for a specific user
 const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate("book");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Get all orders
 const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("book");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status
 const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an order
 const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
}
