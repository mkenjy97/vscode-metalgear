"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raiden = void 0;
const basepettype_1 = require("../basepettype");
class Raiden extends basepettype_1.BasePetType {
    constructor() {
        super(...arguments);
        this.label = 'raiden';
        this._climbSpeed = 2;
        this._climbHeight = 120;
        this._fallSpeed = 7;
        this.sequence = {
            startingState: "sit-idle" /* States.sitIdle */,
            sequenceStates: [
                {
                    state: "sit-idle" /* States.sitIdle */,
                    possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
                },
                {
                    state: "walk-right" /* States.walkRight */,
                    possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
                },
                {
                    state: "run-right" /* States.runRight */,
                    possibleNextStates: ["run-left" /* States.runLeft */, "walk-left" /* States.walkLeft */, "climb-wall-left" /* States.climbWallLeft */],
                },
                {
                    state: "walk-left" /* States.walkLeft */,
                    possibleNextStates: ["sit-idle" /* States.sitIdle */, "walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
                },
                {
                    state: "run-left" /* States.runLeft */,
                    possibleNextStates: [
                        "sit-idle" /* States.sitIdle */,
                        "climb-wall-left" /* States.climbWallLeft */,
                        "run-right" /* States.runRight */,
                        "walk-right" /* States.walkRight */,
                    ],
                },
                {
                    state: "climb-wall-left" /* States.climbWallLeft */,
                    possibleNextStates: ["wall-hang-left" /* States.wallHangLeft */],
                },
                {
                    state: "wall-hang-left" /* States.wallHangLeft */,
                    possibleNextStates: ["jump-down-left" /* States.jumpDownLeft */],
                },
                {
                    state: "jump-down-left" /* States.jumpDownLeft */,
                    possibleNextStates: ["land" /* States.land */],
                },
                {
                    state: "land" /* States.land */,
                    possibleNextStates: ["sit-idle" /* States.sitIdle */, "run-right" /* States.runRight */, "walk-right" /* States.walkRight */],
                },
                {
                    state: "chase" /* States.chase */,
                    possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
                },
                {
                    state: "idle-with-ball" /* States.idleWithBall */,
                    possibleNextStates: ["walk-right" /* States.walkRight */, "walk-left" /* States.walkLeft */, "run-right" /* States.runRight */, "run-left" /* States.runLeft */],
                },
            ],
        };
    }
    get emoji() {
        return '⚡';
    }
    get hello() {
        return `I'm Raiden. Jack, the Ripper. ⚡`;
    }
}
exports.Raiden = Raiden;
Raiden.possibleColors = [
    "normal" /* OperativeColor.normal */,
    "white-suit" /* OperativeColor.whiteSuit */,
    "cyborg" /* OperativeColor.cyborg */,
];
