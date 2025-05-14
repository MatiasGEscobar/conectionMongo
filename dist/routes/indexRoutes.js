"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send('Hello World!');
});
router.get("/api", (req, res) => {
    res.json({ message: "Hello from the API!" });
});
exports.default = router;
