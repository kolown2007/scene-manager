/**
 * KolownScene represents a single scene in the application.
 * It provides lifecycle methods and state management for the scene.
 */
import { SceneLifecycle, SceneState, SceneData } from './types';

export class KolownScene implements SceneLifecycle {
  public readonly name: string;
  public state: SceneState = 'inactive';
  public data: SceneData = {};

  /**
   * Constructor for KolownScene.
   * @param name - The unique name of the scene.
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Called when the scene is entered.
   * Override this method in subclasses to define custom behavior.
   */
  public onEnter(): void | Promise<void> {
    // Override in subclasses
  }

  /**
   * Called when the scene is exited.
   * Override this method in subclasses to define custom behavior.
   */
  public onExit(): void | Promise<void> {
    // Override in subclasses
  }

  /**
   * Called every frame while the scene is active.
   * @param deltaTime - The time elapsed since the last update.
   * Override this method in subclasses to define custom behavior.
   */
  public onUpdate(deltaTime: number): void {
    // Override in subclasses
  }

  /**
   * Called when the scene is paused.
   * Override this method in subclasses to define custom behavior.
   */
  public onPause(): void {
    // Override in subclasses
  }

  /**
   * Called when the scene is resumed from a paused state.
   * Override this method in subclasses to define custom behavior.
   */
  public onResume(): void {
    // Override in subclasses
  }

  /**
   * Sets the state of the scene.
   * @param state - The new state of the scene.
   */
  public setState(state: SceneState): void {
    this.state = state;
  }

  /**
   * Checks if the scene is currently active.
   * @returns True if the scene is active, false otherwise.
   */
  public isActive(): boolean {
    return this.state === 'active';
  }

  /**
   * Checks if the scene is currently paused.
   * @returns True if the scene is paused, false otherwise.
   */
  public isPaused(): boolean {
    return this.state === 'paused';
  }

  /**
   * Stores a key-value pair in the scene's data storage.
   * @param key - The key to store the value under.
   * @param value - The value to store.
   */
  public setData(key: string, value: any): void {
    this.data[key] = value;
  }

  /**
   * Retrieves a value from the scene's data storage.
   * @param key - The key of the value to retrieve.
   * @returns The value associated with the key, or undefined if not found.
   */
  public getData(key: string): any {
    return this.data[key];
  }
}
