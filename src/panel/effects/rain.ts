/**
 * Effetto pioggia — Mother Base / Big Shell.
 * Gocce di pioggia che cadono verticalmente con leggero angolo.
 */
import { OperativeSize, ColorThemeKind } from '../../common/types';
import { Effect } from './effect';

interface Raindrop {
    x: number;
    y: number;
    length: number;
    speed: number;
    angle: number;
    opacity: number;
}

export class RainEffect extends Effect {
    private drops: Raindrop[] = [];
    private readonly DROP_COUNT = 120;

    init(
        foregroundCanvas: HTMLCanvasElement,
        backgroundCanvas: HTMLCanvasElement,
        _size: OperativeSize,
        _floor: number,
        _themeKind: ColorThemeKind,
    ): void {
        this.foregroundCanvas = foregroundCanvas;
        this.backgroundCanvas = backgroundCanvas;
        this.drops = [];
        for (let i = 0; i < this.DROP_COUNT; i++) {
            this.drops.push(this.createDrop());
        }
    }

    private createDrop(atTop = false): Raindrop {
        const w = this.foregroundCanvas?.width ?? window.innerWidth;
        const h = this.foregroundCanvas?.height ?? window.innerHeight;
        return {
            x: Math.random() * w,
            y: atTop ? 0 : Math.random() * h,
            length: Math.random() * 15 + 8,
            speed: Math.random() * 4 + 6,
            angle: Math.PI / 6 + (Math.random() - 0.5) * 0.2, // ~30° angle
            opacity: Math.random() * 0.4 + 0.2,
        };
    }

    protected startAnimation(): void {
        const canvas = this.foregroundCanvas;
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            this.drops.forEach((drop) => {
                ctx.beginPath();
                ctx.globalAlpha = drop.opacity;
                ctx.strokeStyle = 'rgba(150, 180, 220, 0.8)';
                ctx.lineWidth = 0.8;

                const dx = Math.sin(drop.angle) * drop.length;
                const dy = Math.cos(drop.angle) * drop.length;

                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x + dx, drop.y + dy);
                ctx.stroke();

                // Update position
                drop.y += drop.speed;
                drop.x += Math.sin(drop.angle) * drop.speed * 0.3;

                // Reset if out of bounds
                if (drop.y > canvas.height || drop.x > canvas.width + 20) {
                    Object.assign(drop, this.createDrop(true));
                }
            });

            ctx.globalAlpha = 1;
            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }
}
