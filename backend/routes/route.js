
const express = require("express");
const {
  OwnerRegistration,
  CustomerRegistration,
  OwnerLogin,
  CustomerLogin,
  getCustomerPets,
  getAllPets,
  getAvailablePetsByType,
  createPet,
} = require("../controllers/AuthControllers.js");
const auth = require("../middleware/auth");
const ownerAuth = require("../middleware/ownerAuth");

const router = express.Router();
router.post("/register/owner", OwnerRegistration);
router.post("/register/customer", CustomerRegistration);
router.post("/login/owner", OwnerLogin);
router.post("/login/customer", CustomerLogin);
router.get("/customer/pets", auth, getCustomerPets);
router.get("/owner/all-pets", auth, ownerAuth, getAllPets);
router.get("/available-pets", auth, getAvailablePetsByType);
router.post("/pets", createPet);

module.exports = router;
