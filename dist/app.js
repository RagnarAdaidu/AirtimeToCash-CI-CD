"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_config_1 = __importDefault(require("./config/database.config"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const user_1 = __importDefault(require("./routes/user"));
const account_1 = __importDefault(require("./routes/account"));
const withdrawal_1 = __importDefault(require("./routes/withdrawal"));
//db.sync({ alter: true })
database_config_1.default.sync({ force: false })
    .then(() => {
    console.log('Database conneted successfully');
})
    .catch((err) => {
    console.log(err);
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
//app.use(express.static(path.join("public")));
// app.use('/user', usersRouter);
app.use('/users', user_1.default);
app.use('/account', account_1.default);
app.use('/cash', withdrawal_1.default);
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
exports.default = app;
