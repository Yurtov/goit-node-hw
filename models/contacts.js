const fs = require("fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "contacts.json");

const readContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");

  return JSON.parse(data);
};

const writeContacts = async (contacts) => {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
};

const listContacts = async () => {
  const contacts = await readContacts();

  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  const result = contacts.find((contact) => contact.id === contactId);

  return result || null;
};

const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const deleteContact = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];
  await writeContacts(deleteContact);

  return contacts[index];
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await readContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  contacts.push(newContact);
  await writeContacts(contacts);

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await readContacts();
  const id = contactId;
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const newContact = { id, ...body };
  console.log(newContact);
  const newContacts = [
    ...contacts.slice(0, index),
    newContact,
    ...contacts.slice(index + 1),
  ];

  await writeContacts(newContacts);

  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
