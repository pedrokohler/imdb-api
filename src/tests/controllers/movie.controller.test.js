import MovieService from "../../services/movie.service";
import dbHandler from "../test-helpers/db.handler";
import messageCodeMap from "../../controllers/utils/message.codes";
import { createMoviePayload } from "../test-helpers/movie.payload.factory";
import RequestBuilder from "../test-helpers/request.builder";
import { createReviewPayload } from "../test-helpers/review.payload.factory";
import ReviewService from "../../services/review.service";
import { createAndFilter } from "../../controllers/utils/filter.factory";

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
const get = (path) => RequestBuilderInstance.newRequest().get(path);

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
    let body;

    beforeEach(async () => {
      const { body: movie } = await post("/movie")
        .send(createMoviePayload())
        .build();
      body = createReviewPayload({ reviewedItemId: movie.id });
    });

    it("Should call ReviewService.create once if it is a valid request", async () => {
      const spy = jest.spyOn(ReviewService, "create");

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

    it("Should return the json data of the created review with status 200", async () => {
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

    it("Should not allow to create two reviews with same (reviewerId, reviewedItemId) pair", async () => {
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

    it("Should not allow to create a review if the movie does't exist", async () => {
      const noMovieBody = createReviewPayload();
      const result = await post(`/movie/${noMovieBody.reviewedItemId}/review`)
        .withValidRegularUserToken(noMovieBody.reviewerId)
        .send({ rating: noMovieBody.rating })
        .build();

      expect(result.status).toBe(404);
      expect(result.body).toEqual(messageCodeMap.get(404));
    });

    it("Should not allow admin users to create reviews", async () => {
      const result = await post(`/movie/${body.reviewedItemId}/review`)
        .withValidAdminToken(body.reviewerId)
        .build();
      expect(result.status).toBe(401);
      expect(result.body).toEqual(messageCodeMap.get(401));
    });
  });

  describe("GET MOVIE LIST", () => {
    const director = "tarantino";
    const genders = "action";
    const query = { director, genders };
    const searchParams = new URLSearchParams(query);

    it("Should call MovieService.list once if it is a valid request", async () => {
      const spy = jest.spyOn(MovieService, "list");

      await get(`/movie/search?${searchParams.toString()}`).build();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(createAndFilter(query));
    });

    it("Should return the json data of the list with status 200", async () => {
      await Promise.all([
        post("/movie").send(createMoviePayload({ director, genders })).build(),
        post("/movie").send(createMoviePayload({ director })).build(),
        post("/movie").send(createMoviePayload({ genders })).build(),
        post("/movie").send(createMoviePayload({ director, genders })).build(),
        post("/movie").send(createMoviePayload()).build(),
      ]);
      const result = await get(
        `/movie/search?${searchParams.toString()}`
      ).build();

      expect(result.body).toHaveLength(2);
    });
  });

  // describe("GET MOVIE", () => {});
});
