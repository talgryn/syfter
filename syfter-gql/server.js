import { ApolloServer } from 'apollo-server';
import JWT from 'jsonwebtoken';
import mongoose from 'mongoose';
import { gql } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema'
import { Schema, Resolvers } from './types/index.js'
import dotenv from 'dotenv'
import KafkaDS from './datasources/kafka-ds/index.js';
import TrackerDS from './datasources/tracker-ds/index.js';
import { Pool } from 'undici'
dotenv.config()
export const createServer = async (ctxFunc) => {

  const typeDefs =  gql([Schema])
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers: Resolvers,
  })
  const kafkaDS = new KafkaDS()
  await kafkaDS.init()
  const baseURL = `http://${process.env.TRACKER_SYFTER_TRACKER_SERVICE_HOST}:${process.env.TRACKER_SYFTER_TRACKER_SERVICE_PORT}`
  // const pool = new Pool(baseURL)
  const trackerDS = new TrackerDS(baseURL, null)
  // const users = new Users(mongoose)
  // const players = new Players(mongoose)
  // const teams = new Teams(mongoose)

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    dataSources: () => ({
      kafkaDS,
      trackerDS
      // teams,
      // users,
      // players,
    }),
    context: ({ req }) => {
      //for testing
      if (ctxFunc) {
        const ctx = ctxFunc(req)
        return ctx
      }
      const ctx = {
        // client: mongoose.connection.db,
        // mongoose
      };
      const jwt = (req?.headers.authorization || '').replace(/^Bearer\s+/, '');
      if (!jwt) {
        return ctx
      }
      try {
        const user = JWT.verify(jwt, process.env.JWT_SECRET);
        ctx.user = user;
      } catch {
        // ignore invalid token. user will be undefined.
      }
      return ctx;

    }
  })
  // server.executeOperation()
  return server
}
