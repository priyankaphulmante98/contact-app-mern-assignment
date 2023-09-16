const contact = require("../model/contact.model");

// create a contact function

exports.contactAddFunction = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const contactData = await contact.create({ name, email, phone });
    res.status(200).json(contactData);
  } catch (error) {
    console.log(error);
  }
};

// get a contact function

exports.contactGetFunction = async (req, res) => {
  try {
    const contactData = await contact.find();
    res.status(200).json(contactData);
  } catch (error) {
    console.log(error);
  }
};

// get a single contact function

exports.contactGetSingleFunction = async (req, res) => {
  const { id } = req.params;
  try {
    const contactData = await contact.findById({ _id: id });
    res.status(200).json(contactData);
  } catch (error) {
    console.log(error);
  }
};

// update a contact function

exports.contactUpdateFunction = async (req, res) => {
  const { id } = req.params;

  try {
    const { name, email, phone } = req.body;
    const contactData = await contact.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true }
    );
    await contactData.save();
    res.status(200).json(contactData);
  } catch (error) {
    console.log(error);
  }
};

// delete a contact function

exports.contactDeleteFunction = async (req, res) => {
  const { id } = req.params;
  try {
    const contactData = await contact.findByIdAndDelete(id);
    res.status(200).json(contactData);
  } catch (error) {
    console.log(error);
  }
};
