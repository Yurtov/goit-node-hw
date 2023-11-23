const { Contact } = require("../models/contact");
const ctrlWrapper = require("../helpers/ctrlWrapper");

const listContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite = true } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find(
    { favorite, owner },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  ).exec();
  res.json(result);
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findById(contactId).exec();
  if (!result) {
    return next();
  }
  if (result.owner.toString() !== owner.toString()) {
    return next();
  }
  res.json(result);
};

const addContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });

  res.status(201).json(result);
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    return next();
  }
  if (result.owner.toString() !== owner.toString()) {
    return next();
  }

  return res.json({ message: "contact deleted" });
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    return next();
  }
  if (result.owner.toString() !== owner.toString()) {
    return next();
  }
  res.json(result);
};
const updateContactFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    return next();
  }
  if (result.owner.toString() !== owner.toString()) {
    return next();
  }
  res.json(result);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateContactFavorite: ctrlWrapper(updateContactFavorite),
};
