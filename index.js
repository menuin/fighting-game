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
  // offset: {
  //   // offset for player1's attackbox
  //   x: 0,
  //   y: 0,
  // },
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
    attack1: {
      img: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      img: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      img: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 140,
    height: 50,
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
  // offset: {
  //   // offset for player2's attackbox
  //   x: -50,
  //   y: 0,
  // },
  img: "./img/kenji/Idle.png", // img in basic(idle) status
  framesMax: 4,
  scale: 2.5,
  framesPadding: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      img: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      img: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      img: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      img: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      img: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      img: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      img: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 140,
    height: 50,
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
  c.fillStyle = "rgba(255,255,255,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player1.update();
  player2.update();
  // clear canvas & update() method called in every frame

  player1.velocity.x = 0;
  player2.velocity.x = 0;

  // player1 movement
  if (keys.a.pressed && player1.lastKey === "a") {
    // moving backwards
    if (player1.position.x >= 0) {
      player1.velocity.x = -5;
    }
    player1.switchSprite("run");
  } else if (keys.d.pressed && player1.lastKey === "d") {
    // moving forward
    if (player1.position.x + player1.width <= canvas.width) {
      player1.velocity.x = 5;
    }

    player1.switchSprite("run");
  } else {
    player1.switchSprite("idle"); // default state
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
    // moving backwards
    if (player2.position.x >= 0) {
      player2.velocity.x = -5;
    }
    player2.switchSprite("run");
  } else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
    // moving forward
    if (player2.position.x + player2.width <= canvas.width) {
      player2.velocity.x = 5;
    }
    player2.switchSprite("run");
  } else {
    player2.switchSprite("idle");
  }
  if (player2.velocity.y < 0) {
    // jumping
    player2.switchSprite("jump");
  } else if (player2.velocity.y > 0) {
    // falling
    player2.switchSprite("fall");
  }

  // player 1 attacks
  if (
    detectCollision({
      attacker: player1,
      victim: player2,
    }) &&
    player1.isAttacking &&
    player1.framesCurrent === 4 // to synchronize player1's animation with damage
  ) {
    player2.takeHit();
    // document.querySelector("#player2Health").style.width = player2.health + "%";
    gsap.to("#player2Health", {
      // using gsap to animate
      width: player2.health + "%",
    });
    player1.isAttacking = false;
  }
  // if player1 misses
  if (player1.isAttacking && player1.framesCurrent === 4) {
    player1.isAttacking = false;
  }

  // player 2 attacks
  if (
    detectCollision({
      attacker: player2,
      victim: player1,
    }) &&
    player2.isAttacking &&
    player2.framesCurrent === 1 // to synchronize player2's animation
  ) {
    player1.takeHit();
    // document.querySelector("#playerHealth").style.width = player1.health + "%";
    gsap.to("#playerHealth", {
      // using gsap to animate
      width: player1.health + "%",
    });
    player2.isAttacking = false;
  }
  // if player2 misses
  if (player2.isAttacking && player2.framesCurrent === 1) {
    player2.isAttacking = false;
  }

  // player dies
  if (player1.health <= 0 || player2.health <= 0) {
    determineWinner({ player1, player2, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player1.dead) {
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
    }
  }
  if (!player2.dead) {
    switch (event.key) {
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
