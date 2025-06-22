import { Scene } from '../Scene';

describe('Scene', () => {
  let scene: Scene;

  beforeEach(() => {
    scene = new Scene('test-scene');
  });

  test('should create scene with correct name', () => {
    expect(scene.name).toBe('test-scene');
  });

  test('should initialize with inactive state', () => {
    expect(scene.state).toBe('inactive');
    expect(scene.isActive()).toBe(false);
    expect(scene.isPaused()).toBe(false);
  });

  test('should set and get data', () => {
    scene.setData('key', 'value');
    expect(scene.getData('key')).toBe('value');
  });

  test('should change state correctly', () => {
    scene.setState('active');
    expect(scene.state).toBe('active');
    expect(scene.isActive()).toBe(true);
  });

  test('should handle pause state', () => {
    scene.setState('paused');
    expect(scene.isPaused()).toBe(true);
    expect(scene.isActive()).toBe(false);
  });
});
