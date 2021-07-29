import { Router } from "express";
import { getIsAdmin, getUserId } from "../services/auth.service";
import {
  createMovie,
  createReview,
  getMovie,
  getMovieList,
  validateCreateMoviePayload,
} from "../services/movie.service";
import messageCodeMap from "./common/message.codes";
import { createErrorResponse } from "./common/response.factory";
import safeExecute from "./common/safe.execute";

const MovieController = Router();

MovieController.post(
  "/",
  safeExecute(async (req, res) => {
    const { error: validationError } = validateCreateMoviePayload(req.body);
    if (validationError) {
      return createErrorResponse(res, validationError);
    }

    // @todo: create guard middleware
    const isAdmin = await getIsAdmin(req);
    if (!isAdmin) {
      return res.status(401).json(messageCodeMap.get(401));
    }

    const movie = await createMovie(req.body);
    return res.status(200).send(movie);
  })
);

MovieController.post(
  "/:id/review",
  safeExecute(async (req, res) => {
    const { id: reviewedItemId } = req.params;
    const { rating } = req.body;

    // @todo: create middleware to extract user id
    const reviewerId = await getUserId(req);

    // @todo: create guard middleware
    const isAdmin = await getIsAdmin(req);
    if (isAdmin || !reviewerId) {
      return res.status(401).json(messageCodeMap.get(401));
    }

    const review = await createReview({
      reviewerId,
      reviewedItemId,
      rating,
    });

    if (review.error) {
      return createErrorResponse(res, review.error);
    }

    return res.status(200).json(review);
  })
);

MovieController.get(
  "/",
  safeExecute(async (req, res) => {
    const { query } = req;
    const list = await getMovieList(query);
    return res.status(200).json(list);
  })
);

MovieController.get(
  "/:id",
  safeExecute(async (req, res) => {
    const { id } = req.params;
    const movie = await getMovie(id);

    if (movie.error) {
      return createErrorResponse(res, movie.error);
    }

    return res.status(200).json(movie);
  })
);

export default MovieController;
