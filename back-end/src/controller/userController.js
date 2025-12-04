require('dotenv').config();
const { createUserService,loginUserService,GetAllUsersService ,GetAllSellersService} = require('../service/userService');
const jwt = require("jsonwebtoken");


const createUser = async(req, res) => {
  console.log("Check request>>>>>>>>>>>> ", req.body);
  const { name,email, phone, address, password,role} = req.body;
  const data =  await createUserService(name,email, phone, address, password,role)
  return res.status(201).json({'message': 'User created successfully' });
}  

const loginUser = async(req, res) => {
  console.log("check request>>>>>>>>>>>> ", req.body);
  const { email, password } = req.body;
  const data = await loginUserService(email, password);
  if (!data.success) {
    return res.status(400).json({ message: data.message });
  }
  const user = data.user;
  const token = jwt.sign({
      id: user.id,
      name: user.name,
      role: user.role
  },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  return res.status(200).json({
    message: "Login successful",
    token: token,
    user: user
  });
}  

const GetAllUsers = async (req, res) => {
  try {
    const users = await GetAllUsersService(); 
    return users;
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
const GetAllsellers = async (req, res) => {
  try {
    const sellers = await GetAllSellersService(); 
    return sellers;
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {createUser,loginUser,GetAllUsers,GetAllsellers};