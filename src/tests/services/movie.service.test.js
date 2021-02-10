import dbHandler from "../test-helpers/db.handler";
import MovieService from "../../services/movie.service";
import { createMoviePayload } from "../test-helpers/movie.payload.factory";

beforeAll(async () => {
  await dbHandler.connect();
});
afterEach(async () => {
  await dbHandler.clearDatabase();
});
afterAll(async () => {
  await dbHandler.closeDatabase();
});

const addMovie = async (customizedPayload) => {
  await MovieService.create(createMoviePayload(customizedPayload));
};

describe("MOVIE SERVICE", () => {
  it("Should save a movie in the database without errors", async () => {
    try {
      await addMovie({});
      expect(true).toBe(true);
    } catch {
      expect(true).toBe(false);
    }
  });

  it("Should list all movies in the database", async () => {
    await addMovie({});
    await addMovie({});
    await addMovie({});
    const movies = await MovieService.list({});
    expect(movies).toHaveLength(3);
  });

  it("Should list all movies in the database based on a filter", async () => {
    await addMovie({});
    await addMovie({ title: "filtered" });
    const filteredMovies = await MovieService.list({ title: "filtered" });
    expect(filteredMovies).toHaveLength(1);
  });
});
