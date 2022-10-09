"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
const user_1 = require("../models/user");
async function auth(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401);
            res.json({
                Error: 'kindly sign in as a user'
            });
        }
        //hide part of the token 
        const token = authorization?.slice(7, authorization.length) || req.cookies.mytoken;
        const verified = jsonwebtoken_1.default.verify(token, secret);
        if (!verified) {
            res.status(401);
            res.json({
                Error: 'User not verified, you cant access this route'
            });
            return;
        }
        const { id } = verified;
        const user = await user_1.UserInstance.findOne({ where: { id } });
        if (!user) {
            res.status(404);
            res.json({
                Error: 'user not verified'
            });
            return;
        }
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(500);
        res.json({
            Error: "user not logged in"
        });
        return;
    }
}
exports.auth = auth;
