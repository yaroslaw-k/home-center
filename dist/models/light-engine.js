"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerialPort = require("serialport");
const rxjs_1 = require("rxjs");
const light_modes_1 = require("./light-modes");
class LightEngine {
    constructor() {
        this.writePeriod = 10; // ms
        this.value = 0;
        this.serialAddresses = ['COM3', 'COM4'];
        this.modes = light_modes_1.lightModes;
        this.tickGenerator = rxjs_1.timer(0, this.writePeriod);
        this.start();
    }
    start() {
        this.currentMode = this.modes.find(m => m.name === 'staticColors');
        this.serialPorts = [
            new SerialPort(this.serialAddresses[0], { baudRate: 115200 }),
            new SerialPort(this.serialAddresses[1], { baudRate: 115200 }),
        ];
        // console.time('->');
        this.tickGenerator.subscribe(_ => this.writeOutput());
        console.log('Light Engine Started!');
    }
    writeOutput() {
        // console.timeLog('->');
        this.currentMode.processFunc();
        let val = [
            this.value2String(this.currentMode.lightStates[0]),
            this.value2String(this.currentMode.lightStates[1])
        ];
        // console.log(val);
        this.serialPorts[0].write(val[0]);
        this.serialPorts[1].write(val[1]);
    }
    genStringParam(p) {
        let ps = p.toString(10);
        while (ps.length < 3) {
            ps = '0' + ps;
        }
        return ps;
    }
    value2String(options) {
        return 's' + this.genStringParam(options.r)
            + this.genStringParam(options.g)
            + this.genStringParam(options.b)
            + this.genStringParam(options.w) + 'f';
    }
    setMode(modeName, params) {
        console.log('-->', modeName, params);
        this.currentMode = this.modes.find(m => m.name === modeName);
        this.currentMode.setFunc(params);
    }
}
exports.LightEngine = LightEngine;
//# sourceMappingURL=light-engine.js.map