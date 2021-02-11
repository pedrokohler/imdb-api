import { Router } from "express";
import UserService from "../services/user.service";
import messageCodeMap from "./utils/message.codes";
import safeExecute from "./utils/safe.execute";
import tokenHandler from "./utils/token.handler";

const LoginController = Router();

LoginController.post(
  "/",
  safeExecute(async (req, res) => {
    const { email, password } = req.body;
    const userList = await UserService.list({ email });
    const user = userList[0];

    if (!user) {
      return res.status(404).send(messageCodeMap.get(404));
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).send(messageCodeMap.get(401));
    }

    const token = await tokenHandler.createToken(user);

    return res.status(200).json({ token });
  })
);

export default LoginController;
