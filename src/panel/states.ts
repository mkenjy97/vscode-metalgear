import { OperativeSize } from '../common/types';
import { ISequenceTree } from './sequences';

export const enum States {
    sitIdle = 'sit-idle',
    walkRight = 'walk-right',
    walkLeft = 'walk-left',
    runRight = 'run-right',
    runLeft = 'run-left',
    swipe = 'swipe',
    idleWithBall = 'idle-with-ball',   // idle con razione
    chase = 'chase',
    chaseFriend = 'chase-friend',
    climbWallLeft = 'climb-wall-left',
    wallHangLeft = 'wall-hang-left',
    jumpDownLeft = 'jump-down-left',
    land = 'land',
}

export const enum HorizontalDirection {
    left = 'left',
    right = 'right',
    none = '',
}

export const enum FrameResult {
    stateContinue = 0,
    stateComplete = 1,
    stateCancel = 2,
}

export interface PetInstanceState {
    currentStateEnum: States;
}

export interface PetPanelState {
    petStates?: PetElementState[];
    petCounter?: number;
}

export interface PetElementState {
    petName?: string;
    petColor?: string;
    petType?: string;
    petState?: PetInstanceState;
    petFriend?: string;
    elLeft?: string;
    elBottom?: string;
}

export interface IState {
    label: string;
    spriteLabel: string;
    horizontalDirection: HorizontalDirection;
    nextFrame(): FrameResult;
}

export interface IPetType {
    label: string;
    sequence: ISequenceTree;
    currentState: IState;
    currentStateEnum: States;
    holdState: IState | undefined;
    holdStateEnum: States | undefined;
    petRoot: string;
    floor: number;
    left: number;
    bottom: number;
    width: number;
    speed: number;
    isMoving: boolean;
    isPlaying: boolean;
    hasFriend: boolean;
    canSwipe: boolean;
    canChase: boolean;
    friend: IPetType | undefined;
    name: string;
    emoji: string;
    hello: string;
    size: OperativeSize;
    getState(): PetInstanceState;
    nextFrame(): void;
    swipe(): void;
    chase(ballState: BallState, canvas: HTMLCanvasElement): void;
    showSpeechBubble(message: string, duration?: number): void;
    hideSpeechBubble(): void;
    makeFriendsWith(friend: IPetType): boolean;
    recoverFriend(friend: IPetType): void;
    recoverState(state: PetInstanceState): void;
    remove(): void;
}

export function isStateAboveGround(state: States): boolean {
    return (
        state === States.climbWallLeft ||
        state === States.wallHangLeft ||
        state === States.jumpDownLeft
    );
}

// ── State implementations ────────────────────────────────────────────────────

export abstract class AbstractStaticState implements IState {
    label = 'abstract-static';
    spriteLabel = 'idle';
    horizontalDirection = HorizontalDirection.none;

    nextFrame(): FrameResult {
        return FrameResult.stateContinue;
    }
}

export class BallState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    paused: boolean;

    constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.paused = false;
    }
}

// ── Concrete states ──────────────────────────────────────────────────────────

class SitIdleState extends AbstractStaticState {
    label = States.sitIdle;
    spriteLabel = 'idle';
    horizontalDirection = HorizontalDirection.none;
    private frameCount = 0;
    private readonly IDLE_FRAMES = 50;

