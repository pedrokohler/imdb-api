import Review from "../models/review.model";
import DbServiceAdapter from "./utils/db.service.adapter";

const ReviewService = new DbServiceAdapter(Review);

export default ReviewService;
