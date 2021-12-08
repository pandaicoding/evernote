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

createConnection()
  .then(async (connection) => {
    const app = express();
    app.use(cors());
    app.use(morgan("dev"));

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [UserResolver],
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

    apolloServer.applyMiddleware({ app });

    app.listen(CONST.PORT, () => {
      console.log(`🚀  Server started on port http://localhost:${CONST.PORT}/graphql`);
    });
  })
  .catch((error) => console.log(error));
