"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalGearRex = void 0;
const basepettype_1 = require("../basepettype");
/**
 * Metal Gear REX — fermo, imponente. Non si muove mai autonomamente.
 * Può inseguire la razione se viene lanciata.
 */
class MetalGearRex extends basepettype_1.BasePetType {
    constructor() {
        super(...arguments);
        this.label = 'metal-gear-rex';
        this.sequence = {
            startingState: "sit-idle" /* States.sitIdle */,
            sequenceStates: [
                {
                    state: "sit-idle" /* States.sitIdle */,
                    possibleNextStates: ["sit-idle" /* States.sitIdle */],
                },
                {
                    state: "chase" /* States.chase */,
                    possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
                },
                {
                    state: "idle-with-ball" /* States.idleWithBall */,
                    possibleNextStates: ["sit-idle" /* States.sitIdle */],
                },
            ],
        };
    }
    get emoji() {
        return '🤖';
    }
    get hello() {
        return `FOOL! This is my moment of triumph! ☢️`;
    }
}
exports.MetalGearRex = MetalGearRex;
MetalGearRex.possibleColors = [
    "normal" /* OperativeColor.normal */,
];
