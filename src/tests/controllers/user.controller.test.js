import UserService from "../../services/user.service";
import dbHandler from "../test-helpers/db.handler";
import messageCodeMap from "../../controllers/utils/message.codes";
import {
  createUserPayload,
  createUserPayloadWithoutPassword,
} from "../test-helpers/user.payload.factory";
import RequestBuilder from "../test-helpers/request.builder";

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
const patch = (path) => RequestBuilderInstance.newRequest().patch(path);
const deletion = (path) => RequestBuilderInstance.newRequest().delete(path);

describe("USER CONTROLLER", () => {
  describe("CREATE USER", () => {
    it("Should call UserService.create once if it is a valid user", async () => {
      const spy = jest.spyOn(UserService, "create");
      const body = createUserPayload();
      await post("/users").send(body).build();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(body);
    });

    it("Should return the json data (no password) of the created user with status 200", async () => {
      const result = await post("/users").send(createUserPayload()).build();
      expect(result.status).toBe(200);
      expect(result.body).toEqual(
        expect.objectContaining(createUserPayloadWithoutPassword())
      );
      expect(result.body).not.toHaveProperty("password");
      expect(result.body).toHaveProperty("id");
    });

    it("Should return a 409 status code if the user already exists", async () => {
      await post("/users").send(createUserPayload()).build();
      const result = await post("/users").send(createUserPayload()).build();
      expect(result.status).toBe(409);
      expect(result.body).toEqual(messageCodeMap.get(409));
    });

    it("Should return a 400 status code if the request body is incomplete", async () => {
      await post("/users").send(createUserPayload()).build();
      const result = await post("/users").send({ name: "Pedro" }).build();
      expect(result.status).toBe(400);
      expect(result.body).toEqual(messageCodeMap.get(400));
    });
  });

  describe("UPDATE USER", () => {
    it("Should call UserService.update once if it is a valid user", async () => {
      const spy = jest.spyOn(UserService, "update");
      const {
        body: { id },
      } = await post("/users").send(createUserPayload()).build();
      const body = { name: "Pedro" };
      await patch(`/users/${id}`).send(body).build();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(id, body);
    });

    it("Should return the json data (no password) of the updated user with status 200", async () => {
      const {
        body: { id },
      } = await post("/users").send(createUserPayload()).build();
      const body = { name: "Pedro" };
      const result = await patch(`/users/${id}`).send(body).build();
      expect(result.status).toBe(200);
      expect(result.body).toEqual(
        expect.objectContaining({
          ...createUserPayloadWithoutPassword(),
          ...body,
        })
      );
      expect(result.body).not.toHaveProperty("password");
      expect(result.body).toHaveProperty("id");
    });

    it("Should return 409 status if new email already exists", async () => {
      const {
        body: { id },
      } = await post("/users").send(createUserPayload()).build();
      const body = { email: "myOther@email.com" };
      await post("/users")
        .send({ ...createUserPayload(), ...body })
        .build();
      const result = await patch(`/users/${id}`).send(body).build();
      expect(result.status).toBe(409);
      expect(result.body).toEqual(messageCodeMap.get(409));
    });

    it("Should return 400 status if tries to update unupdatable field", async () => {
      const {
        body: { id },
      } = await post("/users").send(createUserPayload()).build();
      const body = { isActive: false };
      const result = await patch(`/users/${id}`).send(body).build();
      expect(result.status).toBe(400);
      expect(result.body).toEqual(messageCodeMap.get(400));
    });

    it("Should return 404 status if user is not found", async () => {
      const body = { name: "Pedro" };
      const result = await patch(`/users/fakeId`).send(body).build();
      expect(result.status).toBe(404);
      expect(result.body).toEqual(messageCodeMap.get(404));
    });
  });

  describe("DELETE USER", () => {
    it("Should delete an existing user", async () => {
      const {
        body: { id },
      } = await post("/users").send(createUserPayload()).build();
      const result = await deletion(`/users/${id}`).build();
      expect(result.status).toBe(200);
      expect(result.body).toEqual(messageCodeMap.get(200));
    });

    it("Should return 404 status if user is not found", async () => {
      const result = await deletion(`/users/fakeId`).build();
      expect(result.status).toBe(404);
      expect(result.body).toEqual(messageCodeMap.get(404));
    });
  });
});
