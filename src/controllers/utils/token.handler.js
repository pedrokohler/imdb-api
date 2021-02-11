import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { JWT_SECRET_KEY } = process.env;

class TokenHandler {
  constructor(secret) {
    this.secret = secret;
  }

  async createToken(user) {
    const token = await jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      this.secret,
      {
        expiresIn: "1h",
      }
    );
    return token;
  }
}

const tokenHandler = new TokenHandler(JWT_SECRET_KEY);

export default tokenHandler;
