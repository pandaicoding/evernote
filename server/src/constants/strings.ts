import "dotenv/config";

export const CONST = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT!,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  JWT_COOKIE: process.env.JWT_COOKIE!,
};
