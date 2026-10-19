import { OperativeColor } from '../../common/types';
import { BasePetType } from '../basepettype';
import { States } from '../states';

export class Raiden extends BasePetType {
    label = 'raiden';
    static possibleColors = [
        OperativeColor.normal,
        OperativeColor.whiteSuit,
        OperativeColor.cyborg,
    ];
    protected _climbSpeed = 2;
    protected _climbHeight = 120;
    protected _fallSpeed = 7;

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
                possibleNextStates: [States.runLeft, States.walkLeft, States.climbWallLeft],
            },
            {
                state: States.walkLeft,
                possibleNextStates: [States.sitIdle, States.walkRight, States.runRight],
            },
            {
                state: States.runLeft,
                possibleNextStates: [
                    States.sitIdle,
                    States.climbWallLeft,
                    States.runRight,
                    States.walkRight,
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
                possibleNextStates: [States.sitIdle, States.runRight, States.walkRight],
            },
            {
                state: States.chase,
                possibleNextStates: [States.idleWithBall],
            },
            {
                state: States.idleWithBall,
                possibleNextStates: [States.walkRight, States.walkLeft, States.runRight, States.runLeft],
            },
        ],
    };

    get emoji(): string {
        return '⚡';
    }

    get hello(): string {
        return `I'm Raiden. Jack, the Ripper. ⚡`;
    }
}
