"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class AccountInstance extends sequelize_1.Model {
}
exports.AccountInstance = AccountInstance;
AccountInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    bankName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    accNumber: {
        unique: true,
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    accName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    wallet: {
        type: sequelize_1.DataTypes.NUMBER,
        defaultValue: 0,
    },
}, {
    sequelize: database_config_1.default,
    tableName: 'accountTable'
});
