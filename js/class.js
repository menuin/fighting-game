class Sprite {
  constructor({
    position,
    img,
    scale = 1,
    framesMax = 1,
    framesPadding = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = img;
    this.scale = scale; // scale the image
    // properties below are for animated images
    this.framesMax = framesMax; // # of animation frames
    this.framesCurrent = 0; // current animation frame
    this.framesElapsed = 0; // how many frames(blinks) elapsed during whole animation
    this.framesHold = 4; // changes to next animation frame after 10 frames(blinks)
    this.framesPadding = framesPadding; // inner paddings in each animation frame (refer to the difference b/w samuraiMack and shop.png)
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax), // crop position starts here
      0,
      this.image.width / this.framesMax,
      this.image.height, // crop position ends here
      this.position.x - this.framesPadding.x, // x position: ;
      this.position.y - this.framesPadding.y, // y position: ;
      (this.image.width / this.framesMax) * this.scale, // width: ;
      this.image.height * this.scale // height: ;
    ); // draw image on canvas
  }
  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    img,
    scale = 1,
    framesMax = 1,
    framesPadding,
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      // inherits parent class
      position,
      img,
      scale,
      framesMax,
      framesPadding,
    });
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = this.sprites[sprite].img;
    }

    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset, // attackBox (should face leftward) offset var for player 2
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.dead = false;
  }

  update() {
    this.draw();
    if (!this.dead) {
      // stop updating when player is dead
      this.animateFrames();
    }
    // attackBox
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x; // this is necessary because the attack box position should be updated after being drawn
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    // player movement
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.velocity.y <= 0) {
      this.velocity.y = 0;
    }
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      // when object hits the ground
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false; // after 1000ms
    }, 700);
  }

  takeHit() {
    this.health -= 10;
    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }
  switchSprite(sprite) {
    // overriding all other animations with the death animation
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) {
        this.dead = true;
      }
      return;
    }
    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    ) {
      return;
    }
    // overriding all other animations with the takeHit animation
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    ) {
      return;
    }

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
