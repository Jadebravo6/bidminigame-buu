import { Entity } from '../core/entity.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, 50, 50);
        this.velocityY = 0;
        this.gravity = 0.5;
        this.jumpPower = -10;
        this.isJumping = false;

        this.createElement();
        this.addEventListeners();
    }

    createElement() {
        this.element.className = 'player';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        document.getElementById('game-container').appendChild(this.element);
    }

    addEventListeners() {
        window.addEventListener('touchstart', (e) => {
            if (e.touches[0].clientY < window.innerHeight / 2) {
                this.jump();
            }
        });

        window.addEventListener('touchend', (e) => {
            // Fin du toucher
        });
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpPower;
            this.isJumping = true;
        }
    }

    update() {
        this.y += this.velocityY;
        this.velocityY += this.gravity;

        if (this.y >= window.innerHeight - this.height) {
            this.y = window.innerHeight - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }

        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}
