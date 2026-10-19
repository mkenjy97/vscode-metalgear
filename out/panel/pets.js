"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeColor = exports.availableColors = exports.createPet = exports.createOperative = exports.InvalidOperativeException = exports.OperativeCollection = exports.PetElement = exports.OperativeElement = void 0;
const solidsnake_1 = require("./pets/solidsnake");
const cardboardbox_1 = require("./pets/cardboardbox");
const genomesoldier_1 = require("./pets/genomesoldier");
const grayfox_1 = require("./pets/grayfox");
const raiden_1 = require("./pets/raiden");
const metalgeaRrex_1 = require("./pets/metalgeaRrex");
class OperativeElement {
    remove() {
        this.el.remove();
        this.collision.remove();
        this.speech.remove();
        this.color = "null" /* OperativeColor.null */;
        this.type = "null" /* OperativeType.null */;
        this.operative.remove();
    }
    constructor(el, collision, speech, operative, color, type) {
        this.el = el;
        this.collision = collision;
        this.speech = speech;
        this.operative = operative;
        this.color = color;
        this.type = type;
    }
}
exports.OperativeElement = OperativeElement;
exports.PetElement = OperativeElement;
class OperativeCollection {
    constructor() {
        this._operatives = new Array(0);
    }
    get operatives() {
        return this._operatives;
    }
    // Alias pets per compatibilità
    get pets() {
        return this._operatives;
    }
    push(operative) {
        this._operatives.push(operative);
    }
    reset() {
        this._operatives.forEach((op) => op.remove());
        this._operatives = [];
    }
    locate(name) {
        return this._operatives.find((op) => op.operative.name === name);
    }
    locateOperative(name, type, color) {
        return this._operatives.find((op) => op.operative.name === name &&
            op.type === type &&
            op.color === color);
    }
    remove(target) {
        this._operatives.forEach((op) => {
            if (op === target) {
                op.remove();
            }
        });
        this._operatives = this._operatives.filter((op) => op !== target);
    }
    seekNewFriends() {
        if (this._operatives.length <= 1) {
            return;
        }
        const theFriendless = this._operatives.filter((op) => !op.operative.hasFriend);
        if (theFriendless.length <= 1) {
            return;
        }
        theFriendless.forEach((lonelyOp) => {
            const potentialFriends = theFriendless.filter((op) => op !== lonelyOp);
            potentialFriends.forEach((potentialFriend) => {
                if (!potentialFriend.operative.canChase) {
                    return;
                }
                if (potentialFriend.operative.left > lonelyOp.operative.left &&
                    potentialFriend.operative.left <
                        lonelyOp.operative.left + lonelyOp.operative.width) {
                    console.log(lonelyOp.operative.name, ' establishes codec link with ', potentialFriend.operative.name);
                    if (lonelyOp.operative.makeFriendsWith(potentialFriend.operative)) {
                        potentialFriend.operative.showSpeechBubble('📡', 2000);
                        lonelyOp.operative.showSpeechBubble('📡', 2000);
                    }
                }
            });
        });
    }
}
exports.OperativeCollection = OperativeCollection;
class InvalidOperativeException {
    constructor(message) {
        this.message = message;
    }
}
exports.InvalidOperativeException = InvalidOperativeException;
function createOperative(operativeType, el, collision, speech, size, left, bottom, petRoot, floor, name) {
    if (name === undefined || name === null || name === '') {
        throw new InvalidOperativeException('name is undefined');
    }
    const args = [el, collision, speech, size, left, bottom, petRoot, floor, name];
    switch (operativeType) {
        case "solid-snake" /* OperativeType.solidSnake */:
            return new solidsnake_1.SolidSnake(...args, 3 /* OperativeSpeed.normal */);
        case "cardboard-box" /* OperativeType.cardboardBox */:
            return new cardboardbox_1.CardboardBox(...args, 1 /* OperativeSpeed.verySlow */);
        case "genome-soldier" /* OperativeType.genomeSoldier */:
            return new genomesoldier_1.GenomeSoldier(...args, 4 /* OperativeSpeed.fast */);
        case "gray-fox" /* OperativeType.grayFox */:
            return new grayfox_1.GrayFox(...args, 5 /* OperativeSpeed.veryFast */);
        case "raiden" /* OperativeType.raiden */:
            return new raiden_1.Raiden(...args, 4 /* OperativeSpeed.fast */);
        case "metal-gear-rex" /* OperativeType.metalGearRex */:
            return new metalgeaRrex_1.MetalGearRex(...args, 0 /* OperativeSpeed.still */);
        default:
            throw new InvalidOperativeException("Operative type doesn't exist");
    }
}
exports.createOperative = createOperative;
exports.createPet = createOperative;
function availableColors(operativeType) {
    switch (operativeType) {
        case "solid-snake" /* OperativeType.solidSnake */:
            return solidsnake_1.SolidSnake.possibleColors;
        case "cardboard-box" /* OperativeType.cardboardBox */:
            return cardboardbox_1.CardboardBox.possibleColors;
        case "genome-soldier" /* OperativeType.genomeSoldier */:
            return genomesoldier_1.GenomeSoldier.possibleColors;
        case "gray-fox" /* OperativeType.grayFox */:
            return grayfox_1.GrayFox.possibleColors;
        case "raiden" /* OperativeType.raiden */:
            return raiden_1.Raiden.possibleColors;
        case "metal-gear-rex" /* OperativeType.metalGearRex */:
            return metalgeaRrex_1.MetalGearRex.possibleColors;
        default:
            throw new InvalidOperativeException("Operative type doesn't exist");
    }
}
exports.availableColors = availableColors;
function normalizeColor(color, type) {
    const colors = availableColors(type);
    if (colors.includes(color)) {
        return color;
    }
    return colors[0];
}
exports.normalizeColor = normalizeColor;
