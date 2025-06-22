import { Scene } from './Scene';

/**
 * A scene that runs in the background without a visual component.
 * Useful for tasks like data processing, network requests, or background logic.
 */
export class BackgroundScene extends Scene {
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Called when the scene is entered. Starts background tasks.
   */
  onEnter(): void {
    console.log(`${this.name} entered.`);
    // Example: Start a periodic task
    this.intervalId = setInterval(() => {
      this.performBackgroundTask();
    }, 1000); // Run every second
  }

  /**
   * Called when the scene is exited. Cleans up background tasks.
   */
  onExit(): void {
    console.log(`${this.name} exited.`);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Perform the background task. Override this method to define custom logic.
   */
  protected performBackgroundTask(): void {
    console.log(`${this.name} is performing a background task.`);
    // Add custom logic here
  }

  /**
   * Update method is optional for background scenes but can be used if needed.
   */
  onUpdate(deltaTime: number): void {
    // No-op by default
  }
}
