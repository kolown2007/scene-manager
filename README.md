# Scene Manager

A lightweight, framework-agnostic scene management library for JavaScript/TypeScript applications. Perfect for games, interactive applications, and any project that needs to manage different application states or "scenes".

## Features

- 🎮 **Framework Agnostic** - Works with any JavaScript framework or vanilla JS
- 🔄 **Smooth Transitions** - Built-in transition system with customizable easing
- 📦 **TypeScript Support** - Full TypeScript definitions included
- 🎯 **Lifecycle Management** - Clean enter/exit/update/pause/resume lifecycle
- 🚀 **Lightweight** - Small bundle size with no dependencies
- 🧪 **Well Tested** - Comprehensive test suite

## Installation

```bash
not yet on npm
```

## Quick Start

```typescript
import { SceneManager, Scene } from 'scene-manager';

// Create custom scenes
class MenuScene extends Scene {
  constructor() {
    super('menu');
  }

  onEnter() {
    console.log('Welcome to the menu!');
    // Initialize your menu UI
  }

  onExit() {
    // Clean up menu
  }

  onUpdate(deltaTime: number) {
    // Handle menu updates, animations, etc.
  }
}

class GameScene extends Scene {
  constructor() {
    super('game');
  }

  onEnter() {
    console.log('Game started!');
    // Initialize game world
  }

  onUpdate(deltaTime: number) {
    // Update game logic
  }
}

// Create scene manager
const sceneManager = new SceneManager();

// Add scenes
sceneManager.addScene(new MenuScene());
sceneManager.addScene(new GameScene());

// Switch between scenes
await sceneManager.switchTo('menu');
await sceneManager.switchTo('game');
```

## API Reference

### SceneManager

#### Constructor
```typescript
new SceneManager(options?: SceneManagerOptions)
```

Options:
- `enableTransitions?: boolean` - Enable/disable scene transitions (default: true)
- `defaultTransitionDuration?: number` - Default transition duration in ms (default: 1000)
- `autoUpdate?: boolean` - Automatically start update loop (default: true)

#### Methods

- `addScene(scene: Scene): void` - Add a scene to the manager
- `removeScene(sceneName: string): void` - Remove a scene
- `switchTo(sceneName: string, transitionOptions?: SceneTransitionOptions): Promise<void>` - Switch to a scene
- `getCurrentScene(): Scene | null` - Get the currently active scene
- `getPreviousScene(): Scene | null` - Get the previous scene
- `pauseCurrentScene(): void` - Pause the current scene
- `resumeCurrentScene(): void` - Resume the current scene
- `update(deltaTime?: number): void` - Manually update (if autoUpdate is false)

### Scene

#### Constructor
```typescript
new Scene(name: string)
```

#### Lifecycle Methods (Override these)
- `onEnter(): void | Promise<void>` - Called when entering the scene
- `onExit(): void | Promise<void>` - Called when exiting the scene
- `onUpdate(deltaTime: number): void` - Called every frame while active
- `onPause(): void` - Called when scene is paused
- `onResume(): void` - Called when scene is resumed

#### Properties & Methods
- `name: string` - Scene name (readonly)
- `state: SceneState` - Current scene state
- `data: SceneData` - Scene-specific data storage
- `setData(key: string, value: any): void` - Store data
- `getData(key: string): any` - Retrieve data

### Transitions

Customize scene transitions:

```typescript
await sceneManager.switchTo('game', {
  duration: 2000,
  easing: SceneTransition.easeInOut,
  onComplete: () => console.log('Transition complete!')
});
```

Built-in easing functions:
- `SceneTransition.easeIn`
- `SceneTransition.easeOut` 
- `SceneTransition.easeInOut`

## Examples

### Game with Menu System
```typescript
class MainMenuScene extends Scene {
  constructor() {
    super('mainMenu');
  }

  onEnter() {
    // Show menu buttons
    this.showUI();
  }

  onExit() {
    // Hide menu
    this.hideUI();
  }

  private showUI() {
    // Your UI framework code here
  }
}

class GameplayScene extends Scene {
  private gameLoop: number = 0;

  onEnter() {
    // Initialize game world
    this.startGameLoop();
  }

  onExit() {
    this.stopGameLoop();
  }

  onPause() {
    // Pause game systems
  }

  onResume() {
    // Resume game systems
  }

  onUpdate(deltaTime: number) {
    // Update game entities, physics, etc.
  }
}
```

### State Persistence
```typescript
class SavedScene extends Scene {
  onEnter() {
    // Load saved data
    const savedData = this.getData('playerProgress');
    if (savedData) {
      this.restoreState(savedData);
    }
  }

  onExit() {
    // Save current state
    this.setData('playerProgress', this.getCurrentState());
  }
}
```

## SceneRegistry

### Overview
The `SceneRegistry` allows you to dynamically register and create scenes by type. This is useful for scenarios where you want to decouple scene creation from the main application logic.

### Methods

#### `register(type: string, constructor: SceneConstructor): void`
Registers a new scene type with a unique identifier and its constructor.

#### `create(type: string, name: string, ...args: any[]): Scene`
Creates a new scene instance of the specified type.

### Example Usage

```typescript
import { SceneRegistry, Scene } from 'scene-manager';

// Define custom scenes
class MenuScene extends Scene {
  constructor(name: string) {
    super(name);
  }

  onEnter() {
    console.log(`${this.name} entered.`);
  }
}

class GameScene extends Scene {
  constructor(name: string) {
    super(name);
  }

  onEnter() {
    console.log(`${this.name} entered.`);
  }
}

// Create a SceneRegistry instance
const registry = new SceneRegistry();

// Register scenes
registry.register('menu', MenuScene);
registry.register('game', GameScene);

// Create scenes dynamically
const menuScene = registry.create('menu', 'MainMenu');
const gameScene = registry.create('game', 'Level1');

menuScene.onEnter(); // Output: MainMenu entered.
gameScene.onEnter(); // Output: Level1 entered.
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint
npm run lint
```

## License

ISC License - see LICENSE file for details.
