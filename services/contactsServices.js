import Contact from "../models/Contact.js";

export const listContacts = (search = {}) => {
  const { filter = {} } = search;
  return Contact.find(filter);
};
export const getContactById = async (_id) => {
  const result = await Contact.findById(_id);
  return result;
};

export const updateContactById = async (id, newData) => {
  const updatedContact = await Contact.findByIdAndUpdate(id, newData, {
    new: true,
  });
  return updatedContact;
};

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const addContact = ({ name, email, phone }) =>
  Contact.create({ name, email, phone });

export const updateStatusContact = async (id, { favorite }) => {
  const result = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  );
  return result;
};
