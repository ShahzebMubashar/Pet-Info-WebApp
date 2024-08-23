const express = require('express');
const { getAllPets, createPet, updatePet, deletePet } = require('../controllers/petController');
const router = express.Router();

router.get('/pets', getAllPets);
router.post('/pets', createPet);
router.put('/pets/:id', updatePet);
router.delete('/pets/:id', deletePet);

module.exports = router;
