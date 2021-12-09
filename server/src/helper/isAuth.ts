import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../graphql/UserResolver";
import { verify } from "jsonwebtoken";
import { CONST } from "../constants/strings";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  try {
    const bearer = context.req.headers["authorization"];
    const token = bearer!.split(" ")[1];
    if (!token) throw new Error("No token provided");

    const tokenPayload = verify(token, CONST.ACCESS_TOKEN_SECRET!);
    if (!tokenPayload) throw new Error("Invalid token");

    context.tokenPayload = tokenPayload as any;
  } catch (error) {
    throw new Error("Invalid token");
  }

  return next();
};
