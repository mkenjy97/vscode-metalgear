import { OperativeColor, OperativeSize, OperativeSpeed } from '../common/types';
import { IPetType } from './states';
import { ISequenceTree } from './sequences';
import {
    States,
    IState,
    resolveState,
    PetInstanceState,
    isStateAboveGround,
    BallState,
    ChaseState,
    HorizontalDirection,
    FrameResult,
} from './states';

export class InvalidStateError extends Error {
    fromState: States;
    operativeType: string;

    constructor(fromState: States, operativeType: string) {
        super(`Invalid state ${fromState} for operative type ${operativeType}`);
        this.fromState = fromState;
        this.operativeType = operativeType;
    }
}

export abstract class BasePetType implements IPetType {
    label: string = 'base';
    static count: number = 0;
    sequence: ISequenceTree = {
        startingState: States.sitIdle,
        sequenceStates: [],
    };
    static possibleColors: OperativeColor[];
    currentState: IState;
    currentStateEnum: States;
    holdState: IState | undefined;
    holdStateEnum: States | undefined;
    private el: HTMLImageElement;
    private collision: HTMLDivElement;
    private speech: HTMLDivElement;
    private _left: number;
    private _bottom: number;
    petRoot: string;
    _floor: number;
    _friend: IPetType | undefined;
    private _name: string;
    private _speed: number;
    private _size: OperativeSize;
    protected _climbSpeed: number = 1;
    protected _climbHeight: number = 100;
    protected _fallSpeed: number = 5;

    constructor(
        spriteElement: HTMLImageElement,
        collisionElement: HTMLDivElement,
        speechElement: HTMLDivElement,
        size: OperativeSize,
        left: number,
        bottom: number,
        petRoot: string,
        floor: number,
        name: string,
        speed: number,
    ) {
        this.el = spriteElement;
        this.collision = collisionElement;
        this.speech = speechElement;
        this.petRoot = petRoot;
        this._floor = floor;
        this._left = left;
        this._bottom = bottom;
        this.initSprite(size, left, bottom);
        this.currentStateEnum = this.sequence.startingState;
        this.currentState = resolveState(this.currentStateEnum, this);

        this._name = name;
        this._size = size;
        this._speed = this.randomizeSpeed(speed);

        (this.constructor as any).count += 1;
    }

    initSprite(size: OperativeSize, left: number, bottom: number) {
        this.el.style.left = `${left}px`;
        this.el.style.bottom = `${bottom}px`;
        this.el.style.width = 'auto';
        this.el.style.height = 'auto';
        this.el.style.maxWidth = `${this.calculateSpriteWidth(size)}px`;
        this.el.style.maxHeight = `${this.calculateSpriteWidth(size)}px`;
        this.collision.style.left = `${left}px`;
        this.collision.style.bottom = `${bottom}px`;
        this.collision.style.width = `${this.calculateSpriteWidth(size)}px`;
        this.collision.style.height = `${this.calculateSpriteWidth(size)}px`;
        this.speech.style.left = `${left}px`;
        this.speech.style.bottom = `${bottom + this.calculateSpriteWidth(size)}px`;
        this.hideSpeechBubble();
    }

    get left(): number {
        return this._left;
    }

    get bottom(): number {
        return this._bottom;
    }

    private repositionAccompanyingElements() {
        this.collision.style.left = `${this._left}px`;
        this.collision.style.bottom = `${this._bottom}px`;
        this.speech.style.left = `${this._left}px`;
        this.speech.style.bottom = `${this._bottom + this.calculateSpriteWidth(this._size)}px`;
    }

    calculateSpriteWidth(size: OperativeSize): number {
        if (size === OperativeSize.nano) {
            return 30;
        } else if (size === OperativeSize.small) {
            return 40;
        } else if (size === OperativeSize.medium) {
            return 55;
        } else if (size === OperativeSize.large) {
            return 110;
        } else {
            return 30;
        }
    }

    positionBottom(bottom: number): void {
        this._bottom = bottom;
        this.el.style.bottom = `${this._bottom}px`;
        this.repositionAccompanyingElements();
    }

    positionLeft(left: number): void {
        this._left = left;
        this.el.style.left = `${this._left}px`;
        this.repositionAccompanyingElements();
    }

    get width(): number {
        return this.el.width;
    }

    get floor(): number {
        return this._floor;
    }

    get hello(): string {
        return `Snake? SNAKE! SNAAAAKE! 📡`;
    }

    getState(): PetInstanceState {
        return {
            currentStateEnum: this.holdStateEnum ?? this.currentStateEnum,
        };
    }

    get speed(): number {
        return this._speed;
    }

    randomizeSpeed(speed: number): number {
        const min = speed * 0.7;
        const max = speed * 1.3;
        return Math.random() * (max - min) + min;
    }

    get climbSpeed(): number {
        return this._climbSpeed;
    }

    get climbHeight(): number {
        return this._climbHeight;
    }

