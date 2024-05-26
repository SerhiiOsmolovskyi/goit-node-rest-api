import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";
import { subscriptions } from "../constants/authConstants.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";

const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;
  // const { path: oldPath, filename } = req.file;
  // const newPath = path.join(avatarsPath, filename);
  // await fs.rename(oldPath, newPath);
  // const avatarURL = path.join("avatars", filename);
  const avatarURL = gravatar.url(email, { s: "250", r: "pg", d: "mm" });
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email already exists");
  }

  const newUser = await authServices.saveUser({ ...req.body, avatarURL });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const updateAvatar = async (req, res) => {
  const userId = req.user.id;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  await authServices.processAvatar(newPath, filename);
  const avatarURL = path.join("avatars", filename);

  await authServices.updateUser({ _id: userId }, { avatarURL });

  res.status(200).json({ avatarURL });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const comparePassword = await compareHash(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password invalid");
  }

  const { _id: id } = user;
  const payload = { id };
  const token = createToken(payload);
  await authServices.updateUser({ _id: id }, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = (req, res) => {
  const { username, email, subscription } = req.user;
  res.json({
    username,
    email,
    subscription,
  });
};

const signout = async (req, res) => {
  const { _id: userId } = req.user;

  await authServices.updateUser({ _id: userId }, { token: "" });

  res.status(204).send();
};

const updateSubscription = async (req, res) => {
  const { _id: id } = req.user;
  const { subscription } = req.body;

  if (!subscriptions.includes(subscription)) {
    throw HttpError(
      400,
      `Invalid subscription type. Allowed values: ${subscriptions.join(", ")}`
    );
  }

  const updatedUser = await authServices.updateUser(
    { _id: id },
    { subscription }
  );
  if (!updatedUser) {
    throw HttpError(404, `User with id=${id} not found`);
  }

  res.json({
    user: {
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    },
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
