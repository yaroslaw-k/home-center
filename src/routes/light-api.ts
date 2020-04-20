import {LightEngine} from "../models/light-engine";

const express = require('express');
const router = express.Router();

const lightEngine: LightEngine = new LightEngine();

router.get('/get-state', function(req, res, next) {
    res.json(lightEngine.currentMode);
});

router.post('/set-mode', function (req, res) {
    let body = req.body;
    lightEngine.setMode(body.mode, body.params);
    res.sendStatus(200);
});



module.exports = router;
