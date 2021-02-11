// @todo: implement
export const createValidAdminToken = (id) =>
  JSON.stringify({ isAdmin: true, userId: id });

// @todo: implement
export const createValidRegularUserToken = (id) =>
  JSON.stringify({ isAdmin: false, userId: id });

export default {
  createValidAdminToken,
  createValidRegularUserToken,
};
