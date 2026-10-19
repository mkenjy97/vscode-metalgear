"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrayFox = void 0;
const basepettype_1 = require("../basepettype");
class GrayFox extends basepettype_1.BasePetType {
    constructor() {
        super(...arguments);
        this.label = 'gray-fox';
        // Gray Fox è molto veloce e può arrampicarsi
        this._climbSpeed = 2;
        this._climbHeight = 150;
        this._fallSpeed = 8;
        this.sequence = {
            startingState: "sit-idle" /* States.sitIdle */,
            sequenceStates: [
                {
                    state: "sit-idle" /* States.sitIdle */,
                    possibleNextStates: ["run-right" /* States.runRight */, "run-left" /* States.runLeft */],
                },
                {
                    state: "walk-right" /* States.walkRight */,
                    possibleNextStates: ["run-left" /* States.runLeft */, "run-right" /* States.runRight */],
                },
                {
                    state: "run-right" /* States.runRight */,
                    possibleNextStates: ["run-left" /* States.runLeft */, "walk-left" /* States.walkLeft */, "climb-wall-left" /* States.climbWallLeft */],
                },
                {
                    state: "walk-left" /* States.walkLeft */,
                    possibleNextStates: ["run-right" /* States.runRight */, "run-left" /* States.runLeft */],
                },
                {
                    state: "run-left" /* States.runLeft */,
                    possibleNextStates: [
                        "sit-idle" /* States.sitIdle */,
                        "climb-wall-left" /* States.climbWallLeft */,
                        "run-right" /* States.runRight */,
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
                    possibleNextStates: ["run-right" /* States.runRight */, "run-left" /* States.runLeft */],
                },
                {
                    state: "chase" /* States.chase */,
                    possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
                },
                {
                    state: "idle-with-ball" /* States.idleWithBall */,
                    possibleNextStates: ["run-right" /* States.runRight */, "run-left" /* States.runLeft */],
                },
            ],
        };
    }
    get emoji() {
        return '🥷';
    }
    get hello() {
        return `We're not tools of the government... ⚔️`;
    }
}
exports.GrayFox = GrayFox;
GrayFox.possibleColors = [
    "cyborg" /* OperativeColor.cyborg */,
    "ninja" /* OperativeColor.ninja */,
];
