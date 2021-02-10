export const defaultName = "My user";
export const defaultEmail = "my@email.com";
export const defaultPassword = "My plain text password";
export const defaultIsAdmin = false;

export const createUserPayload = (optionalExtraPayload) => ({
  name: defaultName,
  email: defaultEmail,
  password: defaultPassword,
  isAdmin: defaultIsAdmin,
  ...optionalExtraPayload,
});

export const createUserPayloadWithoutPassword = (optionalExtraPayload) => {
  const { password, ...payload } = createUserPayload(optionalExtraPayload);
  return payload;
};

export default {
  defaultName,
  defaultEmail,
  defaultPassword,
  defaultIsAdmin,
  createUserPayload,
};
