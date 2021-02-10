import { Types } from "mongoose";
import dbHandler from "../db.handler";
import ReviewService from "../../services/review.service";

beforeAll(async () => {
  await dbHandler.connect();
});
afterEach(async () => {
  await dbHandler.clearDatabase();
});
afterAll(async () => {
  await dbHandler.closeDatabase();
});

const defaultId = Types.ObjectId();
const defaultRating = 3;

const addReview = async (customizedPayload) => {
  await ReviewService.create({
    movieId: defaultId,
    userId: defaultId,
    rating: defaultRating,
    ...customizedPayload,
  });
};

describe("REVIEW SERVICE", () => {
  it("Should save a review in the database without errors", async () => {
    try {
      await addReview({});
      expect(true).toBe(true);
    } catch {
      expect(true).toBe(false);
    }
  });
  it("Should retrieve all reviews for a given movie ID", async () => {
    const otherId = Types.ObjectId();
    await addReview({});
    await addReview({ movieId: otherId });
    await addReview({});
    await addReview({ movieId: otherId });

    const reviews = await ReviewService.list({ movieId: otherId });
    expect(reviews).toHaveLength(2);
  });
});
