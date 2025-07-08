"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const constants_1 = require("./constants/constants");
const mongodb_1 = require("./db/mongodb");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongodb_1.connectDB)();
            const server = app_1.default.listen(Number(constants_1.PORT), "0.0.0.0", () => {
                console.log("Server is listening on Port:", constants_1.PORT, "......");
            });
            server.keepAliveTimeout = 120000; // 120 seconds
            server.headersTimeout = 120000; // 120 seconds
        }
        catch (error) {
            console.log(error);
        }
    });
}
init();
