"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryNearbyUser = exports.queryFollowers = exports.queryFans = exports.fork = exports.remove = exports.update = exports.queryOneById = exports.queryAll = exports.create = void 0;
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("../db/models/user"));
const logger_1 = require("../lib/logger");
const config_1 = require("../config");
const validator_1 = require("../lib/validator");
const redis_1 = require("../redis");
const Logger = logger_1.user;
/**
 * API接口通用返回结构体
 */
const getResult = () => {
    let result = {
        // 请求业务时处理成功，true:是，false：否
        success: true,
        // 返回消息
        message: 'success',
        // 返回数据
        data: null
    };
    return result;
};
/**
 * 创建用户
 * @param req
 * @param res
 * @returns
 */
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = getResult();
    Logger.info(`create_input_receive:${req.body ? JSON.stringify(req.body) : ''}`);
    let { name, dob, address, description, longitude, latitude } = req.body || {};
    if (!name || !dob || !address || !description || !latitude || !longitude) {
        result.success = false;
        result.message = '参数错误，必填参数：name,dob,address,description,longitude and latitude';
        return res.send(result);
    }
    if (!validator_1.isFormatDate(dob)) {
        result.success = false;
        result.message = '生日（dob）值不合法，应该是合法的日期，并且符合YYYY-MM-DD的格式';
        return res.send(result);
    }
    if (!validator_1.isLongitude(longitude)) {
        result.success = false;
        result.message = '经度（longitude）值不合法，正确的值应该在-180~180之间，并且最大支持6位小数';
        return res.send(result);
    }
    if (!validator_1.isLatitude(latitude)) {
        result.success = false;
        result.message = '纬度（latitude）值不合法，正确的值应该在-90~90之间，并且最大支持6位小数';
        return res.send(result);
    }
    // 处理数据值长度过大
    name = name.length > 255 ? name.substr(0, 254) : name;
    dob = dob.length > 255 ? dob.substr(0, 254) : dob;
    address = address.length > 255 ? address.substr(0, 254) : address;
    description = description.length > 255 ? description.substr(0, 254) : description;
    let point = {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)]
    };
    try {
        let u = yield user_1.default.create({ name, dob, address, description, gps: point });
        Logger.info(`create_insert_db_res:${JSON.stringify(u)}`);
        result.data = u;
    }
    catch (ex) {
        Logger.info(`create_insert_db_err:${ex.message}`);
        result.success = false;
        if (ex.original && ex.original.code && ex.original.code === 'ER_DUP_ENTRY')
            result.message = '该用户名(name)已经存在了，请更换后再试';
        else
            result.message = '创建用户执行数据库操作报错';
    }
    return res.send(result);
});
exports.create = create;
/**
 * 查找所有
 * @param req
 * @param res
 */
const queryAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = getResult();
    Logger.info(`queryAll_input_receive:${req.query ? JSON.stringify(req.query) : ''}`);
    try {
        let { rows, count } = yield user_1.default.findAndCountAll();
        Logger.info(`queryAll_select_db_res:get ${count} rows`);
        result.data = { rows, count };
    }
    catch (ex) {
        Logger.info(`queryAll_select_db_err:${ex.message}`);
        result.success = false;
        result.message = '查询所有用户执行数据库操作报错';
    }
    return res.send(result);
});
exports.queryAll = queryAll;
/**
 * 根据id查找某个用户
 * @param req
 * @param res
 */
const queryOneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = getResult();
    Logger.info(`queryOneById_input_receive:${req.params ? JSON.stringify(req.params) : ''}`);
    if (!req.params.id) {
        result.success = false;
        result.message = '请传入用户id参数值';
        return res.send(result);
    }
    try {
        let u = yield user_1.default.findByPk(req.params.id);
        Logger.info(`queryOneById_select_db_res:${JSON.stringify(u)}`);
        result.data = u;
        if (!u) {
            result.success = false;
            result.message = '没有找到对应的用户信息';
        }
    }
    catch (ex) {
        Logger.info(`queryOneById_select_db_err:${ex.message}`);
        result.success = false;
        result.message = '查询所有用户执行数据库操作报错';
    }
    return res.send(result);
});
exports.queryOneById = queryOneById;
/**
 * 修改用户信息
 * @param req
 * @param res
 */
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = getResult();
    Logger.info(`update_input_receive:${req.params ? JSON.stringify(req.params) : ''},${req.body ? JSON.stringify(req.body) : ''}`);
    let { name, dob, address, description, longitude, latitude } = req.body;
    let id = req.params.id;
    if (!id) {
        result.success = false;
        result.message = '参数错误，必填参数:id';
        return res.send(result);
    }
    if (dob && !validator_1.isFormatDate(dob)) {
        result.success = false;
        result.message = '生日（dob）值不合法，应该是合法的日期，并且符合YYYY-MM-DD的格式';
        return res.send(result);
    }
    // 经纬度合法性校验，经度（-180~180）
    if (longitude && !validator_1.isLongitude(longitude)) {
        result.success = false;
        result.message = '经度（longitude）值不合法，正确的值应该在-180~180之间，并且最大支持6位小数';
        return res.send(result);
    }
    if (latitude && !validator_1.isLatitude(latitude)) {
        result.success = false;
        result.message = '纬度（latitude）值不合法，正确的值应该在-90~90之间，并且最大支持6位小数';
        return res.send(result);
    }
    let u;
    // 查找要修改的用户
    try {
        u = yield user_1.default.findByPk(id);
    }
    catch (ex) {
        Logger.info(`update_findByPk_error:${ex.message}`);
        result.success = false;
        result.message = '查询用户数据库操作报错';
        return res.send(result);
    }
    // 判断用户是否存在，不存在则返回
    if (!u) {
        Logger.info(`update_findByPk_res:user not exist`);
        result.success = false;
        result.message = '未找到用户数据';
        return res.send(result);
    }
    let updateFields = {};
    // 修改名称
    if (name) {
        updateFields['name'] = name.length > 255 ? name.substr(0, 254) : name;
        ;
    }
    // 修改生日
    if (dob) {
        updateFields['dob'] = dob.length > 255 ? dob.substr(0, 254) : dob;
        ;
    }
    // 修改地址
    if (address) {
        updateFields['address'] = address.length > 255 ? address.substr(0, 254) : address;
        ;
    }
    // 修改描述
    if (description) {
        updateFields['description'] = description.length > 255 ? description.substr(0, 254) : description;
        ;
    }
    // 修改经纬度
    if (longitude && latitude) {
        updateFields['gps'] = {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)]
        };
    }
    // 只修改经度
    if (longitude && !latitude && u.gps.coordinates && u.gps.coordinates.length == 2) {
        updateFields['gps'] = {
            type: 'Point',
            coordinates: [Number(longitude), u.gps.coordinates[1]]
        };
    }
    // 只修改纬度
    if (latitude && !longitude && u.gps.coordinates && u.gps.coordinates.length == 2) {
        updateFields['gps'] = {
            type: 'Point',
            coordinates: [u.gps.coordinates[0], Number(latitude)]
        };
    }
    // 如果没有任何修改项，则返回
    if (JSON.stringify(updateFields) == '{}') {
        result.success = false;
        result.message = '未传入任何需要修改的用户信息';
        return res.send(result);
    }
    try {
        let updateRes = yield u.update(updateFields);
        Logger.info(`update_update_db_res,id:${id},${JSON.stringify(updateRes)}`);
        result.data = updateRes;
    }
    catch (ex) {
        Logger.info(`update_update_db_err,id:${id},${ex.message}`);
        result.success = false;
        result.message = '修改用户信息执行数据库操作报错';
    }
    return res.send(result);
});
exports.update = update;
/**
 * 删除用户信息
 * @param req
 * @param res
 */
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = getResult();
    Logger.info(`remove_input_receive:${req.params ? JSON.stringify(req.params) : ''}`);
    if (!req.params.id) {
        result.success = false;
        result.message = '请传入用户id参数值';
        return res.send(result);
    }
    try {
        let delRes = yield user_1.default.destroy({ where: { id: req.params.id } });
        Logger.info(`remove_destroy_db_res,id:${req.params.id},${delRes}`);
        if (delRes != 1) {
            result.success = false;
            result.message = '删除用户信息失败';
        }
    }
    catch (ex) {
        Logger.info(`remove_destroy_db_err,id:${req.params.id},${ex.message}`);
        result.success = false;
        result.message = '删除用户信息执行数据库操作报错';
    }
    return res.send(result);
});
exports.remove = remove;
/**
 * 关注某个用户
 * @param req
 * @param res
 */
