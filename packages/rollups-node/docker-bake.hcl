target "docker-metadata-action" {}
target "docker-platforms" {}

target "default" {
  inherits = ["docker-metadata-action", "docker-platforms"]
  args = {
    REGISTRY            = "docker.io"
    ORG                 = "cartesi"
    ROLLUPS_VERSION     = "1.3.1"
  }
}
