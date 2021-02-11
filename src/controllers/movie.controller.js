import { Router } from "express";
import MovieService from "../services/movie.service";
import ReviewService from "../services/review.service";
import { createAndFilter } from "./utils/filter.factory";
import messageCodeMap from "./utils/message.codes";
import safeExecute from "./utils/safe.execute";

const MovieController = Router();

const isAdmin = (req) => {
  // @todo: implement to get this information from JWT token
  const token = req.header("Authorization");
  const parsedToken = JSON.parse(token);
  return parsedToken.isAdmin;
};

const getUserId = (req) => {
  // @todo: implement to get ID from JWT token
  const token = req.header("Authorization");
  const { userId } = JSON.parse(token);
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

    const movie = await MovieService.create(req.body);
    const { _id: id, ...response } = movie.toJSON();
    return res.status(200).send({ id, ...response });
  })
);

MovieController.post(
  "/:id/review",
  safeExecute(async (req, res) => {
    const { id: reviewedItemId } = req.params;
    const reviewerId = getUserId(req);
    const { rating } = req.body;

    if (isAdmin(req)) {
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
  "/search",
  safeExecute(async (req, res) => {
    const { query } = req;
    const filter = createAndFilter(query);
    const list = await MovieService.list(filter);
    return res.status(200).json(list);
  })
);

MovieController.get(
  "/:id",
  safeExecute(async (req, res) => {
    const { director } = req.query;
    return res.send(director);
  })
);

export default MovieController;
