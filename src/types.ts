export interface SceneLifecycle {
  onEnter?(): void | Promise<void>;
  onExit?(): void | Promise<void>;
  onUpdate?(deltaTime: number): void;
  onPause?(): void;
  onResume?(): void;
}

export interface SceneTransitionOptions {
  duration?: number;
  easing?: (t: number) => number;
  onComplete?(): void;
}

export type SceneState = 'inactive' | 'entering' | 'active' | 'exiting' | 'paused';

export interface SceneManagerOptions {
  enableTransitions?: boolean;
  defaultTransitionDuration?: number;
  autoUpdate?: boolean;
}

export interface SceneData {
  [key: string]: any;
}
