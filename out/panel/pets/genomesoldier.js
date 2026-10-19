"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenomeSoldier = void 0;
const basepettype_1 = require("../basepettype");
class GenomeSoldier extends basepettype_1.BasePetType {
    constructor() {
        super(...arguments);
        this.label = 'genome-soldier';
        this.sequence = {
            startingState: "sit-idle" /* States.sitIdle */,
            sequenceStates: [
                {
                    state: "sit-idle" /* States.sitIdle */,
                    possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */, "walk-left" /* States.walkLeft */],
                },
                {
                    state: "walk-right" /* States.walkRight */,
                    possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */, "sit-idle" /* States.sitIdle */],
                },
                {
                    state: "run-right" /* States.runRight */,
                    possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
                },
                {
                    state: "walk-left" /* States.walkLeft */,
                    possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */, "sit-idle" /* States.sitIdle */],
                },
                {
                    state: "run-left" /* States.runLeft */,
                    possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
                },
                {
                    state: "chase" /* States.chase */,
                    possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
                },
                {
                    state: "idle-with-ball" /* States.idleWithBall */,
                    possibleNextStates: ["walk-right" /* States.walkRight */, "walk-left" /* States.walkLeft */],
                },
            ],
        };
    }
    get emoji() {
        return '🪖';
    }
    get hello() {
        return `Freeze! Don't move! 🔫`;
    }
}
exports.GenomeSoldier = GenomeSoldier;
GenomeSoldier.possibleColors = [
    "normal" /* OperativeColor.normal */,
    "foxhound" /* OperativeColor.foxhound */,
    "snow" /* OperativeColor.snow */,
];
