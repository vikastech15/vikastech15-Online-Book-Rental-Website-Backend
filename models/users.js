const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Delivery Address Schema
const addressSchema = new Schema({
  address: { type: String, required: true },
  locality: { type: String, required: true },
  pin: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
});

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {String},
  password: { type: String, required: true },
  deliveryAddresses: {
    type: [addressSchema],
   
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
