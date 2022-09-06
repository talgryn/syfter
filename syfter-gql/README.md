# SoccerManagerBELite

Apollo graphql implementation of SoccerManagerBELite project.

## install dependencies:

```
npm i
```

## running the project
change the .env file to point to en existing mongo 4+ with replica set installation

OR 

run
```
 npm run mongo-rs 
```
to start mongodb locally

## Run the project
```
npm start
```
and open browser to 
```
localhost:4000/graphql
```
which will redirect you to apollo studio


## working with the api:

### user registration:
```
mutation SignupUser($data: UserCreateInput!) {
  users {
    signupUser(data: $data) {
      token
    }
  }
}
```

sample variables:
```
{
  "data": {
    "email": "player2@t.com",
    "password": "12345678",
    "name": "player2"
  }
}
```

after running the command a token is returned.
add the token to the Authorization header to use the rest of the API's

### login
similar to registration, use the login mutation to login with user/password and retrieving a token.  send the token as Authorization header

```
mutation LoginUser($data2: UserLoginInput!) {
  users {
    loginUser(data: $data2) {
      token
    }
  }
}
```


### Queries
The api defines two queries

* team - fetches the team that belongs to the logged in user
* transfer list - fetches the players in the transfer list

### Mutations

* users -> loginUser and SignupUser
* updateTeam: used to update the team's name and country
* offer: offer a player for transfer
* buyPlayer: buy a player in the transfer list


