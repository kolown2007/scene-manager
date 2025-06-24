import { SceneManager, KolownScene } from '../src';

// Example scene classes
class MenuScene extends KolownScene {
  constructor() {
    super('menu');
  }

  onEnter(): void {
    console.log('Entering menu scene');
    // Initialize menu UI
  }

  onExit(): void {
    console.log('Exiting menu scene');
    // Clean up menu UI
  }

  onUpdate(deltaTime: number): void {
    // Update menu animations, handle input, etc.
  }
}

class GameScene extends KolownScene {
  constructor() {
    super('game');
  }

  onEnter(): void {
    console.log('Entering game scene');
    // Initialize game world
  }

  onExit(): void {
    console.log('Exiting game scene');
    // Save game state, clean up
  }

  onUpdate(deltaTime: number): void {
    // Update game logic, physics, rendering, etc.
  }

  onPause(): void {
    console.log('Game paused');
    // Pause game logic
  }

  onResume(): void {
    console.log('Game resumed');
    // Resume game logic
  }
}

// Usage example
const sceneManager = new SceneManager({
  enableTransitions: true,
  defaultTransitionDuration: 500
});

// Add scenes
sceneManager.addScene(new MenuScene());
sceneManager.addScene(new GameScene());

// Switch between scenes
async function startGame() {
  await sceneManager.switchTo('menu');
  
  // Later, when user clicks "Start Game"
  setTimeout(async () => {
    await sceneManager.switchTo('game', {
      duration: 1000,
      easing: (t) => t * t // ease-in
    });
  }, 2000);
}

startGame();
