import { KolownScene } from './Scene';

/**
 * A constructor type for creating scenes.
 */
type SceneConstructor = new (name: string, ...args: any[]) => KolownScene;

/**npx jest src/__tests__/SceneRegistry.test.ts
 * A registry for managing and creating scenes dynamically.
 */
export class SceneRegistry {
  private registry: Map<string, SceneConstructor> = new Map();

  /**
   * Registers a new scene type.
   * @param type - The unique identifier for the scene type.
   * @param constructor - The constructor function for the scene.
   */
  register(type: string, constructor: SceneConstructor): void {
    this.registry.set(type, constructor);
  }

  /**
   * Creates a new scene instance of the specified type.
   * @param type - The type of scene to create.
   * @param name - The name of the scene.
   * @param args - Additional arguments to pass to the scene constructor.
   * @returns The created scene instance.
   * @throws Will throw an error if the scene type is not registered.
   */
  create(type: string, name: string, ...args: any[]): KolownScene {
    const constructor = this.registry.get(type);
    if (!constructor) {
      throw new Error(`Scene type "${type}" is not registered.`);
    }
    return new constructor(name, ...args);
  }
}
