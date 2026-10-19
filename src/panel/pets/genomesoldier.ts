import { OperativeColor } from '../../common/types';
import { BasePetType } from '../basepettype';
import { States } from '../states';

export class GenomeSoldier extends BasePetType {
    label = 'genome-soldier';
    static possibleColors = [
        OperativeColor.normal,
        OperativeColor.foxhound,
        OperativeColor.snow,
    ];
    sequence = {
        startingState: States.sitIdle,
        sequenceStates: [
            {
                state: States.sitIdle,
                possibleNextStates: [States.walkRight, States.runRight, States.walkLeft],
            },
            {
                state: States.walkRight,
                possibleNextStates: [States.walkLeft, States.runLeft, States.sitIdle],
            },
            {
                state: States.runRight,
                possibleNextStates: [States.walkLeft, States.runLeft],
            },
            {
                state: States.walkLeft,
                possibleNextStates: [States.walkRight, States.runRight, States.sitIdle],
            },
            {
                state: States.runLeft,
                possibleNextStates: [States.walkRight, States.runRight],
            },
            {
                state: States.chase,
                possibleNextStates: [States.idleWithBall],
            },
            {
                state: States.idleWithBall,
                possibleNextStates: [States.walkRight, States.walkLeft],
            },
        ],
    };

    get emoji(): string {
        return '🪖';
    }

    get hello(): string {
        return `Freeze! Don't move! 🔫`;
    }
}
