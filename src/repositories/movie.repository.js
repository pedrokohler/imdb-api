import DbRepositoryAdapter from "./common/db.repository.adapter";
import Movie from "../models/movie.model";

const MovieRepository = new DbRepositoryAdapter(Movie);

export default MovieRepository;
