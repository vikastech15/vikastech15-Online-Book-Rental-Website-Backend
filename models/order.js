const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  type: {
    type: String,
    enum: ["Rent", "Buy"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rentalPeriodDays: {
    type: Number,
    required: function () {
      return this.type === "Rent";
    },
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Returned", "Cancelled"],
    default: "Pending",
  },
  orderedAt: {
    type: Date,
    default: Date.now,
  },
  returnedAt: {
    type: Date,
  },
  shippingAddress: {
    street: { type: String, required: true },
    city:   { type: String, required: true },
    state:  { type: String, required: true },
    zip:    { type: String, required: true },
  },
});

module.exports = mongoose.model("Order", orderSchema);
