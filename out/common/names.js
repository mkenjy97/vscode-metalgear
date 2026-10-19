"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomName = exports.METAL_GEAR_REX_NAMES = exports.RAIDEN_NAMES = exports.GRAY_FOX_NAMES = exports.GENOME_SOLDIER_NAMES = exports.CARDBOARD_BOX_NAMES = exports.SOLID_SNAKE_NAMES = void 0;
exports.SOLID_SNAKE_NAMES = [
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
exports.CARDBOARD_BOX_NAMES = [
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
exports.GENOME_SOLDIER_NAMES = [
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
exports.GRAY_FOX_NAMES = [
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
exports.RAIDEN_NAMES = [
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
exports.METAL_GEAR_REX_NAMES = [
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
function randomName(operativeType) {
    let names;
    switch (operativeType) {
        case "solid-snake" /* OperativeType.solidSnake */:
            names = exports.SOLID_SNAKE_NAMES;
            break;
        case "cardboard-box" /* OperativeType.cardboardBox */:
            names = exports.CARDBOARD_BOX_NAMES;
            break;
        case "genome-soldier" /* OperativeType.genomeSoldier */:
            names = exports.GENOME_SOLDIER_NAMES;
            break;
        case "gray-fox" /* OperativeType.grayFox */:
            names = exports.GRAY_FOX_NAMES;
            break;
        case "raiden" /* OperativeType.raiden */:
            names = exports.RAIDEN_NAMES;
            break;
        case "metal-gear-rex" /* OperativeType.metalGearRex */:
            names = exports.METAL_GEAR_REX_NAMES;
            break;
        default:
            names = exports.SOLID_SNAKE_NAMES;
            break;
    }
    return names[Math.floor(Math.random() * names.length)];
}
exports.randomName = randomName;
