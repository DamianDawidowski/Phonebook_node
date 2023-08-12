const express = require('express')
const router = express.Router()
const { Contact } = require("../service/contact");
const { contactSchema } = require("../models/contacts");
 
const listContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

const getById = async (contactId) => {
  return await Contact.findOne({ _id: contactId })
};

const removeContact = async (contactId) => { 
    return await Contact.findByIdAndRemove({ _id: contactId }); 
};
 
const addContact = async ({ name, email, phone, favorite })=> { 
    const contact = new Contact({ name, email, phone, favorite });
    contact.save();
    return contact; 
};
 
const updateContact = (_id, payload) => {
  return Contact.findByIdAndUpdate(_id, payload, {
		new: true,
	});
};
 
const updateStatusContact = async (contactId, favorite) => {
  const update = { favorite };
  const updatedContact = await Contact.findByIdAndUpdate(contactId, update, {
    new: true,
      });
  return updatedContact;
};
  
router.get("/", async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

router.get("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getById(contactId);
    if (!contact) {
      return res.status(404).json({ "message": "Not found" });
    }
    res.status(200).json(contact);
  } catch {
    return res.status(500).send("Something went wrong");
  }
});
 
router.post("/", async (req, res) => {
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
    const updatedContact = updateContact(contact.id, req.body);
    return res.status(200).json(updatedContact);
  } catch {
    return res.status(500).send("Something went wrong!");
  }
});


router.patch("/:contactId/favorite", async (req, res) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({"message": "missing field favorite"});
    }
    const favoriteValue = Boolean(favorite);
    const updatedContact = await updateStatusContact(contactId, favoriteValue);
    return res.status(200).send(updatedContact);
  } catch (err) {
    return res.status(404).json({"message": "Not found"});
  }
});


module.exports = router