const fork = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = getResult();
    // 从post参数中，取出关注对象uid
    let { followUserId } = req.body;
    // 参数校验，关注对象uid 和 用户自己的uid都必不可少
    if (!followUserId && !req.params.uId) {
        result.success = false;
        result.message = '请传入关注用户id（followUserId）和用户uId参数值';
        return res.send(result);
    }
    Logger.info(`fork_input_receive:followUserId${followUserId},uId:${req.params.uId}`);
    let self, // 用户自己
    follower, // 关注对象用户
    userFollower, // 粉丝列表
    followUser, // 关注对象列表
    ufKey = config_1.REDIS.keys.userFollower + followUserId, // 粉丝key
    fuKey = config_1.REDIS.keys.followUser + req.params.uId; // 关注者key
    // 查询并判断用户是否存在
    try {
        let dbRes = yield Promise.all([user_1.default.findByPk(followUserId), user_1.default.findByPk(req.params.uId)]);
        Logger.info(`fork_query_db_res,id:${req.params.uId},${JSON.stringify(result)}`);
        follower = dbRes[0];
        self = dbRes[1];
    }
    catch (ex) {
        Logger.info(`fork_query_db_err,id:${req.params.uId},${ex.message}`);
        result.success = false;
        result.message = '查询用户信息执行数据库操作报错';
        return res.send(result);
    }
    if (!self) {
        result.success = false;
        result.message = '未找到用户数据';
        return res.send(result);
    }
    if (!follower) {
        result.success = false;
        result.message = '未找到要关注的用户数据';
        return res.send(result);
    }
    // 获取用户fans和follower列表
    try {
        let redisRes = yield Promise.all([redis_1.getter(ufKey), redis_1.getter(fuKey)]);
        userFollower = redisRes[0];
        followUser = redisRes[1];
    }
    catch (ex) {
        Logger.info(`fork_get_redis_err,id:${ufKey},${fuKey},${ex.message}`);
        result.success = false;
        result.message = '查询用户followers和fans列表执行REDIS数据库操作报错';
        return res.send(result);
    }
    // 处理用户粉丝列表
    if (userFollower && Array.isArray(userFollower)) {
        if (!userFollower.includes(req.params.uId))
            userFollower.push(req.params.uId);
    }
    else {
        userFollower = [req.params.uId];
    }
    // 处理用户关注对象列表
    if (followUser && Array.isArray(followUser)) {
        if (!followUser.includes(followUserId))
            followUser.push(followUserId);
    }
    else {
        followUser = [followUserId];
    }
    // 重新设置关注着与粉丝列表
    try {
        yield Promise.all([redis_1.setter(ufKey, userFollower), redis_1.setter(fuKey, followUser)]);
    }
    catch (ex) {
        Logger.info(`fork_set_redis_err,id:${ufKey},${fuKey},${ex.message}`);
        result.success = false;
        result.message = '设置用户follower和fans列表执行REDIS数据库操作报错';
        return res.send(result);
    }
    return res.send(result);
});
exports.fork = fork;
/**
 * 查询用户的粉丝
 * @param req
 * @param res
 */
const queryFans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = getResult();
    Logger.info(`queryFans_input_receive:${req.params ? JSON.stringify(req.params) : ''}`);
    if (!req.params.id) {
        result.success = false;
        result.message = '请传入用户id参数值';
        return res.send(result);
    }
    try {
        let u = yield user_1.default.findByPk(req.params.id);
        Logger.info(`queryFans_select_db_res:${JSON.stringify(u)}`);
        result.data = u;
        if (!u) {
            result.success = false;
            result.message = '没有找到对应的用户信息';
            return res.send(result);
        }
    }
    catch (ex) {
        Logger.info(`queryFans_select_db_err:${ex.message}`);
        result.success = false;
        result.message = '查询所有用户执行数据库操作报错';
        return res.send(result);
    }
    // 获取用户fans列表
    let ufKey = config_1.REDIS.keys.userFollower + req.params.id; // 粉丝key
    let userFollower;
    try {
        userFollower = yield redis_1.getter(ufKey);
    }
    catch (ex) {
        Logger.info(`queryFans_get_redis_err,id:${ufKey},${ex.message}`);
        result.success = false;
        result.message = '查询用户fans列表执行REDIS数据库操作报错';
        return res.send(result);
    }
    if (!userFollower) {
        result.success = false;
        result.message = '用户没有粉丝';
        return res.send(result);
    }
    try {
        let u = yield user_1.default.findAndCountAll({
            where: {
                id: {
                    [sequelize_1.Op.in]: userFollower
                }
            }
        });
        Logger.info(`queryFans_select_db_res:${JSON.stringify(u)}`);
        result.data = u;
        if (!u) {
            result.success = false;
            result.message = '没有找到粉丝信息';
        }
    }
    catch (ex) {
        Logger.info(`queryFans_select_db_err:${ex.message}`);
        result.success = false;
        result.message = '查询所有用户执行数据库操作报错';
    }
    return res.send(result);
});
exports.queryFans = queryFans;
/**
 * 查询用户的关注者列表
 * @param req
 * @param res
 */
const queryFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = getResult();
    Logger.info(`queryFollowers_input_receive:${req.params ? JSON.stringify(req.params) : ''}`);
    if (!req.params.id) {
        result.success = false;
        result.message = '请传入用户id参数值';
        return res.send(result);
    }
    try {
        let u = yield user_1.default.findByPk(req.params.id);
        Logger.info(`queryFollowers_select_db_res:${JSON.stringify(u)}`);
        result.data = u;
        if (!u) {
            result.success = false;
            result.message = '没有找到对应的用户信息';
            return res.send(result);
        }
    }
    catch (ex) {
        Logger.info(`queryFollowers_select_db_err:${ex.message}`);
        result.success = false;
        result.message = '查询所有用户执行数据库操作报错';
        return res.send(result);
    }
    // 获取用户follower列表
    let fuKey = config_1.REDIS.keys.followUser + req.params.id; // 粉丝key
    let followUser;
    try {
        followUser = yield redis_1.getter(fuKey);
    }
    catch (ex) {
        Logger.info(`queryFollowers_get_redis_err,id:${fuKey},${ex.message}`);
        result.success = false;
        result.message = '查询用户follower列表执行REDIS数据库操作报错';
        return res.send(result);
    }
    if (!followUser) {
        result.success = false;
        result.message = '用户没有关注者';
        return res.send(result);
    }
    try {
        let u = yield user_1.default.findAndCountAll({
            where: {
                id: {
                    [sequelize_1.Op.in]: followUser
                }
            }
        });
        Logger.info(`queryFollowers_select_db_res:${JSON.stringify(u)}`);
        result.data = u;
        if (!u) {
            result.success = false;
            result.message = '没有找到关注者信息';
        }
    }
    catch (ex) {
        Logger.info(`queryFollowers_select_db_err:${ex.message}`);
        result.success = false;
        result.message = '查询所有用户执行数据库操作报错';
    }
    return res.send(result);
});
exports.queryFollowers = queryFollowers;
/**
 * 查询用户附近的人
 * @param req
 * @param res
 */
const queryNearbyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = getResult();
    // 从post参数中，返回小于此距离的用户
    let { distance } = req.query;
    Logger.info(`queryNearbyUser_input_receive:distance${distance},name:${req.params && req.params.name || ''}`);
    if (!distance && isNaN(Number(distance)))
        distance = 10000; //如果没传，给定默认值1万米
    else
        distance = Number(distance);
    if (!req.params.name) {
        result.success = false;
        result.message = '请传入用户姓名';
        return res.send(result);
    }
    let sql = `SELECT *,FLOOR(ST_DISTANCE_SPHERE((select gps from user where name=?),gps)) as 
        distance FROM user WHERE ST_DISTANCE_SPHERE((select gps from user where name=?),gps)<? AND name!=? ORDER BY distance;`;
    try {
        let dbRes = yield user_1.default.sequelize.query(sql, {
            replacements: [req.params.name, req.params.name, distance, req.params.name],
            type: sequelize_1.QueryTypes.SELECT
        });
        Logger.info(`queryNearbyUser_select_db_res:get ${dbRes.length} user`);
        if (!dbRes || !dbRes.length) {
            result.success = false;
            result.message = '没有找到附近的用户';
        }
        else {
            result.data = {
                count: dbRes.length,
                rows: dbRes
            };
        }
    }
    catch (ex) {
        Logger.info(`queryNearbyUser_select_db_err:${ex.message}`);
        result.success = false;
        result.message = '查询用户执行数据库操作报错';
    }
    return res.send(result);
});
exports.queryNearbyUser = queryNearbyUser;
//# sourceMappingURL=user.js.map