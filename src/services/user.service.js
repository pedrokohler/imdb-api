import { Router } from "express";
import UserRepository from "../repositories/user.repository";
import {
  validateHasExtraInputs,
  validateIsMissingFields,
} from "./common/validation";

const UserController = Router();

const isDuplicateEmail = async (email) => {
  const list = await UserRepository.list({ email });
  return list.length > 0;
};

export const validateCreateUserPayload = validateIsMissingFields([
  "name",
  "password",
  "email",
  "isAdmin",
]);

export const createUser = async (userPayload) => {
  const userAlreadyExists = await isDuplicateEmail(userPayload.email);
  if (userAlreadyExists) {
    return { error: 409 };
  }

  const user = await UserRepository.create(userPayload);
  const { _id: id, password, ...userData } = user.toJSON();
  return { id, ...userData };
};

export const validateUpdateUserPayload = validateHasExtraInputs([
  "name",
  "password",
  "email",
  "isAdmin",
]);

export const updateUser = async (userPayload) => {
  const { id, ...updatePayload } = userPayload;
  if (updatePayload.email) {
    const userAlreadyExists = await isDuplicateEmail(updatePayload.email);
    if (userAlreadyExists) {
      return { error: 409 };
    }
  }

  const user = await UserRepository.update(id, updatePayload);

  if (user === null) {
    return { error: 404 };
  }

  const { _id, password, ...userData } = user.toJSON();
  return { ...userData, id };
};

export const deleteUser = async (id) => {
  const user = await UserRepository.update(id, { isActive: false });

  if (user === null) {
    return { error: 404 };
  }
  return {};
};

export default UserController;
