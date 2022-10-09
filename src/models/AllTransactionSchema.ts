import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';
import router from '../routes/user';

interface TransactionAtrribute {
  id: string;
  transfer: string;
  withdraw_balance: string;
  transaction_history: string;
  date:string
}
class TransactionSchema extends Model<TransactionAtrribute> {}

TransactionSchema.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    transfer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    withdraw_balance: {
      type: DataTypes.STRING,
      allowNull: false
    },
    transaction_history: {
        type: DataTypes.STRING,
        allowNull: false
    },
      date: {
      type:  DataTypes.STRING,
    allowNull: false
},
    },
  

  {
    sequelize: db,
    tableName: 'userTable'
  }
);

export default TransactionSchema