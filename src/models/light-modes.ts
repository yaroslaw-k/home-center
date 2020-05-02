import {timer} from "rxjs";

export interface Irgbw {
    r: number,
    g: number,
    b: number,
    w: number
}

export class LightMode {
    name: string;
    processFunc: any; // func for count values
    setFunc: any;
    stopFunc?: any;
    lightStates: Irgbw[];
    modeState?: any;

    constructor(name, processFunc, setFunc, lightStates, modeState?, stopFunc?) {
        this.name = name;
        this.processFunc = processFunc;
        this.setFunc = setFunc;
        this.lightStates = lightStates;
        this.modeState = modeState;
        this.stopFunc = setFunc
    }

}

export const lightModes: LightMode[] = [
    new LightMode(
        'staticColors',
        () => {
        },
        function (params: { p0: Irgbw, p1: Irgbw }) {
            this.lightStates[0] = params.p0;
            this.lightStates[1] = params.p1;
        },
        [{r: 0, g: 0, b: 0, w: 0}, {r: 0, g: 0, b: 0, w: 0}]
    ),
    new LightMode(
        'party',
        function () {
            this.modeState.forEach((s, i) => {
                if (this.lightStates[i][s] === 255) {
                    const colors = ["r", "g", "b"];
                    colors.splice(colors.findIndex(c => c === this.modeState[i]), 1);
                    this.modeState[i] = colors[Math.floor(Math.random() * colors.length)];
                    ["r", "g", "b"].forEach(c => this.lightStates[i][c] = 0);
                    this.lightStates[i][this.modeState[i]] = 50;
                }
                let v = this.lightStates[i][this.modeState[i]] * 1.02;
                if (v > 255) v = 255;
                this.lightStates[i][this.modeState[i]] = Math.round(v);
            });

        },
        () => {
        },
        [{r: 50, g: 0, b: 0, w: 0}, {r: 0, g: 50, b: 0, w: 0}],
        ['r', 'g']
    ),
    new LightMode(
        'strobe',
        function () {
            let ct = (+(new Date()) - this.modeState.startTime);
            // console.log('timeLeft', ct/1000);
            if (Math.floor(ct / this.modeState.period) % 2 === 0) {
                this.lightStates[0].w = 255;
                this.lightStates[1].w = 255;
                // console.log('->')
            } else {
                this.lightStates[0].w = 0;
                this.lightStates[1].w = 0;
            }
        },
        function (params: { frequency: number }) {
            this.modeState.startTime = new Date();
            this.modeState.period = Math.round(1000 / params.frequency); //strobe period in ms
        },
        [{r: 0, g: 0, b: 0, w: 0}, {r: 0, g: 0, b: 0, w: 0}],
        {startTime: Date, period: 1000}
    ),
    new LightMode(
        'morning',
        function () {
            let ct = (+(new Date()) - this.modeState.startTime);
            if (ct / 60000 >= 10) {
                let val = (ct / (this.modeState.duraton * 60 * 1000))
                    * (this.modeState.maxPower / 100) * 255;
                this.lightStates[0].w = Math.round(val);
                this.lightStates[1].w = Math.round(val);
                this.lightStates[0].b = Math.round(val * 0.3);
                this.lightStates[1].b = Math.round(val * 0.3);
            }
        },
        function (params: { duration: number, maxPower: number }) {
            this.modeState.startTime = new Date();
            this.modeState.duration = params.duration; // sunrise duration in min
            this.modeState.maxPower = params.maxPower;
        },
        [{r: 0, g: 0, b: 0, w: 0}, {r: 0, g: 0, b: 0, w: 0}],
        {startTime: Date, duration: 10, maxPower: 100}
    ),

    new LightMode(
        'roundUp',
        function () {
        },
        function (params: { colors: Irgbw[][], speed: number }) {
            this.lightStates = params.colors[0];
            this.modeState.ticker = timer(0, params.speed).subscribe(() => {
                this.modeState.counter++;
                if (this.modeState.counter === 255) {
                    this.modeState.counter = 0;
                    this.modeState.currentColorI = this.modeState.currentColorI < (params.colors.length - 1) ? this.modeState.currentColorI + 1 : 0;
                }
                [0, 1].forEach(n => {
                    ['r', 'g', 'b', 'w'].forEach(c => {
                        this.lightStates[n][c] = this.lightStates[n][c]
                            + params.colors[this.modeState.currentColorI < (params.colors.length - 1) ? this.modeState.currentColorI + 1 : 0][n][c]
                            - params.colors[this.modeState.currentColorI][n][c];
                    })
                })
            });
        },
        [],
        {ticker: null, currentColorI: 0, counter: 0},
        function () {
            this.modeState.ticker.unsubscribe();
        }
    )

];




