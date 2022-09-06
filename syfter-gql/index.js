// import mongoose from 'mongoose'
// import { run } from 'jest';
import { createServer } from './server.js';

// const connectDB = async () => {
//   await mongoose.connect(process.env.SOCCER_DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
// }
// await connectDB()
const start = async () =>  {
  const server = await createServer()
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}

start()