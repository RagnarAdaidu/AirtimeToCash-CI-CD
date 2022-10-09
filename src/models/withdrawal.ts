import { DataTypes, Model } from 'sequelize'
import db from '../config/database.config'

interface WithdrawalAttributes{
amount:number,
bankName:string,
accNumber:string,
id:string,
status?:boolean,
userID:string
}

export class WithdrawalInstance extends Model<WithdrawalAttributes>{ }

WithdrawalInstance.init({
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    amount: { type: DataTypes.NUMBER,  allowNull: false },
    bankName: { type: DataTypes.STRING, allowNull: false },
    accNumber: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.BOOLEAN, defaultValue:false, allowNull: false },
    userID: { type: DataTypes.STRING, allowNull: false },
    
}, {
    sequelize:db,
    tableName: 'withdrawTable'
    
})