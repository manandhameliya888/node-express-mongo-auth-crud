// This is used as try-catch of the express async code
const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel')


// @desc Get all contacts
// @route GET /api/contacts
// @access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json({ message: "Get All Contacts", contacts });
    // res.status(200).json({ message: "Get All Contacts" });
});


// @desc Create/add new contact
// @route POST /api/contacts
// @access private
const createContact = asyncHandler(async (req, res) => {
    console.log("The request body coming is : => ", req.body);

    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are Mandatory(name, email, phone)")
    }

    const contact = await Contact.create({
        // name: name,
        name,
        email,
        phone,
        user_id: req.user.id
    })

    res.status(201).json({ message: "Create / Add Contact", contact });
});


// @desc Get contact by Id
// @route GET /api/contacts/:id
// @access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact Not Found!")
    } else {
        res.status(200).json({ message: `Get Contact for ${req.params.id}`, contact });
    }
});


// @desc Update contact by Id
// @route PUT /api/contacts/:id
// @access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact Not Found!");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contacts!")
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json({ message: `Update Contact for ${req.params.id}`, updatedContact });
});


// @desc Delete contact by Id
// @route DELETE /api/contacts/:id
// @access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact Not Found!");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to delete other user contacts!")
    }

    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: `Delete Contact for ${req.params.id}`, contact });

});

module.exports = {
    getContact,
    createContact,
    getContacts,
    updateContact,
    deleteContact
}