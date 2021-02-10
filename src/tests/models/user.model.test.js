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

  //   it("Should not store the plain text password after validation", async () => {
  //     expect(user.password).not.toBe(defaultPassword);
  //   });

  //   it("Should store a encypted version of the password", async () => {
  //     const plainTextPassword = user.password;
  //     const isValidPassword = await bcrypt.compare(
  //       plainTextPassword,
  //       user.password
  //     );
  //     expect(isValidPassword).toBeTruthy();
  //   });
});
