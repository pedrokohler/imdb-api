import { Types } from "mongoose";

export const defaultReviewedItemId = Types.ObjectId();
export const defaultReviewerId = Types.ObjectId();
export const defaultRating = 3;

export const createReviewPayload = (customizedPayload) => ({
  reviewedItemId: defaultReviewedItemId,
  reviewerId: defaultReviewerId,
  rating: defaultRating,
  ...customizedPayload,
});

export const generateRandomId = () => Types.ObjectId();
