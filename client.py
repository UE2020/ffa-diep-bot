import pygame
pygame.init()
screen = pygame.display.set_mode([500, 500])
pygame.display.set_caption("ffa-diep-bot-client")
image = None
running = True
while running:
	for event in pygame.event.get():
		if event.type == pygame.QUIT:
			running = False
	try:
		image = pygame.image.load("image.png")
	except:
		pass
	screen.blit(pygame.transform.smoothscale(image, [500, 500]), [0, 0])
	pygame.display.flip()
pygame.quit()