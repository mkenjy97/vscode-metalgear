import { OperativeColor, OperativeSize, OperativeSpeed, OperativeType } from '../common/types';
import { SolidSnake } from './pets/solidsnake';
import { CardboardBox } from './pets/cardboardbox';
import { GenomeSoldier } from './pets/genomesoldier';
import { GrayFox } from './pets/grayfox';
import { Raiden } from './pets/raiden';
import { MetalGearRex } from './pets/metalgeaRrex';
import { IPetType } from './states';

export class OperativeElement {
    el: HTMLImageElement;
    collision: HTMLDivElement;
    speech: HTMLDivElement;
    operative: IPetType;
    color: OperativeColor;
    type: OperativeType;

    remove() {
        this.el.remove();
        this.collision.remove();
        this.speech.remove();
        this.color = OperativeColor.null;
        this.type = OperativeType.null;
        this.operative.remove();
    }

    constructor(
        el: HTMLImageElement,
        collision: HTMLDivElement,
        speech: HTMLDivElement,
        operative: IPetType,
        color: OperativeColor,
        type: OperativeType,
    ) {
        this.el = el;
        this.collision = collision;
        this.speech = speech;
        this.operative = operative;
        this.color = color;
        this.type = type;
    }
}

// Alias per compatibilità con main.ts (che usa PetElement)
export { OperativeElement as PetElement };

export interface IOperativeCollection {
    operatives: Array<OperativeElement>;
    push(operative: OperativeElement): void;
    reset(): void;
    seekNewFriends(): void;
    locate(name: string): OperativeElement | undefined;
    locateOperative(name: string, type: string, color: string): OperativeElement | undefined;
    remove(operative: OperativeElement): void;
}

export class OperativeCollection implements IOperativeCollection {
    private _operatives: Array<OperativeElement>;

    constructor() {
        this._operatives = new Array(0);
    }

    public get operatives() {
        return this._operatives;
    }

    // Alias pets per compatibilità
    public get pets() {
        return this._operatives;
    }

    push(operative: OperativeElement) {
        this._operatives.push(operative);
    }

    reset() {
        this._operatives.forEach((op) => op.remove());
        this._operatives = [];
    }

    locate(name: string): OperativeElement | undefined {
        return this._operatives.find((op) => op.operative.name === name);
    }

    locateOperative(name: string, type: string, color: string): OperativeElement | undefined {
        return this._operatives.find(
            (op) =>
                op.operative.name === name &&
                op.type === type &&
                op.color === color,
        );
    }

    remove(target: OperativeElement): void {
        this._operatives.forEach((op) => {
            if (op === target) {
                op.remove();
            }
        });
        this._operatives = this._operatives.filter((op) => op !== target);
    }

    seekNewFriends(): void {
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
                if (
                    potentialFriend.operative.left > lonelyOp.operative.left &&
                    potentialFriend.operative.left <
                        lonelyOp.operative.left + lonelyOp.operative.width
                ) {
                    console.log(
                        lonelyOp.operative.name,
                        ' establishes codec link with ',
                        potentialFriend.operative.name,
                    );
                    if (lonelyOp.operative.makeFriendsWith(potentialFriend.operative)) {
                        potentialFriend.operative.showSpeechBubble('📡', 2000);
                        lonelyOp.operative.showSpeechBubble('📡', 2000);
                    }
                }
            });
        });
    }
}

export class InvalidOperativeException {
    message?: string;
    constructor(message?: string) {
        this.message = message;
    }
}

export function createOperative(
    operativeType: string,
    el: HTMLImageElement,
    collision: HTMLDivElement,
    speech: HTMLDivElement,
    size: OperativeSize,
    left: number,
    bottom: number,
    petRoot: string,
    floor: number,
    name: string,
): IPetType {
    if (name === undefined || name === null || name === '') {
        throw new InvalidOperativeException('name is undefined');
    }

    const args: [
        HTMLImageElement,
        HTMLDivElement,
        HTMLDivElement,
        OperativeSize,
        number,
        number,
        string,
        number,
        string,
    ] = [el, collision, speech, size, left, bottom, petRoot, floor, name];

    switch (operativeType) {
        case OperativeType.solidSnake:
            return new SolidSnake(...args, OperativeSpeed.normal);
        case OperativeType.cardboardBox:
            return new CardboardBox(...args, OperativeSpeed.verySlow);
        case OperativeType.genomeSoldier:
            return new GenomeSoldier(...args, OperativeSpeed.fast);
        case OperativeType.grayFox:
            return new GrayFox(...args, OperativeSpeed.veryFast);
        case OperativeType.raiden:
            return new Raiden(...args, OperativeSpeed.fast);
        case OperativeType.metalGearRex:
            return new MetalGearRex(...args, OperativeSpeed.still);
        default:
            throw new InvalidOperativeException("Operative type doesn't exist");
    }
}

// Alias per compatibilità con main.ts
export { createOperative as createPet };

export function availableColors(operativeType: OperativeType): OperativeColor[] {
    switch (operativeType) {
        case OperativeType.solidSnake:
            return SolidSnake.possibleColors;
        case OperativeType.cardboardBox:
            return CardboardBox.possibleColors;
        case OperativeType.genomeSoldier:
            return GenomeSoldier.possibleColors;
        case OperativeType.grayFox:
            return GrayFox.possibleColors;
        case OperativeType.raiden:
            return Raiden.possibleColors;
        case OperativeType.metalGearRex:
            return MetalGearRex.possibleColors;
        default:
            throw new InvalidOperativeException("Operative type doesn't exist");
    }
}

export function normalizeColor(color: OperativeColor, type: OperativeType): OperativeColor {
    const colors = availableColors(type);
    if (colors.includes(color)) {
        return color;
    }
    return colors[0];
}
