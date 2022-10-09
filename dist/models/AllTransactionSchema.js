"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class TransactionSchema extends sequelize_1.Model {
}
TransactionSchema.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    transfer: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    withdraw_balance: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    transaction_history: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: database_config_1.default,
    tableName: 'userTable'
});
exports.default = TransactionSchema;
