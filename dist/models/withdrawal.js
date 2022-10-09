"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class WithdrawalInstance extends sequelize_1.Model {
}
exports.WithdrawalInstance = WithdrawalInstance;
WithdrawalInstance.init({
    id: { type: sequelize_1.DataTypes.STRING, primaryKey: true, allowNull: false },
    amount: { type: sequelize_1.DataTypes.NUMBER, allowNull: false },
    bankName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    accNumber: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    status: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    userID: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, {
    sequelize: database_config_1.default,
    tableName: 'withdrawTable'
});
