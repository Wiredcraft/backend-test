# Wiredcraft Back-end Developer Coding Test

## Run tests

```js
npm test
```

## Start server

```js
node .
```

## API

```
GET    /user/{id}                   - Get user by ID
POST   /user/                       - To create a new user
PUT    /user/{id}                   - To update an existing user with data
DELETE /user/{id}                   - To delete a user from database
```

## User Model

```
{
  "id": "xxx",
  "name": "test",                       // required
  "dob": ["DD/MM/YYYY"|"DD-MM-YYYY"],
  "address": "",
  "description": "",
  "created_at": ""                      // read-only
}
```