    nextFrame(): FrameResult {
        this.frameCount++;
        if (this.frameCount > this.IDLE_FRAMES) {
            this.frameCount = 0;
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

class WalkRightState implements IState {
    label = States.walkRight;
    spriteLabel = 'walk';
    horizontalDirection = HorizontalDirection.right;
    private readonly pet: IPetType;
    private frameCount = 0;

    constructor(pet: IPetType) {
        this.pet = pet;
    }

    nextFrame(): FrameResult {
        this.pet.positionLeft(this.pet.left + this.pet.speed);
        this.frameCount++;
        if (this.pet.left > window.innerWidth - this.pet.width) {
            return FrameResult.stateComplete;
        }
        if (this.frameCount > 100) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

class WalkLeftState implements IState {
    label = States.walkLeft;
    spriteLabel = 'walk';
    horizontalDirection = HorizontalDirection.left;
    private readonly pet: IPetType;
    private frameCount = 0;

    constructor(pet: IPetType) {
        this.pet = pet;
    }

    nextFrame(): FrameResult {
        this.pet.positionLeft(this.pet.left - this.pet.speed);
        this.frameCount++;
        if (this.pet.left < 0) {
            return FrameResult.stateComplete;
        }
        if (this.frameCount > 100) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

class RunRightState implements IState {
    label = States.runRight;
    spriteLabel = 'run';
    horizontalDirection = HorizontalDirection.right;
    private readonly pet: IPetType;
    private frameCount = 0;

    constructor(pet: IPetType) {
        this.pet = pet;
    }

    nextFrame(): FrameResult {
        this.pet.positionLeft(this.pet.left + this.pet.speed * 1.6);
        this.frameCount++;
        if (this.pet.left > window.innerWidth - this.pet.width) {
            return FrameResult.stateComplete;
        }
        if (this.frameCount > 100) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

class RunLeftState implements IState {
    label = States.runLeft;
    spriteLabel = 'run';
    horizontalDirection = HorizontalDirection.left;
    private readonly pet: IPetType;
    private frameCount = 0;

    constructor(pet: IPetType) {
        this.pet = pet;
    }

    nextFrame(): FrameResult {
        this.pet.positionLeft(this.pet.left - this.pet.speed * 1.6);
        this.frameCount++;
        if (this.pet.left < 0) {
            return FrameResult.stateComplete;
        }
        if (this.frameCount > 100) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

class SwipeState extends AbstractStaticState {
    label = States.swipe;
    spriteLabel = 'swipe';
    horizontalDirection = HorizontalDirection.none;
    private frameCount = 0;
    private readonly SWIPE_FRAMES = 15;

    nextFrame(): FrameResult {
        this.frameCount++;
        if (this.frameCount > this.SWIPE_FRAMES) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

class IdleWithBallState extends AbstractStaticState {
    label = States.idleWithBall;
    spriteLabel = 'with_ball';
    horizontalDirection = HorizontalDirection.none;
    private frameCount = 0;
    private readonly IDLE_FRAMES = 30;

    nextFrame(): FrameResult {
        this.frameCount++;
        if (this.frameCount > this.IDLE_FRAMES) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

export class ChaseState implements IState {
    label = States.chase;
    spriteLabel = 'run';
    horizontalDirection = HorizontalDirection.none;
    private readonly pet: IPetType;
    private readonly ballState: BallState;
    private readonly canvas: HTMLCanvasElement;

    constructor(
        pet: IPetType,
        ballState: BallState,
        canvas: HTMLCanvasElement,
    ) {
        this.pet = pet;
        this.ballState = ballState;
        this.canvas = canvas;
    }

    nextFrame(): FrameResult {
        if (this.ballState.paused) {
            return FrameResult.stateCancel;
        }
        // Move toward the ball
        const ballX = this.ballState.x - this.canvas.getBoundingClientRect().left;
        if (ballX > this.pet.left + this.pet.width / 2) {
            this.pet.positionLeft(this.pet.left + this.pet.speed);
            this.horizontalDirection = HorizontalDirection.right;
        } else {
            this.pet.positionLeft(this.pet.left - this.pet.speed);
            this.horizontalDirection = HorizontalDirection.left;
        }
        // Check if caught
        if (Math.abs(ballX - this.pet.left) < this.pet.width) {
            return FrameResult.stateCancel;
        }
        return FrameResult.stateContinue;
    }
}

class ChaseFriendState implements IState {
    label = States.chaseFriend;
    spriteLabel = 'run';
    horizontalDirection = HorizontalDirection.none;
    private readonly pet: IPetType;

    constructor(pet: IPetType) {
        this.pet = pet;
    }

    nextFrame(): FrameResult {
        if (!this.pet.friend || !this.pet.friend.isPlaying) {
            return FrameResult.stateCancel;
        }
        if (this.pet.friend.left > this.pet.left) {
            this.pet.positionLeft(this.pet.left + this.pet.speed);
            this.horizontalDirection = HorizontalDirection.right;
        } else {
            this.pet.positionLeft(this.pet.left - this.pet.speed);
            this.horizontalDirection = HorizontalDirection.left;
        }
        return FrameResult.stateContinue;
    }
}

class ClimbWallLeftState implements IState {
    label = States.climbWallLeft;
    spriteLabel = 'walk_fast';
    horizontalDirection = HorizontalDirection.left;
    private readonly pet: IPetType;
    private climbFrames = 0;

    constructor(pet: IPetType) {
        this.pet = pet;
    }

    nextFrame(): FrameResult {
        this.pet.positionLeft(0);
        this.pet.positionBottom(this.pet.floor + this.climbFrames * this.pet.climbSpeed);
        this.climbFrames++;
        if (this.climbFrames > this.pet.climbHeight / this.pet.climbSpeed) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

class WallHangLeftState extends AbstractStaticState {
    label = States.wallHangLeft;
    spriteLabel = 'idle';
    horizontalDirection = HorizontalDirection.left;
    private frameCount = 0;
    private readonly HANG_FRAMES = 40;

    nextFrame(): FrameResult {
        this.frameCount++;
        if (this.frameCount > this.HANG_FRAMES) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

class JumpDownLeftState implements IState {
    label = States.jumpDownLeft;
    spriteLabel = 'swipe';
    horizontalDirection = HorizontalDirection.left;
    private readonly pet: IPetType;

    constructor(pet: IPetType) {
        this.pet = pet;
    }

    nextFrame(): FrameResult {
        this.pet.positionBottom(this.pet.bottom - this.pet.fallSpeed);
        if (this.pet.bottom <= this.pet.floor) {
            this.pet.positionBottom(this.pet.floor);
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

class LandState extends AbstractStaticState {
    label = States.land;
    spriteLabel = 'idle';
    horizontalDirection = HorizontalDirection.none;
    private frameCount = 0;
    private readonly LAND_FRAMES = 10;

    nextFrame(): FrameResult {
        this.frameCount++;
        if (this.frameCount > this.LAND_FRAMES) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}

// ── Resolve state factory ─────────────────────────────────────────────────────

export function resolveState(state: States, pet: IPetType): IState {
    switch (state) {
        case States.sitIdle:
            return new SitIdleState();
        case States.walkRight:
            return new WalkRightState(pet);
        case States.walkLeft:
            return new WalkLeftState(pet);
        case States.runRight:
            return new RunRightState(pet);
        case States.runLeft:
            return new RunLeftState(pet);
        case States.swipe:
            return new SwipeState();
        case States.idleWithBall:
            return new IdleWithBallState();
        case States.chase:
            return new SitIdleState(); // fallback — chase viene impostato esplicitamente con ChaseState
        case States.chaseFriend:
            return new ChaseFriendState(pet);
        case States.climbWallLeft:
            return new ClimbWallLeftState(pet);
        case States.wallHangLeft:
            return new WallHangLeftState();
        case States.jumpDownLeft:
            return new JumpDownLeftState(pet);
        case States.land:
            return new LandState();
        default:
            return new SitIdleState();
    }
}

// Aggiungiamo i metodi di posizionamento all'interfaccia IPetType
// (devono essere implementati da BasePetType)
declare module './states' {
    interface IPetType {
        positionLeft(left: number): void;
        positionBottom(bottom: number): void;
        climbSpeed: number;
        climbHeight: number;
        fallSpeed: number;
    }
}
