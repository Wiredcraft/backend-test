const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai');
const app = require('../index');
const config = require('../config');

const expect = chai.expect; // eslint-disable-line prefer-destructuring
chai.config.includeStack = true;

describe('## User APIs', () => {
  const user = {
    email: `${+new Date()}@test.com`,
    name: 'Test',
    password: 'irrelevant'
  };
  let createdUser;

  describe(`# POST ${config.basePath}users`, () => {

    it('should create a new user', (done) => {
      request(app)
        .post(`${config.basePath}users`)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.name).to.equal(user.name);
          createdUser = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${config.basePath}users/:userId`, () => {
    it('should get user details', (done) => {
      request(app)
        .get(`${config.basePath}users/${createdUser._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.name).to.equal(user.name);
          done();
        })
        .catch(done);
    });
  });

  describe(`# PUT ${config.basePath}users/:userId`, () => {
    it('should update user details', (done) => {
      const newName = 'Another test';
      request(app)
        .put(`${config.basePath}users/${createdUser._id}`)
        .send({ name: newName })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(user.email);
          expect(res.body.name).to.equal(newName);
          done();
        })
        .catch(done);
    });
  });

  describe(`# DELETE ${config.basePath}users/:userId`, () => {
    const { email } = user;
    it('should delete user', (done) => {
      request(app)
        .delete(`${config.basePath}users/${createdUser._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(email);
          done();
        })
        .catch(done);
    });
  });
});