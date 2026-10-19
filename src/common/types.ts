/**
 * Operative color/variant — corrisponde al nome della cartella sprite
 * es. media/solid-snake/sneaking-suit_idle_8fps.gif
 */
export const enum OperativeColor {
    sneakingSuit = 'sneaking-suit',
    bandana = 'bandana',
    tuxedo = 'tuxedo',
    foxhound = 'foxhound',
    vrMission = 'vr-mission',
    snow = 'snow',
    desert = 'desert',
    normal = 'normal',
    cyborg = 'cyborg',
    ninja = 'ninja',
    whiteSuit = 'white-suit',
    null = 'null',
}

export const enum OperativeType {
    solidSnake = 'solid-snake',
    cardboardBox = 'cardboard-box',
    genomeSoldier = 'genome-soldier',
    grayFox = 'gray-fox',
    raiden = 'raiden',
    metalGearRex = 'metal-gear-rex',
    null = 'null',
}

export const enum OperativeSpeed {
    still = 0,
    verySlow = 1,
    slow = 2,
    normal = 3,
    fast = 4,
    veryFast = 5,
}

export const enum OperativeSize {
    nano = 'nano',
    small = 'small',
    medium = 'medium',
    large = 'large',
}

export const enum ExtPosition {
    panel = 'panel',
    explorer = 'explorer',
}

export const enum Theme {
    none = 'none',
    shadowMoses = 'shadow-moses',
    motherBase = 'mother-base',
    bigShell = 'big-shell',
    outerHeaven = 'outer-heaven',
}

export const enum ColorThemeKind {
    light = 1,
    dark = 2,
    highContrast = 3,
    highContrastLight = 4,
}

export class WebviewMessage {
    text: string;
    command: string;

    constructor(text: string, command: string) {
        this.text = text;
        this.command = command;
    }
}

export const ALL_OPERATIVES = [
    OperativeType.solidSnake,
    OperativeType.cardboardBox,
    OperativeType.genomeSoldier,
    OperativeType.grayFox,
    OperativeType.raiden,
    OperativeType.metalGearRex,
];

export const ALL_COLORS = [
    OperativeColor.sneakingSuit,
    OperativeColor.bandana,
    OperativeColor.tuxedo,
    OperativeColor.foxhound,
    OperativeColor.vrMission,
    OperativeColor.snow,
    OperativeColor.desert,
    OperativeColor.normal,
    OperativeColor.cyborg,
    OperativeColor.ninja,
    OperativeColor.whiteSuit,
    OperativeColor.null,
];

export const ALL_SCALES = [
    OperativeSize.nano,
    OperativeSize.small,
    OperativeSize.medium,
    OperativeSize.large,
];

export const ALL_THEMES = [
    Theme.none,
    Theme.shadowMoses,
    Theme.motherBase,
    Theme.bigShell,
    Theme.outerHeaven,
];
