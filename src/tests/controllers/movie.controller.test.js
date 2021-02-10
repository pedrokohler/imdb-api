import MovieService from "../../services/movie.service";
import dbHandler from "../test-helpers/db.handler";
import messageCodeMap from "../../controllers/utils/message.codes";
import { createMoviePayload } from "../test-helpers/movie.payload.factory";
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

describe("MOVIE CONTROLLER", () => {
  describe("CREATE MOVIE", () => {
    it("Should call MovieService.create once if it is a valid movie", async () => {
      const spy = jest.spyOn(MovieService, "create");
      const body = createMoviePayload();
      await RequestBuilderInstance.newRequest()
        .post("/movie")
        .send(body)
        .build();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(body);
    });

    it("Should return the json data of the created movie with status 200", async () => {
      const body = createMoviePayload();
      const result = await RequestBuilderInstance.newRequest()
        .post("/movie")
        .send(body)
        .build();
      expect(result.status).toBe(200);
      expect(result.body).toEqual(expect.objectContaining(body));
      expect(result.body).toHaveProperty("id");
    });

    it("Should return a 400 status code if the request body is incomplete", async () => {
      await RequestBuilderInstance.newRequest()
        .post("/movie")
        .send(createMoviePayload())
        .build();
      const result = await RequestBuilderInstance.newRequest()
        .post("/movie")
        .send({ title: "Movie" })
        .build();
      expect(result.status).toBe(400);
      expect(result.body).toEqual(messageCodeMap.get(400));
    });
  });

  describe("REVIEW MOVIE", () => {
    it("Should call ReviewService.create once if it is a valid request", async () => {
      // const spy = jest.spyOn(MovieService, "create");

      const body = createMoviePayload();
      await RequestBuilderInstance.newRequest()
        .post("/movie")
        .send(body)
        .build();

      const result = await RequestBuilderInstance.newRequest()
        .post("/movie/id/review")
        .withValidRegularUserToken()
        .send()
        .build();

      expect(result.status).toBe(200);
      // expect(result.body).toEqual(messageCodeMap.get(401));
    });
    it("Should not allow admin users to create reviews", async () => {
      const result = await RequestBuilderInstance.newRequest()
        .post("/movie/id/review")
        .withValidAdminToken()
        .build();
      expect(result.status).toBe(401);
      expect(result.body).toEqual(messageCodeMap.get(401));
    });
  });

  // describe("GET MOVIE", () => {});

  // describe("GET MOVIE LIST", () => {});
});
