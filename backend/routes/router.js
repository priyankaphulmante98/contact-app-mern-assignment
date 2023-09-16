const express = require("express");

const router = express.Router();

// Import the Controller module
const Controller = require("../controller/contact.controller");

router.post("/contacts", Controller.contactAddFunction);

router.get("/contacts", Controller.contactGetFunction);

router.get("/contacts/:id", Controller.contactGetSingleFunction);

router.put("/contacts/:id", Controller.contactUpdateFunction);

router.delete("/contacts/:id", Controller.contactDeleteFunction);

module.exports = router;
