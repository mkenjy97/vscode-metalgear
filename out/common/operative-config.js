"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeColor = exports.availableColors = void 0;
const OPERATIVE_COLORS = {
    'solid-snake': [
        "sneaking-suit" /* OperativeColor.sneakingSuit */,
        "bandana" /* OperativeColor.bandana */,
        "tuxedo" /* OperativeColor.tuxedo */,
        "foxhound" /* OperativeColor.foxhound */,
        "vr-mission" /* OperativeColor.vrMission */,
    ],
    'cardboard-box': [
        "normal" /* OperativeColor.normal */,
        "snow" /* OperativeColor.snow */,
        "desert" /* OperativeColor.desert */,
    ],
    'genome-soldier': [
        "normal" /* OperativeColor.normal */,
        "foxhound" /* OperativeColor.foxhound */,
        "snow" /* OperativeColor.snow */,
    ],
    'gray-fox': [
        "cyborg" /* OperativeColor.cyborg */,
        "ninja" /* OperativeColor.ninja */,
    ],
    'raiden': [
        "normal" /* OperativeColor.normal */,
        "white-suit" /* OperativeColor.whiteSuit */,
        "cyborg" /* OperativeColor.cyborg */,
    ],
    'metal-gear-rex': [
        "normal" /* OperativeColor.normal */,
    ],
};
function availableColors(operativeType) {
    const colors = OPERATIVE_COLORS[operativeType];
    if (!colors) {
        return ["normal" /* OperativeColor.normal */];
    }
    return colors;
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
