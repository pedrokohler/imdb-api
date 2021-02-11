import MovieService from "../../services/movie.service";
import dbHandler from "../test-helpers/db.handler";
import messageCodeMap from "../../controllers/utils/message.codes";
import { createMoviePayload } from "../test-helpers/movie.payload.factory";
import RequestBuilder from "../test-helpers/request.builder";
import {
  createReviewPayload,
  generateRandomId,
} from "../test-helpers/review.payload.factory";
import ReviewService from "../../services/review.service";

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
// const get = (path) => RequestBuilderInstance.newRequest().get(path);

describe("MOVIE CONTROLLER", () => {
  describe("CREATE MOVIE", () => {
    it("Should call MovieService.create once if it is a valid movie", async () => {
      const spy = jest.spyOn(MovieService, "create");
      const body = createMoviePayload();
      await post("/movie").send(body).build();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(body);
    });

    it("Should return the json data of the created movie with status 200", async () => {
      const body = createMoviePayload();
      const result = await post("/movie").send(body).build();
      expect(result.status).toBe(200);
      expect(result.body).toEqual(expect.objectContaining(body));
      expect(result.body).toHaveProperty("id");
    });

    it("Should return a 400 status code if the request body is incomplete", async () => {
      await post("/movie").send(createMoviePayload()).build();
      const result = await post("/movie").send({ title: "Movie" }).build();
      expect(result.status).toBe(400);
      expect(result.body).toEqual(messageCodeMap.get(400));
    });
  });

  describe("REVIEW MOVIE", () => {
    it("Should call ReviewService.create once if it is a valid request", async () => {
      const spy = jest.spyOn(ReviewService, "create");
      const body = createReviewPayload();

      await post(`/movie/${body.reviewedItemId}/review`)
        .withValidRegularUserToken(body.reviewerId)
        .send({ rating: body.rating })
        .build();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        ...body,
        reviewedItemId: body.reviewedItemId.toString(),
        reviewerId: body.reviewerId.toString(),
      });
    });

    it("Should return the json data of the created movie with status 200", async () => {
      const body = createReviewPayload();

      const result = await post(`/movie/${body.reviewedItemId}/review`)
        .withValidRegularUserToken(body.reviewerId)
        .send({ rating: body.rating })
        .build();

      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty(
        "reviewedItemId",
        body.reviewedItemId.toString()
      );
      expect(result.body).toHaveProperty(
        "reviewerId",
        body.reviewerId.toString()
      );
      expect(result.body).toHaveProperty("rating", body.rating);
      expect(result.body).toHaveProperty("id");
    });

    it("Should not allow to create a (reviewerId, reviewedItemId) pair duplicate", async () => {
      const body = createReviewPayload();

      await post(`/movie/${body.reviewedItemId}/review`)
        .withValidRegularUserToken(body.reviewerId)
        .send({ rating: body.rating })
        .build();
      const result = await post(`/movie/${body.reviewedItemId}/review`)
        .withValidRegularUserToken(body.reviewerId)
        .send({ rating: body.rating })
        .build();

      expect(result.status).toBe(409);
      expect(result.body).toEqual(messageCodeMap.get(409));
    });

    it("Should not allow admin users to create reviews", async () => {
      const result = await post("/movie/id/review")
        .withValidAdminToken(generateRandomId())
        .build();
      expect(result.status).toBe(401);
      expect(result.body).toEqual(messageCodeMap.get(401));
    });
  });

  // describe("GET MOVIE", () => {});

  // describe("GET MOVIE LIST", () => {});
});
