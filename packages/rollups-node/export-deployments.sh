#!/usr/bin/env sh
source .env
rm -rf deployments
mkdir -p deployments
docker compose -f rollups-deployments.yaml up --detach --wait
docker compose -f rollups-deployments.yaml exec anvil eth_dump | gzip > deployments/anvil.json.gz
docker compose -f rollups-deployments.yaml cp rollups:/app/rollups/deployments/localhost deployments/
docker compose -f rollups-deployments.yaml cp rollups:/opt/cartesi/share/deployments/localhost.json deployments/
docker compose -f rollups-deployments.yaml down
