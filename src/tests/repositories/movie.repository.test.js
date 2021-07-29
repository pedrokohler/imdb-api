import dbHandler from "../test-helpers/db.handler";
import MovieRepository from "../../repositories/movie.repository";
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
  await MovieRepository.create(createMoviePayload(customizedPayload));
};

describe("MOVIE REPOSITORY", () => {
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
    const movies = await MovieRepository.list({});
    expect(movies).toHaveLength(3);
  });

  it("Should list all movies in the database based on a filter", async () => {
    await addMovie({});
    await addMovie({ title: "filtered" });
    const filteredMovies = await MovieRepository.list({ title: "filtered" });
    expect(filteredMovies).toHaveLength(1);
  });
});
