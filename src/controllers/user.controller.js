import { Router } from "express";
import messageCodeMap from "./common/message.codes";
import safeExecute from "./common/safe.execute";
import {
  createUser,
  deleteUser,
  updateUser,
  validateCreateUserPayload,
  validateUpdateUserPayload,
} from "../services/user.service";
import { createErrorResponse } from "./common/response.factory";

const UserController = Router();

UserController.post(
  "/",
  safeExecute(async (req, res) => {
    const { error: validationError } = validateCreateUserPayload(req.body);

    if (validationError) {
      return createErrorResponse(res, validationError);
    }

    const user = await createUser(req.body);

    if (user.error) {
      return createErrorResponse(res, user.error);
    }

    return res.status(200).json(user);
  })
);

UserController.patch(
  "/:id",
  safeExecute(async (req, res) => {
    const { error: validationError } = validateUpdateUserPayload(req.body);

    if (validationError) {
      return createErrorResponse(res, validationError);
    }

    const user = await updateUser({ id: req.params.id, ...req.body });

    if (user.error) {
      return createErrorResponse(res, user.error);
    }

    return res.status(200).json(user);
  })
);

UserController.delete(
  "/:id",
  safeExecute(async (req, res) => {
    const { error } = await deleteUser(req.params.id);

    if (error) {
      return createErrorResponse(res, error);
    }

    return res.status(200).json(messageCodeMap.get(200));
  })
);

export default UserController;
