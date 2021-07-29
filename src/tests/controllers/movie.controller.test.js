import MovieRepository from "../../repositories/movie.repository";
import dbHandler from "../test-helpers/db.handler";
import messageCodeMap from "../../controllers/common/message.codes";
import { createMoviePayload } from "../test-helpers/movie.payload.factory";
import RequestBuilder from "../test-helpers/request.builder";
import {
  createReviewPayload,
  generateRandomId,
} from "../test-helpers/review.payload.factory";
import ReviewRepository from "../../repositories/review.repository";
import { createLogicalAndFilter } from "../../controllers/common/filter.factory";

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
    it("Should call MovieRepository.create once if it is a valid movie", async () => {
      const spy = jest.spyOn(MovieRepository, "create");
      const body = createMoviePayload();
      await post("/movies")
        .withValidAdminToken()
        .then((self) => self.send(body).build());
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(body);
    });

    it("Should return the json data of the created movie with status 200", async () => {
      const body = createMoviePayload();
      const result = await post("/movies")
        .withValidAdminToken()
        .then((self) => self.send(body).build());
      expect(result.status).toBe(200);
      expect(result.body).toEqual(expect.objectContaining(body));
      expect(result.body).toHaveProperty("id");
    });

    it("Should return a 400 status code if the request body is incomplete", async () => {
      const result = await post("/movies")
        .withValidAdminToken()
        .then((self) => self.send({ title: "Movie" }).build());
      expect(result.status).toBe(400);
      expect(result.body).toEqual(messageCodeMap.get(400));
    });

    it("Should return a 401 status code if user is not authenticated or is not admin", async () => {
      const resultWithoutAdmin = await post("/movies")
        .withValidRegularUserToken()
        .then((self) => self.send(createMoviePayload()).build());
      expect(resultWithoutAdmin.status).toBe(401);
      expect(resultWithoutAdmin.body).toEqual(messageCodeMap.get(401));

      const resultWithoutAuthentication = await post("/movies")
        .send(createMoviePayload())
        .build();
      expect(resultWithoutAuthentication.body).toEqual(messageCodeMap.get(401));
      expect(resultWithoutAuthentication.status).toBe(401);
    });
  });

  describe("REVIEW MOVIE", () => {
    let body;

    beforeEach(async () => {
      const { body: movie } = await post("/movies")
        .withValidAdminToken()
        .then((self) => self.send(createMoviePayload()).build());
      body = createReviewPayload({ reviewedItemId: movie.id });
    });

    it("Should call ReviewRepository.create once if it is a valid request", async () => {
      const spy = jest.spyOn(ReviewRepository, "create");

      await post(`/movies/${body.reviewedItemId}/review`)
        .withValidRegularUserToken(body.reviewerId)
        .then((self) => self.send({ rating: body.rating }).build());

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        ...body,
        reviewedItemId: body.reviewedItemId.toString(),
        reviewerId: body.reviewerId.toString(),
      });
    });

    it("Should return the json data of the created review with status 200", async () => {
      const result = await post(`/movies/${body.reviewedItemId}/review`)
        .withValidRegularUserToken(body.reviewerId)
        .then((self) => self.send({ rating: body.rating }).build());

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
      await post(`/movies/${body.reviewedItemId}/review`)
        .withValidRegularUserToken(body.reviewerId)
        .then((self) => self.send({ rating: body.rating }).build());
      const result = await post(`/movies/${body.reviewedItemId}/review`)
        .withValidRegularUserToken(body.reviewerId)
        .then((self) => self.send({ rating: body.rating }).build());

      expect(result.status).toBe(409);
      expect(result.body).toEqual(messageCodeMap.get(409));
    });

    it("Should not allow to create a review if the movie does't exist", async () => {
      const noMovieBody = createReviewPayload();
      const result = await post(`/movies/${noMovieBody.reviewedItemId}/review`)
        .withValidRegularUserToken(noMovieBody.reviewerId)
        .then((self) => self.send({ rating: noMovieBody.rating }).build());

      expect(result.status).toBe(404);
      expect(result.body).toEqual(messageCodeMap.get(404));
    });

    it("Should not allow admin users to create reviews", async () => {
      const result = await post(`/movies/${body.reviewedItemId}/review`)
        .withValidAdminToken(body.reviewerId)
        .then((self) => self.build());
      expect(result.status).toBe(401);
      expect(result.body).toEqual(messageCodeMap.get(401));
    });
  });

  describe("GET MOVIE LIST", () => {
    const director = "tarantino";
    const genders = "action";
    const query = { director, genders };
    const searchParams = new URLSearchParams(query);

    it("Should call MovieRepository.list once if it is a valid request", async () => {
      const spy = jest.spyOn(MovieRepository, "list");

      await get(`/movies?${searchParams.toString()}`).build();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(createLogicalAndFilter(query));
    });

    it("Should return the json data of the list with status 200", async () => {
      await post("/movies")
        .withValidAdminToken()
        .then((self) =>
          self.send(createMoviePayload({ director, genders })).build()
        );
      await post("/movies")
        .withValidAdminToken()
        .then((self) => self.send(createMoviePayload({ director })).build());
      await post("/movies")
        .withValidAdminToken()
        .then((self) => self.send(createMoviePayload({ genders })).build());
      await post("/movies")
        .withValidAdminToken()
        .then((self) =>
          self.send(createMoviePayload({ director, genders })).build()
        );
      await post("/movies")
        .withValidAdminToken()
        .then((self) => self.send(createMoviePayload()).build());

      const result = await get(`/movies?${searchParams.toString()}`).build();
      expect(result.body).toHaveLength(2);

      const noFilterResult = await get(`/movies`).build();
      expect(noFilterResult.body).toHaveLength(5);
    });
  });

  describe("GET MOVIE", () => {
    const body = createMoviePayload();
    let movie;
    beforeEach(async () => {
      const result = await post("/movies")
        .withValidAdminToken()
        .then((self) => self.send(body).build());
      movie = result.body;
    });
    it("Should call MovieRepository.get once", async () => {
      const spy = jest.spyOn(MovieRepository, "find");
      const id = "id";

      await get(`/movies/${id}`).build();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(id);
    });

    it("Should return the json data of the movie with status 200", async () => {
      const result = await get(`/movies/${movie.id}`).build();
      expect(result.status).toBe(200);
      expect(result.body).toEqual(expect.objectContaining(body));
      expect(result.body).toHaveProperty("id");
    });

    it("Should include the review rating average", async () => {
      const reviewPayload1 = createReviewPayload({
        reviewedItemId: movie.id,
      });
      await post(`/movies/${reviewPayload1.reviewedItemId}/review`)
        .withValidRegularUserToken(reviewPayload1.reviewerId)
        .then((self) => self.send({ rating: 3 }).build());

      const reviewPayload2 = createReviewPayload({
        reviewedItemId: movie.id,
      });
      await post(`/movies/${reviewPayload2.reviewedItemId}/review`)
        .withValidRegularUserToken(generateRandomId())
        .then((self) => self.send({ rating: 2 }).build());

      const result = await get(`/movies/${movie.id}`).build();
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("rating", 2.5);
    });

    it("Should return 404 status if movie is not found", async () => {
      const result = await get(`/movies/${generateRandomId()}`).build();
      expect(result.body).toEqual(messageCodeMap.get(404));
      expect(result.status).toBe(404);
    });
  });
});
