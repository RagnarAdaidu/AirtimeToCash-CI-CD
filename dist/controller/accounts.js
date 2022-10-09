"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.cancelTransaction = exports.updateTransactionStatus = exports.withdraw = exports.sellAirtime = exports.deleteBankAccount = exports.getBankAccount = exports.CreateAccount = void 0;
const uuid_1 = require("uuid");
const account_1 = require("../models/account");
const user_1 = require("../models/user");
const transactions_1 = require("../models/transactions");
const validation_1 = require("../utils/validation");
const Flutterwave = require('flutterwave-node-v3');
const mailSender_1 = require("./mailSender");
const emailService_1 = require("./emailService");
async function CreateAccount(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        console.log(req);
        const userID = req.user.id;
        const ValidateAccount = validation_1.createAccountSchema.validate(req.body, validation_1.options);
        if (ValidateAccount.error) {
            return res.status(400).json({
                Error: ValidateAccount.error.details[0].message,
            });
        }
        const duplicatAccount = await account_1.AccountInstance.findOne({
            where: { accNumber: req.body.accNumber },
        });
        if (duplicatAccount) {
            return res.status(409).json({
                msg: "Account number is used, please enter another account number",
            });
        }
        const record = await account_1.AccountInstance.create({
            id: id,
            bankName: req.body.bankName,
            accNumber: req.body.accNumber,
            accName: req.body.accName,
            userId: userID,
            wallet: req.body.wallet,
        });
        if (record) {
            return res.status(201).json({
                msg: "Account created successfully",
                data: record
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal server error",
            error: error
        });
    }
}
exports.CreateAccount = CreateAccount;
async function getBankAccount(req, res, next) {
    try {
        const { id } = req.params;
        const record = await account_1.AccountInstance.findOne({ where: { id } });
        return res.status(200).json({ "record": record });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Invalid User",
            route: "/read/:id",
        });
    }
}
exports.getBankAccount = getBankAccount;
async function deleteBankAccount(req, res, next) {
    try {
        const { id } = req.params;
        const record = await account_1.AccountInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                msg: "Account not found",
            });
        }
        const deletedRecord = await record.destroy();
        return res.status(200).json({
            msg: "Account deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "failed to delete",
            route: "/delete/:id",
        });
    }
}
exports.deleteBankAccount = deleteBankAccount;
const sellAirtime = async (req, res) => {
    try {
        const id = (0, uuid_1.v4)();
        const userID = req.user.id;
        const User = (await user_1.UserInstance.findOne({ where: { id: userID } }));
        if (!User) {
            return res.status(404).json({
                msg: "Unauthorized access",
            });
        }
        const { email, firstname, lastname } = User;
        console.log(req.body);
        const ValidateTransaction = validation_1.sellAirtimeSchema.validate(req.body, validation_1.options);
        const amountToReceive = req.body.airtimeAmount * 0.7;
        if (ValidateTransaction.error) {
            return res.status(400).json({
                Error: ValidateTransaction.error.details[0].message,
            });
        }
        const record = await transactions_1.SellAirtimeInstance.create({
            id: id,
            userID: userID,
            userEmail: email,
            airtimeAmount: req.body.airtimeAmount,
            airtimeAmountToReceive: amountToReceive,
            network: req.body.network,
            phoneNumber: req.body.phoneNumber,
            destinationPhoneNumber: req.body.destinationPhoneNumber,
            uStatus: "sent",
            aStatus: "pending",
        });
        if (record) {
            const email = "felixtemikotan@yahoo.com";
            const subject = "Airtime Transaction Notification";
            const str = `${firstname}  ${lastname} with phone number ${req.body.phoneNumber} has just sent an airtime transaction of ${req.body.airtimeAmount} to ${req.body.destinationPhoneNumber} on ${req.body.network} network.`;
            const html = (0, mailSender_1.transactionNotification)(firstname, lastname, req.body.phoneNumber, req.body.airtimeAmount, req.body.network, req.body.destinationPhoneNumber);
            await (0, emailService_1.sendMail)(html, email, subject, str);
            return res.status(200).json({
                "msg": "Transaction created successfully",
                "status": "OK",
                "record": record,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "failed to sell airtime",
            route: "/sellairtime",
        });
    }
};
exports.sellAirtime = sellAirtime;
// Install with: npm i flutterwave-node-v3
const withdraw = async (req, res) => {
    try {
        const { account_bank, account_number, amount, naration, currency } = req.body;
        const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
        const details = {
            account_bank: account_bank,
            account_number: account_number,
            amount: amount,
            narration: naration,
            currency: currency,
            //reference: generateTransactionReference(),
            callback_url: "https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d",
            debit_currency: "NGN"
        };
        flw.Transfer.initiate(details)
            .then(async (response) => {
            if (response.status === "success") {
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
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to withdraw",
            route: "/withdraw",
        });
    }
};
exports.withdraw = withdraw;
async function updateTransactionStatus(req, res, next) {
    try {
        const { id, airtimeAmount } = req.params;
        const validationResult = validation_1.updateStatusSchema.validate(req.body, validation_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await transactions_1.SellAirtimeInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                Error: "Cannot find existing transaction",
            });
        }
        const amountToReceive = parseFloat(airtimeAmount) * 0.7;
        const updatedrecord = await record.update({
            airtimeAmount: req.body.airtimeAmount,
            airtimeAmountToReceive: amountToReceive,
            aStatus: "completed",
        });
        res.status(201).json({
            message: "Your transaction has been updated successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to update",
            route: "/updatetransactionstatus/:id",
        });
    }
}
exports.updateTransactionStatus = updateTransactionStatus;
async function cancelTransaction(req, res, next) {
    try {
        const { id } = req.params;
        const record = await transactions_1.SellAirtimeInstance.findOne({ where: { id } });
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
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to update",
            route: "/canceltransaction/:id",
        });
    }
}
exports.cancelTransaction = cancelTransaction;
async function deleteTransaction(req, res, next) {
    try {
        const { id } = req.params;
        const record = await transactions_1.SellAirtimeInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                msg: "Transaction not found",
            });
        }
        const deletedRecord = await record.destroy();
        return res.status(200).json({
            msg: "Transaction deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "failed to delete",
            route: "/deletetransaction/:id",
        });
    }
}
exports.deleteTransaction = deleteTransaction;
