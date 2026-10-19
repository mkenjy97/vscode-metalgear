"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolidSnake = void 0;
const basepettype_1 = require("../basepettype");
class SolidSnake extends basepettype_1.BasePetType {
    constructor() {
        super(...arguments);
        this.label = 'solid-snake';
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
                    possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
                },
                {
                    state: "walk-left" /* States.walkLeft */,
                    possibleNextStates: [
                        "sit-idle" /* States.sitIdle */,
                        "climb-wall-left" /* States.climbWallLeft */,
                        "walk-right" /* States.walkRight */,
                        "run-right" /* States.runRight */,
                    ],
                },
                {
                    state: "run-left" /* States.runLeft */,
                    possibleNextStates: [
                        "sit-idle" /* States.sitIdle */,
                        "climb-wall-left" /* States.climbWallLeft */,
                        "walk-right" /* States.walkRight */,
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
                    possibleNextStates: [
                        "sit-idle" /* States.sitIdle */,
                        "walk-right" /* States.walkRight */,
                        "run-right" /* States.runRight */,
                    ],
                },
                {
                    state: "chase" /* States.chase */,
                    possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
                },
                {
                    state: "idle-with-ball" /* States.idleWithBall */,
                    possibleNextStates: [
                        "walk-right" /* States.walkRight */,
                        "walk-left" /* States.walkLeft */,
                        "run-left" /* States.runLeft */,
                        "run-right" /* States.runRight */,
                    ],
                },
            ],
        };
    }
    get emoji() {
        return '🐍';
    }
    get hello() {
        return `Snake? SNAKE! SNAAAAKE! 📡`;
    }
}
exports.SolidSnake = SolidSnake;
SolidSnake.possibleColors = [
    "sneaking-suit" /* OperativeColor.sneakingSuit */,
    "bandana" /* OperativeColor.bandana */,
    "tuxedo" /* OperativeColor.tuxedo */,
    "foxhound" /* OperativeColor.foxhound */,
    "vr-mission" /* OperativeColor.vrMission */,
];
