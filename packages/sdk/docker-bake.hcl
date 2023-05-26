target "docker-metadata-action" {}
target "docker-platforms" {}

target "default" {
  inherits = ["docker-metadata-action", "docker-platforms"]
  args = {
    BASE_IMAGE               = "debian:bullseye-20230502"
    MACHINE_EMULATOR_VERSION = "0.14.0-bullseye"
    LINUX_VERSION            = "0.16.0"
    LINUX_KERNEL_VERSION     = "5.15.63-ctsi-2"
    ROM_VERSION              = "0.16.0"
  }
}
