import { Router } from "express";
import MovieService from "../services/movie.service";
import messageCodeMap from "./utils/message.codes";
import safeExecute from "./utils/safe.execute";

const MovieController = Router();

MovieController.post(
  "/",
  safeExecute(async (req, res) => {
    const movie = await MovieService.create(req.body);
    return res.status(200).send(movie);
  })
);

MovieController.get(
  "/:id",
  safeExecute(async (req, res) => {
    const { director } = req.query;
    return res.send(director);
  })
);

MovieController.get(
  "/search",
  safeExecute(async (req, res) => {
    const { director } = req.query;
    return res.send(director);
  })
);

MovieController.post(
  "/:id/review",
  safeExecute(async (req, res) => {
    const { id } = req.params;
    return res.send(id);
  })
);

export default MovieController;
