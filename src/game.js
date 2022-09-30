import { Background } from './entities/Background.js';
import { Floor } from './entities/Floor.js';
import { Bird } from './entities/Bird.js';
import { Pipes } from './entities/Pipes.js';

import { Engine } from './engine/index.js';

Engine.createGameObjects([
  Background,
  Bird,
  Pipes,
  Floor,
]);

Engine.init();