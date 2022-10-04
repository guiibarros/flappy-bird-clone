import { Background } from './gameObjects/Background';
import { Floor } from './gameObjects/Floor';
import { Bird } from './gameObjects/Bird';
import { Pipes } from './gameObjects/Pipes';

import { Engine } from './engine';

Engine.createGameObjects([
  new Background,
  new Bird,
  new Pipes,
  new Floor,
]);

Engine.init();