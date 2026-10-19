import { OperativeType } from './types';

export const SOLID_SNAKE_NAMES: ReadonlyArray<string> = [
    'Solid Snake',
    'Big Boss',
    'Naked Snake',
    'Punished Snake',
    'Venom Snake',
    'Old Snake',
    'Dave',
    'Iroquois Pliskin',
    'The Legendary Mercenary',
    'Fox',
    'FOXHOUND',
    'Vic Boss',
    'Jack',
    'Saladin',
    'Os',
    'Les Enfants Terribles',
    'Outer Heaven',
    'Zanzibar',
    'Shadow Moses',
    'Genome Soldier',
    'Snake Eater',
];

export const CARDBOARD_BOX_NAMES: ReadonlyArray<string> = [
    'Box',
    'Not a box',
    'Totally a rock',
    'Nothing to see here',
    'Mystery Box',
    'Sneaky Box',
    'Infiltration Unit',
    'KEROTAN',
    'Supply Crate',
    'Stealth Field',
    'Caution!',
    'Kept you waiting, huh?',
];

export const GENOME_SOLDIER_NAMES: ReadonlyArray<string> = [
    'Genome Soldier',
    'Johnny Sasaki',
    'Deepthroat',
    'Vulcan Raven',
    'Octopus',
    'Mantis',
    'Ocelot',
    'Raven Sword',
    'PMC Soldier',
    'Outer Haven',
    'Haven Trooper',
    'FROGs',
    'Rat Patrol',
    'Meryl',
    'Campbell',
    'DARPA Chief',
    'Baker',
    'Scamp',
];

export const GRAY_FOX_NAMES: ReadonlyArray<string> = [
    'Gray Fox',
    'Frank Jaeger',
    'Cyborg Ninja',
    'Null',
    'White Devil',
    'The Ninja',
    'Frank',
    'Jaeger',
    'Deepthroat',
    'Unit',
    'Perfect Soldier',
    'Force XXI',
];

export const RAIDEN_NAMES: ReadonlyArray<string> = [
    'Raiden',
    'Jack',
    'White Devil',
    'Minuano',
    'Ripper',
    'Jam',
    'Jack the Ripper',
    'Lightning Bolt',
    'Cyborg',
    'Blade Wolf',
    'Sam',
    'Sundowner',
    'Mistral',
    'Monsoon',
    'Senator Armstrong',
    'Kevin Washington',
    'Boris Vyacheslavovich Popov',
    'Doktor',
];

export const METAL_GEAR_REX_NAMES: ReadonlyArray<string> = [
    'Metal Gear REX',
    'REX',
    'Metal Gear RAY',
    'RAY',
    'ZEKE',
    'EXCELSUS',
    'SAHELANTHROPUS',
    'D-WALKER',
    'ST-84',
    'Metal Gear',
    'GEKKO',
    'Hammer',
];

export function randomName(operativeType: OperativeType): string {
    let names: ReadonlyArray<string>;
    switch (operativeType) {
        case OperativeType.solidSnake:
            names = SOLID_SNAKE_NAMES;
            break;
        case OperativeType.cardboardBox:
            names = CARDBOARD_BOX_NAMES;
            break;
        case OperativeType.genomeSoldier:
            names = GENOME_SOLDIER_NAMES;
            break;
        case OperativeType.grayFox:
            names = GRAY_FOX_NAMES;
            break;
        case OperativeType.raiden:
            names = RAIDEN_NAMES;
            break;
        case OperativeType.metalGearRex:
            names = METAL_GEAR_REX_NAMES;
            break;
        default:
            names = SOLID_SNAKE_NAMES;
            break;
    }
    return names[Math.floor(Math.random() * names.length)];
}
