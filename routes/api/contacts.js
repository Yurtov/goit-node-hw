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
const authenticate = require("../../middlewars/authenticate");
const { addSchema, updateFavoriteSchema } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, listContacts);

router.get("/:contactId", authenticate, isValidId, getContactById);

router.post("/", authenticate, validateBody(addSchema), addContact);

router.delete("/:contactId", authenticate, isValidId, removeContact);

router.put("/:contactId", authenticate, isValidId, validateBody(addSchema), updateContact);

router.patch("/:contactId/favorite", authenticate, isValidId, validateBody(updateFavoriteSchema), updateContactFavorite);

module.exports = router;
