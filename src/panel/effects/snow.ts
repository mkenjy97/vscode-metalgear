/**
 * Effetto neve — Shadow Moses (Alaska).
 * Fiocchi di neve che cadono diagonalmente con vento.
 */
import { OperativeSize, ColorThemeKind } from '../../common/types';
import { Effect } from './effect';

interface Snowflake {
    x: number;
    y: number;
    radius: number;
    speed: number;
    wind: number;
    opacity: number;
}

export class SnowEffect extends Effect {
    private flakes: Snowflake[] = [];
    private readonly FLAKE_COUNT = 80;
    private readonly snowColor: string;

    constructor(snowColor: string = 'rgba(220, 235, 255, 0.9)') {
        super();
        this.snowColor = snowColor;
    }

    init(
        foregroundCanvas: HTMLCanvasElement,
        backgroundCanvas: HTMLCanvasElement,
        _size: OperativeSize,
        _floor: number,
        _themeKind: ColorThemeKind,
    ): void {
        this.foregroundCanvas = foregroundCanvas;
        this.backgroundCanvas = backgroundCanvas;
        this.flakes = [];
        for (let i = 0; i < this.FLAKE_COUNT; i++) {
            this.flakes.push(this.createFlake());
        }
    }

    private createFlake(atTop = false): Snowflake {
        return {
            x: Math.random() * (this.foregroundCanvas?.width ?? window.innerWidth),
            y: atTop ? 0 : Math.random() * (this.foregroundCanvas?.height ?? window.innerHeight),
            radius: Math.random() * 2.5 + 0.5,
            speed: Math.random() * 1.5 + 0.5,
            wind: (Math.random() - 0.5) * 0.8,
            opacity: Math.random() * 0.6 + 0.3,
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
            ctx.fillStyle = this.snowColor;
            this.flakes.forEach((flake) => {
                ctx.beginPath();
                ctx.globalAlpha = flake.opacity;
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fill();

                // Update position
                flake.y += flake.speed;
                flake.x += flake.wind;

                // Reset if out of bounds
                if (flake.y > canvas.height || flake.x < -10 || flake.x > canvas.width + 10) {
                    Object.assign(flake, this.createFlake(true));
                }
            });
            ctx.globalAlpha = 1;
            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }
}
