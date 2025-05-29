# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

# Docker compose file location
DOCKER_COMPOSE_FILE := docker-compose.yml

# Default target
.DEFAULT_GOAL := help

.PHONY: help up down build rebuild logs exec status xdebug-status xdebug-log fresh clean composer-install migrate seed artisan npm-install

## Display available commands
help:
	@echo "$(GREEN)Available commands:$(NC)"
	@echo "$(BLUE)  make up$(NC)          	- Start all containers"
	@echo "$(BLUE)  make down$(NC)        	- Stop all containers"
	@echo "$(BLUE)  make build$(NC)       	- Build all containers"
	@echo "$(BLUE)  make rebuild$(NC)     	- Rebuild all containers from scratch"
	@echo "$(BLUE)  make logs$(NC)        	- Show logs from all containers"
	@echo "$(BLUE)  make logs-backend$(NC)	- Show backend logs"
	@echo "$(BLUE)  make logs-frontend$(NC)   - Show frontend logs"
	@echo "$(BLUE)  make logs-mysql$(NC)  	- Show MySQL logs"
	@echo "$(BLUE)  make ssh-backend$(NC)	- Execute bash in backend container"
	@echo "$(BLUE)  make ssh-frontend$(NC)   - Execute bash in frontend container"
	@echo "$(BLUE)  make ssh-mysql$(NC)  	- Execute bash in MySQL container"
	@echo "$(BLUE)  make status$(NC)      	- Show container status"
	@echo "$(BLUE)  make xdebug-status$(NC)   - Check Xdebug installation"
	@echo "$(BLUE)  make xdebug-log$(NC)  	- Show Xdebug logs"
	@echo "$(BLUE)  make fresh$(NC)       	- Fresh installation with migration"
	@echo "$(BLUE)  make clean$(NC)       	- Remove all containers and volumes"
	@echo "$(BLUE)  make composer-install$(NC) - Install PHP dependencies"
	@echo "$(BLUE)  make migrate$(NC)     	- Run Laravel migrations"
	@echo "$(BLUE)  make seed$(NC)        	- Run Laravel database seeders"
	@echo "$(BLUE)  make artisan cmd=''$(NC)  - Run artisan command (e.g., make artisan cmd='make:controller TestController')"
	@echo "$(BLUE)  make npm-install$(NC) 	- Install Node.js dependencies"

## Start all containers
up:
	@echo "$(GREEN)Starting application containers...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) up -d

## Stop all containers
down:
	@echo "$(YELLOW)Stopping application containers...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) down

## Build all containers
build:
	@echo "$(GREEN)Building application containers...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) build

## Check containers status
ps:
	@echo "$(GREEN)Check container status...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) ps

## Rebuild all containers from scratch
rebuild:
	@echo "$(YELLOW)Rebuilding application containers...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) down
	docker compose -f $(DOCKER_COMPOSE_FILE) build --no-cache
	docker compose -f $(DOCKER_COMPOSE_FILE) up -d

## Show logs from all containers
logs:
	docker compose -f $(DOCKER_COMPOSE_FILE) logs -f

## Show backend logs
logs-backend:
	docker compose -f $(DOCKER_COMPOSE_FILE) logs -f backend

## Show frontend logs
logs-frontend:
	docker compose -f $(DOCKER_COMPOSE_FILE) logs -f frontend

## Show MySQL logs
logs-mysql:
	docker compose -f $(DOCKER_COMPOSE_FILE) logs -f mysql

## Execute bash in backend container
ssh-backend:
	docker compose -f $(DOCKER_COMPOSE_FILE) exec backend /bin/bash

## Execute bash in frontend container
ssh-frontend:
	docker compose -f $(DOCKER_COMPOSE_FILE) exec frontend /bin/sh

## Execute bash in MySQL container
ssh-mysql:
	docker compose -f $(DOCKER_COMPOSE_FILE) exec mysql /bin/bash

## Show container status
status:
	@echo "$(GREEN)Application container status:$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) ps

## Check Xdebug installation
xdebug-status:
	@echo "$(GREEN)Checking Xdebug status...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) exec backend php -m | grep xdebug || echo "$(RED)Xdebug not found$(NC)"

## Show Xdebug logs
xdebug-log:
	@echo "$(GREEN)Showing Xdebug logs...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) exec backend tail -f /tmp/xdebug.log

## Fresh installation with database migration
fresh:
	@echo "$(YELLOW)Fresh installation...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) down -v
	docker compose -f $(DOCKER_COMPOSE_FILE) build --no-cache
	docker compose -f $(DOCKER_COMPOSE_FILE) up -d
	@echo "$(GREEN)Waiting for containers to start...$(NC)"
	sleep 10
	@echo "$(GREEN)Running Laravel setup...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) exec backend composer install
	docker compose -f $(DOCKER_COMPOSE_FILE) exec backend php artisan key:generate
	docker compose -f $(DOCKER_COMPOSE_FILE) exec backend php artisan migrate
	@echo "$(GREEN)Fresh installation completed!$(NC)"

## Remove all containers and volumes
clean:
	@echo "$(RED)Removing all containers and volumes...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) down -v --remove-orphans
	docker system prune -f

## Install PHP dependencies
composer-install:
	@echo "$(GREEN)Installing PHP dependencies...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) exec backend composer install

## Run Laravel migrations
migrate:
	@echo "$(GREEN)Running Laravel migrations...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) exec backend php artisan migrate

## Run Laravel database seeders
seed:
	@echo "$(GREEN)Running Laravel database seeders...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) exec backend php artisan db:seed

## Run artisan command
artisan:
	@if [ -z "$(cmd)" ]; then \
    	echo "$(RED)Please specify a command: make artisan cmd='your-command'$(NC)"; \
	else \
    	echo "$(GREEN)Running artisan $(cmd)...$(NC)"; \
    	docker compose -f $(DOCKER_COMPOSE_FILE) exec backend php artisan $(cmd); \
	fi

## Install Node.js dependencies
npm-install:
	@echo "$(GREEN)Installing Node.js dependencies...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) exec frontend npm install

## Development helpers
dev-setup: up composer-install migrate npm-install
	@echo "$(GREEN)Development environment setup complete!$(NC)"

## Production helpers
prod-build: build
	@echo "$(GREEN)Production build complete!$(NC)"

## Database helpers
db-reset:
	@echo "$(YELLOW)Resetting database...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) exec backend php artisan migrate:fresh --seed

## Testing helpers
test:
	@echo "$(GREEN)Running Laravel tests...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) exec backend php artisan test

test-frontend:
	@echo "$(GREEN)Running frontend tests...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) exec frontend npm run test
