import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createServer } from '../server.js';
/*
test cases
* create a new user
  validate user, team and players (20 players with the right roles, budget = 5000000)
*/
let mongo, server
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
    console.log({ mongoUri });
    const connectDB = async () => {
      mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    }
    await connectDB()
  
})

afterAll(async () => {
  
    //await mongoose.connection.close()
    // await mongoose.disconnect()
    //await mongo.stop()
    // await mongoose.disconnect()
})

xdescribe('Integration tests', () => {

  it('should just start and stop mongo', async () => {
    expect(true).toBe(true);
  })

  const checkToken = (token, email) => {
    const payload = token.split('.')[1];
    const buff = Buffer.from(payload, 'base64');
    const text = buff.toString('ascii');
    const parsedToken = JSON.parse(text);
    
    expect(parsedToken.username).toBeDefined()
    expect(parsedToken.username).toBe(email)

    return parsedToken
  }
  
  const createUser = async (email, name) => {
    const CREATE_USER = `
      mutation SignupUser($data: UserCreateInput!) {
        users {
          signupUser(data: $data) {
            token
          }
        }
      }`
      const result = await server.executeOperation({
        query: CREATE_USER,
        variables: { 
          data: {
            email,
            password: "12345678",
            name
          }
        },
      },()=>{});
      const token = result.data.users.signupUser.token
      const user = checkToken(token, email);
      expect(user._id).toBeDefined()
  
      return user
    
  }

  const loginUser = async (email) => {
    const LOGIN = `
    mutation LoginUser($data: UserLoginInput!) {
      users {
        loginUser(data: $data) {
          token
        }
      }
    }`
      const result = await server.executeOperation({
        query: LOGIN,
        variables: { 
          data: {
            email,
            password: "12345678",
          }
        },
      },()=>{});
      const token = result.data.users.loginUser.token
      const user = checkToken(token, email);
      expect(user._id).toBeDefined()
  
      return user
    
  }


  it('shoud register a user', async () => {
    server = await createServer()
    const ownerId = await createUser("test1@test.com", "test1")
    expect(ownerId).toBeDefined()
  })

  it('should signup and login a user', async () => {
    server = await createServer()
    const user1 = await createUser("test2@test.com", "test2")
    expect(user1._id).toBeDefined()

    const user2 = await loginUser("test2@test.com")
    expect(user2._id).toBeDefined()
    expect(user2._id).toBe(user1._id)
  })


})

