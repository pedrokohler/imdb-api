// import bcrypt from "bcrypt";
import User from "../../models/user.model";

let user;

const defaultName = "My user";
const defaultEmail = "my@email.com";
const defaultPassword = "My plain text password";
const defaultIsAdmin = false;

beforeEach(() => {
  user = new User({
    name: defaultName,
    email: defaultEmail,
    password: defaultPassword,
    isAdmin: defaultIsAdmin,
  });
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
