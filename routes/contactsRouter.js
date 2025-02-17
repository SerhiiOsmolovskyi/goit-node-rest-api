import { isEmptyBody } from "../middlewares/isEmptyBody.js";

import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", isEmptyBody, createContact);

contactsRouter.put("/:id", isEmptyBody, updateContact);

export default contactsRouter;
