import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

const connect = async () => {
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

  await mongoose.connect(MONGO_CONNECTION_STRING, mongooseOpts);
};

export default connect;
