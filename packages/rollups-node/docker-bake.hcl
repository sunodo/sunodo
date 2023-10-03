target "docker-metadata-action" {}
target "docker-platforms" {}

variable "ROLLUPS_VERSION" {
  default = "1.0.2"
}

target "default" {
  inherits = ["docker-metadata-action", "docker-platforms"]
  args = {
    ROLLUPS_VERSION = "${ROLLUPS_VERSION}"
  }
}
