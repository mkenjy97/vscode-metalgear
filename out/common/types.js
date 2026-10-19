"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_THEMES = exports.ALL_SCALES = exports.ALL_COLORS = exports.ALL_OPERATIVES = exports.WebviewMessage = void 0;
class WebviewMessage {
    constructor(text, command) {
        this.text = text;
        this.command = command;
    }
}
exports.WebviewMessage = WebviewMessage;
exports.ALL_OPERATIVES = [
    "solid-snake" /* OperativeType.solidSnake */,
    "cardboard-box" /* OperativeType.cardboardBox */,
    "genome-soldier" /* OperativeType.genomeSoldier */,
    "gray-fox" /* OperativeType.grayFox */,
    "raiden" /* OperativeType.raiden */,
    "metal-gear-rex" /* OperativeType.metalGearRex */,
];
exports.ALL_COLORS = [
    "sneaking-suit" /* OperativeColor.sneakingSuit */,
    "bandana" /* OperativeColor.bandana */,
    "tuxedo" /* OperativeColor.tuxedo */,
    "foxhound" /* OperativeColor.foxhound */,
    "vr-mission" /* OperativeColor.vrMission */,
    "snow" /* OperativeColor.snow */,
    "desert" /* OperativeColor.desert */,
    "normal" /* OperativeColor.normal */,
    "cyborg" /* OperativeColor.cyborg */,
    "ninja" /* OperativeColor.ninja */,
    "white-suit" /* OperativeColor.whiteSuit */,
    "null" /* OperativeColor.null */,
];
exports.ALL_SCALES = [
    "nano" /* OperativeSize.nano */,
    "small" /* OperativeSize.small */,
    "medium" /* OperativeSize.medium */,
    "large" /* OperativeSize.large */,
];
exports.ALL_THEMES = [
    "none" /* Theme.none */,
    "shadow-moses" /* Theme.shadowMoses */,
    "mother-base" /* Theme.motherBase */,
    "big-shell" /* Theme.bigShell */,
    "outer-heaven" /* Theme.outerHeaven */,
];
