import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import { validateContactId } from "../middlewares/validateContactId.js";

import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", validateContactId, getOneContact);

contactsRouter.delete("/:id", validateContactId, deleteContact);

contactsRouter.post("/", isEmptyBody, createContact);

contactsRouter.put("/:id", validateContactId, isEmptyBody, updateContact);

contactsRouter.patch(
  "/:id",
  validateContactId,
  isEmptyBody,
  updateStatusContact
);

export default contactsRouter;
