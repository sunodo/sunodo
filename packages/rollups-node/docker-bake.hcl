target "docker-metadata-action" {}
target "docker-platforms" {}

variable "ROLLUPS_VERSION" {
  default = "1.2.0"
}

target "default" {
  inherits = ["docker-metadata-action", "docker-platforms"]
  args = {
    ROLLUPS_VERSION = "${ROLLUPS_VERSION}"
  }
}
