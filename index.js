const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // drawing is going to be 2d

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); // fill whole canvas area with rectangle

const gravity = 0.9;

// create background image
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  img: "./img/background.png",
});
// create shop
const shop = new Sprite({
  position: {
    x: 620,
    y: 160,
  },
  img: "./img/shop.png",
  scale: 2.5,
  framesMax: 6,
});
// create player 1 object
const player1 = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  img: "./img/samuraiMack/Idle.png", // img in basic(idle) status
  framesMax: 8,
  scale: 2.5,
  framesPadding: {
    x: 215,
    y: 153,
  },
  sprites: {
    idle: {
      img: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      img: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      img: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      img: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
  },
});

// create player 2 object
const player2 = new Fighter({
  position: {
    x: 400,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    // offset for player2's attackbox
    x: -50,
    y: 0,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

// animation loop
function animate() {
  window.requestAnimationFrame(animate); // loop animate() function over and over again
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player1.update();
  // player2.update();
  // clear canvas & update() method called in every frame

  player1.velocity.x = 0;
  player2.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player1.lastKey === "a") {
    // moving backwards
    player1.velocity.x = -5;
    player1.switchSprite("run");
  } else if (keys.d.pressed && player1.lastKey === "d") {
    // moving forward
    player1.velocity.x = 5;
    player1.switchSprite("run");
  } else {
    player1.switchSprite("idle");
  }
  if (player1.velocity.y < 0) {
    // jumping
    player1.switchSprite("jump");
  } else if (player1.velocity.y > 0) {
    // falling
    player1.switchSprite("fall");
  }

  // player2 movement
  if (keys.ArrowLeft.pressed && player2.lastKey === "ArrowLeft") {
    player2.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
    player2.velocity.x = 5;
  }

  // player 1 attacks
  if (
    detectCollision({
      attacker: player1,
      victim: player2,
    }) &&
    player1.isAttacking
  ) {
    player2.health -= 10;
    document.querySelector("#player2Health").style.width = player2.health + "%";
    player1.isAttacking = false;
  }

  // player 2 attacks
  if (
    detectCollision({
      attacker: player2,
      victim: player1,
    }) &&
    player2.isAttacking
  ) {
    player1.health -= 10;
    document.querySelector("#playerHealth").style.width = player1.health + "%";
    player2.isAttacking = false;
  }

  if (player1.health <= 0 || player2.health <= 0) {
    determineWinner({ player1, player2, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    // player1 keys
    case "d":
      keys.d.pressed = true;
      player1.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player1.lastKey = "a";
      break;
    case "w":
      player1.velocity.y = -15;
      break;
    case "s":
      player1.attack();
      break;

    // player2 keys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      player2.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      player2.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      player2.velocity.y = -15;
      break;
    case "ArrowDown":
      player2.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // player1 keys
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    // player2 keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
