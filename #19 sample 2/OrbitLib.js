class Orbit {
    constructor(radius) {
      this.radius = radius;
    }
  
    display() {
      noFill();
      stroke(255);
      ellipse(width / 2, height / 2, this.radius * 2);
    }
  }
  
  class Player {
    constructor(radius) {
      this.angle = 0;
      this.radius = radius;
      this.speed = this.calculateSpeed();
    }
  
    calculateSpeed() {
      return baseSpeed / this.radius;
    }
  
    update() {
      this.angle += this.speed;
    }
  
    display() {
      let x = width / 2 + cos(this.angle) * this.radius;
      let y = height / 2 + sin(this.angle) * this.radius;
      fill("#ffbc63");
      noStroke();
      ellipse(x, y, 25);
    }
  
    getPosition() {
      return {
        x: width / 2 + cos(this.angle) * this.radius,
        y: height / 2 + sin(this.angle) * this.radius,
      };
    }
  
    changeOrbit(newRadius) {
      this.radius = newRadius;
      this.speed = this.calculateSpeed();
    }
  }
  
  // Item, Obstacle, Particle peuvent aussi être séparés ici
  export { Orbit, Player };
  