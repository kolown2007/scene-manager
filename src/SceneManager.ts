import { Scene } from './Scene';
import { SceneTransition } from './SceneTransition';
import { SceneManagerOptions, SceneTransitionOptions } from './types';

export class SceneManager {
  private scenes: Map<string, Scene> = new Map();
  private currentScene: Scene | null = null;
  private previousScene: Scene | null = null;
  private activeTransition: SceneTransition | null = null;
  private lastUpdateTime: number = 0;
  private isUpdating: boolean = false;

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

  public addScene(scene: Scene): void {
    this.scenes.set(scene.name, scene);
  }

  public removeScene(sceneName: string): void {
    const scene = this.scenes.get(sceneName);
    if (scene === this.currentScene) {
      this.currentScene = null;
    }
    this.scenes.delete(sceneName);
  }

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
    newScene: Scene, 
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

  private async directSwitchToScene(newScene: Scene): Promise<void> {
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

  public getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  public getPreviousScene(): Scene | null {
    return this.previousScene;
  }

  public pauseCurrentScene(): void {
    if (this.currentScene && this.currentScene.isActive()) {
      this.currentScene.setState('paused');
      this.currentScene.onPause();
    }
  }

  public resumeCurrentScene(): void {
    if (this.currentScene && this.currentScene.isPaused()) {
      this.currentScene.setState('active');
      this.currentScene.onResume();
    }
  }

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

  public stopUpdateLoop(): void {
    this.isUpdating = false;
  }

  public getScenes(): string[] {
    return Array.from(this.scenes.keys());
  }

  public hasScene(sceneName: string): boolean {
    return this.scenes.has(sceneName);
  }
}
