import dbHandler from "../test-helpers/db.handler";
import ReviewRepository from "../../repositories/review.repository";
import {
  createReviewPayload,
  generateRandomId,
} from "../test-helpers/review.payload.factory";

beforeAll(async () => {
  await dbHandler.connect();
});
afterEach(async () => {
  await dbHandler.clearDatabase();
});
afterAll(async () => {
  await dbHandler.closeDatabase();
});

const addReview = async (customizedPayload) => {
  await ReviewRepository.create(createReviewPayload(customizedPayload));
};

describe("REVIEW REPOSITORY", () => {
  it("Should save a review in the database without errors", async () => {
    try {
      await addReview({});
      expect(true).toBe(true);
    } catch {
      expect(true).toBe(false);
    }
  });
  it("Should retrieve all reviews for a given movie ID", async () => {
    const otherId = generateRandomId();
    await addReview({});
    await addReview({ reviewedItemId: otherId });
    await addReview({});
    await addReview({ reviewedItemId: otherId });

    const reviews = await ReviewRepository.list({ reviewedItemId: otherId });
    expect(reviews).toHaveLength(2);
  });
});
