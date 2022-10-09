"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const account_1 = require("./account");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    phonenumber: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    wallet: {
        type: sequelize_1.DataTypes.NUMBER,
        defaultValue: 0
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_config_1.default,
    tableName: 'userTable'
});
UserInstance.hasMany(account_1.AccountInstance, { foreignKey: "userId", as: "accounts" });
account_1.AccountInstance.belongsTo(UserInstance, { foreignKey: "userId", as: "user" });
