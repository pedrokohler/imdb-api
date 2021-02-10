import User from "../../models/user.model";
import {
  defaultName,
  defaultEmail,
  defaultPassword,
  defaultIsAdmin,
  createUserPayload,
} from "../helpers/user.payload.factory";

let user;

beforeEach(() => {
  user = new User(createUserPayload());
});

describe("USER MODEL", () => {
  it("Should create a user", () => {
    expect(user).toHaveProperty("name", defaultName);
    expect(user).toHaveProperty("email", defaultEmail);
    expect(user).toHaveProperty("password");
    expect(user).toHaveProperty("isAdmin", defaultIsAdmin);
  });

  it("Should have a method encryptPassword", () => {
    expect(user).toHaveProperty("encryptPassword");
    expect(typeof user.encryptPassword).toBe("function");
  });

  it("Should have a method comparePassword", () => {
    expect(user).toHaveProperty("comparePassword");
    expect(typeof user.encryptPassword).toBe("function");
  });

  it("Should call user.encryptPassword when validating a user with a new password", async () => {
    const spy = jest.spyOn(user, "encryptPassword");
    await user.validate();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("Should not store the plain text password after validation", async () => {
    await user.validate();
    expect(user.password).not.toBe(defaultPassword);
  });

  it("Should store an encypted version of the password after validation", async () => {
    await user.validate();
    const isValidPassword = await user.comparePassword(defaultPassword);
    expect(isValidPassword).toBe(true);
  });

  it("Should be activated on creation", () => {
    expect(user).toHaveProperty("isActive", true);
  });
});
