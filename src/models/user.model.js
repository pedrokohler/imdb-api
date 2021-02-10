import { model, Schema } from "mongoose";
// import bcrypt from "bcrypt";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

// const encryptPassword = async (plainTextPassword) => {
//   const enctyptedPassword = await bcrypt.hash(plainTextPassword, 10);
//   return enctyptedPassword;
// };

const User = model("User", UserSchema);

export default User;
