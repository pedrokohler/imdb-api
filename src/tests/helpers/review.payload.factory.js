import { Types } from "mongoose";

export const defaultId = Types.ObjectId();
export const defaultRating = 3;

export const createReviewPayload = (customizedPayload) => ({
  reviewedItemId: defaultId,
  reviewerId: defaultId,
  rating: defaultRating,
  ...customizedPayload,
});

export const generateRandomId = () => Types.ObjectId();
