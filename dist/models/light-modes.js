"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LightMode {
    constructor(name, processFunc, setFunc, lightStates, modeState) {
        this.name = name;
        this.processFunc = processFunc;
        this.setFunc = setFunc;
        this.lightStates = lightStates;
        this.modeState = modeState;
    }
}
exports.LightMode = LightMode;
exports.lightModes = [
    new LightMode('staticColors', () => {
    }, function (params) {
        this.lightState[0] = params.p0;
        this.lightState[1] = params.p1;
    }, [{ r: 0, g: 0, b: 0, w: 0 }, { r: 0, g: 0, b: 0, w: 0 }]),
    new LightMode('party', function () {
        this.modeState.forEach((s, i) => {
            if (this.lightStates[i][s] === 255) {
                const colors = ["r", "g", "b"];
                colors.splice(colors.findIndex(c => c === this.modeState[i]), 1);
                this.modeState[i] = colors[Math.floor(Math.random() * colors.length)];
                ["r", "g", "b"].forEach(c => this.lightStates[i][c] = 0);
                this.lightStates[i][this.modeState[i]] = 50;
            }
            let v = this.lightStates[i][this.modeState[i]] * 1.02;
            if (v > 255)
                v = 255;
            this.lightStates[i][this.modeState[i]] = Math.round(v);
        });
    }, () => { }, [{ r: 50, g: 0, b: 0, w: 0 }, { r: 0, g: 50, b: 0, w: 0 }], ['r', 'g']),
    new LightMode('strobe', function () {
        let ct = (+(new Date()) - this.modeState.startTime);
        // console.log('timeLeft', ct/1000);
        if (Math.floor(ct / this.modeState.period) % 2 === 0) {
            this.lightStates[0].w = 255;
            this.lightStates[1].w = 255;
            // console.log('->')
        }
        else {
            this.lightStates[0].w = 0;
            this.lightStates[1].w = 0;
        }
    }, function (params) {
        this.modeState.period = Math.round(1000 / params.frequency); //strobe period in ms
        console.log('period: ', this.modeState.period);
    }, [{ r: 0, g: 0, b: 0, w: 0 }, { r: 0, g: 0, b: 0, w: 0 }], { startTime: new Date(), period: 1000 })
];
//# sourceMappingURL=light-modes.js.map