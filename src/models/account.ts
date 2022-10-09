import { string } from 'joi';
import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

interface AccountAtrribute {
  id: string;
  bankName: string;
  accNumber: string;
  accName:string;
  userId: string;
  wallet: number;
}

export class AccountInstance extends Model<AccountAtrribute> {}

AccountInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },

    bankName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accNumber: {
        unique: true,
      type: DataTypes.STRING,
      allowNull: false
    },
    accName:{
          type:DataTypes.STRING,
          allowNull:false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    wallet: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
  },
  {
    sequelize: db,
    tableName: 'accountTable'
  }
);
