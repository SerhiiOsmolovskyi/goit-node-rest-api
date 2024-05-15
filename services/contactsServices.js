import Contact from "../models/Contact.js";

export const listContacts = (search = {}) => {
  const { filter = {} } = search;
  return Contact.find(filter);
};
export const getContactById = async (_id) => {
  const result = await Contact.findById(_id);
  return result;
};

export const updateContactById = (id, { name, email, phone }) =>
  Contact.findByIdAndUpdate(id, { name, email, phone });

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const addContact = ({ name, email, phone }) =>
  Contact.create({ name, email, phone });

export const updateStatusContact = (_id, { favorite }) => {
  return Contact.findByIdAndUpdate(_id, { favorite }, { new: true });
};
