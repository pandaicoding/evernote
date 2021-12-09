import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { CONST } from "./constants/strings";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MyContext, UserResolver } from "./graphql/UserResolver";
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { generateAccessToken, generateRefreshToken, sendRefreshToken } from "./helper/generateToken";
import cookieParser from "cookie-parser";
import { NoteResolver } from "./graphql/NoteResolver";

createConnection()
  .then(async (connection) => {
    const app = express();
    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );
    app.use(cookieParser());
    app.use(morgan("dev"));

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.post("/refresh-token", async (req, res) => {
      const token = req.cookies[CONST.JWT_COOKIE];
      if (!token) return res.send({ success: false, access_token: "" });

      let data: any = null;
      try {
        data = verify(token, CONST.REFRESH_TOKEN_SECRET);
      } catch (error) {
        console.log(error);
        return res.send({ success: false, access_token: "" });
      }

      const user = await User.findOne({ id: data.userId });

      if (!user) return res.send({ success: false, access_token: "" });
      if (user.token_version !== data.token_version) return res.send({ success: false, access_token: "" });

      const access_token = generateAccessToken(user);
      sendRefreshToken(res, generateRefreshToken(user));
      return res.send({ success: true, access_token });
    });

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [UserResolver, NoteResolver],
        emitSchemaFile: true,
      }),
      context: ({ req, res }): MyContext => ({ req, res }),
      plugins: [
        process.env.NODE_ENV === "production"
          ? ApolloServerPluginLandingPageDisabled()
          : ApolloServerPluginLandingPageGraphQLPlayground(),
      ],
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(CONST.PORT, () => {
      console.log(`🚀  Server started on port http://localhost:${CONST.PORT}/graphql`);
    });
  })
  .catch((error) => console.log(error));
