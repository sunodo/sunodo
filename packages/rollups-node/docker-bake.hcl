target "docker-metadata-action" {}
target "docker-platforms" {}

variable "ROLLUPS_VERSION" {
  default = "1.1.0-rc.1"
}

target "default" {
  inherits = ["docker-metadata-action", "docker-platforms"]
  args = {
    ROLLUPS_VERSION = "${ROLLUPS_VERSION}"
    REGISTRY = "ghcr.io"
  }
}
