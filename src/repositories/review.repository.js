import Review from "../models/review.model";
import DbRepositoryAdapter from "./common/db.repository.adapter";

const ReviewRepository = new DbRepositoryAdapter(Review);

export default ReviewRepository;
