import { Router } from "express";
import { login } from "../services/auth.service";
import { createErrorResponse } from "./common/response.factory";
import safeExecute from "./common/safe.execute";

const LoginController = Router();

LoginController.post(
  "/",
  safeExecute(async (req, res) => {
    const { email, password } = req.body;
    const token = await login(email, password);

    if (token.error) {
      return createErrorResponse(res, token.error);
    }

    return res.status(200).json({ email, token });
  })
);

export default LoginController;
