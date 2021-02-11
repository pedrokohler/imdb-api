import { Router } from "express";
import MovieService from "../services/movie.service";
import ReviewService from "../services/review.service";
import { createLogicalAndFilter } from "./utils/filter.factory";
import messageCodeMap from "./utils/message.codes";
import safeExecute from "./utils/safe.execute";
import tokenHandler from "./utils/token.handler";

const MovieController = Router();

const getIsAdmin = async (req) => {
  const authorization = req.header("Authorization");
  const decoded = await tokenHandler.verifyToken(authorization);
  const { isAdmin } = decoded;
  return isAdmin;
};

const getUserId = async (req) => {
  const authorization = req.header("Authorization");
  const decoded = await tokenHandler.verifyToken(authorization);
  const { userId } = decoded;
  return userId;
};

const isDuplicateReview = async (reviewerId, reviewedItemId) => {
  const list = await ReviewService.list({
    $and: [{ reviewerId }, { reviewedItemId }],
  });
  return list.length > 0;
};

const checkReviewedItemExists = async (reviewedItemId) => {
  const item = await MovieService.find(reviewedItemId);
  return item;
};

const getRating = async (reviewedItemId) => {
  const reviews = await ReviewService.list({ reviewedItemId });
  if (reviews.length) {
    const accumulatedRating = reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    return Number(
      Number.parseFloat(accumulatedRating / reviews.length).toFixed(2)
    );
  }
  return 0;
};

MovieController.post(
  "/",
  safeExecute(async (req, res) => {
    const requiredFields = ["title", "director", "description"];
    const isMissingRequiredField = requiredFields.some(
      (field) => !Object.keys(req.body).includes(field)
    );

    if (isMissingRequiredField) {
      return res.status(400).send(messageCodeMap.get(400));
    }

    const isAdmin = await getIsAdmin(req);
    if (!isAdmin) {
      return res.status(401).json(messageCodeMap.get(401));
    }

    const movie = await MovieService.create(req.body);
    const { _id: id, ...response } = movie.toJSON();
    return res.status(200).send({ id, ...response });
  })
);

MovieController.post(
  "/:id/review",
  safeExecute(async (req, res) => {
    const { id: reviewedItemId } = req.params;
    const reviewerId = await getUserId(req);
    const { rating } = req.body;

    const isAdmin = await getIsAdmin(req);
    if (isAdmin) {
      return res.status(401).json(messageCodeMap.get(401));
    }

    const reviewedItemExists = await checkReviewedItemExists(reviewedItemId);
    if (!reviewedItemExists) {
      return res.status(404).json(messageCodeMap.get(404));
    }

    const reviewAlreadyExists = await isDuplicateReview(
      reviewerId,
      reviewedItemId
    );
    if (reviewAlreadyExists) {
      return res.status(409).json(messageCodeMap.get(409));
    }

    const review = await ReviewService.create({
      reviewedItemId,
      reviewerId,
      rating,
    });
    const { _id: id, ...result } = review.toJSON();
    return res.status(200).json({ id, ...result });
  })
);

MovieController.get(
  "/",
  safeExecute(async (req, res) => {
    const { query } = req;
    const filter = createLogicalAndFilter(query);
    const list = await MovieService.list(filter);
    return res.status(200).json(list);
  })
);

MovieController.get(
  "/:id",
  safeExecute(async (req, res) => {
    const { id } = req.params;
    const movie = await MovieService.find(id);

    if (!movie) {
      return res.status(404).json(messageCodeMap.get(404));
    }

    const rating = await getRating(id);
    const { _id, ...result } = movie.toJSON();
    return res.status(200).json({ id: _id, ...result, rating });
  })
);

export default MovieController;
