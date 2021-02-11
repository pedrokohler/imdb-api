import { Types } from "mongoose";

// @todo: implement
export const createValidAdminToken = (id) =>
  JSON.stringify({ isAdmin: true, userId: id || Types.ObjectId() });

// @todo: implement
export const createValidRegularUserToken = (id) =>
  JSON.stringify({ isAdmin: false, userId: id || Types.ObjectId() });

export default {
  createValidAdminToken,
  createValidRegularUserToken,
};
