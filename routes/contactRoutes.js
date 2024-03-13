const express = require('express');
const { getContact, createContact, getContacts, updateContact, deleteContact } = require('../controller/contactController');
const validateToken = require('../middleware/validateTokenHandler');
const router = express.Router();

// This is another way to use the middleware for verifying the token and calling the controller when there are comman endpoints
router.use(validateToken);

router.route("/").get(getContacts).post(createContact);
// router.route("/").post(createContact);

router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);
// router.route("/:id").put(updateContact);
// router.route("/:id").delete(deleteContact);


module.exports = router;