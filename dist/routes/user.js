"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const users_1 = require("../controller/users");
router.get("/verify/:token", async (req, res) => {
    const token = req.params.token;
    const response = await (0, users_1.verifyUser)(token);
    const link = `${process.env.FRONTEND_URL}`;
    res.redirect(`${link}/login`);
});
router.patch('/update/:id', auth_1.auth, users_1.Updateprofile);
router.get('/user/:id', users_1.getUsers);
router.post('/create', users_1.RegisterUser);
router.get('/getuser/:id', auth_1.auth, users_1.getUser);
router.post('/login', users_1.LoginUser);
router.post('/forgotpassword', users_1.forgotPassword);
router.patch('/change-password/:id', users_1.changePassword);
router.get('/userrecords', auth_1.auth, users_1.getUserRecords);
exports.default = router;
