import { OperativeColor } from '../../common/types';
import { BasePetType } from '../basepettype';
import { States } from '../states';

export class SolidSnake extends BasePetType {
    label = 'solid-snake';
    static possibleColors = [
        OperativeColor.sneakingSuit,
        OperativeColor.bandana,
        OperativeColor.tuxedo,
        OperativeColor.foxhound,
        OperativeColor.vrMission,
    ];
    sequence = {
        startingState: States.sitIdle,
        sequenceStates: [
            {
                state: States.sitIdle,
                possibleNextStates: [States.walkRight, States.runRight],
            },
            {
                state: States.walkRight,
                possibleNextStates: [States.walkLeft, States.runLeft],
            },
            {
                state: States.runRight,
                possibleNextStates: [States.walkLeft, States.runLeft],
            },
            {
                state: States.walkLeft,
                possibleNextStates: [
                    States.sitIdle,
                    States.climbWallLeft,
                    States.walkRight,
                    States.runRight,
                ],
            },
            {
                state: States.runLeft,
                possibleNextStates: [
                    States.sitIdle,
                    States.climbWallLeft,
                    States.walkRight,
                    States.runRight,
                ],
            },
            {
                state: States.climbWallLeft,
                possibleNextStates: [States.wallHangLeft],
            },
            {
                state: States.wallHangLeft,
                possibleNextStates: [States.jumpDownLeft],
            },
            {
                state: States.jumpDownLeft,
                possibleNextStates: [States.land],
            },
            {
                state: States.land,
                possibleNextStates: [
                    States.sitIdle,
                    States.walkRight,
                    States.runRight,
                ],
            },
            {
                state: States.chase,
                possibleNextStates: [States.idleWithBall],
            },
            {
                state: States.idleWithBall,
                possibleNextStates: [
                    States.walkRight,
                    States.walkLeft,
                    States.runLeft,
                    States.runRight,
                ],
            },
        ],
    };

    get emoji(): string {
        return '🐍';
    }

    get hello(): string {
        return `Snake? SNAKE! SNAAAAKE! 📡`;
    }
}
