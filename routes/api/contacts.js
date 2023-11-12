<<<<<<< Updated upstream
const express = require('express')
=======
const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateContactFavorite
} = require("../../controllers/contacts");
const { validateBody } = require("../../middlewars/validateBody");
const isValidId = require("../../middlewars/isValidId");
const { addSchema, updateFavoriteSchema } = require("../../models/contact");
>>>>>>> Stashed changes

const router = express.Router()

router.get('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

<<<<<<< Updated upstream
router.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})
=======
router.get("/:contactId", isValidId, getContactById);
>>>>>>> Stashed changes

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

<<<<<<< Updated upstream
router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})
=======
router.delete("/:contactId", isValidId, removeContact);

router.put("/:contactId", isValidId, validateBody(addSchema), updateContact);

router.patch("/:contactId/favorite", isValidId, validateBody(updateFavoriteSchema), updateContactFavorite);
>>>>>>> Stashed changes

module.exports = router
