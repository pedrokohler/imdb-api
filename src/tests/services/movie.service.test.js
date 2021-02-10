import dbHandler from "../db.handler";
import MovieService from "../../services/movie.service";

beforeAll(async () => {
  await dbHandler.connect();
});
afterEach(async () => {
  await dbHandler.clearDatabase();
});
afterAll(async () => {
  await dbHandler.closeDatabase();
});

const title = "My movie";
const description = "My description";
const director = "My director";
const genders = ["My gender1", "My gender2"];
const actors = ["My actor1", "My actor2"];

const addMovie = async (customizedPayload) => {
  await MovieService.create({
    title,
    description,
    director,
    genders,
    actors,
    ...customizedPayload,
  });
};

describe("MOVIE MODEL", () => {
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
