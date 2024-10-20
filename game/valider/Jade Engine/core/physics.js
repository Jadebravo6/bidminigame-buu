// physics.js
class Physics {
    static checkCollision(entityA, entityB) {
        return (
            entityA.x < entityB.x + entityB.width &&
            entityA.x + entityA.width > entityB.x &&
            entityA.y < entityB.y + entityB.height &&
            entityA.y + entityA.height > entityB.y
        );
    }

    static applyGravity(entity, gravity = 0.98) {
        entity.y += gravity;
    }

    static applyVelocity(entity) {
        if (entity.velocityX !== undefined) {
            entity.x += entity.velocityX;
        }
        if (entity.velocityY !== undefined) {
            entity.y += entity.velocityY;
        }
    }
}

export default Physics;
