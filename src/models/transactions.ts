import { string } from 'joi';
import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

interface SellAirtimeAttribute {
    id: string;
    userID: string;
    userEmail: string;
    airtimeAmount: number;
    airtimeAmountToReceive: number;
    network: string;
    phoneNumber: string;
    destinationPhoneNumber:string;
    uStatus: string;
    aStatus:string;
    
}

export class SellAirtimeInstance extends Model<SellAirtimeAttribute> {}
SellAirtimeInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    airtimeAmount: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    airtimeAmountToReceive: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    network: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destinationPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    uStatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    aStatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    sequelize: db,
    tableName: 'transactionsTable'
  })