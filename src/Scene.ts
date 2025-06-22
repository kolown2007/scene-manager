import { SceneLifecycle, SceneState, SceneData } from './types';

export class Scene implements SceneLifecycle {
  public readonly name: string;
  public state: SceneState = 'inactive';
  public data: SceneData = {};

  constructor(name: string) {
    this.name = name;
  }

  public onEnter(): void | Promise<void> {
    // Override in subclasses
  }

  public onExit(): void | Promise<void> {
    // Override in subclasses
  }

  public onUpdate(deltaTime: number): void {
    // Override in subclasses
  }

  public onPause(): void {
    // Override in subclasses
  }

  public onResume(): void {
    // Override in subclasses
  }

  public setState(state: SceneState): void {
    this.state = state;
  }

  public isActive(): boolean {
    return this.state === 'active';
  }

  public isPaused(): boolean {
    return this.state === 'paused';
  }

  public setData(key: string, value: any): void {
    this.data[key] = value;
  }

  public getData(key: string): any {
    return this.data[key];
  }
}
