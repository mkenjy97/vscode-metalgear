import { OperativeColor } from '../../common/types';
import { BasePetType } from '../basepettype';
import { States } from '../states';

/**
 * Metal Gear REX — fermo, imponente. Non si muove mai autonomamente.
 * Può inseguire la razione se viene lanciata.
 */
export class MetalGearRex extends BasePetType {
    label = 'metal-gear-rex';
    static possibleColors = [
        OperativeColor.normal,
    ];

    sequence = {
        startingState: States.sitIdle,
        sequenceStates: [
            {
                state: States.sitIdle,
                possibleNextStates: [States.sitIdle],
            },
            {
                state: States.chase,
                possibleNextStates: [States.idleWithBall],
            },
            {
                state: States.idleWithBall,
                possibleNextStates: [States.sitIdle],
            },
        ],
    };

    get emoji(): string {
        return '🤖';
    }

    get hello(): string {
        return `FOOL! This is my moment of triumph! ☢️`;
    }
}
