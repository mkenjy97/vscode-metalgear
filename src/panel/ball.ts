/**
 * Ration throwing system — Metal Gear Solid edition.
 * La "palla" di vscode-pets diventa una razione (C-ration / Calorie Mate).
 */
import { OperativeSize } from '../common/types';
import { BallState } from './states';
import { OperativeElement } from './pets';

const RATION_RADIUS_NANO = 8;
const RATION_RADIUS_SMALL = 10;
const RATION_RADIUS_MEDIUM = 14;
const RATION_RADIUS_LARGE = 20;

let ballState: BallState | undefined;
let canvas: HTMLCanvasElement | null = null;
let petSize: OperativeSize = OperativeSize.nano;
let floor: number = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

export function calculateBallRadius(size: OperativeSize): number {
    switch (size) {
        case OperativeSize.nano:   return RATION_RADIUS_NANO;
        case OperativeSize.small:  return RATION_RADIUS_SMALL;
        case OperativeSize.medium: return RATION_RADIUS_MEDIUM;
        case OperativeSize.large:  return RATION_RADIUS_LARGE;
        default:                   return RATION_RADIUS_NANO;
    }
}

export function setupBallThrowing(
    canvasId: string,
    size: OperativeSize,
    floorHeight: number,
): void {
    canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    petSize = size;
    floor = floorHeight;
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

function drawRation(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    // Disegna una razione stilizzata (rettangolo arrotondato verde)
    ctx.save();
    ctx.translate(x, y);
    const w = radius * 2;
    const h = radius * 1.4;
    ctx.fillStyle = '#4a7c3f';
    ctx.strokeStyle = '#2a4a2a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 3);
    ctx.fill();
    ctx.stroke();
    // Label "C" per C-ration
    ctx.fillStyle = '#d4c87a';
    ctx.font = `bold ${Math.max(8, radius)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('C', 0, 0);
    ctx.restore();
}

export function throwBall(pets: OperativeElement[]): BallState | undefined {
    if (!canvas) {
        return undefined;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return undefined;
    }

    const radius = calculateBallRadius(petSize);
    const startX = Math.random() * (canvas.width - radius * 2) + radius;
    const startY = canvas.height - floor - radius;
    const vx = (Math.random() - 0.5) * 10;
    const vy = -(Math.random() * 8 + 6);

    ballState = new BallState(startX, startY, vx, vy);

    pets.forEach((petEl) => {
        if (petEl.operative.canChase) {
            petEl.operative.chase(ballState!, canvas!);
        }
    });

    animateRation(ctx, radius);
    return ballState;
}

function animateRation(ctx: CanvasRenderingContext2D, radius: number) {
    if (!ballState || !canvas) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!ballState.paused) {
        drawRation(ctx, ballState.x, ballState.y, radius);

        // Physics
        ballState.vy += 0.5; // gravity
        ballState.x += ballState.vx;
        ballState.y += ballState.vy;

        // Bounce off walls
        if (ballState.x < radius || ballState.x > canvas.width - radius) {
            ballState.vx *= -0.8;
            ballState.x = Math.max(radius, Math.min(canvas.width - radius, ballState.x));
        }

        // Bounce off floor
        const floorY = canvas.height - floor - radius;
        if (ballState.y >= floorY) {
            ballState.y = floorY;
            ballState.vy *= -0.6;
            ballState.vx *= 0.9;
            if (Math.abs(ballState.vy) < 1) {
                ballState.paused = true;
                // Fade out after 3 seconds
                setTimeout(() => {
                    ctx.clearRect(0, 0, canvas!.width, canvas!.height);
                    ballState = undefined;
                }, 3000);
                return;
            }
        }
    }

    if (ballState && !ballState.paused) {
        requestAnimationFrame(() => animateRation(ctx, radius));
    }
}

// ── Mouse throwing ────────────────────────────────────────────────────────────

export function dynamicThrowOn(pets: OperativeElement[]): void {
    if (!canvas) {
        return;
    }
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', (e) => onMouseUp(e, pets));
}

export function dynamicThrowOff(): void {
    if (!canvas) {
        return;
    }
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mousemove', onMouseMove);
}

function onMouseDown(e: MouseEvent) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
}

function onMouseMove(_e: MouseEvent) {
    // Could draw a trajectory preview
}

function onMouseUp(e: MouseEvent, pets: OperativeElement[]) {
    if (!isDragging || !canvas) {
        return;
    }
    isDragging = false;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    const radius = calculateBallRadius(petSize);

    ballState = new BallState(
        dragStartX,
        dragStartY,
        dx * 0.15,
        dy * 0.15 - 5,
    );

    pets.forEach((petEl) => {
        if (petEl.operative.canChase) {
            petEl.operative.chase(ballState!, canvas!);
        }
    });

    animateRation(ctx, radius);
}

export function throwAndChase(pets: OperativeElement[]): void {
    throwBall(pets);
}
