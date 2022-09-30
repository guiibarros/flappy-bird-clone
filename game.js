// Util for query DOM elements
const $ = query => document.querySelector(query);

const gameScreen = $('#gameScreen');
const context = gameScreen.getContext('2d');

let framesCount = 0;
const fps = 60;

const spriteSheet = new Image();
spriteSheet.src = './img/spritesheet.png';

const states = {
  current: 1,
  ready: 1,
  start: 2,
  over: 3
};

gameScreen.addEventListener('click', () => {
  switch(states.current) {
    case states.ready: {
      states.current = states.start;
      bird.flap();
      break;
    }

    case states.start: {
      bird.flap();
      break;
    }
  }
});

// Background
const background = {
  x: 0,
  y: gameScreen.height - 227,
  width: 276,
  height: 227,
  sX: 0,
  sY: 0,

  draw() {
    context.drawImage(
      spriteSheet,
      this.sX,
      this.sY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  },
};

// Floor
const floor = {
  x: 0,
  y: gameScreen.height - 112,
  sX: 276,
  sY: 0,
  width: 224,
  height: 112,
  xSpeed: 2,

  draw() {
    // Draw two floors to fill the screen
    context.drawImage(
      spriteSheet,
      this.sX,
      this.sY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );

    context.drawImage(
      spriteSheet,
      this.sX,
      this.sY,
      this.width,
      this.height,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  },

  update() {
    // If the floor x mod gameScreen.width / 2 is equal to zero, then, reset the x
    if (states.current !== states.over) {
      this.x = (this.x - this.xSpeed) % (gameScreen.width / 2);
    }
  }
};

// Bird
const bird = {
  // Properties in the canvas
  x: gameScreen.width / 3,
  y: gameScreen.height / 3,
  width: 34,
  height: 24,

  // Physics
  gravity: 0.8,
  mass: 0.3,
  velocity: 0,
  flapImpulse: 5,
  angle: 0,
  angleSpeed: 6,
  angleLimit: 60,

  // Animation
  animationSpeed: 4,
  sprites: [
    { sX: 276, sY: 114, },
    { sX: 276, sY: 140, },
    { sX: 276, sY: 166, },
    { sX: 276, sY: 140, },
  ],

  spriteIndex: 0,

  draw() {
    const { sX, sY } = this.sprites[this.spriteIndex];

    const angleInRadian = (Math.PI * this.angle) / 180;

    context.save();
    context.translate(this.x, this.y);
    context.rotate(angleInRadian);
    context.drawImage(
      spriteSheet,
      sX,
      sY,
      this.width,
      this.height,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    );
    context.restore();
  },

  update() {
    this.checkFloorCollision();

    if (this.velocity < 0) {
      this.angle = Math.max(-this.angleLimit, this.angle - this.angleSpeed);
    } else if (this.velocity > 0) {
      this.angle = Math.min(this.angleLimit, this.angle + this.angleSpeed);
    }

    if (states.current !== states.over) {
      framesCount % this.animationSpeed === 0 && this.spriteIndex++;

      this.spriteIndex = this.spriteIndex % this.sprites.length;
    }

    this.y += this.velocity;
  },

  applyGravity() {
    this.velocity += this.gravity * this.mass;
  },

  flap() {
    this.velocity = -this.flapImpulse;
  },

  checkFloorCollision() {
    if (states.current !== states.ready) {
      if ((this.y + this.height) >= floor.y) {
        states.current = states.over;
        this.die();
      } else {
        this.applyGravity();
      }
    }
  },

  die() {
    this.y = floor.y - (this.height / 2);
    this.velocity = 0;
    this.spriteIndex = 0;
  }
};

// Pipes
const pipes = {
  // Properties in the canvas
  width: 52,
  height: 400,
  gap: 100,
  xSpeed: 2,
  pipesGenerationInterval: 120, // frames interval
  instances: [],

  // Animation
  sprites: [
    { sX: 502, sY: 0 },
    { sX: 554, sY: 0 },
  ],

  draw() {
    this.instances.forEach(pipe => {
      const pipeBottom = this.sprites[0];
      const pipeTop = this.sprites[1];

      const pipeBottomY = pipe.y + this.height + this.gap;

      context.drawImage(
        spriteSheet,
        pipeTop.sX,
        pipeTop.sY,
        this.width,
        this.height,
        pipe.x,
        pipe.y,
        this.width,
        this.height,
      );

      context.drawImage(
        spriteSheet,
        pipeBottom.sX,
        pipeBottom.sY,
        this.width,
        this.height,
        pipe.x,
        pipeBottomY,
        this.width,
        this.height,
      );
    });
  },

  update() {
    if (states.current === states.start) {
      this.generatePipes();
    }

    this.instances.forEach(pipe => {
      if (states.current === states.start){
        pipe.x -= this.xSpeed;
      }

      if (pipe.x < -this.width) {
        this.instances.shift();
      }

      if (
        (pipe.x < (bird.x + (bird.width / 3)) &&
        pipe.x + this.width > bird.x) &&
        (pipe.y + this.height > bird.y - (bird.height / 2) ||
        pipe.y + this.height + this.gap < bird.y + (bird.height / 2))
      ) {
        states.current = states.over;
      }
    });
  },

  generatePipes() {
    if (framesCount % this.pipesGenerationInterval === 0) {
      this.instances.push({
        x: gameScreen.width * 1.5,
        y: Math.floor(Math.random() * (-125 + 325) - 325)
      });
    }
  }
};

// Draw game objects
function draw() {
  // Clear the screen
  context.clearRect(0, 0, gameScreen.width, gameScreen.height);

  background.draw();
  pipes.draw();
  bird.draw();
  floor.draw();
}

// Update game states
function update() {
  floor.update();
  bird.update();
  pipes.update();
}

// Game loop
function loop() {
  draw();
  update();

  framesCount++;

  requestAnimationFrame(loop);
}

loop();