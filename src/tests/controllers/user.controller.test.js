import request from "supertest";
import UserService from "../../services/user.service";
import dbHandler from "../db.handler";
import app from "../../app";
import messageCodeMap from "../../controllers/utils/message.codes";

beforeAll(async () => {
  await dbHandler.connect();
});
afterEach(async () => {
  await dbHandler.clearDatabase();
});
afterAll(async () => {
  await dbHandler.closeDatabase();
});

const defaultName = "My user";
const defaultEmail = "my@email.com";
const defaultPassword = "My plain text password";
const defaultIsAdmin = false;

const createRequestBody = () => ({
  name: defaultName,
  email: defaultEmail,
  password: defaultPassword,
  isAdmin: defaultIsAdmin,
});

const createResponseBody = () => ({
  name: defaultName,
  email: defaultEmail,
  isActive: true,
});

describe("USER CONTROLLER", () => {
  describe("CREATE USER", () => {
    it("Should call UserService.create once if it is a valid user", async () => {
      const spy = jest.spyOn(UserService, "create");
      const body = createRequestBody();
      await request(app).post("/user").send(body);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(body);
    });

    it("Should return the json data (no password) of the created user with status 200", async () => {
      const result = await request(app).post("/user").send(createRequestBody());
      expect(result.status).toBe(200);
      expect(result.body).toEqual(
        expect.objectContaining(createResponseBody())
      );
      expect(result.body).not.toHaveProperty("password");
      expect(result.body).toHaveProperty("id");
    });

    it("Should return a 409 status code if the user already exists", async () => {
      await request(app).post("/user").send(createRequestBody());
      const result = await request(app).post("/user").send(createRequestBody());
      expect(result.status).toBe(409);
      expect(result.body).toEqual(messageCodeMap.get(409));
    });

    it("Should return a 400 status code if the request body is incomplete", async () => {
      await request(app).post("/user").send(createRequestBody());
      const result = await request(app).post("/user").send({ name: "Pedro" });
      expect(result.status).toBe(400);
      expect(result.body).toEqual(messageCodeMap.get(400));
    });
  });

  describe("UPDATE USER", () => {
    it("Should call UserService.update once if it is a valid user", async () => {
      const spy = jest.spyOn(UserService, "update");
      const {
        body: { id },
      } = await request(app).post("/user").send(createRequestBody());
      const body = { name: "Pedro" };
      await request(app).patch(`/user/${id}`).send(body);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(id, body);
    });

    it("Should return the json data (no password) of the updated user with status 200", async () => {
      const {
        body: { id },
      } = await request(app).post("/user").send(createRequestBody());
      const body = { name: "Pedro" };
      const result = await request(app).patch(`/user/${id}`).send(body);
      expect(result.status).toBe(200);
      expect(result.body).toEqual(
        expect.objectContaining({ ...createResponseBody(), ...body })
      );
      expect(result.body).not.toHaveProperty("password");
      expect(result.body).toHaveProperty("id");
    });

    it("Should return 409 status if new email already exists", async () => {
      const {
        body: { id },
      } = await request(app).post("/user").send(createRequestBody());
      const body = { email: "myOther@email.com" };
      await request(app)
        .post("/user")
        .send({ ...createRequestBody(), ...body });
      const result = await request(app).patch(`/user/${id}`).send(body);
      expect(result.status).toBe(409);
      expect(result.body).toEqual(messageCodeMap.get(409));
    });

    it("Should return 400 status if tries to update unupdatable field", async () => {
      const {
        body: { id },
      } = await request(app).post("/user").send(createRequestBody());
      const body = { isActive: false };
      const result = await request(app).patch(`/user/${id}`).send(body);
      expect(result.status).toBe(400);
      expect(result.body).toEqual(messageCodeMap.get(400));
    });

    it("Should return 404 status if user is not found", async () => {
      const body = { name: "Pedro" };
      const result = await request(app).patch(`/user/fakeId`).send(body);
      expect(result.status).toBe(404);
      expect(result.body).toEqual(messageCodeMap.get(404));
    });
  });

  describe("DELETE USER", () => {
    it("Should delete an existing user", async () => {
      const {
        body: { id },
      } = await request(app).post("/user").send(createRequestBody());
      const result = await request(app).delete(`/user/${id}`);
      expect(result.status).toBe(200);
      expect(result.body).toEqual(messageCodeMap.get(200));
    });

    it("Should return 404 status if user is not found", async () => {
      const result = await request(app).delete(`/user/fakeId`);
      expect(result.status).toBe(404);
      expect(result.body).toEqual(messageCodeMap.get(404));
    });
  });
});
