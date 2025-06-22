import { SceneTransition } from '../SceneTransition';

describe('SceneTransition', () => {
  let transition: SceneTransition;

  beforeEach(() => {
    transition = new SceneTransition({
      duration: 1000,
      easing: (t) => t // linear easing
    });
  });

  test('should initialize in stopped state', () => {
    expect(transition.isActive()).toBe(false);
  });

  test('should start transition', () => {
    transition.start();
    expect(transition.isActive()).toBe(true);
  });

  test('should update progress correctly', () => {
    transition.start();
    
    // Mock Date.now to control time
    const originalNow = Date.now;
    let mockTime = 1000;
    Date.now = jest.fn(() => mockTime);

    // Start time
    transition.start();
    
    // Halfway through
    mockTime += 500;
    let progress = transition.update();
    expect(progress).toBeCloseTo(0.5, 1);
    expect(transition.isActive()).toBe(true);

    // Complete
    mockTime += 500;
    progress = transition.update();
    expect(progress).toBe(1);
    expect(transition.isActive()).toBe(false);

    // Restore Date.now
    Date.now = originalNow;
  });

  test('should call onComplete callback', () => {
    const onComplete = jest.fn();
    const transitionWithCallback = new SceneTransition({
      duration: 100,
      onComplete
    });

    transitionWithCallback.start();
    transitionWithCallback.complete();

    expect(onComplete).toHaveBeenCalled();
  });

  test('should apply easing function', () => {
    const easingFn = jest.fn((t) => t * t); // quadratic easing
    const easedTransition = new SceneTransition({
      duration: 1000,
      easing: easingFn
    });

    easedTransition.start();
    
    // Mock time
    const originalNow = Date.now;
    let mockTime = 1000;
    Date.now = jest.fn(() => mockTime);

    easedTransition.start();
    mockTime += 500; // 50% through
    
    easedTransition.update();
    
    expect(easingFn).toHaveBeenCalledWith(0.5);

    Date.now = originalNow;
  });

  describe('Built-in easing functions', () => {
    test('easeIn should work correctly', () => {
      expect(SceneTransition.easeIn(0)).toBe(0);
      expect(SceneTransition.easeIn(0.5)).toBe(0.25);
      expect(SceneTransition.easeIn(1)).toBe(1);
    });

    test('easeOut should work correctly', () => {
      expect(SceneTransition.easeOut(0)).toBe(0);
      expect(SceneTransition.easeOut(0.5)).toBe(0.75);
      expect(SceneTransition.easeOut(1)).toBe(1);
    });

    test('easeInOut should work correctly', () => {
      expect(SceneTransition.easeInOut(0)).toBe(0);
      expect(SceneTransition.easeInOut(0.25)).toBe(0.125);
      expect(SceneTransition.easeInOut(0.75)).toBe(0.875);
      expect(SceneTransition.easeInOut(1)).toBe(1);
    });
  });
});
