"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardboardBox = void 0;
const basepettype_1 = require("../basepettype");
/**
 * Cardboard Box — si muove lentamente, non arrampica pareti.
 * Quando viene toccata emette "!" (alert stealth rotto).
 */
class CardboardBox extends basepettype_1.BasePetType {
    constructor() {
        super(...arguments);
        this.label = 'cardboard-box';
        this.sequence = {
            startingState: "sit-idle" /* States.sitIdle */,
            sequenceStates: [
                {
                    state: "sit-idle" /* States.sitIdle */,
                    possibleNextStates: ["walk-right" /* States.walkRight */, "walk-left" /* States.walkLeft */, "sit-idle" /* States.sitIdle */],
                },
                {
                    state: "walk-right" /* States.walkRight */,
                    possibleNextStates: ["sit-idle" /* States.sitIdle */, "walk-left" /* States.walkLeft */],
                },
                {
                    state: "walk-left" /* States.walkLeft */,
                    possibleNextStates: ["sit-idle" /* States.sitIdle */, "walk-right" /* States.walkRight */],
                },
                {
                    state: "chase" /* States.chase */,
                    possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
                },
                {
                    state: "idle-with-ball" /* States.idleWithBall */,
                    possibleNextStates: ["walk-right" /* States.walkRight */, "walk-left" /* States.walkLeft */, "sit-idle" /* States.sitIdle */],
                },
            ],
        };
    }
    get emoji() {
        return '📦';
    }
    get hello() {
        return `...`;
    }
    swipe() {
        // Sovrascriviamo swipe: la scatola non può combattere,
        // ma emette il classico "!" del rilevamento nemico
        this.showSpeechBubble('❗', 2000);
    }
}
exports.CardboardBox = CardboardBox;
CardboardBox.possibleColors = [
    "normal" /* OperativeColor.normal */,
    "snow" /* OperativeColor.snow */,
    "desert" /* OperativeColor.desert */,
];
