const express = require("express");
const contactsRouter = require("./contacts");
const authRouter = require("./authorization"); 
const router = express.Router();
 
router.use("/api/contacts", contactsRouter);
router.use("/users", authRouter);

module.exports = router;