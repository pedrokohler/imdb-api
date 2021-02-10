import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

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

UserSchema.method(
  "encryptPassword",
  async function encryptPassword(plainTextPassword) {
    const enctyptedPassword = await bcrypt.hash(plainTextPassword, 10);
    return enctyptedPassword;
  }
);

UserSchema.method(
  "comparePassword",
  async function comparePassword(plainTextPassword) {
    const enctyptedPassword = await bcrypt.compare(
      plainTextPassword,
      this.password
    );
    return enctyptedPassword;
  }
);

UserSchema.pre("validate", async function validate(next) {
  const user = this;
  if (user.isModified("password")) {
    const hash = await user.encryptPassword(user.password);
    user.password = hash;
  }
  next();
});

const User = model("User", UserSchema);

export default User;
