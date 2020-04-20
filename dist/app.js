"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const apiRouter = require('./routes/light-api');
exports.app = express();
exports.app.use(logger('dev'));
exports.app.use(express.json());
exports.app.use(express.urlencoded({ extended: false }));
exports.app.use(cookieParser());
exports.app.use(express.static(path.join(__dirname, 'public')));
exports.app.use('/api-light', apiRouter);
module.exports = exports.app;
//# sourceMappingURL=app.js.map