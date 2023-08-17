target "docker-metadata-action" {}
target "docker-platforms" {}

target "default" {
  inherits = ["docker-metadata-action", "docker-platforms"]
  args = {
    BASE_IMAGE               = "debian:bookworm-20230814"
    MACHINE_EMULATOR_VERSION = "0.15.0"
    LINUX_VERSION            = "0.17.0"
    LINUX_KERNEL_VERSION     = "5.15.63-ctsi-2-v0.17.0"
    ROM_VERSION              = "0.17.0"
  }
}
