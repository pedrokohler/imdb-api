import { Router } from "express";
import UserService from "../services/user.service";
import messageCodeMap from "./utils/message.codes";
import safeExecute from "./utils/safe.execute";

const UserController = Router();

const isDuplicateEmail = async (email) => {
  const list = await UserService.list({ email });
  return list.length > 0;
};

UserController.post(
  "/",
  safeExecute(async (req, res) => {
    const requiredFields = ["name", "password", "email", "isAdmin"];
    const isRequiredFieldMissing = requiredFields.some(
      (field) => !Object.keys(req.body).includes(field)
    );

    if (isRequiredFieldMissing) {
      return res.status(400).json(messageCodeMap.get(400));
    }

    const userAlreadyExists = await isDuplicateEmail(req.body.email);
    if (userAlreadyExists) {
      return res.status(409).json(messageCodeMap.get(409));
    }

    const user = await UserService.create(req.body);
    const { _id: id, password, ...response } = user.toJSON();
    return res.status(200).json({ id, ...response });
  })
);

UserController.patch(
  "/:id",
  safeExecute(async (req, res) => {
    const updatableFields = ["name", "password", "email", "isAdmin"];
    const someFieldIsNotUpdatable = Object.keys(req.body).some(
      (field) => !updatableFields.includes(field)
    );

    if (someFieldIsNotUpdatable) {
      return res.status(400).json(messageCodeMap.get(400));
    }

    if (req.body.email) {
      const userAlreadyExists = await isDuplicateEmail(req.body.email);
      if (userAlreadyExists) {
        return res.status(409).json(messageCodeMap.get(409));
      }
    }

    const { id } = req.params;
    const user = await UserService.update(id, req.body);

    if (user === null) {
      return res.status(404).json(messageCodeMap.get(404));
    }

    const { _id, password, ...response } = user.toJSON();
    return res.status(200).json({ ...response, id });
  })
);

UserController.delete(
  "/:id",
  safeExecute(async (req, res) => {
    const { id } = req.params;
    const user = await UserService.update(id, { isActive: false });

    if (user === null) {
      return res.status(404).json(messageCodeMap.get(404));
    }

    return res.status(200).json(messageCodeMap.get(200));
  })
);

export default UserController;
