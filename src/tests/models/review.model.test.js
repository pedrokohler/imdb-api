import Review from "../../models/review.model";
import {
  defaultId,
  createReviewPayload,
} from "../helpers/review.payload.factory";

const createReview = (rating) => new Review(createReviewPayload({ rating }));

describe("REVIEW MODEL", () => {
  it("Should create a review", () => {
    const review = createReview(3);

    expect(review).toHaveProperty("reviewedItemId", defaultId);
    expect(review).toHaveProperty("reviewerId", defaultId);
    expect(review).toHaveProperty("rating", 3);
  });

  it("Should round the value of the rating to an integer", () => {
    const review = createReview(2.2);
    expect(review).toHaveProperty("rating", 2);
  });

  it("Should not be greater than 4", () => {
    const review = createReview(5);
    expect(review).toHaveProperty("rating", 4);
  });

  it("Should not be smaller than 0", () => {
    const review = createReview(-1);
    expect(review).toHaveProperty("rating", 0);
  });
});
