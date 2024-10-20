import pygame
import sys

# Initialiser pygame
pygame.init()

# Définir les constantes
WIDTH, HEIGHT = 800, 600
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BALL_SPEED = 5
PADDLE_SPEED = 10
PADDLE_WIDTH, PADDLE_HEIGHT = 10, 100

# Créer la fenêtre du jeu
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pong")

# Définir les objets du jeu
ball = pygame.Rect(WIDTH // 2 - 15, HEIGHT // 2 - 15, 30, 30)
ball_dx, ball_dy = BALL_SPEED, BALL_SPEED
left_paddle = pygame.Rect(30, HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
right_paddle = pygame.Rect(WIDTH - 30 - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)

# Fonction principale du jeu
def game_loop():
    global ball_dx, ball_dy  # Déclaration des variables globales
    clock = pygame.time.Clock()
    left_score, right_score = 0, 0

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        # Contrôler les déplacements des palettes
        keys = pygame.key.get_pressed()
        if keys[pygame.K_w] and left_paddle.top > 0:
            left_paddle.y -= PADDLE_SPEED
        if keys[pygame.K_s] and left_paddle.bottom < HEIGHT:
            left_paddle.y += PADDLE_SPEED
        if keys[pygame.K_UP] and right_paddle.top > 0:
            right_paddle.y -= PADDLE_SPEED
        if keys[pygame.K_DOWN] and right_paddle.bottom < HEIGHT:
            right_paddle.y += PADDLE_SPEED

        # Déplacer la balle
        ball.x += ball_dx
        ball.y += ball_dy

        # Collision avec le haut et le bas
        if ball.top <= 0 or ball.bottom >= HEIGHT:
            ball_dy *= -1

        # Collision avec les palettes
        if ball.colliderect(left_paddle) or ball.colliderect(right_paddle):
            ball_dx *= -1

        # Scoring
        if ball.left <= 0:
            right_score += 1
            ball.x = WIDTH // 2 - 15
            ball_dx *= -1
        if ball.right >= WIDTH:
            left_score += 1
            ball.x = WIDTH // 2 - 15
            ball_dx *= -1

        # Dessiner les objets
        screen.fill(BLACK)
        pygame.draw.rect(screen, WHITE, left_paddle)
        pygame.draw.rect(screen, WHITE, right_paddle)
        pygame.draw.ellipse(screen, WHITE, ball)
        pygame.draw.aaline(screen, WHITE, (WIDTH // 2, 0), (WIDTH // 2, HEIGHT))

        # Afficher les scores
        font = pygame.font.Font(None, 74)
        text = font.render(f"{left_score}  {right_score}", True, WHITE)
        screen.blit(text, (WIDTH // 2 - text.get_width() // 2, 10))

        pygame.display.flip()
        clock.tick(60)

if __name__ == "__main__":
    game_loop()
