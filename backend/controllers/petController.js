const Pet = require("../models/Pet");

exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.createPet = async (req, res) => {
//   const newPet = new Pet(req.body);
//   try {
//     await newPet.save();
//     res.status(201).json(newPet);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
exports.createPet = async (req, res) => {
  const newPet = new Pet(req.body);
  try {
    const savedPet = await newPet.save();
    res.status(201).json(savedPet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPetById = async (req, res) => {
  console.log("Received request for pet ID:", req.params.id);
  try {
    const pet = await Pet.findById(req.params.id);
    console.log("Pet found:", pet);
    if (!pet) {
      console.log("Pet not found for ID:", req.params.id);
      return res.status(404).json({ message: "Pet not found" });
    }
    res.json(pet);
  } catch (error) {
    console.error("Error in getPetById:", error);
    res.status(500).json({ message: error.message });
  }
};

// exports.updatePet = async (req, res) => {
//   try {
//     const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!pet) return res.status(404).json({ message: "Pet not found" });
//     res.json(pet);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
exports.updatePet = async (req, res) => {
  try {
    console.log("Updating pet with ID:", req.params.id);
    console.log("Received update data:", req.body);
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    console.log("Updated pet:", pet);
    res.json(pet);
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(400).json({ message: error.message });
  }
};

// exports.updatePet = async (req, res) => {
//   try {
//     console.log("Updating pet with ID:", req.params.id);
//     console.log("Received update data:", req.body);

//     const result = await Pet.updateOne(
//       { _id: req.params.id },
//       { $set: req.body }
//     );

//     if (result.nModified === 0)
//       return res
//         .status(404)
//         .json({ message: "Pet not found or no changes made" });

//     const updatedPet = await Pet.findById(req.params.id);
//     console.log("Updated pet:", updatedPet);
//     res.json(updatedPet);
//   } catch (error) {
//     console.error("Error updating pet:", error);
//     res.status(400).json({ message: error.message });
//   }
// };
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json({ message: "Pet deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
