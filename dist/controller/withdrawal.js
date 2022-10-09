"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserWithdrawals = exports.getAllWithdrawals = exports.withdrawal = void 0;
const uuid_1 = require("uuid");
const withdrawal_1 = require("../models/withdrawal");
const user_1 = require("../models/user");
const account_1 = require("../models/account");
const utils_1 = require("../utils/utils");
const flutter_1 = require("./flutter");
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
async function withdrawal(req, res, next) {
    const withdrawalId = (0, uuid_1.v4)();
    try {
        let wallet;
        const userID = req.user.id;
        const { amount, bankName, accNumber } = req.body;
        const validateInput = await utils_1.withdrawalSchema.validate(req.body);
        if (validateInput.error) {
            return res.status(400).json(validateInput.error.details[0].message);
        }
        const customer = (await user_1.UserInstance.findOne({ where: { id: userID } }));
        if (!customer) {
            return res.status(401).json({ message: ' Sorry customer does not exist' });
        }
        //
        const validateAccount = await account_1.AccountInstance.findOne({ where: { accNumber } });
        if (!validateAccount) {
            return res.status(401).json({ message: 'Sorry this account is not registered' });
        }
        if (validateAccount.userId !== userID) {
            return res.status(401).json({ message: ' Sorry this account is not registered by this customer!' });
        }
        wallet = customer.wallet;
        if (amount > wallet) {
            return res.status(401).json({ message: 'Insufficient fund!' });
        }
        // fluterwave function here...
        let allBanks = await (0, flutter_1.getAllBanksNG)();
        console.log(allBanks);
        const bankCode = allBanks.data.filter((item) => item.name.toLowerCase() == bankName.toLowerCase());
        let code = bankCode[0].code;
        console.log(code);
        const details = {
            // account_bank: "044",
            account_bank: code,
            // account_number:"0690000040",
            account_number: accNumber,
            amount: amount,
            narration: 'Airtime for cash',
            currency: "NGN",
            //reference: generateTransactionReference(),
            callback_url: "https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d",
            debit_currency: "NGN"
        };
        //    let flutta = await flw.Transfer.initiate(details)
        //     .then(console.log)
        //     .catch(console.log);
        const flutta = await (0, flutter_1.initTrans)(details);
        // const response = await flw.Transfer.initiate(details);
        // console.log(response)
        // const statusUrl = `${BASE_API_URL}/transfers/${response.data.id}`;
        // const respo = await axios.get(statusUrl, options);
        console.log('this is what i want', flutta.status);
        if (flutta.status === 'success') {
            const newwallet = wallet - amount;
            const customerUpdatedRecord = await user_1.UserInstance.update({ wallet: newwallet }, { where: { id: userID } });
            const withdrawalHistory = await withdrawal_1.WithdrawalInstance.create({
                id: withdrawalId,
                amount,
                bankName,
                accNumber,
                userID,
                status: true
            });
            return res.status(201).json({ message: `You have successfully withdrawn N${amount} from your wallet`, withdrawalHistory, newwallet });
        }
        else {
            await withdrawal_1.WithdrawalInstance.create({
                id: withdrawalId,
                amount,
                bankName,
                accNumber,
                userID,
                status: false
            });
            return res.status(401).json({ message: `S0rry yourwithdrawal was not successful service error`, flutta });
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.withdrawal = withdrawal;
async function getAllWithdrawals(req, res, next) {
    try {
        const allWithdrawalHistory = await withdrawal_1.WithdrawalInstance.findAll();
        if (!allWithdrawalHistory) {
            return res.status(404).json({ message: 'Sorry there is currently no withdrawal history!' });
        }
        return res.status(200).json(allWithdrawalHistory);
    }
    catch (error) {
        return res.status(500).json({ message: 'failed to get all withdrawal history!' });
    }
}
exports.getAllWithdrawals = getAllWithdrawals;
async function getAllUserWithdrawals(req, res, next) {
    try {
        const userID = req.user.id;
        const allWithdrawalHistory = await withdrawal_1.WithdrawalInstance.findAll({ where: { userID } });
        if (!allWithdrawalHistory) {
            return res.status(404).json({ message: 'Sorry there is currently no withdrawal history!' });
        }
        return res.status(200).json(allWithdrawalHistory);
    }
    catch (error) {
        return res.status(500).json({ message: 'failed to get all withdrawal history!' });
    }
}
exports.getAllUserWithdrawals = getAllUserWithdrawals;
