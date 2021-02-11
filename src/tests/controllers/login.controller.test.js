import messageCodeMap from "../../controllers/utils/message.codes";
import tokenHandler from "../../controllers/utils/token.handler";
import dbHandler from "../test-helpers/db.handler";
import RequestBuilder from "../test-helpers/request.builder";
import { createUserPayload } from "../test-helpers/user.payload.factory";

beforeAll(async () => {
  await dbHandler.connect();
});
afterEach(async () => {
  await dbHandler.clearDatabase();
});
afterAll(async () => {
  await dbHandler.closeDatabase();
});

const RequestBuilderInstance = new RequestBuilder();

const post = (path) => RequestBuilderInstance.newRequest().post(path);

describe("LOGIN CONTROLLER", () => {
  let user;
  let userPayload;
  beforeEach(async () => {
    userPayload = createUserPayload();
    const result = await post("/users").send(userPayload).build();
    user = result.body;
  });

  it("Should call tokenHandler.createToken to find the user if request is valid", async () => {
    const spy = jest.spyOn(tokenHandler, "createToken");
    const body = {
      email: user.email,
      password: userPayload.password,
    };
    await post("/login").send(body).build();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        ...user,
      })
    );
  });

  it("Should send the token when the login is successful", async () => {
    const body = {
      email: user.email,
      password: userPayload.password,
    };
    const result = await post("/login").send(body).build();
    expect(result.body).toHaveProperty("token");
    expect(result.status).toBe(200);
  });

  it("Should send a 404 error when user email is not found", async () => {
    const body = {
      email: "unexisting@email.com",
      password: userPayload.password,
    };
    const result = await post("/login").send(body).build();
    expect(result.status).toBe(404);
    expect(result.body).toEqual(messageCodeMap.get(404));
  });

  it("Should send a 401 error when user passowrd is incorrect", async () => {
    const body = {
      email: user.email,
      password: "wrong password",
    };
    const result = await post("/login").send(body).build();
    expect(result.status).toBe(401);
    expect(result.body).toEqual(messageCodeMap.get(401));
  });
});
