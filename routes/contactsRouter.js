import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import { validateContactId } from "../middlewares/validateContactId.js";
import validateBody from "../decorators/validateBody.js";
import express from "express";

import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

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

contactsRouter.post(
  "/",
  isEmptyBody,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  validateContactId,
  isEmptyBody,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id",
  validateContactId,
  isEmptyBody,
  validateBody(updateStatusContactSchema),
  updateStatusContact
);

export default contactsRouter;
