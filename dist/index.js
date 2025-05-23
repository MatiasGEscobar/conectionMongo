"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("dotenv/config");
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const serverOnline = async () => {
    try {
        await (0, dbConfig_1.default)();
        console.log('BDD online');
        app_1.default.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error(error);
    }
};
serverOnline();
