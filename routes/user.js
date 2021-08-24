const express = require('express');
const userController = require('../controllers/user');
const { check, oneOf } = require('express-validator');
const router = express.Router();

// check params
const checkUserHandlers = [
  check('name').notEmpty().withMessage('can not empty'),
  check('dob').notEmpty().isInt().withMessage('must be a timestamp in milliseconds'),
  check('address').notEmpty().withMessage('can not empty'),
];

/**
 * @api {get} /user get all users
 * @apiGroup user
 * @apiDescription get all users
 * @apiParam {Number} page
 * @apiParam {Number} limit
 * @apiName getUsers
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 * @apiSuccess {Object[]} data
 * @apiSuccess {String} data._id user ID
 * @apiSuccess {String} data.name user name
 * @apiSuccess {String} data.dob date of birth
 * @apiSuccess {String} data.address user address
 * @apiSuccess {String} data.description user description
 * @apiSuccess {String} data.createdAt user created date
 * @apiVersion 0.0.1
 */
router.get('/', userController.getUser);
/**
 * @api {put} /user add a new user
 * @apiGroup user
 * @apiDescription add a new user
 * @apiParam {String} name user name
 * @apiParam {Number} dob date of birth, must be a timestamp in milliseconds
 * @apiParam {String} address user address
 * @apiParam {String} description user description
 * @apiName addUser
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 * @apiVersion 0.0.1
 */
router.put('/', checkUserHandlers, userController.addUser);
/**
 * @api {get} /user/:id get user by id
 * @apiGroup user
 * @apiDescription get user by id
 * @apiParam {Number} id Users unique ID.
 * @apiName getUser
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 * @apiSuccess {Object[]} data
 * @apiSuccess {String} data._id user ID
 * @apiSuccess {String} data.name user name
 * @apiSuccess {String} data.dob date of birth
 * @apiSuccess {String} data.address user address
 * @apiSuccess {String} data.description user description
 * @apiSuccess {String} data.createdAt user created date
 * @apiVersion 0.0.1
 */
router.get('/:id', userController.getUser);
/**
 * @api {post} /user/:id update user by id
 * @apiGroup user
 * @apiDescription update user by id
 * @apiParam {Number} id Users unique ID.
 * @apiParam {String} name user name
 * @apiParam {Number} dob date of birth, must be a timestamp in milliseconds
 * @apiParam {String} address user address
 * @apiParam {String} description user description
 * @apiName updateUser
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 * @apiVersion 0.0.1
 */
router.post('/:id', oneOf(checkUserHandlers), userController.updateUser);
/**
 * @api {delete} /user/:id delete user by id
 * @apiGroup user
 * @apiDescription delete user by id
 * @apiParam {Number} id Users unique ID.
 * @apiName delUser
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 * @apiVersion 0.0.1
 */
router.delete('/:id', userController.delUser);

module.exports = router;
