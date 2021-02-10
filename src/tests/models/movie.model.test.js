import Movie from "../../models/movie.model";

describe("MOVIE MODEL", () => {
  it("Should create a correct document", () => {
    const title = "My movie";
    const description = "My description";
    const director = "My director";
    const genders = ["My gender1", "My gender2"];
    const actors = ["My actor1", "My actor2"];

    const movie = new Movie({
      title,
      description,
      director,
      genders,
      actors,
    });

    expect(movie).toHaveProperty("title", title);
    expect(movie).toHaveProperty("description", description);
    expect(movie).toHaveProperty("director", director);
    expect(movie).toHaveProperty("genders", expect.arrayContaining(genders));
    expect(movie).toHaveProperty("actors", expect.arrayContaining(actors));
  });
});
