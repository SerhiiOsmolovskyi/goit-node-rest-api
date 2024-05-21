import Contact from "../models/Contact.js";

export const countContacts = (filter) => Contact.countDocuments(filter);

export const listContacts = (search = {}) => {
  const { filter = {}, fields = "", settings = "" } = search;
  return Contact.find(filter, fields, settings).populate("owner");
};

export const getContact = (filter) => Contact.findOne(filter);

export const updateContact = (filter, newData) =>
  Contact.findOneAndUpdate(filter, newData, { new: true });

export const removeContact = (filter) => Contact.findOneAndDelete(filter);

export const addContact = ({ name, email, phone, owner }) =>
  Contact.create({ name, email, phone, owner });

export const updateStatusContact = (filter, { favorite }) => {
  const result = Contact.findOneAndUpdate(filter, { favorite }, { new: true });
  return result;
};
