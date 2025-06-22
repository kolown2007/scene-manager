import { SceneRegistry } from '../SceneRegistry';
import { Scene } from '../Scene';

// Mock Scene class for testing
class MockScene extends Scene {
  constructor(name: string, public extraData?: any) {
    super(name);
  }
}

describe('SceneRegistry', () => {
  let registry: SceneRegistry;

  beforeEach(() => {
    registry = new SceneRegistry();
  });

  test('should register and create a scene', () => {
    registry.register('mock', MockScene);

    const scene = registry.create('mock', 'testScene');

    expect(scene).toBeInstanceOf(MockScene);
    expect(scene.name).toBe('testScene');
  });

  test('should throw an error for unregistered scene types', () => {
    expect(() => {
      registry.create('unregistered', 'testScene');
    }).toThrow('Scene type "unregistered" is not registered.');
  });

  test('should pass additional arguments to the scene constructor', () => {
    registry.register('mock', MockScene);

    const extraData = { key: 'value' };
    const scene = registry.create('mock', 'testScene', extraData);

    expect(scene).toBeInstanceOf(MockScene);
    expect(scene.name).toBe('testScene');
    expect((scene as MockScene).extraData).toEqual(extraData);
  });
});
