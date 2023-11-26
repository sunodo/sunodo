target "docker-metadata-action" {}
target "docker-platforms" {}

target "default" {
  inherits = ["docker-metadata-action", "docker-platforms"]
  args = {
    BASE_IMAGE                 = "debian:bookworm-20230814"
    SERVER_MANAGER_REGISTRY    = "docker.io"
    SERVER_MANAGER_ORG         = "cartesi"
    SERVER_MANAGER_VERSION     = "0.8.2"
    LINUX_VERSION              = "0.17.0"
    LINUX_KERNEL_VERSION       = "5.15.63-ctsi-2-v0.17.0"
    ROM_VERSION                = "0.17.0"
  }
}
