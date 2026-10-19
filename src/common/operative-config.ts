/**
 * Configurazione operativi condivisa tra extension host e webview panel.
 * NON importa tipi DOM — compatibile con tsconfig.extension.json.
 */
import { OperativeColor, OperativeType } from './types';

const OPERATIVE_COLORS: Record<string, OperativeColor[]> = {
    'solid-snake': [
        OperativeColor.sneakingSuit,
        OperativeColor.bandana,
        OperativeColor.tuxedo,
        OperativeColor.foxhound,
        OperativeColor.vrMission,
    ],
    'cardboard-box': [
        OperativeColor.normal,
        OperativeColor.snow,
        OperativeColor.desert,
    ],
    'genome-soldier': [
        OperativeColor.normal,
        OperativeColor.foxhound,
        OperativeColor.snow,
    ],
    'gray-fox': [
        OperativeColor.cyborg,
        OperativeColor.ninja,
    ],
    'raiden': [
        OperativeColor.normal,
        OperativeColor.whiteSuit,
        OperativeColor.cyborg,
    ],
    'metal-gear-rex': [
        OperativeColor.normal,
    ],
};

export function availableColors(operativeType: OperativeType): OperativeColor[] {
    const colors = OPERATIVE_COLORS[operativeType as string];
    if (!colors) {
        return [OperativeColor.normal];
    }
    return colors;
}

export function normalizeColor(color: OperativeColor, type: OperativeType): OperativeColor {
    const colors = availableColors(type);
    if (colors.includes(color)) {
        return color;
    }
    return colors[0];
}
