import { model, Schema, Types } from "mongoose";

const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

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
    get: (value) => Math.round(clamp(value, 0, 4)),
    set: (value) => Math.round(clamp(value, 0, 4)),
  },
});

const Review = model("Review", ReviewSchema);

export default Review;
