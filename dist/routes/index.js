"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpRoutes = void 0;
const startRoutes_1 = __importDefault(require("./startRoutes"));
const express_1 = __importDefault(require("express"));
const setUpRoutes = (app) => {
    app.use(express_1.default.json());
    app.use("/", startRoutes_1.default);
};
exports.setUpRoutes = setUpRoutes;
