"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawalSchema = exports.generateToken = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    const pass = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign(user, pass, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
exports.withdrawalSchema = joi_1.default.object().keys({
    accNumber: joi_1.default.string().trim().required().pattern(/^[0-9]+$/).length(10),
    bankName: joi_1.default.string().trim().required(),
    amount: joi_1.default.number().required(),
});
