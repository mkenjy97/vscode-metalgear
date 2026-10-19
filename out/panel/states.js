"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveState = exports.ChaseState = exports.BallState = exports.AbstractStaticState = exports.isStateAboveGround = void 0;
function isStateAboveGround(state) {
    return (state === "climb-wall-left" /* States.climbWallLeft */ ||
        state === "wall-hang-left" /* States.wallHangLeft */ ||
        state === "jump-down-left" /* States.jumpDownLeft */);
}
exports.isStateAboveGround = isStateAboveGround;
// ── State implementations ────────────────────────────────────────────────────
class AbstractStaticState {
    constructor() {
        this.label = 'abstract-static';
        this.spriteLabel = 'idle';
        this.horizontalDirection = "" /* HorizontalDirection.none */;
    }
    nextFrame() {
        return 0 /* FrameResult.stateContinue */;
    }
}
exports.AbstractStaticState = AbstractStaticState;
class BallState {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.paused = false;
    }
}
exports.BallState = BallState;
// ── Concrete states ──────────────────────────────────────────────────────────
class SitIdleState extends AbstractStaticState {
    constructor() {
        super(...arguments);
        this.label = "sit-idle" /* States.sitIdle */;
        this.spriteLabel = 'idle';
        this.horizontalDirection = "" /* HorizontalDirection.none */;
        this.frameCount = 0;
        this.IDLE_FRAMES = 50;
    }
    nextFrame() {
        this.frameCount++;
        if (this.frameCount > this.IDLE_FRAMES) {
            this.frameCount = 0;
            return 1 /* FrameResult.stateComplete */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
class WalkRightState {
    constructor(pet) {
        this.label = "walk-right" /* States.walkRight */;
        this.spriteLabel = 'walk';
        this.horizontalDirection = "right" /* HorizontalDirection.right */;
        this.frameCount = 0;
        this.pet = pet;
    }
    nextFrame() {
        this.pet.positionLeft(this.pet.left + this.pet.speed);
        this.frameCount++;
        if (this.pet.left > window.innerWidth - this.pet.width) {
            return 1 /* FrameResult.stateComplete */;
        }
        if (this.frameCount > 100) {
            return 1 /* FrameResult.stateComplete */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
class WalkLeftState {
    constructor(pet) {
        this.label = "walk-left" /* States.walkLeft */;
        this.spriteLabel = 'walk';
        this.horizontalDirection = "left" /* HorizontalDirection.left */;
        this.frameCount = 0;
        this.pet = pet;
    }
    nextFrame() {
        this.pet.positionLeft(this.pet.left - this.pet.speed);
        this.frameCount++;
        if (this.pet.left < 0) {
            return 1 /* FrameResult.stateComplete */;
        }
        if (this.frameCount > 100) {
            return 1 /* FrameResult.stateComplete */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
class RunRightState {
    constructor(pet) {
        this.label = "run-right" /* States.runRight */;
        this.spriteLabel = 'run';
        this.horizontalDirection = "right" /* HorizontalDirection.right */;
        this.frameCount = 0;
        this.pet = pet;
    }
    nextFrame() {
        this.pet.positionLeft(this.pet.left + this.pet.speed * 1.6);
        this.frameCount++;
        if (this.pet.left > window.innerWidth - this.pet.width) {
            return 1 /* FrameResult.stateComplete */;
        }
        if (this.frameCount > 100) {
            return 1 /* FrameResult.stateComplete */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
class RunLeftState {
    constructor(pet) {
        this.label = "run-left" /* States.runLeft */;
        this.spriteLabel = 'run';
        this.horizontalDirection = "left" /* HorizontalDirection.left */;
        this.frameCount = 0;
        this.pet = pet;
    }
    nextFrame() {
        this.pet.positionLeft(this.pet.left - this.pet.speed * 1.6);
        this.frameCount++;
        if (this.pet.left < 0) {
            return 1 /* FrameResult.stateComplete */;
        }
        if (this.frameCount > 100) {
            return 1 /* FrameResult.stateComplete */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
class SwipeState extends AbstractStaticState {
    constructor() {
        super(...arguments);
        this.label = "swipe" /* States.swipe */;
        this.spriteLabel = 'swipe';
        this.horizontalDirection = "" /* HorizontalDirection.none */;
        this.frameCount = 0;
        this.SWIPE_FRAMES = 15;
    }
    nextFrame() {
        this.frameCount++;
        if (this.frameCount > this.SWIPE_FRAMES) {
            return 1 /* FrameResult.stateComplete */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
class IdleWithBallState extends AbstractStaticState {
    constructor() {
        super(...arguments);
        this.label = "idle-with-ball" /* States.idleWithBall */;
        this.spriteLabel = 'with_ball';
        this.horizontalDirection = "" /* HorizontalDirection.none */;
        this.frameCount = 0;
        this.IDLE_FRAMES = 30;
    }
    nextFrame() {
        this.frameCount++;
        if (this.frameCount > this.IDLE_FRAMES) {
            return 1 /* FrameResult.stateComplete */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
class ChaseState {
    constructor(pet, ballState, canvas) {
        this.label = "chase" /* States.chase */;
        this.spriteLabel = 'run';
        this.horizontalDirection = "" /* HorizontalDirection.none */;
        this.pet = pet;
        this.ballState = ballState;
        this.canvas = canvas;
    }
    nextFrame() {
        if (this.ballState.paused) {
            return 2 /* FrameResult.stateCancel */;
        }
        // Move toward the ball
        const ballX = this.ballState.x - this.canvas.getBoundingClientRect().left;
        if (ballX > this.pet.left + this.pet.width / 2) {
            this.pet.positionLeft(this.pet.left + this.pet.speed);
            this.horizontalDirection = "right" /* HorizontalDirection.right */;
        }
        else {
            this.pet.positionLeft(this.pet.left - this.pet.speed);
            this.horizontalDirection = "left" /* HorizontalDirection.left */;
        }
        // Check if caught
        if (Math.abs(ballX - this.pet.left) < this.pet.width) {
            return 2 /* FrameResult.stateCancel */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
exports.ChaseState = ChaseState;
class ChaseFriendState {
    constructor(pet) {
        this.label = "chase-friend" /* States.chaseFriend */;
        this.spriteLabel = 'run';
        this.horizontalDirection = "" /* HorizontalDirection.none */;
        this.pet = pet;
    }
    nextFrame() {
        if (!this.pet.friend || !this.pet.friend.isPlaying) {
            return 2 /* FrameResult.stateCancel */;
        }
        if (this.pet.friend.left > this.pet.left) {
            this.pet.positionLeft(this.pet.left + this.pet.speed);
            this.horizontalDirection = "right" /* HorizontalDirection.right */;
        }
        else {
            this.pet.positionLeft(this.pet.left - this.pet.speed);
            this.horizontalDirection = "left" /* HorizontalDirection.left */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
class ClimbWallLeftState {
    constructor(pet) {
        this.label = "climb-wall-left" /* States.climbWallLeft */;
        this.spriteLabel = 'walk_fast';
        this.horizontalDirection = "left" /* HorizontalDirection.left */;
        this.climbFrames = 0;
        this.pet = pet;
    }
    nextFrame() {
        this.pet.positionLeft(0);
        this.pet.positionBottom(this.pet.floor + this.climbFrames * this.pet.climbSpeed);
        this.climbFrames++;
        if (this.climbFrames > this.pet.climbHeight / this.pet.climbSpeed) {
            return 1 /* FrameResult.stateComplete */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
class WallHangLeftState extends AbstractStaticState {
    constructor() {
        super(...arguments);
        this.label = "wall-hang-left" /* States.wallHangLeft */;
        this.spriteLabel = 'idle';
        this.horizontalDirection = "left" /* HorizontalDirection.left */;
        this.frameCount = 0;
        this.HANG_FRAMES = 40;
    }
    nextFrame() {
        this.frameCount++;
        if (this.frameCount > this.HANG_FRAMES) {
            return 1 /* FrameResult.stateComplete */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
class JumpDownLeftState {
    constructor(pet) {
        this.label = "jump-down-left" /* States.jumpDownLeft */;
        this.spriteLabel = 'swipe';
        this.horizontalDirection = "left" /* HorizontalDirection.left */;
        this.pet = pet;
    }
    nextFrame() {
        this.pet.positionBottom(this.pet.bottom - this.pet.fallSpeed);
        if (this.pet.bottom <= this.pet.floor) {
            this.pet.positionBottom(this.pet.floor);
            return 1 /* FrameResult.stateComplete */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
class LandState extends AbstractStaticState {
    constructor() {
        super(...arguments);
        this.label = "land" /* States.land */;
        this.spriteLabel = 'idle';
        this.horizontalDirection = "" /* HorizontalDirection.none */;
        this.frameCount = 0;
        this.LAND_FRAMES = 10;
    }
    nextFrame() {
        this.frameCount++;
        if (this.frameCount > this.LAND_FRAMES) {
            return 1 /* FrameResult.stateComplete */;
        }
        return 0 /* FrameResult.stateContinue */;
    }
}
// ── Resolve state factory ─────────────────────────────────────────────────────
function resolveState(state, pet) {
    switch (state) {
        case "sit-idle" /* States.sitIdle */:
            return new SitIdleState();
        case "walk-right" /* States.walkRight */:
            return new WalkRightState(pet);
        case "walk-left" /* States.walkLeft */:
            return new WalkLeftState(pet);
        case "run-right" /* States.runRight */:
            return new RunRightState(pet);
        case "run-left" /* States.runLeft */:
            return new RunLeftState(pet);
        case "swipe" /* States.swipe */:
            return new SwipeState();
        case "idle-with-ball" /* States.idleWithBall */:
            return new IdleWithBallState();
        case "chase" /* States.chase */:
            return new SitIdleState(); // fallback — chase viene impostato esplicitamente con ChaseState
        case "chase-friend" /* States.chaseFriend */:
            return new ChaseFriendState(pet);
        case "climb-wall-left" /* States.climbWallLeft */:
            return new ClimbWallLeftState(pet);
        case "wall-hang-left" /* States.wallHangLeft */:
            return new WallHangLeftState();
        case "jump-down-left" /* States.jumpDownLeft */:
            return new JumpDownLeftState(pet);
        case "land" /* States.land */:
            return new LandState();
        default:
            return new SitIdleState();
    }
}
exports.resolveState = resolveState;
