"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.SALT_ROUNDS = exports.PORT = exports.MONGODB_URL = void 0;
require("dotenv");
exports.MONGODB_URL = process.env.MONGODB_URL;
exports.PORT = process.env.PORT;
exports.SALT_ROUNDS = process.env.SALT_ROUNDS;
exports.JWT_SECRET = process.env.JWT_SECRET;
