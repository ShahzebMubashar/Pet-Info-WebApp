const express = require("express");
const {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  getPetById,
  adoptPet, // Add this line
} = require("../controllers/petController");
const router = express.Router();

router.get("/pets", getAllPets);
router.post("/pets", createPet);
router.get("/pets/:id", getPetById);
router.put("/pets/:id", updatePet);
router.delete("/pets/:id", deletePet);
router.patch("/pets/adopt/:id", adoptPet); // Add this line


module.exports = router;
