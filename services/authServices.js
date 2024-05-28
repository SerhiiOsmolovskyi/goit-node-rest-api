import User from "../models/User.js";
import bcrypt from "bcrypt";
import jimp from "jimp";

export const findUser = (filter) => User.findOne(filter);

export const saveUser = async (data) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);
export const updateAvatarUser = (filter, { avatarURL }) =>
  User.findOneAndUpdate(filter, { avatarURL });

export const processAvatar = async (oldPath) => {
  const image = await jimp.read(oldPath);
  await image.resize(250, 250).writeAsync(oldPath);
};
