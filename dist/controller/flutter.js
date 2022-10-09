"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTrans = exports.getAllBanksNG = void 0;
const axios_1 = __importDefault(require("axios"));
const BASE_API_URL = 'https://api.flutterwave.com/v3';
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
const bankUrl = `${BASE_API_URL}/banks/NG`;
const options = {
    'method': 'GET',
    'url': '{{BASE_API_URL}}/banks/NG',
    'headers': {
        'Authorization': 'Bearer FLWSECK_TEST-SANDBOXDEMOKEY-X'
    }
};
const getAllBanksNG = async () => {
    try {
        const response = await axios_1.default.get(bankUrl, options);
        return response.data;
    }
    catch (error) {
        return (error);
    }
};
exports.getAllBanksNG = getAllBanksNG;
const initTrans = async (details) => {
    try {
        const response = await flw.Transfer.initiate(details);
        return (response);
    }
    catch (error) {
        console.log(error);
    }
};
exports.initTrans = initTrans;
