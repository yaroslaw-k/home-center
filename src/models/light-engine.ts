import SerialPort = require("serialport");
import {timer} from "rxjs";
import {Irgbw, LightMode, lightModes} from "./light-modes";


export class LightEngine {
    writePeriod: number = 3; // ms
    baudRate: number = 250000;
    value: number = 0;
    serialPorts: SerialPort[];
    serialAddresses = ['/dev/ttyUSB0', '/dev/ttyUSB1'];
    modes = lightModes;
    currentMode: LightMode;

    tickGenerator = timer(0, this.writePeriod);


    constructor() {
        this.start();
    }

    start() {
        this.currentMode = this.modes.find(m => m.name === 'staticColors');
        this.serialPorts = [
            new SerialPort(this.serialAddresses[0], {baudRate: this.baudRate}),
            new SerialPort(this.serialAddresses[1], {baudRate: this.baudRate}),
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

    genStringParam(p: number) {
        let ps = p.toString(10);
        while (ps.length < 3) {
            ps = '0' + ps;
        }
        return ps;
    }

    value2String(options: Irgbw): string {
        return 's' + this.genStringParam(options.r)
            + this.genStringParam(options.g)
            + this.genStringParam(options.b)
            + this.genStringParam(options.w) + 'f';
    }

    setMode(modeName: string, params: any) {
        console.log('-->', modeName, params);
        this.currentMode = this.modes.find(m => m.name === modeName);
        this.currentMode.setFunc(params);
    }

}
