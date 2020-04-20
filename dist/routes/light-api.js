"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const light_engine_1 = require("../models/light-engine");
const express = require('express');
const router = express.Router();
const lightEngine = new light_engine_1.LightEngine();
router.get('/get-state', function (req, res, next) {
    res.json(lightEngine.currentMode);
});
router.post('/set-mode', function (req, res) {
    let body = req.body;
    lightEngine.setMode(body.mode, body.params);
    res.sendStatus(200);
});
module.exports = router;
//# sourceMappingURL=light-api.js.map