    get fallSpeed(): number {
        return this._fallSpeed;
    }

    get isMoving(): boolean {
        return this._speed !== OperativeSpeed.still;
    }

    recoverFriend(friend: IPetType) {
        this._friend = friend;
    }

    recoverState(state: PetInstanceState) {
        const recoveredStateEnum =
            state.currentStateEnum ?? this.sequence.startingState;
        const hasRecoveredStateInSequence = this.sequence.sequenceStates.some(
            (s) => s.state === recoveredStateEnum,
        );
        this.currentStateEnum = hasRecoveredStateInSequence
            ? recoveredStateEnum
            : this.sequence.startingState;
        this.currentState = resolveState(this.currentStateEnum, this);

        if (!isStateAboveGround(this.currentStateEnum)) {
            this.positionBottom(this.floor);
        }
    }

    get canSwipe() {
        return !isStateAboveGround(this.currentStateEnum);
    }

    get canChase() {
        return !isStateAboveGround(this.currentStateEnum) && this.isMoving;
    }

    showSpeechBubble(message: string, duration: number = 3000) {
        this.speech.innerHTML = message;
        this.speech.style.display = 'block';
        setTimeout(() => {
            this.hideSpeechBubble();
        }, duration);
    }

    hideSpeechBubble() {
        this.speech.style.display = 'none';
    }

    swipe() {
        if (this.currentStateEnum === States.swipe) {
            return;
        }
        this.holdState = this.currentState;
        this.holdStateEnum = this.currentStateEnum;
        this.currentStateEnum = States.swipe;
        this.currentState = resolveState(this.currentStateEnum, this);
        this.showSpeechBubble('!');
    }

    chase(ballState: BallState, canvas: HTMLCanvasElement) {
        this.currentStateEnum = States.chase;
        this.currentState = new ChaseState(this, ballState, canvas);
    }

    faceLeft() {
        this.el.style.transform = 'scaleX(-1)';
    }

    faceRight() {
        this.el.style.transform = 'scaleX(1)';
    }

    setAnimation(face: string) {
        if (this.el.src.endsWith(`_${face}_8fps.gif`)) {
            return;
        }
        this.el.src = `${this.petRoot}_${face}_8fps.gif`;
    }

    chooseNextState(fromState: States): States {
        let possibleNextStates: States[] | undefined = undefined;
        for (let i = 0; i < this.sequence.sequenceStates.length; i++) {
            if (this.sequence.sequenceStates[i].state === fromState) {
                possibleNextStates = this.sequence.sequenceStates[i].possibleNextStates;
                break;
            }
        }
        if (!possibleNextStates) {
            throw new InvalidStateError(fromState, this.label);
        }
        const idx = Math.floor(Math.random() * possibleNextStates.length);
        return possibleNextStates[idx];
    }

    nextFrame() {
        if (this.currentState.horizontalDirection === HorizontalDirection.left) {
            this.faceLeft();
        } else if (this.currentState.horizontalDirection === HorizontalDirection.right) {
            this.faceRight();
        }
        this.setAnimation(this.currentState.spriteLabel);

        // Chase friend?
        if (
            this.hasFriend &&
            this.currentStateEnum !== States.chaseFriend &&
            this.isMoving
        ) {
            if (
                this.friend?.isPlaying &&
                !isStateAboveGround(this.currentStateEnum)
            ) {
                this.currentState = resolveState(States.chaseFriend, this);
                this.currentStateEnum = States.chaseFriend;
                return;
            }
        }

        const frameResult = this.currentState.nextFrame();
        if (frameResult === FrameResult.stateComplete) {
            if (this.holdState && this.holdStateEnum) {
                this.currentState = this.holdState;
                this.currentStateEnum = this.holdStateEnum;
                this.holdState = undefined;
                this.holdStateEnum = undefined;
                return;
            }
            const nextState = this.chooseNextState(this.currentStateEnum);
            this.currentState = resolveState(nextState, this);
            this.currentStateEnum = nextState;
        } else if (frameResult === FrameResult.stateCancel) {
            if (
                this.currentStateEnum === States.chase ||
                this.currentStateEnum === States.chaseFriend
            ) {
                const nextState = this.chooseNextState(States.idleWithBall);
                this.currentState = resolveState(nextState, this);
                this.currentStateEnum = nextState;
            }
        }
    }

    get hasFriend(): boolean {
        return this._friend !== undefined;
    }

    get friend(): IPetType | undefined {
        return this._friend;
    }

    get name(): string {
        return this._name;
    }

    makeFriendsWith(friend: IPetType): boolean {
        this._friend = friend;
        console.log(this.name, ': Codec link established with', friend.name);
        return true;
    }

    get isPlaying(): boolean {
        return (
            this.isMoving &&
            (this.currentStateEnum === States.runRight ||
                this.currentStateEnum === States.runLeft)
        );
    }

    get emoji(): string {
        return '🐍';
    }

    get size(): OperativeSize {
        return this._size;
    }

    remove(): void {}
}
