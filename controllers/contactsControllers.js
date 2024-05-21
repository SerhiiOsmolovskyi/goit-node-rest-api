import HttpError from "../helpers/HttpError.js";
import * as contactsServices from "../services/contactsServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

export const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const filter = { owner };
  const fields = "-createdAt -updatedAt";
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const settings = { skip, limit };

  if (favorite !== undefined) {
    filter.favorite = favorite === "true";
  }

  const result = await contactsServices.listContacts({
    filter,
    fields,
    settings,
  });
  const total = await contactsServices.countContacts(filter);
  res.json({ total, result });
};

export const getOneContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;

  const result = await contactsServices.getContact({ _id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} has not found`);
  }
  res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsServices.removeContact({ _id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} has not found`);
  }
  res.status(200).json(result);
};

export const createContact = async (req, res) => {
  const { id: owner } = req.user;
  const result = await contactsServices.addContact({ ...req.body, owner });
  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;

  const result = await contactsServices.updateContact({ _id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} has not found`);
  }
  res.json(result);
};

export const updateStatusContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const { favorite } = req.body;

  const updatedContact = await contactsServices.updateStatusContact(
    { _id, owner },
    {
      favorite,
    }
  );

  if (!updatedContact) {
    throw HttpError(404, `Contact with id=${id} has not found`);
  }

  res.json(updatedContact);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
