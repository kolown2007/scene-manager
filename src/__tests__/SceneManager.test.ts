import { SceneManager, Scene } from '../index';

class TestScene extends Scene {
  public enterCalled = false;
  public exitCalled = false;

  onEnter(): void {
    this.enterCalled = true;
  }

  onExit(): void {
    this.exitCalled = true;
  }
}

describe('SceneManager', () => {
  let sceneManager: SceneManager;
  let scene1: TestScene;
  let scene2: TestScene;

  beforeEach(() => {
    sceneManager = new SceneManager({ autoUpdate: false });
    scene1 = new TestScene('scene1');
    scene2 = new TestScene('scene2');
  });

  test('should add and remove scenes', () => {
    sceneManager.addScene(scene1);
    expect(sceneManager.hasScene('scene1')).toBe(true);
    expect(sceneManager.getScenes()).toContain('scene1');

    sceneManager.removeScene('scene1');
    expect(sceneManager.hasScene('scene1')).toBe(false);
  });

  test('should switch to scene without transitions', async () => {
    const sceneManagerNoTransitions = new SceneManager({ 
      enableTransitions: false,
      autoUpdate: false 
    });
    
    sceneManagerNoTransitions.addScene(scene1);
    await sceneManagerNoTransitions.switchTo('scene1');

    expect(sceneManagerNoTransitions.getCurrentScene()).toBe(scene1);
    expect(scene1.enterCalled).toBe(true);
    expect(scene1.state).toBe('active');
  });

  test('should throw error when switching to non-existent scene', async () => {
    await expect(sceneManager.switchTo('non-existent')).rejects.toThrow('Scene "non-existent" not found');
  });

  test('should not switch if already on the same scene', async () => {
    sceneManager.addScene(scene1);
    await sceneManager.switchTo('scene1');
    
    scene1.enterCalled = false; // Reset
    await sceneManager.switchTo('scene1');
    
    expect(scene1.enterCalled).toBe(false); // Should not call enter again
  });

  test('should pause and resume current scene', async () => {
    const scene = new TestScene('test');
    let pauseCalled = false;
    let resumeCalled = false;
    
    scene.onPause = () => { pauseCalled = true; };
    scene.onResume = () => { resumeCalled = true; };
    
    sceneManager.addScene(scene);
    await sceneManager.switchTo('test');
    
    sceneManager.pauseCurrentScene();
    expect(scene.isPaused()).toBe(true);
    expect(pauseCalled).toBe(true);
    
    sceneManager.resumeCurrentScene();
    expect(scene.isActive()).toBe(true);
    expect(resumeCalled).toBe(true);
  });
});
