import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../entity/User";
import { hash, compare } from "bcryptjs";
import { generateAccessToken, generateRefreshToken, sendRefreshToken } from "../helper/generateToken";
import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { isAuth } from "../helper/isAuth";
export interface MyContext {
  req: Request;
  res: Response;
  tokenPayload?: any;
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

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() ctx: MyContext) {
    const payload = ctx.tokenPayload;
    if (!payload) return null;
    try {
      const user = await User.findOne(payload.userId);
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
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

      sendRefreshToken(res, refreshToken);

      return {
        access_token: accessToken,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  @Mutation(() => Boolean)
  async revokeUserSession(@Arg("userId") userId: string) {
    await getConnection().getRepository(User).increment({ id: userId! }, "token_version", 1);
    return true;
  }
}
