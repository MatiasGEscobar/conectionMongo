"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const indexRepository_1 = require("../repository/indexRepository");
const indexRepository = new indexRepository_1.IndexRepository();
class IndexService {
    async getService() {
        return await indexRepository.getRepository();
    }
}
exports.default = IndexService;
