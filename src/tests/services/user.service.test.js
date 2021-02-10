import dbHandler from "../helpers/db.handler";
import UserService from "../../services/user.service";
import {
  defaultPassword,
  createUserPayload,
} from "../helpers/user.payload.factory";

beforeAll(async () => {
  await dbHandler.connect();
});
afterEach(async () => {
  await dbHandler.clearDatabase();
});
afterAll(async () => {
  await dbHandler.closeDatabase();
});

const addUser = async (customizedPayload) => {
  const user = await UserService.create(createUserPayload(customizedPayload));
  return user;
};

describe("USER SERVICE", () => {
  it("Should save a user in the database without errors", async () => {
    try {
      await addUser({});
      expect(true).toBe(true);
    } catch {
      expect(true).toBe(false);
    }
  });

  it("Should find a user in the database", async () => {
    const user = await addUser({});
    const foundUser = await UserService.find(user.id);
    expect(user.toJSON()).toEqual(foundUser?.toJSON());
  });

  it("Should update a user in the database", async () => {
    const user = await addUser({});
    await UserService.update(user.id, { name: "Pedro" });

    const foundUser = await UserService.find(user.id);
    expect(foundUser).not.toBe(null);
    expect(foundUser).toHaveProperty("name", "Pedro");
  });

  it("Shouldn't hash the user password a second time after updating another user field", async () => {
    const user = await addUser({});
    const updatedUser = await UserService.update(user.id, { name: "Pedro" });
    expect(updatedUser).not.toBe(null);

    const isValidPassword = await updatedUser.comparePassword(defaultPassword);
    expect(isValidPassword).toBe(true);
  });

  it("Should hash the user password after updating the user password", async () => {
    const user = await addUser({});
    const newPassword = "New Password";
    const updatedUser = await UserService.update(user.id, {
      password: newPassword,
    });
    expect(updatedUser).not.toBe(null);

    const isValidPassword = await updatedUser.comparePassword(newPassword);
    expect(isValidPassword).toBe(true);
  });
});
