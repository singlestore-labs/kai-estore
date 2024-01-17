dev-build:
	docker compose -f docker-compose.dev.yml build
dev-start:
	docker compose -f docker-compose.dev.yml up
dev-down:
	docker-compose -f docker-compose.dev.yml down --rmi local
dev-start-server:
	docker-compose -f docker-compose.dev.yml up server
dev-start-client:
	docker-compose -f docker-compose.dev.yml up client

prod-build:
	docker compose -f docker-compose.prod.yml build
prod-start:
	docker compose -f docker-compose.prod.yml up -d
prod-down:
	docker compose -f docker-compose.prod.yml down --rmi local
prod-start-server:
	docker-compose -f docker-compose.prod.yml up server
prod-start-client:
	docker-compose -f docker-compose.prod.yml up client