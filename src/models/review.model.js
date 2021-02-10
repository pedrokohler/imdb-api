import { model, Schema, Types } from "mongoose";

const ReviewSchema = new Schema({
  movieId: {
    type: Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    get: (value) => Math.round(value),
    set: (value) => Math.round(value),
    min: 0,
    max: 4,
  },
});

const Review = model("Review", ReviewSchema);

export default Review;
