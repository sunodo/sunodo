target "docker-metadata-action" {}
target "docker-platforms" {}

target "default" {
  inherits = ["docker-metadata-action", "docker-platforms"]
  tags     = ["sunodo/cartesi-node:devel"]
  args     = {
    ROLLUPS_VERSION = "devel"
  }
}

target "0-9-0" {
  inherits = ["docker-metadata-action", "docker-platforms"]
  args     = {
    ROLLUPS_VERSION = "0.9.0"
  }
}
