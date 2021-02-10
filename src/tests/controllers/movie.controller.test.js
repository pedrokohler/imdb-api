import request from "supertest";
import app from "../../app";
import MovieService from "../../services/movie.service";
import dbHandler from "../test-helpers/db.handler";
import messageCodeMap from "../../controllers/utils/message.codes";
import { createMoviePayload } from "../test-helpers/movie.payload.factory";
import {
  createValidAdminToken,
  createValidRegularUserToken,
} from "../test-helpers/token.factory";

beforeAll(async () => {
  await dbHandler.connect();
});
afterEach(async () => {
  await dbHandler.clearDatabase();
});
afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("MOVIE CONTROLLER", () => {
  describe("CREATE MOVIE", () => {
    it("Should call MovieService.create once if it is a valid movie", async () => {
      const spy = jest.spyOn(MovieService, "create");
      const body = createMoviePayload();
      await request(app).post("/movie").send(body);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(body);
    });

    it("Should return the json data of the created movie with status 200", async () => {
      const body = createMoviePayload();
      const result = await request(app).post("/movie").send(body);
      expect(result.status).toBe(200);
      expect(result.body).toEqual(expect.objectContaining(body));
      expect(result.body).toHaveProperty("id");
    });

    it("Should return a 400 status code if the request body is incomplete", async () => {
      await request(app).post("/movie").send(createMoviePayload());
      const result = await request(app).post("/movie").send({ title: "Movie" });
      expect(result.status).toBe(400);
      expect(result.body).toEqual(messageCodeMap.get(400));
    });
  });

  // describe("REVIEW MOVIE", () => {});

  // describe("GET MOVIE", () => {});

  // describe("GET MOVIE LIST", () => {});
});
