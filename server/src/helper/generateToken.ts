import { Response } from "express";
import { sign } from "jsonwebtoken";
import { User } from "src/entity/User";
import { CONST } from "../constants/strings";

export const generateAccessToken = (user: User) => {
  return sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, email: user.email, token_version: user.token_version },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const sendRefreshToken = (res: Response, refreshToken: string) => {
  res.cookie(CONST.JWT_COOKIE, refreshToken, {
    httpOnly: true,
    path: "/refresh-token",
  });
};
