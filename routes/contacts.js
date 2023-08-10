const nanoid = require("nanoid");
const express = require('express')
const router = express.Router()
const contactStorage = require("../models/contacts.json");
const { Contact } = require("../models/contacts.js");
const { contactSchema } = require("../models/contacts");
 
const listContacts = () => {
  return contactStorage;
};

const getById = (contactId) => {
  return contactStorage.find((element) => element.id === contactId);
};

const removeContact = (contactId) => {
  const index = contactStorage.findIndex((element) => element.id === contactId);
  if (index > -1) {
    contactStorage.splice(index, 1);
    return true;
  }
  return false;
};

const addContact = (body) => {
  const newId = nanoid.nanoid();
  const contact = new Contact(
    newId,
    body.name,
    body.email,
    body.phone
  );
  contactStorage.push(contact);
  return contact;
};
const updateContact = (contactId, body) => {
  for (let i = 0; i < contactStorage.length; i++) {
    if (contactStorage[i].id === contactId) {
      contactStorage[i] = Object.assign({}, contactStorage[i], {
        ...body,
        id: contactStorage[i].id,
      });
      return;
    }
  }
};
 
router.get("/", (req, res) => {
  try {
    const contacts = listContacts();
    res.status(200).json(contacts);
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

router.get("/:contactId", (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = getById(contactId);
    if (!contact) {
      return res.status(404).json({ "message": "Not found" });
    }
    res.status(200).json(contact);
  } catch {
    return res.status(500).send("Something went wrong");
  }
});
 
router.post("/", (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ "message": "missing required name - field"});
  }
  try {
    const contact = addContact(req.body);
    return res.status(201).json(contact);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong!");
  }
});

router.delete("/:contactId", (req, res) => {
  const contactId = req.params.contactId;
  try {
    const removed = removeContact(contactId);
    if (removed) {
      return res.status(200).json({"message": "contact deleted"});
    } else {
      return res.status(404).json({"message": "Not found"});
    }
  } catch (err) {
    return res.status(500).send("Something went wrong");
  }
});


router.put("/:contactId", (req, res) => {
  const { contactId } = req.params;
  if (!contactId) {
    return res.status(400).send("Id is required to perform update");
  }
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: 400, message: "missing fields" });
  }
  const contact = getById(contactId);
  if (!contact) {
    return res.status(404).json({"message": "Not found"});
  }
  try { 
    const updatedContact = updateContact(contactId, req.body);
    return res.status(200).json(updatedContact);
  } catch {
    return res.status(500).send("Something went wrong!");
  }
});

module.exports = router
