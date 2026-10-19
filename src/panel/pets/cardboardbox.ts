import { OperativeColor } from '../../common/types';
import { BasePetType } from '../basepettype';
import { States } from '../states';

/**
 * Cardboard Box — si muove lentamente, non arrampica pareti.
 * Quando viene toccata emette "!" (alert stealth rotto).
 */
export class CardboardBox extends BasePetType {
    label = 'cardboard-box';
    static possibleColors = [
        OperativeColor.normal,
        OperativeColor.snow,
        OperativeColor.desert,
    ];
    sequence = {
        startingState: States.sitIdle,
        sequenceStates: [
            {
                state: States.sitIdle,
                possibleNextStates: [States.walkRight, States.walkLeft, States.sitIdle],
            },
            {
                state: States.walkRight,
                possibleNextStates: [States.sitIdle, States.walkLeft],
            },
            {
                state: States.walkLeft,
                possibleNextStates: [States.sitIdle, States.walkRight],
            },
            {
                state: States.chase,
                possibleNextStates: [States.idleWithBall],
            },
            {
                state: States.idleWithBall,
                possibleNextStates: [States.walkRight, States.walkLeft, States.sitIdle],
            },
        ],
    };

    get emoji(): string {
        return '📦';
    }

    get hello(): string {
        return `...`;
    }

    swipe() {
        // Sovrascriviamo swipe: la scatola non può combattere,
        // ma emette il classico "!" del rilevamento nemico
        this.showSpeechBubble('❗', 2000);
    }
}
