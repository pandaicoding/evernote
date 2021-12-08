import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entity/User";
import { hash, compare } from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../helper/generateToken";
import { Request, Response } from "express";
import { CONST } from "../constants/strings";

export interface MyContext {
  req: Request;
  res: Response;
}

@ObjectType()
class loginResponse {
  @Field()
  access_token: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hello World Update";
  }

  @Mutation(() => Boolean)
  async signup(
    @Arg("display_name") display_name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      const findUser = await User.findOne({ where: { email } });
      if (findUser) {
        throw new Error("User already exists");
      }

      await User.insert({
        display_name,
        username: email.split("@")[0],
        email,
        password: await hash(password, 12),
      });
      return true;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  @Mutation(() => loginResponse)
  async login(@Arg("email") email: string, @Arg("password") password: string, @Ctx() { res }: MyContext) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found!!!");
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password!!!");
      }

      const accessToken = generateAccessToken(user);

      const refreshToken = generateRefreshToken(user);

      res.cookie(CONST.JWT_COOKIE, refreshToken, {
        httpOnly: true,
        // path: "/refresh_token",
      });

      return {
        access_token: accessToken,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
