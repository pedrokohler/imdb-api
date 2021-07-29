import MovieRepository from "../repositories/movie.repository";
import ReviewRepository from "../repositories/review.repository";
import { createLogicalAndFilter } from "./common/filter.factory";
import { validateIsMissingFields } from "./common/validation";

const isDuplicateReview = async (reviewerId, reviewedItemId) => {
  const list = await ReviewRepository.list({
    $and: [{ reviewerId }, { reviewedItemId }],
  });
  return list.length > 0;
};

const checkReviewedItemExists = async (reviewedItemId) => {
  const item = await MovieRepository.find(reviewedItemId);
  return item;
};

const getRating = async (reviewedItemId) => {
  const reviews = await ReviewRepository.list({ reviewedItemId });

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

export const validateCreateMoviePayload = validateIsMissingFields([
  "title",
  "director",
  "description",
]);

export const createMovie = async (moviePayload) => {
  const movie = await MovieRepository.create(moviePayload);
  const { _id: id, ...movieData } = movie.toJSON();
  return { id, ...movieData };
};

export const createReview = async ({ reviewerId, reviewedItemId, rating }) => {
  const reviewedItemExists = await checkReviewedItemExists(reviewedItemId);
  if (!reviewedItemExists) {
    return { error: 404 };
  }

  const reviewAlreadyExists = await isDuplicateReview(
    reviewerId,
    reviewedItemId
  );
  if (reviewAlreadyExists) {
    return { error: 409 };
  }

  const review = await ReviewRepository.create({
    reviewedItemId,
    reviewerId,
    rating,
  });
  const { _id: id, ...reviewData } = review.toJSON();
  return { id, ...reviewData };
};

export const getMovieList = async (query) => {
  const filter = createLogicalAndFilter(query);
  const list = await MovieRepository.list(filter);
  return list;
};

export const getMovie = async (id) => {
  const movie = await MovieRepository.find(id);

  if (!movie) {
    return { error: 404 };
  }

  const rating = await getRating(id);
  const { _id, ...movieData } = movie.toJSON();
  return { id: _id, ...movieData, rating };
};

export default {
  createMovie,
  createReview,
  getMovieList,
  getMovie,
};
