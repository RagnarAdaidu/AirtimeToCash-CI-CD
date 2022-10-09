"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const AllTransactions_1 = require("../controller/AllTransactions");
router.get('/alltransactions', AllTransactions_1.allTransactions);
exports.default = router;
