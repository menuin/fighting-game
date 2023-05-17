class Sprite {
  constructor({ position, img, scale = 1, framesMax = 1 }) {
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
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax), // crop position starts here
      0,
      this.image.width / this.framesMax,
      this.image.height, // crop position ends here
      this.position.x, // x position
      this.position.y, // y position
      (this.image.width / this.framesMax) * this.scale, // width: ;
      this.image.height * this.scale // height: ;
    ); // draw image on canvas
  }

  update() {
    this.draw();
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
}

class Fighter {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color; // write fillStyle befor fillRect in order to fill the rectangle with color
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.position.x + this.attackBox.offset.x,
        this.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
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
