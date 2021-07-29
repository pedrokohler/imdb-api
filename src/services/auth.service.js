import UserRepository from "../repositories/user.repository";
import tokenHandler from "./common/token.handler";

export const login = async (email, password) => {
  const userList = await UserRepository.list({ email });
  const user = userList[0];

  if (!user) {
    return { error: 404 };
  }

  const isValidPassword = await user.comparePassword(password);
  if (!user.isActive || !isValidPassword) {
    return { error: 401 };
  }

  const token = await tokenHandler.createToken(user);
  return token;
};

export const getIsAdmin = async (req) => {
  const authorization = req.header("Authorization");
  const decoded = await tokenHandler.verifyToken(authorization);
  const { isAdmin } = decoded;
  return isAdmin;
};

export const getUserId = async (req) => {
  const authorization = req.header("Authorization");
  const decoded = await tokenHandler.verifyToken(authorization);
  const { userId } = decoded;
  return userId;
};

export default {
  login,
};
