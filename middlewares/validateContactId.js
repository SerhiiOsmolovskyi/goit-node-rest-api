import mongoose from "mongoose";
import HttpError from "../helpers/HttpError.js";

export const validateContactId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw HttpError(400, "Invalid contact id formatying");
  }
  next();
};
