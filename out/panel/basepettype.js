"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePetType = exports.InvalidStateError = void 0;
const states_1 = require("./states");
class InvalidStateError extends Error {
    constructor(fromState, operativeType) {
        super(`Invalid state ${fromState} for operative type ${operativeType}`);
        this.fromState = fromState;
        this.operativeType = operativeType;
    }
}
exports.InvalidStateError = InvalidStateError;
class BasePetType {
    constructor(spriteElement, collisionElement, speechElement, size, left, bottom, petRoot, floor, name, speed) {
        this.label = 'base';
        this.sequence = {
            startingState: "sit-idle" /* States.sitIdle */,
            sequenceStates: [],
        };
        this._climbSpeed = 1;
        this._climbHeight = 100;
        this._fallSpeed = 5;
        this.el = spriteElement;
        this.collision = collisionElement;
        this.speech = speechElement;
        this.petRoot = petRoot;
        this._floor = floor;
        this._left = left;
        this._bottom = bottom;
        this.initSprite(size, left, bottom);
        this.currentStateEnum = this.sequence.startingState;
        this.currentState = (0, states_1.resolveState)(this.currentStateEnum, this);
        this._name = name;
        this._size = size;
        this._speed = this.randomizeSpeed(speed);
        this.constructor.count += 1;
    }
    initSprite(size, left, bottom) {
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
    get left() {
        return this._left;
    }
    get bottom() {
        return this._bottom;
    }
    repositionAccompanyingElements() {
        this.collision.style.left = `${this._left}px`;
        this.collision.style.bottom = `${this._bottom}px`;
        this.speech.style.left = `${this._left}px`;
        this.speech.style.bottom = `${this._bottom + this.calculateSpriteWidth(this._size)}px`;
    }
    calculateSpriteWidth(size) {
        if (size === "nano" /* OperativeSize.nano */) {
            return 30;
        }
        else if (size === "small" /* OperativeSize.small */) {
            return 40;
        }
        else if (size === "medium" /* OperativeSize.medium */) {
            return 55;
        }
        else if (size === "large" /* OperativeSize.large */) {
            return 110;
        }
        else {
            return 30;
        }
    }
    positionBottom(bottom) {
        this._bottom = bottom;
        this.el.style.bottom = `${this._bottom}px`;
        this.repositionAccompanyingElements();
    }
    positionLeft(left) {
        this._left = left;
        this.el.style.left = `${this._left}px`;
        this.repositionAccompanyingElements();
    }
    get width() {
        return this.el.width;
    }
    get floor() {
        return this._floor;
    }
    get hello() {
        return `Snake? SNAKE! SNAAAAKE! 📡`;
    }
    getState() {
        return {
            currentStateEnum: this.holdStateEnum ?? this.currentStateEnum,
        };
    }
    get speed() {
        return this._speed;
    }
    randomizeSpeed(speed) {
        const min = speed * 0.7;
        const max = speed * 1.3;
        return Math.random() * (max - min) + min;
    }
    get climbSpeed() {
        return this._climbSpeed;
    }
    get climbHeight() {
        return this._climbHeight;
    }
    get fallSpeed() {
        return this._fallSpeed;
    }
    get isMoving() {
        return this._speed !== 0 /* OperativeSpeed.still */;
    }
    recoverFriend(friend) {
        this._friend = friend;
    }
    recoverState(state) {
        const recoveredStateEnum = state.currentStateEnum ?? this.sequence.startingState;
        const hasRecoveredStateInSequence = this.sequence.sequenceStates.some((s) => s.state === recoveredStateEnum);
        this.currentStateEnum = hasRecoveredStateInSequence
            ? recoveredStateEnum
            : this.sequence.startingState;
        this.currentState = (0, states_1.resolveState)(this.currentStateEnum, this);
        if (!(0, states_1.isStateAboveGround)(this.currentStateEnum)) {
            this.positionBottom(this.floor);
        }
    }
    get canSwipe() {
        return !(0, states_1.isStateAboveGround)(this.currentStateEnum);
    }
    get canChase() {
        return !(0, states_1.isStateAboveGround)(this.currentStateEnum) && this.isMoving;
    }
    showSpeechBubble(message, duration = 3000) {
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
        if (this.currentStateEnum === "swipe" /* States.swipe */) {
            return;
        }
        this.holdState = this.currentState;
        this.holdStateEnum = this.currentStateEnum;
        this.currentStateEnum = "swipe" /* States.swipe */;
        this.currentState = (0, states_1.resolveState)(this.currentStateEnum, this);
        this.showSpeechBubble('!');
    }
    chase(ballState, canvas) {
        this.currentStateEnum = "chase" /* States.chase */;
        this.currentState = new states_1.ChaseState(this, ballState, canvas);
    }
    faceLeft() {
        this.el.style.transform = 'scaleX(-1)';
    }
    faceRight() {
        this.el.style.transform = 'scaleX(1)';
    }
    setAnimation(face) {
        if (this.el.src.endsWith(`_${face}_8fps.gif`)) {
            return;
        }
        this.el.src = `${this.petRoot}_${face}_8fps.gif`;
    }
    chooseNextState(fromState) {
        let possibleNextStates = undefined;
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
        if (this.currentState.horizontalDirection === "left" /* HorizontalDirection.left */) {
            this.faceLeft();
        }
        else if (this.currentState.horizontalDirection === "right" /* HorizontalDirection.right */) {
            this.faceRight();
        }
        this.setAnimation(this.currentState.spriteLabel);
        // Chase friend?
        if (this.hasFriend &&
            this.currentStateEnum !== "chase-friend" /* States.chaseFriend */ &&
            this.isMoving) {
            if (this.friend?.isPlaying &&
                !(0, states_1.isStateAboveGround)(this.currentStateEnum)) {
                this.currentState = (0, states_1.resolveState)("chase-friend" /* States.chaseFriend */, this);
                this.currentStateEnum = "chase-friend" /* States.chaseFriend */;
                return;
            }
        }
        const frameResult = this.currentState.nextFrame();
        if (frameResult === 1 /* FrameResult.stateComplete */) {
            if (this.holdState && this.holdStateEnum) {
                this.currentState = this.holdState;
                this.currentStateEnum = this.holdStateEnum;
                this.holdState = undefined;
                this.holdStateEnum = undefined;
                return;
            }
            const nextState = this.chooseNextState(this.currentStateEnum);
            this.currentState = (0, states_1.resolveState)(nextState, this);
            this.currentStateEnum = nextState;
        }
        else if (frameResult === 2 /* FrameResult.stateCancel */) {
            if (this.currentStateEnum === "chase" /* States.chase */ ||
                this.currentStateEnum === "chase-friend" /* States.chaseFriend */) {
                const nextState = this.chooseNextState("idle-with-ball" /* States.idleWithBall */);
                this.currentState = (0, states_1.resolveState)(nextState, this);
                this.currentStateEnum = nextState;
            }
        }
    }
    get hasFriend() {
        return this._friend !== undefined;
    }
    get friend() {
        return this._friend;
    }
    get name() {
        return this._name;
    }
    makeFriendsWith(friend) {
        this._friend = friend;
        console.log(this.name, ': Codec link established with', friend.name);
        return true;
    }
    get isPlaying() {
        return (this.isMoving &&
            (this.currentStateEnum === "run-right" /* States.runRight */ ||
                this.currentStateEnum === "run-left" /* States.runLeft */));
    }
    get emoji() {
        return '🐍';
    }
    get size() {
        return this._size;
    }
    remove() { }
}
exports.BasePetType = BasePetType;
BasePetType.count = 0;
