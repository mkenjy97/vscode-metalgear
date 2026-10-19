import { OperativeSize } from '../../common/types';
import { ColorThemeKind } from '../../common/types';

export abstract class Effect {
    protected foregroundCanvas: HTMLCanvasElement | undefined;
    protected backgroundCanvas: HTMLCanvasElement | undefined;
    protected animationId: number | undefined;

    abstract init(
        foregroundCanvas: HTMLCanvasElement,
        backgroundCanvas: HTMLCanvasElement,
        size: OperativeSize,
        floor: number,
        themeKind: ColorThemeKind,
    ): void;

    enable(): void {
        this.startAnimation();
    }

    disable(): void {
        if (this.animationId !== undefined) {
            cancelAnimationFrame(this.animationId);
            this.animationId = undefined;
        }
        // Clear canvases
        if (this.foregroundCanvas) {
            const ctx = this.foregroundCanvas.getContext('2d');
            ctx?.clearRect(0, 0, this.foregroundCanvas.width, this.foregroundCanvas.height);
        }
        if (this.backgroundCanvas) {
            const ctx = this.backgroundCanvas.getContext('2d');
            ctx?.clearRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
        }
    }

    handleResize(): void {
        if (this.foregroundCanvas) {
            this.foregroundCanvas.width = window.innerWidth;
            this.foregroundCanvas.height = window.innerHeight;
        }
        if (this.backgroundCanvas) {
            this.backgroundCanvas.width = window.innerWidth;
            this.backgroundCanvas.height = window.innerHeight;
        }
    }

    protected abstract startAnimation(): void;
}
