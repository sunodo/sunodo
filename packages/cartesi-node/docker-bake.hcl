target "docker-metadata-action" {}
target "docker-platforms" {}

target "default" {
  inherits = ["docker-metadata-action", "docker-platforms"]
  tags     = ["sunodo/cartesi-node:devel"]
  args = {
    REGISTRY        = "ghcr.io"
    ORG             = "cartesi"
    ROLLUPS_VERSION = "develop"
  }
}

target "0-9-0" {
  inherits = ["docker-metadata-action", "docker-platforms"]
  args = {
    ROLLUPS_VERSION = "0.9.0"
  }
}
