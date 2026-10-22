import { ColorThemeKind, OperativeSize, Theme } from '../common/types';
import { Effect } from './effects/effect';
import { SnowEffect } from './effects/snow';
import { RainEffect } from './effects/rain';

function normalizeColorThemeKind(kind: ColorThemeKind): 'dark' | 'light' {
    switch (kind) {
        case ColorThemeKind.light:
            return 'light';
        case ColorThemeKind.highContrastLight:
            return 'light';
        case ColorThemeKind.dark:
        case ColorThemeKind.highContrast:
        default:
            return 'dark';
    }
}

export class ThemeInfo {
    name: string = '';
    description: string = '';
    effect?: Effect = undefined;

    floor(_size: OperativeSize): number {
        return 0;
    }

    backgroundImageUrl(
        basePetUri: string,
        themeKind: ColorThemeKind,
        petSize: OperativeSize,
    ): string {
        const kind = normalizeColorThemeKind(themeKind);
        return `url('${basePetUri}/backgrounds/${this.name}/background-${kind}-${petSize}.png')`;
    }

    foregroundImageUrl(
        basePetUri: string,
        themeKind: ColorThemeKind,
        petSize: OperativeSize,
    ): string {
        const kind = normalizeColorThemeKind(themeKind);
        return `url('${basePetUri}/backgrounds/${this.name}/foreground-${kind}-${petSize}.png')`;
    }
}

/** Shadow Moses — impianto nucleare, Alaska. Sfondo bianco, neve nera. */
class ShadowMosesThemeInfo extends ThemeInfo {
    name = 'shadow-moses';
    description = 'Shadow Moses Island — FOXHOUND nuclear facility';
    effect = new SnowEffect('rgba(20, 20, 20, 0.85)');

    backgroundImageUrl(
        _basePetUri: string,
        _themeKind: ColorThemeKind,
        _petSize: OperativeSize,
    ): string {
        return 'linear-gradient(to bottom, #ffffff, #ffffff)';
    }

    foregroundImageUrl(
        _basePetUri: string,
        _themeKind: ColorThemeKind,
        _petSize: OperativeSize,
    ): string {
        return '';
    }

    floor(size: OperativeSize): number {
        switch (size) {
            case OperativeSize.small:  return 20;
            case OperativeSize.medium: return 30;
            case OperativeSize.large:  return 50;
            case OperativeSize.nano:
            default:                   return 15;
        }
    }
}

/** Mother Base — piattaforma offshore. Effetto pioggia. */
class MotherBaseThemeInfo extends ThemeInfo {
    name = 'mother-base';
    description = 'Mother Base — MSF offshore platform';
    effect = new RainEffect();

    floor(size: OperativeSize): number {
        switch (size) {
            case OperativeSize.small:  return 50;
            case OperativeSize.medium: return 65;
            case OperativeSize.large:  return 100;
            case OperativeSize.nano:
            default:                   return 38;
        }
    }
}

/** Big Shell — impianto di purificazione, MGS2. Effetto pioggia. */
class BigShellThemeInfo extends ThemeInfo {
    name = 'big-shell';
    description = 'Big Shell — offshore cleanup facility (MGS2)';
    effect = new RainEffect();

    floor(size: OperativeSize): number {
        switch (size) {
            case OperativeSize.small:  return 55;
            case OperativeSize.medium: return 72;
            case OperativeSize.large:  return 110;
            case OperativeSize.nano:
            default:                   return 42;
        }
    }
}

/** Outer Heaven — fortezza di mercenari. Nessun effetto. */
class OuterHeavenThemeInfo extends ThemeInfo {
    name = 'outer-heaven';
    description = 'Outer Heaven — mercenary fortress';

    floor(size: OperativeSize): number {
        switch (size) {
            case OperativeSize.small:  return 30;
            case OperativeSize.medium: return 42;
            case OperativeSize.large:  return 65;
            case OperativeSize.nano:
            default:                   return 22;
        }
    }
}

export const THEMES: Record<Theme, ThemeInfo> = {
    none: {
        name: 'none',
        description: 'No theme',
        floor: (_size: OperativeSize) => 0,
        backgroundImageUrl: (_basePetUri: string, _themeKind: ColorThemeKind, _petSize: OperativeSize) => '',
        foregroundImageUrl: (_basePetUri: string, _themeKind: ColorThemeKind, _petSize: OperativeSize) => '',
    },
    'shadow-moses': new ShadowMosesThemeInfo(),
    'mother-base': new MotherBaseThemeInfo(),
    'big-shell': new BigShellThemeInfo(),
    'outer-heaven': new OuterHeavenThemeInfo(),
};
