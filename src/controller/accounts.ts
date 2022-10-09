import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4, validate } from "uuid";
import { AccountInstance }  from "../models/account";
import {UserInstance} from "../models/user";
import {SellAirtimeInstance} from "../models/transactions"
import { createAccountSchema,sellAirtimeSchema,updateStatusSchema,options } from '../utils/validation'
import { UUIDV1 } from "sequelize";
import { idText } from "typescript";
const Flutterwave = require('flutterwave-node-v3');
import { emailVerificationView,transactionNotification } from "./mailSender";
import { sendMail } from "./emailService";



export async function CreateAccount(
  req: Request|any,
  res: Response,
  next: NextFunction
) {
    const id = uuidv4();
    try {
      console.log(req)
        const userID=req.user.id;
        const ValidateAccount = createAccountSchema.validate(req.body,options);
        if (ValidateAccount.error) {
            return res.status(400).json({
                Error: ValidateAccount.error.details[0].message,
            });
        }
        const duplicatAccount = await AccountInstance.findOne({
            where: { accNumber: req.body.accNumber },
        });
        if (duplicatAccount) {
            return res.status(409).json({
                msg: "Account number is used, please enter another account number",
            });
        }
        const record = await AccountInstance.create({
            id: id,
            bankName: req.body.bankName,
            accNumber: req.body.accNumber,
            accName:req.body.accName,
            userId: userID, 
            wallet: req.body.wallet,
        })
        if (record) {
            return res.status(201).json({
                msg: "Account created successfully",
                data: record
            })
        }
    } catch (error) {
      console.log(error)
        return res.status(500).json({
            msg: "Internal server error",
            error: error
        })
    }
}

export async function getBankAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const record = await AccountInstance.findOne({ where: { id } });
  
      return res.status(200).json({"record":record});
    } catch (error) {
      return res.status(500).json({
        msg: "Invalid User",
        route: "/read/:id",
      });
    }
  }


export async function deleteBankAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const record = await AccountInstance.findOne({ where: { id } });
      if (!record) {
        return res.status(404).json({
          msg: "Account not found",
        });
      }
      const deletedRecord = await record.destroy();
     return  res.status(200).json({
        msg: "Account deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        msg: "failed to delete",
        route: "/delete/:id",
      });
    }
  }

  export const sellAirtime = async (req: Request|any, res: Response) => {
    try {
      
      const id=uuidv4();
      const userID=req.user.id;
     
      const User = (await UserInstance.findOne({ where: { id: userID} })) as unknown as { [key: string]: string} ;
      if (!User) {
        return res.status(404).json({
          msg: "Unauthorized access",
        });
      }
     
      const {email,firstname, lastname} = User;
      console.log(req.body)
      const ValidateTransaction = sellAirtimeSchema.validate(req.body,options);
      const amountToReceive=req.body.airtimeAmount*0.7;
      if (ValidateTransaction.error) {
        return res.status(400).json({
            Error: ValidateTransaction.error.details[0].message,
        });
    }
   
      const record=await SellAirtimeInstance.create({
        id:id,
        userID:userID,
        userEmail:email,
        airtimeAmount:req.body.airtimeAmount,
        airtimeAmountToReceive:amountToReceive,
        network:req.body.network,
        phoneNumber:req.body.phoneNumber,
        destinationPhoneNumber:req.body.destinationPhoneNumber,
        uStatus:"sent",
        aStatus:"pending",
      })
     
      if(record){
        
        const email = "felixtemikotan@yahoo.com"
            const subject = "Airtime Transaction Notification";
            const str =`${firstname}  ${lastname} with phone number ${req.body.phoneNumber} has just sent an airtime transaction of ${req.body.airtimeAmount} to ${req.body.destinationPhoneNumber} on ${req.body.network} network.`;
            const html:string = transactionNotification(firstname,lastname,req.body.phoneNumber,req.body.airtimeAmount,req.body.network,req.body.destinationPhoneNumber);
            await sendMail(html,email,subject,str)

            
       return  res.status(200).json({
          "msg":"Transaction created successfully",
          "status": "OK",
          "record":record,
        })
      }
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        msg: "failed to sell airtime",
        route: "/sellairtime",
      });
    } 
  } 
  
  // Install with: npm i flutterwave-node-v3
 
export const withdraw = async (req: Request|any, res: Response) => {
  try {
    const {account_bank,account_number,amount,naration,currency} = req.body;
    
    const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
const details = {
    account_bank: account_bank,
    account_number:account_number,
    amount: amount,
    narration: naration,
    currency: currency,
    //reference: generateTransactionReference(),
    callback_url: "https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d",
    debit_currency: "NGN"
};
flw.Transfer.initiate(details)
    .then( async (response: {
      status: string; data: { id: any; status: any; message: any; }; 
}) => {
        
        if(response.status==="success"){
          console.log(response.data);
        }
        // const {id, status, message} = response.data;
        // if(status==="success"){
        //   const record = await WithdrawInstance.create({
        //     id:id,
        //     userID:req.user.id,
        //     account_bank: account_bank,
        //     account_number:account_number,
        //     amount: amount,
        //     narration: naration,
        //     currency: currency,
        //     status:status,
        //     message:message,
        //   })
        //   if(record){
        //     return res.status(200).json({
        //       "msg":"Withdrawal created successfully",
        //       "status": "OK",
        //       "record":record,
        //     })
        //   }
        // }
        // return res.status(400).json({
        //   "msg":"Withdrawal failed",
        //   "status": "failed",
        //   "record":response.data,
        // })
    })
    .catch(console.log);
    }catch (error) {
      res.status(500).json({
        msg: "failed to withdraw",
        route: "/withdraw",
      });
    }
  }



  export async function updateTransactionStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id,airtimeAmount } = req.params;
  
      const validationResult = updateStatusSchema.validate(req.body, options);
      if (validationResult.error) {
        return res.status(400).json({
          Error: validationResult.error.details[0].message,
        });
      }
  
      const record = await SellAirtimeInstance.findOne({ where: { id } });
      if (!record) {
        return res.status(404).json({
          Error: "Cannot find existing transaction",
        });
      }
      const amountToReceive=parseFloat(airtimeAmount)*0.7;
      const updatedrecord = await record.update({
        airtimeAmount: req.body.airtimeAmount,
        airtimeAmountToReceive: amountToReceive,
        aStatus: "completed",
      });
      res.status(201).json({
        message: "Your transaction has been updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        msg: "failed to update",
        route: "/updatetransactionstatus/:id",
      });
    }
  }



  export async function cancelTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
  
  
      const record = await SellAirtimeInstance.findOne({ where: { id } });
      if (!record) {
        return res.status(404).json({
          Error: "Cannot find existing transaction",
        });
      }
      
      const updatedrecord = await record.update({
        uStatus: "cancelled",
        aStatus: "cancelled",
      });
      res.status(201).json({
        message: "Your transaction has been cancelled successfully",
      });
    } catch (error) {
      res.status(500).json({
        msg: "failed to update",
        route: "/canceltransaction/:id",
      });
    }
  }


  export async function deleteTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const record = await SellAirtimeInstance.findOne({ where: { id } });
      if (!record) {
        return res.status(404).json({
          msg: "Transaction not found",
        });
      }
      const deletedRecord = await record.destroy();
     return  res.status(200).json({
        msg: "Transaction deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        msg: "failed to delete",
        route: "/deletetransaction/:id",
      });
    }
  }
