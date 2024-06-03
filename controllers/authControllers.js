import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";
import { subscriptions } from "../constants/authConstants.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

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

  const verificationCode = nanoid();

  const newUser = await authServices.saveUser({
    ...req.body,
    avatarURL,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await authServices.findUser({ verificationCode });
  if (!user) {
    throw HttpError(404, "Email has not found or email was already verified");
  }

  await authServices.updateUser(
    { _id: user._id },
    { verify: true, verificationCode: "" }
  );
  res.json({
    message: "Email verified",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "Email has not found");
  }

  if (user.verify) {
    throw HttpError(400, "Email has already virified");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email resent",
  });
};
const updateAvatar = async (req, res) => {
  const userId = req.user.id;
  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await authServices.processAvatar(oldPath, filename);
  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", filename);

  await authServices.updateAvatarUser({ _id: userId }, { avatarURL });

  res.status(200).json({ avatarURL });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
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
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
