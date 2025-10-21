.PHONY: dev api web db
api:
cd apps/api && mvn quarkus:dev
web:
cd apps/web && npm dev