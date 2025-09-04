const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/users");

const SECRET_KEY = process.env.JWT_SECRET_KEY ?? "HGA3934JKAFSJASFashjasdfasdds";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({ email, username: user.username, token, message: "Login successful" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const signup =  async (req, res) => {
    try {
        const {username, email, phone, password } = req.body;
        if (!username || !email || !password || !phone) {
          return res.status(400).json({ message: "All fields are required" });
        }
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, phone, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
        res.status(201).json({ message: "User registered successfully", token, email, username });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
}

const checkuser = async (req, res) => {
  try {
    const {email} = req.body;
        if (!email) {
          return res.status(400).json({ message: "Email are required" });
        }
    
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: "User not found" });
        } else{
          const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
          return res.status(200).json({exists: true, email, username:user.username, token, message: "Login successful" });
        }
  }  catch (error) {
    res.status(500).json({ message: "Server error" });
  }


}

const profile = async (req, res) => {
  try {
    // 1. Get token from headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, SECRET_KEY);

    // 3. Find user based on decoded email
    const user = await User.findOne({ email: decoded.email }).select('-password'); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Return user profile
    res.status(200).json({ user });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const editProfile = async (req, res) => {
  try {
    // 1. Get token from headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, SECRET_KEY);

    // 3. Get new data from request body
    const { userName, phone, address } = req.body;
    const username = userName

    // 4. Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email },
      { username, phone, address },
      { new: true }  // return updated document
    ).select('-password'); // Don't send password back

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

async function editDeliveryAddress(userId, newAddresses) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Ensure the newAddresses array has between 1 and 3 addresses
    if (newAddresses.length < 1 || newAddresses.length > 3) {
      throw new Error('A user must have between 1 and 3 delivery addresses');
    }

    // Update the user's deliveryAddresses
    user.deliveryAddresses = newAddresses;

    await user.save();
    console.log('Addresses updated successfully');
  } catch (err) {
    console.error('Error updating user addresses:', err.message);
  }
}


module.exports = {
  login, 
  signup, 
  checkuser,
  profile,
  editProfile,
  editDeliveryAddress
};
