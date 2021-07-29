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

  async verifyToken(authorization) {
    const bearerRegex = /^Bearer /;
    if (authorization && bearerRegex.test(authorization)) {
      const token = authorization.replace(bearerRegex, "");
      const decoded = await jwt.verify(token, this.secret);
      return decoded;
    }
    return {};
  }
}

const tokenHandler = new TokenHandler(JWT_SECRET_KEY);

export default tokenHandler;
