// input.js
class InputManager {
    constructor() {
        this.touches = {};
        this.isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;

        if (this.isTouchDevice) {
            this.initTouchEvents();
        } else {
            this.initMouseEvents();
        }
    }

    initTouchEvents() {
        window.addEventListener('touchstart', this.onTouchStart.bind(this));
        window.addEventListener('touchmove', this.onTouchMove.bind(this));
        window.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    initMouseEvents() {
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onTouchStart(event) {
        for (let touch of event.touches) {
            this.touches[touch.identifier] = { x: touch.clientX, y: touch.clientY };
        }
    }

    onTouchMove(event) {
        for (let touch of event.touches) {
            this.touches[touch.identifier] = { x: touch.clientX, y: touch.clientY };
        }
    }

    onTouchEnd(event) {
        for (let touch of event.changedTouches) {
            delete this.touches[touch.identifier];
        }
    }

    onMouseDown(event) {
        this.touches['mouse'] = { x: event.clientX, y: event.clientY };
    }

    onMouseMove(event) {
        if (this.touches['mouse']) {
            this.touches['mouse'] = { x: event.clientX, y: event.clientY };
        }
    }

    onMouseUp(event) {
        delete this.touches['mouse'];
    }

    getTouchPositions() {
        return this.touches;
    }
}

export default InputManager;
