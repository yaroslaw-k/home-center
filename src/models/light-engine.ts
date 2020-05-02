import SerialPort = require("serialport");
import {Observable, timer} from "rxjs";
import {Irgbw, LightMode, lightModes} from "./light-modes";
import {take} from "rxjs/operators";


export class LightEngine {
    writePeriod: number = 3; // ms
    baudRate: number = 250000;
    value: number = 0;
    serialPorts: SerialPort[];
    serialAddresses = ['/dev/ttyUSB0', '/dev/ttyUSB1'];
    modes = lightModes;
    currentMode: LightMode;
    tickGenerator = timer(0, this.writePeriod);
    alarmEmitter: Observable<any>;


    constructor() {
        this.start();
    }

    start() {
        this.currentMode = this.modes.find(m => m.name === 'staticColors');
        this.serialPorts = [
            new SerialPort(this.serialAddresses[0], {baudRate: this.baudRate}),
            new SerialPort(this.serialAddresses[1], {baudRate: this.baudRate}),
        ];
        this.tickGenerator.subscribe(_ => this.writeOutput());
        console.log('Light Engine Started!');
    }

    writeOutput() {
        this.currentMode.processFunc();
        let val = [
            this.value2String(this.currentMode.lightStates[0]),
            this.value2String(this.currentMode.lightStates[1])
        ];
        this.serialPorts[0].write(val[0]);
        this.serialPorts[1].write(val[1]);
    }

    genStringParam(p: number) { // todo: change to pudsrt
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
        this.currentMode.stopFunc && this.currentMode.stopFunc();
        this.currentMode = this.modes.find(m => m.name === modeName);
        this.currentMode.setFunc(params);
    }

    setAlarm(date: Date, duration: number, maxPower: number) {
        this.alarmEmitter = timer(date, 1000,);
        this.alarmEmitter.pipe(take(1)).subscribe(
            _ => {
                this.setMode('morning', {duration: duration, maxPower: maxPower});
                this.alarmEmitter = null;
            }
        )
    }

}
