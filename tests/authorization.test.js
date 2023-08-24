const request = require('supertest');
const app = require('../app');
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET; 

const testUser = { 
  "password": "$2b$06$/gKU97VxsNOZ5CUX6/Q2neiCZkDwpDfVqmGYMOTGjvNHI9SuY3exe",
  "email": "ee@dmail.com",
  "subscription": "starter",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZTdhZTM3MTQ5MmQ2MzU2NWJhMGFkMiIsImlhdCI6MTY5MjkwNzQ1MH0.NQFrkDaDG4-yFEfWJVJ0kDi9f5wtEOZa40OAlk2MEJk",
  "avatarURL": "//www.gravatar.com/avatar/fc1a72a57e7498df0291c3440aee1a91?s=200&r=pg&d=404",
  "_id": "64e7ae371492d63565ba0ad2"
}
 
const newUser = { 
  "email": "ee@dmail.com",
  "password":"qwerty"
};

const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: testUser._id }, secret);
  
describe('Testing the Authorization endpoints', () => {
  it('Testing the /singup endpoint', async () => {
    const response = await request(app)
    .post('/users/signup')
    .send(newUser)
    .set('Accept', 'application/json');
     expect(response.status).toEqual(200);
     expect(response.body.data.email).toBeInstanceOf("string");
     expect(response.body.data.subscription).toBeInstanceOf("string");

  })
  it('Testing the /login endpoint', async () => {
    const response = await request(app)
    .post('/users/login')
    .send(newUser)
    .set('Accept', 'application/json');
     expect(response.status).toEqual(200);
     expect(response.body.data.email).toBeInstanceOf("string");
     expect(response.body.data.subscription).toBeInstanceOf("string");
     expect(response.body.data.token).toEqual(token);
  }) 
})