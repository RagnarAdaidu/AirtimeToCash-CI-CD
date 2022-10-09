"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRecords = exports.getUsers = exports.Updateprofile = exports.changePassword = exports.forgotPassword = exports.LoginUser = exports.getUser = exports.verifyUser = exports.RegisterUser = void 0;
const uuid_1 = require("uuid");
const user_1 = require("../models/user");
const validation_1 = require("../utils/validation");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailSender_1 = require("./mailSender");
const emailService_1 = require("./emailService");
const utils_1 = require("../utils/utils");
const emailVerification_1 = require("../email/emailVerification");
const account_1 = require("../models/account");
const secret = process.env.JWT_SECRET;
async function RegisterUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const ValidateUser = validation_1.validationSchema.validate(req.body, validation_1.options);
        if (ValidateUser.error) {
            return res.status(400).json({
                Error: ValidateUser.error.details[0].message,
            });
        }
        const duplicatEmail = await user_1.UserInstance.findOne({
            where: { email: req.body.email },
        });
        if (duplicatEmail) {
            return res.status(409).json({
                msg: "Email is used, please enter another email",
            });
        }
        const duplicatePhone = await user_1.UserInstance.findOne({
            where: { phonenumber: req.body.phonenumber },
        });
        if (duplicatePhone) {
            return res.status(409).json({
                msg: "Phone number is used",
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await user_1.UserInstance.create({
            id: id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            password: passwordHash,
            isVerified: false,
            avatar: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000",
            wallet: 0
        });
        if (record) {
            const email = req.body.email;
            const subject = "User verification";
            const username = req.body.username;
            const token = jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: '7d' });
            const html = (0, mailSender_1.emailVerificationView)(token);
            await (0, emailService_1.sendMail)(html, email, subject, username);
            res.json({ msg: "User created successfully", record, token });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'failed to register',
            route: '/create'
        });
    }
}
exports.RegisterUser = RegisterUser;
async function verifyUser(token) {
    const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const details = decode;
    const id = details.id;
    const user = await user_1.UserInstance.findByPk(id);
    if (!user)
        throw new Error('user not found');
    return await user.update({ isVerified: true });
}
exports.verifyUser = verifyUser;
async function getUser(req, res, next) {
    try {
        //const id=req.user.id;
        const { id } = req.params;
        const record = await user_1.UserInstance.findOne({ where: { id } });
        res.status(200).json({ "record": record });
    }
    catch (error) {
        res.status(500).json({
            msg: "Invalid User",
            route: "/read/:id",
        });
    }
}
exports.getUser = getUser;
async function LoginUser(req, res, next) {
    try {
        const validationResult = validation_1.loginSchema.validate(req.body, validation_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const userEmail = req.body.email;
        const userName = req.body.username;
        const record = userEmail
            ? (await user_1.UserInstance.findOne({
                where: [{ email: userEmail }]
            }))
            : (await user_1.UserInstance.findOne({
                where: [{ username: userName }]
            }));
        //console.log("yayyy")
        if (record.isVerified) {
            const { id } = record;
            const { password } = record;
            const token = (0, utils_1.generateToken)({ id });
            const validUser = await bcryptjs_1.default.compare(req.body.password, password);
            if (!validUser) {
                return res.status(401).json({
                    msg: 'Password do not match'
                });
            }
            if (validUser) {
                res.cookie('mytoken', token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24
                });
                res.status(200).json({
                    status: 'success',
                    msg: 'login successful',
                    record: record,
                    token: token
                });
            }
        }
        else {
            return res.status(400).json({
                msg: "Please verify your email address"
            });
        }
    }
    catch (err) {
        res.status(500).json({
            msg: 'Incorrect username or email',
            route: '/login'
        });
    }
}
exports.LoginUser = LoginUser;
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = (await user_1.UserInstance.findOne({
            where: {
                email: email
            }
        }));
        if (!user) {
            return res.status(404).json({
                message: 'email not found'
            });
        }
        const { id } = user;
        const fromUser = process.env.FROM;
        const subject = process.env.SUBJECT;
        const html = (0, emailVerification_1.forgotPasswordVerification)(id);
        await (0, emailService_1.sendMail)(html, req.body.email, subject, fromUser);
        res.status(200).json({
            message: 'Check email for the verification link'
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}
exports.forgotPassword = forgotPassword;
async function changePassword(req, res) {
    try {
        const { id } = req.params;
        const validationResult = validation_1.changePasswordSchema.validate(req.body, validation_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                error: validationResult.error.details[0].message
            });
        }
        const user = await user_1.UserInstance.findOne({
            where: {
                id: id
            }
        });
        if (!user) {
            return res.status(403).json({
                message: 'user does not exist'
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        await user?.update({
            password: passwordHash
        });
        return res.status(200).json({
            message: 'Password Successfully Changed'
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}
exports.changePassword = changePassword;
async function Updateprofile(req, res, next) {
    try {
        const { id } = req.params;
        const { firstname, lastname, phonenumber, wallet } = req.body;
        const validateResult = validation_1.updateProfileSchema.validate(req.body, validation_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const record = await user_1.UserInstance.findByPk(id);
        if (!record) {
            res.status(404).json({
                Error: "cannot find user",
            });
        }
        const updaterecord = await record?.update({
            firstname,
            lastname,
            phonenumber,
            wallet
        });
        res.status(201).json({
            message: 'you have successfully updated your profile',
            record: updaterecord
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'failed to update profile',
            route: '/update/:id'
        });
    }
}
exports.Updateprofile = Updateprofile;
async function getUsers(req, res, next) {
    try {
        const id = req.params.id;
        const record = await user_1.UserInstance.findOne({ where: { id } });
        res.status(200).json({
            record
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'failed to get user',
            route: '/user/:id'
        });
    }
}
exports.getUsers = getUsers;
async function getUserRecords(req, res, next) {
    try {
        const userId = req.user.id;
        const record = (await user_1.UserInstance.findOne({
            where: { id: userId },
            include: [{ model: account_1.AccountInstance, as: "accounts" }],
        }));
        res.status(200).json({
            record: record,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: "failed to login",
            route: "/login",
        });
    }
}
exports.getUserRecords = getUserRecords;
