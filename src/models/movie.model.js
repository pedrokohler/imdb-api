import { model, Schema } from "mongoose";

const MovieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  genders: {
    type: [String],
    required: true,
  },
  actors: {
    type: [String],
    required: true,
  },
});

export default model("Movie", MovieSchema);
