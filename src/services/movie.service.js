import DbServiceAdapter from "./utils/db.service.adapter";
import Movie from "../models/movie.model";

const MovieService = new DbServiceAdapter(Movie);

export default MovieService;
