"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const indexService_1 = __importDefault(require("../services/indexService"));
const indexService = new indexService_1.default();
class IndexController {
    constructor() {
        this.getController = async (req, res) => {
            try {
                const services = await indexService.getService();
                res.status(200).json({ message: "OK", data: services });
            }
            catch (error) {
                res.status(500).json({ message: "Error al obtener la información" });
            }
        };
    }
}
exports.default = IndexController;
