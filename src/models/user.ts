import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';
import { AccountInstance } from './account';

interface UserAtrribute {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phonenumber: number;
  password: string;
  isVerified: boolean;
  avatar: string;
  wallet:number;
}
export class UserInstance extends Model<UserAtrribute> {}

UserInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },

    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phonenumber: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    wallet:{
      type:DataTypes.NUMBER, 
      defaultValue:0
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  
  {
    sequelize: db,
    tableName: 'userTable'
  }
);

UserInstance.hasMany(AccountInstance, { foreignKey: "userId", as: "accounts" });

AccountInstance.belongsTo(UserInstance, { foreignKey: "userId", as: "user" });
