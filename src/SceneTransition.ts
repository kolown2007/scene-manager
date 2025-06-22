import { SceneTransitionOptions } from './types';

export class SceneTransition {
  private startTime: number = 0;
  private isRunning: boolean = false;
  
  constructor(
    private options: SceneTransitionOptions = {}
  ) {
    this.options = {
      duration: 1000,
      easing: (t: number) => t, // linear easing by default
      ...options
    };
  }

  public start(): void {
    this.startTime = Date.now();
    this.isRunning = true;
  }

  public update(): number {
    if (!this.isRunning) return 1;

    const elapsed = Date.now() - this.startTime;
    const progress = Math.min(elapsed / (this.options.duration || 1000), 1);
    
    const easedProgress = this.options.easing ? this.options.easing(progress) : progress;

    if (progress >= 1) {
      this.complete();
    }

    return easedProgress;
  }

  public complete(): void {
    this.isRunning = false;
    if (this.options.onComplete) {
      this.options.onComplete();
    }
  }

  public isActive(): boolean {
    return this.isRunning;
  }

  // Common easing functions
  public static easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  public static easeIn(t: number): number {
    return t * t;
  }

  public static easeOut(t: number): number {
    return t * (2 - t);
  }
}
