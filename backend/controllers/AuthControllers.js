const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Pet = require("../models/Pet");
const auth = require("../middleware/auth");

const OwnerRegistration = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (role === "owner") {
      const ownerExists = await User.isOwnerExists();
      if (ownerExists) {
        return res.status(400).json({ msg: "An owner already exists" });
      }
    }
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ username, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "10h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const CustomerRegistration = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    let customer = await Customer.findOne({ name });
    if (customer)
      return res
        .status(400)
        .json({ msg: "Customer with the same name already exists" });

    let customer1 = await Customer.findOne({ email });
    if (customer1)
      return res
        .status(400)
        .json({ msg: "Customer with the same email already exists" });
    customer = new Customer({ email, password, name });
    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(password, salt);
    await customer.save();

    const payload = { user: { id: customer.id, role: "customer" } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "10h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const OwnerLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ msg: "Invalid owner credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid owenr credentials" });

    const payload = {
      user: { id: user.id, role: user.role },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "10h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, userId: user.id });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const CustomerLogin = async (req, res) => {
  try {
    const { name, password } = req.body;
    let customer = await Customer.findOne({ name });
    if (!customer) return res.status(400).json({ msg: "Invalid name " });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const payload = {
      user: { id: customer.id, role: "customer" },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "10h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, userId: customer.id });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getCustomerPets = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).populate(
      "adoptedPets"
    );
    if (!customer) {
      return res.status(404).json({ msg: "Customer not found" });
    }
    res.json(customer.adoptedPets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate("adoptedBy", "name email");
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAvailablePetsByType = async (req, res) => {
  try {
    const pets = await Pet.find({ status: "available" });

    const groupedPets = pets.reduce((acc, pet) => {
      if (!acc[pet.type]) {
        acc[pet.type] = [];
      }
      acc[pet.type].push(pet);
      return acc;
    }, {});

    ["cat", "dog", "fish", "bird"].forEach((type) => {
      if (!groupedPets[type]) {
        groupedPets[type] = [];
      }
    });

    res.json(groupedPets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
const createPet = async (req, res) => {
  const newPet = new Pet(req.body);
  try {
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  CustomerLogin,
  OwnerLogin,
  CustomerRegistration,
  OwnerRegistration,
  getCustomerPets,
  getAllPets,
  getAvailablePetsByType,
  createPet,
};
