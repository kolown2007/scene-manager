import { Scene } from './Scene';

class TestableScene extends Scene {
  public enterCount = 0;
  public exitCount = 0;
  public updateCount = 0;
  public pauseCount = 0;
  public resumeCount = 0;

  onEnter(): void {
    this.enterCount++;
  }

  onExit(): void {
    this.exitCount++;
  }

  onUpdate(deltaTime: number): void {
    this.updateCount++;
  }

  onPause(): void {
    this.pauseCount++;
  }

  onResume(): void {
    this.resumeCount++;
  }
}

describe('Scene Lifecycle', () => {
  let scene: TestableScene;

  beforeEach(() => {
    scene = new TestableScene('lifecycle-test');
  });

  test('should track lifecycle method calls', () => {
    expect(scene.enterCount).toBe(0);
    expect(scene.exitCount).toBe(0);
    expect(scene.updateCount).toBe(0);

    scene.onEnter();
    expect(scene.enterCount).toBe(1);

    scene.onUpdate(16.67); // ~60fps
    expect(scene.updateCount).toBe(1);

    scene.onExit();
    expect(scene.exitCount).toBe(1);
  });

  test('should handle pause and resume correctly', () => {
    scene.setState('active');
    
    scene.onPause();
    expect(scene.pauseCount).toBe(1);
    
    scene.setState('paused');
    expect(scene.isPaused()).toBe(true);
    
    scene.onResume();
    expect(scene.resumeCount).toBe(1);
  });

  test('should store and retrieve data correctly', () => {
    const testData = { score: 100, level: 5 };
    
    scene.setData('gameState', testData);
    expect(scene.getData('gameState')).toEqual(testData);
    
    scene.setData('playerName', 'TestPlayer');
    expect(scene.getData('playerName')).toBe('TestPlayer');
    
    // Test non-existent key
    expect(scene.getData('nonExistent')).toBeUndefined();
  });
});
