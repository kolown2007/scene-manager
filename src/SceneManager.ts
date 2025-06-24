/**
 * SceneManager is responsible for managing scenes in an application.
 * It handles adding, removing, switching, pausing, resuming, and updating scenes.
 */

import { KolownScene } from './Scene';
import { SceneTransition } from './SceneTransition';
import { SceneManagerOptions, SceneTransitionOptions } from './types';

export class SceneManager {
  private scenes: Map<string, KolownScene> = new Map();
  private currentScene: KolownScene | null = null;
  private previousScene: KolownScene | null = null;
  private activeTransition: SceneTransition | null = null;
  private lastUpdateTime: number = 0;
  private isUpdating: boolean = false;

  /**
   * Constructor for SceneManager.
   * @param options - Configuration options for the SceneManager.
   *   - enableTransitions: Enable/disable scene transitions (default: true).
   *   - defaultTransitionDuration: Default transition duration in milliseconds (default: 1000).
   *   - autoUpdate: Automatically start the update loop (default: true).
   */
  constructor(private options: SceneManagerOptions = {}) {
    this.options = {
      enableTransitions: true,
      defaultTransitionDuration: 1000,
      autoUpdate: true,
      ...options
    };

    if (this.options.autoUpdate) {
      this.startUpdateLoop();
    }
  }

  /**
   * Adds a scene to the manager.
   * @param scene - The scene to add.
   */
  public addScene(scene: KolownScene): void {
    this.scenes.set(scene.name, scene);
  }

  /**
   * Removes a scene from the manager.
   * @param sceneName - The name of the scene to remove.
   */
  public removeScene(sceneName: string): void {
    const scene = this.scenes.get(sceneName);
    if (scene === this.currentScene) {
      this.currentScene = null;
    }
    this.scenes.delete(sceneName);
  }

  /**
   * Switches to a specified scene.
   * @param sceneName - The name of the scene to switch to.
   * @param transitionOptions - Optional transition options.
   * @throws Error if the specified scene is not found.
   */
  public async switchTo(
    sceneName: string, 
    transitionOptions?: SceneTransitionOptions
  ): Promise<void> {
    const newScene = this.scenes.get(sceneName);
    if (!newScene) {
      throw new Error(`Scene "${sceneName}" not found`);
    }

    if (this.currentScene === newScene) {
      return; // Already on this scene
    }

    this.previousScene = this.currentScene;

    if (this.options.enableTransitions && (this.currentScene || transitionOptions)) {
      await this.transitionToScene(newScene, transitionOptions);
    } else {
      await this.directSwitchToScene(newScene);
    }
  }

  private async transitionToScene(
    newScene: KolownScene, 
    transitionOptions?: SceneTransitionOptions
  ): Promise<void> {
    const options = {
      duration: this.options.defaultTransitionDuration,
      ...transitionOptions
    };

    return new Promise<void>((resolve) => {
      this.activeTransition = new SceneTransition({
        ...options,
        onComplete: () => {
          this.activeTransition = null;
          resolve();
        }
      });

      // Start exiting current scene
      if (this.currentScene) {
        this.currentScene.setState('exiting');
        this.currentScene.onExit();
      }

      // Start entering new scene
      newScene.setState('entering');
      newScene.onEnter();

      this.currentScene = newScene;
      this.activeTransition.start();
    });
  }

  private async directSwitchToScene(newScene: KolownScene): Promise<void> {
    // Exit current scene
    if (this.currentScene) {
      this.currentScene.setState('exiting');
      await this.currentScene.onExit();
      this.currentScene.setState('inactive');
    }

    // Enter new scene
    this.currentScene = newScene;
    newScene.setState('entering');
    await newScene.onEnter();
    newScene.setState('active');
  }

  /**
   * Pauses the current scene.
   * Sets the current scene's state to 'paused' and calls its onPause lifecycle method.
   */
  public pauseCurrentScene(): void {
    if (this.currentScene && this.currentScene.isActive()) {
      this.currentScene.setState('paused');
      this.currentScene.onPause();
    }
  }

  /**
   * Resumes the current scene.
   * Sets the current scene's state to 'active' and calls its onResume lifecycle method.
   */
  public resumeCurrentScene(): void {
    if (this.currentScene && this.currentScene.isPaused()) {
      this.currentScene.setState('active');
      this.currentScene.onResume();
    }
  }

  /**
   * Updates the current scene and active transition.
   * @param deltaTime - Optional time delta for the update.
   */
  public update(deltaTime?: number): void {
    const now = Date.now();
    const dt = deltaTime ?? (now - this.lastUpdateTime);
    this.lastUpdateTime = now;

    // Update active transition
    if (this.activeTransition) {
      const progress = this.activeTransition.update();
      
      if (progress >= 1 && this.currentScene) {
        this.currentScene.setState('active');
        if (this.previousScene) {
          this.previousScene.setState('inactive');
        }
      }
    }

    // Update current scene
    if (this.currentScene && this.currentScene.isActive()) {
      this.currentScene.onUpdate(dt);
    }
  }

  /**
   * Starts the update loop for the SceneManager.
   * Continuously updates the current scene and active transition.
   */
  private startUpdateLoop(): void {
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    this.lastUpdateTime = Date.now();

    const updateFrame = () => {
      if (!this.isUpdating) return;
      
      this.update();
      requestAnimationFrame(updateFrame);
    };

    requestAnimationFrame(updateFrame);
  }

  /**
   * Stops the update loop for the SceneManager.
   */
  public stopUpdateLoop(): void {
    this.isUpdating = false;
  }

  /**
   * Gets the names of all scenes managed by the SceneManager.
   * @returns An array of scene names.
   */
  public getScenes(): string[] {
    return Array.from(this.scenes.keys());
  }

  /**
   * Checks if a scene exists in the manager.
   * @param sceneName - The name of the scene to check.
   * @returns True if the scene exists, false otherwise.
   */
  public hasScene(sceneName: string): boolean {
    return this.scenes.has(sceneName);
  }
}
