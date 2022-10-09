"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellAirtimeInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class SellAirtimeInstance extends sequelize_1.Model {
}
exports.SellAirtimeInstance = SellAirtimeInstance;
SellAirtimeInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    userID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    airtimeAmount: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    airtimeAmountToReceive: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    network: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    destinationPhoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    uStatus: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    aStatus: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: database_config_1.default,
    tableName: 'transactionsTable'
});
