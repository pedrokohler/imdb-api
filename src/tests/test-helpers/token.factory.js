import { Types } from "mongoose";
import tokenHandler from "../../services/common/token.handler";

export const createValidAdminToken = async (id) => {
  const token = await tokenHandler.createToken({
    isAdmin: true,
    id: id || Types.ObjectId(),
  });
  return `Bearer ${token}`;
};

export const createValidRegularUserToken = async (id) => {
  const token = await tokenHandler.createToken({
    isAdmin: false,
    id: id || Types.ObjectId(),
  });
  return `Bearer ${token}`;
};

export default {
  createValidAdminToken,
  createValidRegularUserToken,
};
