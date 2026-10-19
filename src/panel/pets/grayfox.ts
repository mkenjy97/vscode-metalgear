import { OperativeColor } from '../../common/types';
import { BasePetType } from '../basepettype';
import { States } from '../states';

export class GrayFox extends BasePetType {
    label = 'gray-fox';
    static possibleColors = [
        OperativeColor.cyborg,
        OperativeColor.ninja,
    ];
    // Gray Fox è molto veloce e può arrampicarsi
    protected _climbSpeed = 2;
    protected _climbHeight = 150;
    protected _fallSpeed = 8;

    sequence = {
        startingState: States.sitIdle,
        sequenceStates: [
            {
                state: States.sitIdle,
                possibleNextStates: [States.runRight, States.runLeft],
            },
            {
                state: States.walkRight,
                possibleNextStates: [States.runLeft, States.runRight],
            },
            {
                state: States.runRight,
                possibleNextStates: [States.runLeft, States.walkLeft, States.climbWallLeft],
            },
            {
                state: States.walkLeft,
                possibleNextStates: [States.runRight, States.runLeft],
            },
            {
                state: States.runLeft,
                possibleNextStates: [
                    States.sitIdle,
                    States.climbWallLeft,
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
                possibleNextStates: [States.runRight, States.runLeft],
            },
            {
                state: States.chase,
                possibleNextStates: [States.idleWithBall],
            },
            {
                state: States.idleWithBall,
                possibleNextStates: [States.runRight, States.runLeft],
            },
        ],
    };

    get emoji(): string {
        return '🥷';
    }

    get hello(): string {
        return `We're not tools of the government... ⚔️`;
    }
}
