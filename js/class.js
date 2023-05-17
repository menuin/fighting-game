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
    this.framesHold = 10; // changes to next animation frame after 10 frames(blinks)
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
    offset,
    img,
    scale = 1,
    framesMax = 1,
    framesPadding,
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

    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset, // attackBox (should face leftward) offset var for player 2
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  update() {
    this.draw();
    this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x; // this is necessary because the attack box position should be updated after being drawn
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      // when object hits the ground
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false; // after 100ms
    }, 100);
  }
}
