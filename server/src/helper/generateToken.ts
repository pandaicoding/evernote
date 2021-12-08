import { sign } from "jsonwebtoken";
import { User } from "src/entity/User";

export const generateAccessToken = (user: User) => {
  return sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (user: User) => {
  return sign({ userId: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};
