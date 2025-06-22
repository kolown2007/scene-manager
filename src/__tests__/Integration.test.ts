import { SceneManager, Scene } from '../index';

// Mock scene for testing
class MockScene extends Scene {
  public lifecycleCalls: string[] = [];
  public lastDeltaTime: number = 0;

  onEnter(): void {
    this.lifecycleCalls.push('enter');    
  }

  onExit(): void {
    this.lifecycleCalls.push('exit');
  }

  onUpdate(deltaTime: number): void {
    this.lifecycleCalls.push('update');
    this.lastDeltaTime = deltaTime;
  }

  onPause(): void {
    this.lifecycleCalls.push('pause');
  }

  onResume(): void {
    this.lifecycleCalls.push('resume');
  }
}

// Async scene for testing promises
class AsyncScene extends Scene {
  public enterPromiseResolver?: () => void;
  public exitPromiseResolver?: () => void;

  onEnter(): Promise<void> {
    return new Promise(resolve => {
      this.enterPromiseResolver = resolve;
      // Simulate async operation
      setTimeout(resolve, 10);
    });
  }

  onExit(): Promise<void> {
    return new Promise(resolve => {
      this.exitPromiseResolver = resolve;
      setTimeout(resolve, 10);
    });
  }
}

describe('SceneManager Integration Tests', () => {
  let sceneManager: SceneManager;
  let scene1: MockScene;
  let scene2: MockScene;

  beforeEach(() => {
    // Create fresh instances for each test
    sceneManager = new SceneManager({ 
      autoUpdate: false,
      enableTransitions: false 
    });
    scene1 = new MockScene('scene1');
    scene2 = new MockScene('scene2');
    
    sceneManager.addScene(scene1);
    sceneManager.addScene(scene2);
  });

  describe('Scene Switching', () => {
    test('should properly switch between scenes', async () => {
      // Switch to first scene
      await sceneManager.switchTo('scene1');
      
      expect(sceneManager.getCurrentScene()).toBe(scene1);
      expect(scene1.lifecycleCalls).toContain('enter');
      expect(scene1.state).toBe('active');

      // Switch to second scene
      await sceneManager.switchTo('scene2');
      
      expect(sceneManager.getCurrentScene()).toBe(scene2);
      expect(sceneManager.getPreviousScene()).toBe(scene1);
      expect(scene1.lifecycleCalls).toContain('exit');
      expect(scene2.lifecycleCalls).toContain('enter');
    });

    test('should handle async scene lifecycle methods', async () => {
      const asyncScene = new AsyncScene('async');
      sceneManager.addScene(asyncScene);

      const switchPromise = sceneManager.switchTo('async');
      
      // Should not be active immediately
      expect(sceneManager.getCurrentScene()?.state).not.toBe('active');
      
      // Wait for async completion
      await switchPromise;
      
      expect(sceneManager.getCurrentScene()).toBe(asyncScene);
      expect(asyncScene.state).toBe('active');
    });
  });

  describe('Scene Updates', () => {
    test('should update active scene', async () => {
      await sceneManager.switchTo('scene1');
      
      const deltaTime = 16.67;
      sceneManager.update(deltaTime);
      
      expect(scene1.lifecycleCalls).toContain('update');
      expect(scene1.lastDeltaTime).toBe(deltaTime);
    });

    test('should not update inactive scenes', async () => {
      await sceneManager.switchTo('scene1');
      sceneManager.update(16.67);
      
      // scene2 should not be updated
      expect(scene2.lifecycleCalls).not.toContain('update');
    });
  });

  describe('Pause and Resume', () => {
    test('should pause and resume correctly', async () => {
      await sceneManager.switchTo('scene1');
      
      sceneManager.pauseCurrentScene();
      expect(scene1.state).toBe('paused');
      expect(scene1.lifecycleCalls).toContain('pause');
      
      sceneManager.resumeCurrentScene();
      expect(scene1.state).toBe('active');
      expect(scene1.lifecycleCalls).toContain('resume');
    });

    test('should not update paused scenes', async () => {
      await sceneManager.switchTo('scene1');
      sceneManager.pauseCurrentScene();
      
      scene1.lifecycleCalls = []; // Clear previous calls
      sceneManager.update(16.67);
      
      expect(scene1.lifecycleCalls).not.toContain('update');
    });
  });

  describe('Error Handling', () => {
    test('should throw error for non-existent scene', async () => {
      await expect(
        sceneManager.switchTo('nonExistentScene')
      ).rejects.toThrow('Scene "nonExistentScene" not found');
    });

    test('should handle scene lifecycle errors gracefully', async () => {
      const errorScene = new Scene('error');
      errorScene.onEnter = () => {
        throw new Error('Test error');
      };
      
      sceneManager.addScene(errorScene);
      
      // Should throw the error from the scene
      await expect(
        sceneManager.switchTo('error')
      ).rejects.toThrow('Test error');
    });
  });

  describe('Scene Data Management', () => {
    test('should persist scene data across switches', async () => {
      await sceneManager.switchTo('scene1');
      
      scene1.setData('score', 100);
      scene1.setData('level', 5);
      
      await sceneManager.switchTo('scene2');
      await sceneManager.switchTo('scene1');
      
      expect(scene1.getData('score')).toBe(100);
      expect(scene1.getData('level')).toBe(5);
    });
  });

  describe('Scene Manager State', () => {
    test('should track scene list correctly', () => {
      expect(sceneManager.getScenes()).toEqual(['scene1', 'scene2']);
      expect(sceneManager.hasScene('scene1')).toBe(true);
      expect(sceneManager.hasScene('nonExistent')).toBe(false);
    });

    test('should remove scenes correctly', async () => {
      await sceneManager.switchTo('scene1');
      
      sceneManager.removeScene('scene1');
      
      expect(sceneManager.hasScene('scene1')).toBe(false);
      expect(sceneManager.getCurrentScene()).toBeNull();
    });
  });
});
