import pygame
import sys

# Initialisation de Pygame
pygame.init()

# Dimensions de la fenêtre
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Pong")

# Couleurs
white = (255, 255, 255)
black = (0, 0, 0)

# Paramètres des raquettes
paddle_width, paddle_height = 15, 100
paddle_speed = 5

# Paramètres de la balle
ball_size = 15
ball_speed_x, ball_speed_y = 5, 5

# Position initiale des raquettes et de la balle
paddle1_x, paddle1_y = 50, height // 2 - paddle_height // 2
paddle2_x, paddle2_y = width - 50 - paddle_width, height // 2 - paddle_height // 2
ball_x, ball_y = width // 2 - ball_size // 2, height // 2 - ball_size // 2

# Fonction pour dessiner les raquettes
def draw_paddle(x, y):
    pygame.draw.rect(screen, white, (x, y, paddle_width, paddle_height))

# Fonction pour dessiner la balle
def draw_ball(x, y):
    pygame.draw.rect(screen, white, (x, y, ball_size, ball_size))

# Boucle principale
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Gestion des touches
    keys = pygame.key.get_pressed()
    if keys[pygame.K_w] and paddle1_y > 0:
        paddle1_y -= paddle_speed
    if keys[pygame.K_s] and paddle1_y < height - paddle_height:
        paddle1_y += paddle_speed
    if keys[pygame.K_UP] and paddle2_y > 0:
        paddle2_y -= paddle_speed
    if keys[pygame.K_DOWN] and paddle2_y < height - paddle_height:
        paddle2_y += paddle_speed

    # Mouvement de la balle
    ball_x += ball_speed_x
    ball_y += ball_speed_y

    # Rebondir la balle sur les murs
    if ball_y <= 0 or ball_y >= height - ball_size:
        ball_speed_y = -ball_speed_y

    # Rebondir la balle sur les raquettes
    if ball_x <= paddle1_x + paddle_width and paddle1_y <= ball_y <= paddle1_y + paddle_height:
        ball_speed_x = -ball_speed_x
    if ball_x >= paddle2_x - ball_size and paddle2_y <= ball_y <= paddle2_y + paddle_height:
        ball_speed_x = -ball_speed_x

    # Réinitialiser la balle si elle sort de l'écran
    if ball_x < 0 or ball_x > width:
        ball_x, ball_y = width // 2 - ball_size // 2, height // 2 - ball_size // 2

    # Remplir l'écran avec une couleur de fond
    screen.fill(black)

    # Dessiner les raquettes et la balle
    draw_paddle(paddle1_x, paddle1_y)
    draw_paddle(paddle2_x, paddle2_y)
    draw_ball(ball_x, ball_y)

    # Mettre à jour l'affichage
    pygame.display.flip()

    # Limiter le nombre de frames par seconde
    pygame.time.Clock().tick(60)

# Quitter Pygame
pygame.quit()
sys.exit()