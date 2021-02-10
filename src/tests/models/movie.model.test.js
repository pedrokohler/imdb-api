import Movie from "../../models/movie.model";
import {
  createMoviePayload,
  defaultTitle,
  defaultDescription,
  defaultDirector,
  defaultGenders,
  defaultActors,
} from "../helpers/movie.payload.factory";

describe("MOVIE MODEL", () => {
  it("Should create a correct document", () => {
    const movie = new Movie(createMoviePayload());

    expect(movie).toHaveProperty("title", defaultTitle);
    expect(movie).toHaveProperty("description", defaultDescription);
    expect(movie).toHaveProperty("director", defaultDirector);
    expect(movie).toHaveProperty(
      "genders",
      expect.arrayContaining(defaultGenders)
    );
    expect(movie).toHaveProperty(
      "actors",
      expect.arrayContaining(defaultActors)
    );
  });
});
